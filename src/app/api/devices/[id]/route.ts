import { handleSupabaseFunction } from '@/utils/config/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: any) {
  const { id } = await params;
  const formattedId = parseInt(id, 10);

  // Validate the id to ensure it's a positive integer
  if (isNaN(formattedId) || id <= 0) {
    return NextResponse.json(
      { error: `id must be a valid positive integer.` },
      { status: 400 }
    );
  }

  try {
    const devices = await handleSupabaseFunction('get_device_by_id', {
      device_id: id,
    });

    if (devices.length <= 0) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: devices[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
