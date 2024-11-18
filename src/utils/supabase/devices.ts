import { handleSupabaseFunction } from '../config/supabase';

/**
 * Gets a list of devices based of their brand.
 * @param brand The brand of the device.
 * @returns A list of the devices.
 */
export const getDevicesByBrand = async (brand: string) => {
  const devices = await handleSupabaseFunction('get_devices_by_brand', {
    device_brand: brand,
  });

  return devices;
};

/**
 * Gets all devices.
 * @returns A list of the devices.
 */
export const getDevices = async () => {
  const devices = await handleSupabaseFunction('get_devices', {});

  return devices;
};

/**
 * Gets a list of devices based of their type.
 * @param type The type of the device.
 * @returns A list of the devices.
 */
export const getDevicesByType = async (type: string) => {
  const devices = await handleSupabaseFunction('get_devices_by_type', {
    device_type: type,
  });

  return devices;
};

/**
 * Gets a list of devices based of their brand and model.
 * @param brand The brand of the device.
 * @param model The model of the device.
 * @returns A list of the devices.
 */
export const getDevicesByBrandAndModel = async (
  brand: string,
  model: string
) => {
  const devices = await handleSupabaseFunction(
    'get_devices_by_brand_and_model',
    {
      device_brand: brand,
      device_model: model,
    }
  );

  return devices;
};

/**
 * Gets a device based of its id.
 * @param id The id of the device you want to get.
 * @returns A device.
 */
export const getDevicesById = async (id: number) => {
  const devices = await handleSupabaseFunction('get_devices_by_id', {
    device_id: id,
  });

  return devices;
};

/**
 * Gets a list of devices based of their brand and type.
 * @param brand The brand of the device.
 * @param type The type of the device.
 * @returns A list of the devices.
 */
export const getDevicesByBrandAndType = async (brand: string, type: string) => {
  const devices = await handleSupabaseFunction(
    'get_devices_by_brand_and_type',
    {
      device_brand: brand,
      device_type: type,
    }
  );

  return devices;
};
