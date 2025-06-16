'use server';

import AccessoryClient from '@lib/clients/accessoryClient';
import Accessory from '@schemas/accessory';
import { ErrorBadRequest } from '@schemas/errors/appErrorTypes';
import { ActionResponse } from '@schemas/types';
import { handleActionError } from '@utils/error';

export async function updateAccessory(
  prevState: ActionResponse<Omit<Accessory, 'images'> | undefined>,
  formData: FormData
): Promise<ActionResponse<Omit<Accessory, 'images'> | undefined>> {
  try {
    const id = parseInt(formData.get('accessoryId')?.toString() || '', 10);
    const name = formData.get('accessoryName')?.toString();
    const brand = formData.get('accessoryBrand')?.toString();
    const description = formData.get('accessoryDescription')?.toString();
    const supportedDevices = formData
      .getAll('supportedDevices')
      .map((value) => value.toString());

    let type = formData.get('accessoryType')?.toString();

    if (type === 'custom') {
      const customType = formData.get('customType')?.toString();

      type = customType;
    }

    console.log(supportedDevices);

    const price = Number(formData.get('accessoryPrice')?.toString());

    if (isNaN(id) || id <= 0) {
      throw new ErrorBadRequest(
        'Ugyldig tilbehør id',
        `Expected accessoryId to be postive integer. Got ${id}`
      );
    }
    if (isNaN(price)) {
      throw new ErrorBadRequest(
        'Ugyldig tilbehørs pris',
        `Expected accessoryPrice to be number. Got ${price}`
      );
    }

    const updateAccessory = await AccessoryClient.id(id).updateAccessory({
      name,
      brand,
      description,
      supportedDevices,
      price,
      type,
    });

    return {
      success: true,
      message: 'Tilbehør opdateret',
      data: updateAccessory,
    };
  } catch (err: unknown) {
    return handleActionError(err);
  }
}

// TODO: Improve this function
export async function deleteAccessory(formData: FormData) {
  const idRaw = formData.get('accessoryId')?.toString();

  if (!idRaw) {
    console.error(
      'Missing accessory id in formdata when trying to delete accessory. Formdata:',
      formData.entries()
    );
    return;
  }

  const id = parseInt(idRaw);
  if (isNaN(id) || id <= 0) {
    console.error(
      `Invalid accessory id in formdata when trying to delete accessory. Expected postive integer. Got ${id}`
    );
    return;
  }

  await AccessoryClient.id(id).deleteAccessory();

  return;
}
