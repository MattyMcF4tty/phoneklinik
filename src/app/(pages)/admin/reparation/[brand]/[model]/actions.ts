'use server';

import DeviceClient from '@/lib/clients/deviceClient';

export async function fetchDevicesByBrandAndModel(brand: string, model: string) {
  if (!brand || !model) {
    throw new Error('Brand and model are required');
  }

  const devices = await DeviceClient.query()
    .brand(brand)
    .model(model);

  return devices;
}
