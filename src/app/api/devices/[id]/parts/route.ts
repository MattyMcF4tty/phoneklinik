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
    const parts = await handleSupabaseFunction('get_device_parts_by_id', {
      parts_device_id: id,
    });

    return NextResponse.json({ data: parts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
