'use server';

import DeviceClient from '@/lib/clients/deviceClient';
import { revalidatePath } from 'next/cache';

export async function fetchModelsByBrand(brand: string) {
  if (!brand) {
    throw new Error('Brand is required');
  }

  const models = await DeviceClient.getUniqueModels(brand);
  return models;
}
