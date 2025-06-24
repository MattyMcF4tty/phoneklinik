'use server';

import DevicePartClient from '@/lib/clients/devicePartClient';
import DevicePartVariantClient from '@/lib/clients/partVariantClient';
import { revalidatePath } from 'next/cache';
import DeviceClient from '@/lib/clients/deviceClient'; // ⬅️ add this
import { createClient } from '@lib/supabase/serverClient';

export async function updateDevice(formData: FormData) {
  const id = Number(formData.get('id'));

  await DeviceClient.id(id).updateDevice({
    brand: formData.get('brand') as string,
    model: formData.get('model') as string,
    version: formData.get('version') as string,
    type: formData.get('type') as string,
    releaseDate: new Date(formData.get('releaseDate') as string), // ✅ convert to Date
  });

  revalidatePath('/');
}

export async function updatePart(formData: FormData) {
  const id = Number(formData.get('id'));

  await DevicePartClient.id(id).updatePart({
    name: formData.get('name') as string,
    description: '', // ✅ placeholder if you're not using it yet
  });

  revalidatePath('/');
}

export async function addPart(formData: FormData) {
  const client = new DevicePartClient();

  const deviceId = Number(formData.get('deviceId'));
  const name = formData.get('name') as string;

  await client.addPart(deviceId, {
    name,
    description: '', // ✅ placeholder
  });

  revalidatePath('/');
}

export async function updateVariant(formData: FormData) {
  const partId = Number(formData.get('partId'));
  const variantId = Number(formData.get('variantId'));
  const price = Number(formData.get('price'));
  const name = formData.get('name') as string;

  await DevicePartVariantClient.id(partId, variantId).updatePartVariant({
    price,
    name,
  });

  revalidatePath('/');
}

export async function addVariant(formData: FormData) {
  const partId = Number(formData.get('partId'));
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));

  const supabase = await createClient();

  const { error } = await supabase.from('part_variants').insert({
    part_id: partId,
    name,
    price,
  });

  if (error) {
    throw new Error(`Error adding variant: ${error.message}`);
  }

  revalidatePath('/');
}