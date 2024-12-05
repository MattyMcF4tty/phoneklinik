import { handleSupabaseFunction } from '@/utils/config/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
  const { id } = await params;
  const formattedId = parseInt(id, 10);

  // Validate the id to ensure it's a positive integer
  if (isNaN(formattedId) || formattedId <= 0) {
    return NextResponse.json(
      { error: `id must be a valid positive integer.` },
      { status: 400 }
    );
  }

  try {
    const devices = await handleSupabaseFunction('get_device_by_id', {
      device_id: formattedId,
    });

    if (devices.length <= 0) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: devices[0] }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
