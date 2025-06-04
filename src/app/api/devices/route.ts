import { handleSupabaseFunction } from '@/utils/config/supabase';
import { decodeUrlSpaces } from '@/utils/misc';
import { NextRequest, NextResponse } from 'next/server';
import { convertToAvif } from '@/utils/image';
import AppError from '@/schemas/errors/appError';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import DeviceClient from '@/lib/clients/deviceClient';
import { ApiResponse } from '@/schemas/new/types';
import Device from '@/schemas/new/device';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const brand = searchParams.get('brand');
  const model = searchParams.get('model');
  const version = searchParams.get('version');
  const type = searchParams.get('type');

  try {
    const devices = await handleSupabaseFunction('query_devices', {
      device_brand: brand,
      device_model: model,
      device_version: version && decodeUrlSpaces(version),
      device_type: type,
    });

    return NextResponse.json({ data: devices }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Device>>> {
  try {
    const formData = await req.formData();

    const brand = formData.get('brand') as string;
    const modelName = formData.get('modelName') as string;
    const deviceName = formData.get('deviceName') as string;
    const type = formData.get('type') as string;
    const releaseDateRaw = formData.get('releaseDate') as string;
    const deviceImage = formData.get('deviceImage') as Blob | null;

    if (
      !brand ||
      !modelName ||
      !deviceName ||
      !deviceImage ||
      !type ||
      !releaseDateRaw
    ) {
      throw new ErrorBadRequest(
        'Mangler påkrævede felter.',
        `brand=${brand}, modelName=${modelName}, deviceName=${deviceName}, type=${type}, releaseDate=${releaseDateRaw}, deviceImage=${deviceImage}`
      );
    }

    const deviceAvif = await convertToAvif(deviceImage);
    const releaseDate = new Date(releaseDateRaw);

    console.log('Creating device with:', {
  brand,
  model: modelName,
  version: deviceName,
  type,
  releaseDate,
});


    const newDevice = await DeviceClient.createDevice(
      {
        brand,
        model: modelName,
        version: deviceName,
        type,
        releaseDate,
      },
      deviceAvif
    );

    return NextResponse.json(
      {
        success: true,
        data: newDevice,
        message: 'Device oprettet.',
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.httpCode }
      );
    }

console.error('Uventet fejl:', JSON.stringify(err, null, 2));
    return NextResponse.json(
      { success: false, message: 'Intern serverfejl.' },
      { status: 500 }
    );
  }
}

