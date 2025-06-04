import { NextRequest, NextResponse } from 'next/server';
import { convertToAvif } from '@/utils/image';
import AppError from '@/schemas/errors/appError';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import DeviceClient from '@/lib/clients/deviceClient';
import { ApiResponse } from '@/schemas/types';
import Device from '@/schemas/device';

export async function POST(
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
