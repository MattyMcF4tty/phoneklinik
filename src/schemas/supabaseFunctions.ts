import { DeviceSchema } from './deviceScema';

export type SupabaseFunctions = {
  get_devices_by_brand: {
    Args: { device_brand: string };
    Returns: DeviceSchema[];
  };
  get_devices: {
    Args: {};
    Returns: DeviceSchema[];
  };
  get_devices_by_type: {
    Args: { device_type: string };
    Returns: DeviceSchema[];
  };
  get_devices_by_brand_and_model: {
    Args: { device_brand: string; device_model: string };
    Returns: DeviceSchema[];
  };
  get_devices_by_id: {
    Args: { device_id: number };
    Returns: DeviceSchema[];
  };
  get_devices_by_brand_and_type: {
    Args: { device_brand: string; device_type: string };
    Returns: DeviceSchema[];
  };
};
