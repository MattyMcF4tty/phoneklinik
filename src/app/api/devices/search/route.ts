import DeviceClient from '@/lib/clients/deviceClient';
import AppError from '@/schemas/errors/appError';
import Device from '@schemas/device';
import { ApiResponse } from '@schemas/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest
): Promise<
  NextResponse<
    ApiResponse<Pick<Device, 'id' | 'brand' | 'model' | 'version'>[]>
  >
> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get('name') || '';

    const devices = await DeviceClient.searchByName(name);

    return NextResponse.json(
      {
        message: `Found ${devices.length} devices matching '${name}'`,
        success: true,
        data: devices,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.httpCode }
      );
    } else {
      console.error('Unexpected error in valuation request:', err);
      return NextResponse.json(
        { success: false, message: 'An unexpected error occurred.' },
        { status: 500 }
      );
    }
  }
}
