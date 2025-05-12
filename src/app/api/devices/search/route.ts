import DeviceClient from '@/lib/clients/deviceClient';
import AppError from '@/schemas/errors/appError';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get('name') || '';

  try {
    const devices = await DeviceClient.searchByName(name);

    return NextResponse.json({ data: devices }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.log(err.details);
      return NextResponse.json(
        { error: err.message },
        { status: err.httpCode }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
