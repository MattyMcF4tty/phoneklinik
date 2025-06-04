import { BrandClient } from '@/lib/clients/brandClient';
import { handleSupabaseFunction } from '@/utils/config/supabase';
import { NextRequest, NextResponse } from 'next/server';
import ValuationRequestClient from '@/lib/clients/valuationBookingClient';
import AppError from '@/schemas/errors/appError';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import { ApiResponse } from '@/schemas/new/types';
import { convertToAvif } from '@/utils/image';


export async function GET() {
  try {
    const brands = await handleSupabaseFunction('get_brands', {});

    return NextResponse.json({ data: brands }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

/* TODO: Missing function */

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();

    const brandName = formData.get('brandName') as string;
    const brandImage = formData.get('brandImage') as Blob | undefined;

    if (!brandName || !brandImage) {
      throw new ErrorBadRequest(
        'Mangler brand navn eller billede.',
        `brandName: ${brandName}, brandImage: ${brandImage}`
      );
    }

    const brandAvif = await convertToAvif(brandImage);

    const newBrand = await BrandClient.createBrand({ name: brandName }, brandAvif);

    return NextResponse.json(
      {
        success: true,
        brand: newBrand,
        message: 'Brand oprettet.',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.httpCode }
      );
    }

    console.error('Unexpected error creating brand:', err);
    return NextResponse.json(
      { success: false, message: 'En uventet fejl opstod.' },
      { status: 500 }
    );
  }
}
