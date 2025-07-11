import AccessoryClient from '@lib/clients/accessoryClient';
import Accessory from '@schemas/accessory';
import AppError from '@schemas/errors/appError';
import { ErrorBadRequest } from '@schemas/errors/appErrorTypes';
import { ApiResponse } from '@schemas/types';
import { convertToAvif } from '@utils/image';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Accessory>>> {
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

    const newAccessory = await AccessoryClient.createAccessory(
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
      { success: true, message: 'Tilbehør oprettet', data: newAccessory },
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

export async function PATCH(
  req: NextRequest
): Promise<NextResponse<ApiResponse<Accessory>>> {
  try {
    const formData = await req.formData();

    const accessoryIdRaw = formData.get('accessoryId') as string | undefined;
    const accessoryId = parseInt(accessoryIdRaw || '', 10);

    if (!accessoryId || isNaN(accessoryId) || accessoryId <= 0) {
      throw new ErrorBadRequest(
        'Mangler tilbehør id.',
        `Invalid accessoryId in formdata. Expected positive integer. Got: ${accessoryIdRaw}`
      );
    }

    const accessoryName = formData.get('accessoryName') as string | undefined;
    const accessoryDescription = formData.get('accessoryDescription') as
      | string
      | undefined;
    const accessoryBrand = formData.get('accessoryBrand') as string | undefined;
    const accessoryType = formData.get('accessoryType') as string | undefined;
    const customType = formData.get('customType') as string | undefined;
    const accessoryPriceRaw = formData.get('accessoryPrice') as
      | string
      | undefined;
    const accessoryPrice = Number(accessoryPriceRaw);
    const supportedDevices = formData.getAll('supportedDevices') as
      | string[]
      | undefined;

    if (isNaN(accessoryPrice)) {
      throw new ErrorBadRequest(
        'Ugyldig tilbehør pris.',
        `Invalid accessoryPrice in formdata. Expected number. Got: ${accessoryPrice}`
      );
    }

    let selectedAccessoryType: string | undefined;
    if (accessoryType) {
      if (accessoryType === 'custom' && customType) {
        selectedAccessoryType = customType;
      } else {
        selectedAccessoryType = accessoryType;
      }
    }

    const accesorryImage = formData.get('accessoryImage') as Blob | undefined;

    const imageExists =
      accesorryImage instanceof Blob &&
      accesorryImage.size > 0 &&
      accesorryImage.type !== 'application/octet-stream';

    let accesorryAvif: Buffer | undefined;
    if (imageExists) {
      console.log(accesorryImage);
      accesorryAvif = await convertToAvif(accesorryImage);
    }

    const updatedAccessory = await AccessoryClient.id(
      accessoryId
    ).updateAccessory(
      {
        brand: accessoryBrand,
        description: accessoryDescription,
        name: accessoryName,
        price: accessoryPrice,
        supportedDevices: supportedDevices,
        type: selectedAccessoryType,
      },
      accesorryAvif
    );

    return NextResponse.json({
      message: `Tilbehør ${updatedAccessory.name} opdateret.`,
      success: true,
      data: updatedAccessory,
    });
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
