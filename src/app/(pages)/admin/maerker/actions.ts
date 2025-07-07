'use server';

import { BrandClient } from '@lib/clients/brandClient';
import { ErrorBadRequest } from '@schemas/errors/appErrorTypes';
import { ActionResponse } from '@schemas/types';
import { handleActionError } from '@utils/error';

export async function deleteBrand(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const brandName = formData.get('brandName')?.toString();

    if (!brandName) {
      throw new ErrorBadRequest(
        'Mangler mærke navn.',
        `Missing brandName in formdata when trying to delete brand. Formdata: ${formData.entries()}`
      );
    }

    await BrandClient.brandName(brandName).deleteBrand();

    return {
      success: true,
      message: `Mærke ${brandName} slettet. Samt alle enheder og tilbehør.`,
    };
  } catch (err: unknown) {
    return handleActionError(err, 'Noget gik galt under sletning.');
  }
}
