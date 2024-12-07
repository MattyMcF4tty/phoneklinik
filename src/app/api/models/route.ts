import { handleSupabaseFunction } from '@/utils/config/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const brand = searchParams.get('brand');

  if (!brand) {
    return NextResponse.json(
      { error: 'Missing brand in search params' },
      { status: 400 }
    );
  }

  try {
    const models = await handleSupabaseFunction('get_device_models_by_brand', {
      model_brand: brand,
    });

    return NextResponse.json({ data: models }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
