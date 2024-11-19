import { handleSupabaseFunction } from '../config/supabase';

/**
 * Gets a device based of its id.
 * @param id The id of the device you want to get.
 * @returns A device.
 */
export const getDevicesById = async (id: number) => {
  const devices = await handleSupabaseFunction('get_device_by_id', {
    device_id: id,
  });

  return devices;
};

/**
 * Query a device based of its id.
 * @param id The id of the device you want to get.
 * @returns A device.
 */
export const queryDevices = async (
  brand: string,
  model: string,
  version: string,
  type: string
) => {
  const devices = await handleSupabaseFunction('query_devices', {
    device_brand: brand,
    device_model: model,
    device_version: version,
    device_type: type,
  });

  return devices;
};
