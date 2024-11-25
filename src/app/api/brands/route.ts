import { handleSupabaseFunction } from '@/utils/config/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const brands = await handleSupabaseFunction('get_brands', {});

    return NextResponse.json({ data: brands }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const brandname = bodyData.brandName;

  if (typeof brandname !== 'string') {
    return NextResponse.json(
      { error: 'Missing brandName in body' },
      { status: 400 }
    );
  }

  try {
    const brandsData = await handleSupabaseFunction('insert_brand', {
      brand_name: brandname,
    });

    const brandData = brandsData[0];

    return NextResponse.json({ data: brandData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
