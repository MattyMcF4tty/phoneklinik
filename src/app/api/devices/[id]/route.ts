import { getDevicesById } from '@/utils/supabase/devices';
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
    const device = await getDevicesById(formattedId);

    return NextResponse.json({ data: device }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
