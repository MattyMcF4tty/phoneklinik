import { BrandClient } from '@/lib/clients/brandClient';
import { NextRequest, NextResponse } from 'next/server';
import AppError from '@/schemas/errors/appError';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import { convertToAvif } from '@/utils/image';
import { ApiResponse } from '@/schemas/types';
import Brand from '@/schemas/brand';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Brand>>> {
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

    const newBrand = await BrandClient.createBrand(
      { name: brandName },
      brandAvif
    );

    return NextResponse.json(
      {
        success: true,
        data: newBrand,
        message: 'Brand oprettet.',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error('Error creating brand:', err.details);
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

export async function PATCH(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Brand>>> {
  try {
    const formData = await req.formData();

    const brandName = formData.get('brandName') as string | undefined;

    if (!brandName) {
      throw new ErrorBadRequest(
        'Mangler mærke navn.',
        `Missing name of brand to updated in formdata. Expected brandName string in formdata. Got ${brandName}`
      );
    }

    const newBrandName = formData.get('newBrandName') as string | undefined;
    const brandImage = formData.get('brandImage') as Blob | undefined;

    let brandAvif: Buffer | undefined;
    if (brandImage) {
      brandAvif = await convertToAvif(brandImage);
    }

  const brandHandler = await BrandClient.brandName(brandName);

const brand = await brandHandler.updateBrand(
  {
    name: newBrandName,
  },
  brandAvif
);

    return NextResponse.json({
      message: `Mærke ${newBrandName && 'navn'} ${
        newBrandName && brandAvif && 'og'
      } ${brandAvif && 'billede'} opdateret.`,
      data: brand,
    });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error('Error creating brand:', err.details);
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
