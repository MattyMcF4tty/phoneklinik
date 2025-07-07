'use server';

import DevicePartVariantClient from '@/lib/clients/partVariantClient';
import DeviceClient from '@/lib/clients/deviceClient';
import { ActionResponse } from '@schemas/types';
import { handleActionError } from '@utils/error';
import { ErrorBadRequest } from '@schemas/errors/appErrorTypes';
import DevicePart from '@schemas/devicePart';
import DevicePartClient from '@lib/clients/devicePartClient';
import PartVariant from '@schemas/partVariant';

export async function updatePart(
  prevState: ActionResponse<DevicePart>,
  formData: FormData
): Promise<ActionResponse<DevicePart>> {
  const id = parseInt(formData.get('partId')?.toString() || '', 10);
  const name = formData.get('partName')?.toString();
  const description = formData.get('partDescription')?.toString();

  const part = await DevicePartClient.id(id).updatePart({
    name: name,
    description: description,
  });

  return {
    success: true,
    message: `Del '${part.name} opdateret.'`,
    data: part,
  };
}

export async function addPart(
  prevState: ActionResponse<DevicePart | undefined>,
  formData: FormData
): Promise<ActionResponse<DevicePart | undefined>> {
  try {
    const deviceId = parseInt(formData.get('deviceId')?.toString() || '', 10);
    if (isNaN(deviceId)) {
      throw new ErrorBadRequest(
        'Ugyldigt ID. Delen kunne ikke oprettes.',
        `Invalid deviceId in formData. Expected postive integer, got:${deviceId}`
      );
    }

    const name = formData.get('partName')?.toString();
    const description = formData.get('partDescription')?.toString();

    if (!name) {
      throw new ErrorBadRequest(
        'Mangler navn',
        `Expected partName string in formData. Got ${name}`
      );
    }
    if (!description) {
      throw new ErrorBadRequest(
        'Mangler beskrivelse',
        `Expected partDescription string in formData. Got ${description}`
      );
    }

    const part = await DevicePartClient.addPart(deviceId, {
      name: name,
      description: description,
    });

    return {
      success: true,
      message: `Del ${part.name} oprettet`,
      data: part,
    };
  } catch (err: unknown) {
    return handleActionError(err, 'Kunne ikke oprette del.');
  }
}

export async function deletePart(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const id = parseInt(formData.get('partId')?.toString() || '', 10);

    if (isNaN(id)) {
      throw new ErrorBadRequest(
        'Ugyldigt ID. Delen kunne ikke slettes.',
        `Invalid id in formData. Expected postive integer, got: ${id}`
      );
    }

    await DevicePartClient.id(id).deletePart();
    return {
      success: true,
      message: 'Delen blev slettet',
    };
  } catch (err: unknown) {
    return handleActionError(err, 'Delen kunne ikke slettes');
  }
}

export async function updateVariant(
  prevState: ActionResponse<PartVariant>,
  formData: FormData
): Promise<ActionResponse<PartVariant>> {
  try {
    const variantId = parseInt(formData.get('variantId')?.toString() || '', 10);
    const name = formData.get('variantName')?.toString();
    const description = formData.get('variantDescription')?.toString();
    const variantRepairTime = Number(formData.get('variantRepairTime'));
    const variantGrade = parseInt(
      formData.get('variantGrade')?.toString() || '',
      10
    );
    const price = Number(formData.get('variantPrice'));

    if (isNaN(variantId) || variantId <= 0) {
      throw new ErrorBadRequest(
        'Ugyldigt ID. Varianten kunne ikke opdateres.',
        `Invalid variantId in formData. Expected postive integer, got: ${variantId}`
      );
    }

    if (isNaN(variantRepairTime) || variantRepairTime < 0) {
      throw new ErrorBadRequest(
        'Ugyldigt reparations tid. Varianten kunne ikke opdateres.',
        `Invalid variantRepairTime in formData. Expected postive number, got: ${variantRepairTime}`
      );
    }
    if (isNaN(variantGrade) || variantGrade < 0) {
      throw new ErrorBadRequest(
        'Ugyldigt variant grade. Varianten kunne ikke opdateres.',
        `Invalid variantGrade in formData. Expected postive integer, got: ${variantGrade}`
      );
    }

    const variant = await DevicePartVariantClient.id(
      variantId
    ).updatePartVariant({
      price: price,
      name: name,
      description: description,
      estimatedMinutes: variantRepairTime,
      gradeLevel: variantGrade,
    });
    return {
      success: true,
      message: `Del-variant '${variant.name}'`,
      data: variant,
    };
  } catch (err: unknown) {
    return handleActionError(err, 'Del-varianten kunne ikke opdateres');
  }
}

