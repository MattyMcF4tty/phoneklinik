import AppError from '@/schemas/errors/appError';
import Device from '@/schemas/new/device';
import { createClient } from '@/utils/config/supabase/serverClient';
import { deserializeFromDbFormat, Serialize } from '@/utils/dbFormat';
import { unstable_cache } from 'next/cache';

export const cachedDevices = unstable_cache(
  async (): Promise<Device[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('release_date', { ascending: false });

    if (error) {
      throw new AppError(
        'Something went wrong while fetching devices',
        `Error fetching devices: ${error.message}`,
        500
      );
    }

    const deviceData = data as Serialize<Device>[];

    const devices = deviceData.map(device => deserializeFromDbFormat(device));

    return devices;
  },
  ['devices-all'],
  {
    revalidate: 60,
    tags: ['devices'],
  }
);


const cachedDevice = unstable_cache();

export async function getDevices() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching devices:', error);
    return [];
  }

  return data;
}
