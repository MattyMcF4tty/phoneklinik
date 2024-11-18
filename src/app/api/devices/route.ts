import { getDevices } from '@/utils/supabase/devices';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  //TODO: Add auth.
  try {
    const devices = await getDevices();

    return NextResponse.json({ data: devices }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
