import {
  getDevicesByBrand,
  getDevicesByBrandAndModel,
  getDevicesById,
} from '@/utils/supabase/devices';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const devices = await getDevicesById(2);

  console.log('devices:', devices);

  const data = devices;
  return NextResponse.json({ data: data }, { status: 200 });
}
