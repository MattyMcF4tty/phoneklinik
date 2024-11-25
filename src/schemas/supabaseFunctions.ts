import { AccessorySchema } from './accessorySchema';
import { BrandSchema } from './brandSchema';
import { DevicePartSchema } from './devicePartSchema';
import { DeviceSchema } from './deviceScema';

export type SupabaseFunctions = {
  /* __________ DEVICES __________ */
  get_device_by_id: {
    Args: { device_id: number };
    Returns: DeviceSchema[];
  };
  query_devices: {
    Args: {
      device_brand: string | null;
      device_model: string | null;
      device_version: string | null;
      device_type: string | null;
    };
    Returns: DeviceSchema[];
  };
  query_device_name: {
    Args: {
      device_name: string;
    };
    Returns: DeviceSchema[];
  };
  /* __________ PARTS __________ */
  get_device_parts_by_id: {
    Args: {
      parts_device_id: number;
    };
    Returns: DevicePartSchema[];
  };
  /* __________ BRANDS __________ */
  get_brands: {
    Args: {};
    Returns: BrandSchema[];
  };
  insert_brand: {
    Args: {
      brand_name: string;
    };
    Returns: BrandSchema[];
  };
  /* __________ ACCESSORIES __________ */
  get_accessory_by_id: {
    /* Missing a route */
    Args: {
      accessory_id: string;
    };
    Returns: AccessorySchema[];
  };
  get_accessories: {
    /* Missing a route */ Args: {};
    Returns: AccessorySchema[];
  };
};
