import AccessoryClient from '@lib/clients/accessoryClient';
import AppError from '@schemas/errors/appError';
import { ErrorBadRequest } from '@schemas/errors/appErrorTypes';
import { ApiResponse } from '@schemas/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const name = data.accessoryName.toString() || undefined;
    const description = data.accessoryDescription.toString() || undefined;
    const brand = data.accessoryBrand.toString() || undefined;
    let type = data.accessoryType.toString() || undefined;
    const price = Number(data.accessoryPrice.toString()) || undefined;

    const supportedDevices = formData.getAll('supportedDevices') as
      | string[]
      | undefined;
    const image = formData.get('accessoryImage') as Blob | undefined;

    if (!name) {
      throw new ErrorBadRequest(
        'Mangler tilbehør navn',
        `Expected accesorryName in formData, got: ${name}`
      );
    }
    if (!description) {
      throw new ErrorBadRequest(
        'Mangler tilbehør beskrivelse',
        `Expected accessoryDescription in formData, got: ${description}`
      );
    }
    if (!brand) {
      throw new ErrorBadRequest(
        'Mangler tilbehør brand',
        `Expected accessoryBrand in formData, got: ${description}`
      );
    }
    if (!type) {
      throw new ErrorBadRequest(
        'Mangler tilbehør type',
        `Expected accessoryType in formData, got: ${description}`
      );
    }
    if (!price || isNaN(price)) {
      throw new ErrorBadRequest(
        'ugyldig tilbehør pris',
        `Expected accessoryPrice in formData to be number, got: ${description}`
      );
    }
    if (!supportedDevices) {
      throw new ErrorBadRequest(
        'Mangler tilbehørs understøttede enheder',
        `Expected supportedDevices in formData, got: ${description}`
      );
    }
    if (!image) {
      throw new ErrorBadRequest(
        'Mangler tilbehør billede',
        `Expected accesorryImage in formData, got: ${description}`
      );
    }

    if (type === 'custom') {
      const customType = data.customType.toString() || undefined;
      if (!customType) {
        throw new ErrorBadRequest(
          'Mangler tilbehør custom type',
          `Expected customType in formData, got: ${description}`
        );
      }
      type = customType;
    }

    await AccessoryClient.createAccessory(
      {
        name,
        description,
        brand,
        type,
        price,
        supportedDevices,
      },
      image
    );

    return NextResponse.json(
      { success: true, message: 'Tilbehør oprettet' },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error('AppError:', err.details);
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.httpCode }
      );
    }

    console.error('Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'Noget gik galt.' },
      { status: 500 }
    );
  }
}
