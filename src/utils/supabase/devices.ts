import { SearchParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import { handleSupabaseFunction } from '../config/supabase';
import Device, { DeviceSchema } from '@/schemas/deviceScema';

/**
 * Gets a device based of its id.
 * @param id The id of the device you want to get.
 * @returns A device.
 */
export const getDeviceById = async (id: number): Promise<Device | null> => {
  const searchParams = new URLSearchParams();
  searchParams.append('id', `${id}`);

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_WEBSITE_URL
    }/api/devices/${searchParams.toString()}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error);
  }

  const deviceData = responseData.data;

  if (!deviceData) {
    return null;
  }

  const device = new Device(deviceData);

  return device;
};

/**
 * Gets a device based of its name.
 * @param name The name of the device. The name is a compination of the model and the version. Example: `'Iphone' + ' ' + '12'`.
 * @returns A device.
 */
export const queryDeviceName = async (name: string): Promise<Device | null> => {
  const searchParams = new URLSearchParams();
  searchParams.append('name', `${name}`);

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_WEBSITE_URL
    }/api/devices/search?${searchParams.toString()}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error);
  }

  const deviceData = responseData.data;

  if (!deviceData) {
    return null;
  }

  const device = new Device(deviceData);

  return device;
};

/**
 * Query for devices.
 * @param brand The brand of the device. Default `null`
 * @param model The model of the device. Default `null`
 * @param version The model version of the device. Default `null`
 * @param type The type of the device. Default `null`
 * @returns An array of deviceSchemas.
 */
export const queryDevices = async (search: {
  brand?: string;
  model?: string;
  version?: string;
  type?: string;
}): Promise<Device[]> => {
  // Format and validate the query paramaters to match what the server expects.
  const searchParams = new URLSearchParams();
  if (search.brand) {
    searchParams.append('brand', search.brand);
  }
  if (search.model) {
    searchParams.append('model', search.model);
  }
  if (search.version) {
    searchParams.append('version', search.version);
  }
  if (search.type) {
    searchParams.append('type', search.type);
  }

  // Fetch data from the server
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_WEBSITE_URL
    }/api/devices?${searchParams.toString()}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );
  const responseData = await response.json();

  // Check if server response was ok and no error occured.
  if (!response.ok) {

    throw new Error(responseData.error);
  }

  // Get devices from json.
  const devicesData = responseData.data;

  const devices = devicesData.map((deviceData: DeviceSchema) => {
    return new Device(deviceData);
  });

  return devices;
};