export async function addVariant(
  prevState: ActionResponse<PartVariant | undefined>,
  formData: FormData
): Promise<ActionResponse<PartVariant | undefined>> {
  try {
    const partId = parseInt(formData.get('partId')?.toString() || '', 10);
    const name = formData.get('variantName')?.toString();
    const description = formData.get('variantDescription')?.toString();
    const variantRepairTime = Number(formData.get('variantRepairTime'));
    const variantGrade = parseInt(
      formData.get('variantGrade')?.toString() || '',
      10
    );
    const price = Number(formData.get('variantPrice'));

    console.log(partId);

    if (isNaN(partId) || partId <= 0) {
      throw new ErrorBadRequest(
        'Ugyldigt ID. Varianten kunne ikke oprettes.',
        `Invalid partId in formData. Expected postive integer, got: ${partId}`
      );
    }
    if (isNaN(variantRepairTime) || variantRepairTime < 0) {
      throw new ErrorBadRequest(
        'Ugyldigt reparations tid. Varianten kunne ikke oprettes.',
        `Invalid variantRepairTime in formData. Expected postive number, got: ${variantRepairTime}`
      );
    }
    if (isNaN(variantGrade) || variantGrade < 0) {
      throw new ErrorBadRequest(
        'Ugyldigt variant grade. Varianten kunne ikke oprettes.',
        `Invalid variantGrade in formData. Expected postive integer, got: ${variantGrade}`
      );
    }
    if (!name) {
      throw new ErrorBadRequest(
        'Mangler navn',
        `Expected variantName string in formData. Got ${name}`
      );
    }
    if (!description) {
      throw new ErrorBadRequest(
        'Mangler beskrivelse',
        `Expected variantDescription string in formData. Got ${description}`
      );
    }
    if (isNaN(price)) {
      throw new ErrorBadRequest(
        'Ugyldig pris',
        `Expected variantprice in formData to be type of number. Got ${price}`
      );
    }

    const variant = await DevicePartVariantClient.addPartVariant(partId, {
      name: name,
      description: description,
      price: price,
      gradeLevel: variantGrade,
      estimatedMinutes: variantRepairTime,
    });

    return {
      success: true,
      message: `Del-variant '${variant.name} tilføjet.'`,
      data: variant,
    };
  } catch (err: unknown) {
    return handleActionError(err, 'Varianten kunne ikke oprettes.');
  }
}

export async function deleteVariant(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const variantId = parseInt(formData.get('variantId')?.toString() || '', 10);

    if (isNaN(variantId)) {
      throw new ErrorBadRequest(
        'Ugyldigt ID. Del-varianten kunne ikke slettes.',
        `Invalid variantId in formData. Expected postive integer. Got ${variantId}`
      );
    }

    await DevicePartVariantClient.id(variantId).deletePartVariant();

    return {
      success: true,
      message: 'Del-varianten blev slettet.',
    };
  } catch (err: unknown) {
    return handleActionError(err, 'Del-varianten kunne ikke slettes.');
  }
}

export async function deleteDevice(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const idRaw = formData.get('deviceId')?.toString();

    const id = parseInt(idRaw || '', 10);

    if (isNaN(id) || id <= 0) {
      throw new ErrorBadRequest(
        'Ugyldigt ID. Enheden kunne ikke slettes.',
        `Invalid id in formData. Expected a positive integer, got: ${idRaw}`
      );
    }

    await DeviceClient.id(id).deleteDevice();

    return {
      success: true,
      message: 'Enhed slettet',
    };
  } catch (err: unknown) {
    return handleActionError(err, 'Sletning af enhed mislykkedes');
  }
}
