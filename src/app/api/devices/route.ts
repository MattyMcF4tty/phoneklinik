import { handleSupabaseFunction } from '@/utils/config/supabase';
import { NextRequest, NextResponse } from 'next/server';

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
      device_version: version,
      device_type: type,
    });

    console.log(devices);

    return NextResponse.json({ data: devices }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
