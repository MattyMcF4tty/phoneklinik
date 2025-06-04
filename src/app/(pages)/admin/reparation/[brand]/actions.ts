'use server';

import { revalidateTag } from 'next/cache';

type DeviceFormState =
  | { success: true; device: any; error?: undefined }
  | { success: false; error: string; device?: undefined };

export async function createDeviceAction(
  prevState: DeviceFormState,
  formData: FormData
): Promise<DeviceFormState> {
  const brand = formData.get('brand') as string;
  const modelName = formData.get('modelName') as string;
  const deviceName = formData.get('deviceName') as string;
  const deviceImage = formData.get('deviceImage') as File;

  if (!brand || !modelName || !deviceName || !deviceImage) {
    return {
      success: false,
      error: 'Alle felter skal udfyldes.',
    };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/devices`, {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: result.message || 'Noget gik galt ved oprettelse.',
      };
    }

    // Optional: revalidate cache
    revalidateTag('devices');

    return {
      success: true,
      device: result.device,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Uventet fejl under oprettelse.',
    };
  }
}
