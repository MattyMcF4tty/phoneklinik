import DeviceClient from '@/lib/clients/deviceClient';
import errorToCookie from '@/lib/errors/handleErrorSSR';
import AppError from '@/schemas/errors/appError';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get('name') || '';

  try {
    const devices = await DeviceClient.searchByName(name);

    return NextResponse.json({ data: devices }, { status: 200 });
  } catch (err: unknown) {
    await errorToCookie(err);
    if (err instanceof AppError) {
      return NextResponse.json({ data: null }, { status: err.httpCode });
    }
    return NextResponse.json({ data: null }, { status: 500 });
  }
}
