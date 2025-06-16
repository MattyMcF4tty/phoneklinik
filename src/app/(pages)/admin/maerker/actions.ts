'use server';

import { BrandClient } from '@lib/clients/brandClient';

// TODO: Improve this function
export async function deleteBrand(formData: FormData) {
  const brandName = formData.get('brandName')?.toString();

  if (!brandName) {
    console.error(
      'Missing brandName in formdata when trying to delete brand. Formdata:',
      formData.entries()
    );
    return;
  }

  await BrandClient.brandName(brandName).deleteBrand();

  return;
}
