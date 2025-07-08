import { NextRequest, NextResponse } from 'next/server';
import { convertToAvif } from '@/utils/image';
import AppError from '@/schemas/errors/appError';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import DeviceClient from '@/lib/clients/deviceClient';
import { ApiResponse } from '@/schemas/types';
import Device from '@/schemas/device';

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Device[]>>> {
  try {
    const searchParams = req.nextUrl.searchParams;

    const ids = searchParams.getAll('id');

    if (ids.length === 0) {
      throw new ErrorBadRequest(
        'Mindst ét ID skal angives.',
        'Expected one or more ?id parameters in the query string'
      );
    }

    const parsedIds = ids.map(Number).filter((n) => !isNaN(n));
    if (parsedIds.length === 0) {
      throw new ErrorBadRequest(
        'Ingen gyldige IDs blev angivet.',
        `Got: ${ids.join(', ')}`
      );
    }

    const devices = await Promise.all(
      parsedIds.map((id) => {
        return DeviceClient.id(id).getDevice();
      })
    );

    return NextResponse.json({
      success: true,
      data: devices,
      message: `Found ${devices.length} devices`,
    });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error('AppError:', err.details);
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.httpCode }
      );
    }

    console.error('Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Noget gik galt.' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Device>>> {
  try {
    const formData = await req.formData();

    const brand = formData.get('deviceBrand')?.toString();
    const model = formData.get('deviceModel')?.toString();
    const version = formData.get('deviceVersion')?.toString();
    const type = formData.get('deviceType')?.toString();
    const releaseDateRaw = formData.get('deviceReleaseDate')?.toString();
    const deviceImage = formData.get('deviceImage') as Blob | null;

    if (!brand) {
      throw new ErrorBadRequest(
        'Enhedens mærke mangler.',
        `Missing deviceBrand in formData. Expected string, got ${brand}`
      );
    }
    if (!model) {
      throw new ErrorBadRequest(
        'Enhedens model mangler.',
        `Missing deviceModel in formData. Expected string, got ${model}`
      );
    }
    if (!version) {
      throw new ErrorBadRequest(
        'Enhedens version mangler.',
        `Missing deviceVersion in formData. Expected string, got ${version}`
      );
    }
    if (!type) {
      throw new ErrorBadRequest(
        'Enhedens type mangler.',
        `Missing deviceType in formData. Expected string, got ${type}`
      );
    }

    const releaseDate = releaseDateRaw ? new Date(releaseDateRaw) : null;
    if (!releaseDate || isNaN(releaseDate.getTime())) {
      throw new ErrorBadRequest(
        'Enhedens udgivelses dato mangler.',
        `Missing deviceReleaseDate in formData. Expected ISO-string, got ${releaseDateRaw}`
      );
    }

    if (!deviceImage) {
      throw new ErrorBadRequest(
        'Enhedens billede mangler.',
        `Missing deviceImage in formData. Expected File, got ${typeof deviceImage}`
      );
    }

    const deviceAvif = await convertToAvif(deviceImage);

    const newDevice = await DeviceClient.createDevice(
      {
        brand: brand,
        model: model,
        version: version,
        type: type,
        releaseDate: releaseDate,
      },
      deviceAvif
    );

    return NextResponse.json(
      {
        success: true,
        data: newDevice,
        message: `Enhed "${newDevice.brand} ${newDevice.model} ${newDevice.version}" oprettet.`,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error('AppError:', err.details);
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.httpCode }
      );
    }

    console.error('Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Noget gik galt.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Device>>> {
  try {
    const formData = await req.formData();

    const idRaw = formData.get('id')?.toString();
    const id = parseInt(idRaw || '', 10);
    if (isNaN(id) || id <= 0) {
      throw new ErrorBadRequest(
        'Ugyldigt ID. Enheden kunne ikke opdateres.',
        `Invalid id in formData. Expected a positive integer, got: ${idRaw}`
      );
    }

    const brand = formData.get('deviceBrand')?.toString();
    const model = formData.get('deviceModel')?.toString();
    const version = formData.get('deviceVersion')?.toString();
    const type = formData.get('deviceType')?.toString();
    const releaseDateRaw = formData.get('deviceReleaseDate')?.toString();
    const deviceImage = formData.get('deviceImage') as Blob | null;

    const releaseDate = releaseDateRaw ? new Date(releaseDateRaw) : undefined;

    let deviceAvif: Buffer | undefined;
    if (deviceImage) {
      deviceAvif = await convertToAvif(deviceImage);
    }

    const updatedDevice = await DeviceClient.id(id).updateDevice(
      {
        brand: brand,
        model: model,
        version: version,
        type: type,
        releaseDate: releaseDate,
      },
      deviceAvif
    );

    return NextResponse.json(
      {
        data: updatedDevice,
        message: `Enhed "${updatedDevice.brand} ${updatedDevice.model} ${updatedDevice.version}" opdateret.`,
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof AppError) {
      console.error('AppError:', err.details);
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.httpCode }
      );
    }

    console.error('Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Noget gik galt.' },
      { status: 500 }
    );
  }
}
