import { NextRequest, NextResponse } from 'next/server';
import { handleSupabaseFunction } from '@/utils/config/supabase';

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Context) {
  const id = (await params).id;
  const formattedId = parseInt(id, 10);

  // Validate the id to ensure it's a positive integer
  if (isNaN(formattedId) || formattedId <= 0) {
    return NextResponse.json(
      { error: `id must be a valid positive integer.` },
      { status: 400 }
    );
  }

  try {
    const parts = await handleSupabaseFunction('get_device_parts_by_id', {
      parts_device_id: formattedId,
    });

    return NextResponse.json({ data: parts }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
