import { handleSupabaseFunction } from '@/utils/config/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get('name') || '';

  try {
    const devices = await handleSupabaseFunction('query_device_name', {
      device_name: name,
    });

    return NextResponse.json({ data: devices }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
