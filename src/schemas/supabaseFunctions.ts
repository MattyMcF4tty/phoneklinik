import { AccessorySchema } from './accessorySchema';
import { BrandSchema } from './brandSchema';
import { DevicePartSchema } from './devicePartSchema';
import { DeviceSchema } from './deviceScema';
import { ModelSchema } from './modelSchema';
import { TimeSlotSchema } from './timeSlotSchema';

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
    Args: object;
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
    /* TODO: Missing a route */
    Args: {
      accessory_id: string;
    };
    Returns: AccessorySchema[];
  };
  get_accessories: {
    /* TODO: Missing a route */
    Args: object;
    Returns: AccessorySchema[];
  };
  /* __________ REPAIR_TIME_SLOTS __________ */
  reserve_time_slot: {
    Args: {
      requested_time: string;
      requester_email: string;
    };
    Returns: TimeSlotSchema[];
  };
  get_reserved_time_slots: {
    Args: {
      requested_month: string;
    };
    Returns: TimeSlotSchema[];
  };
  /* __________ MODELS __________ */
  get_device_models_by_brand: {
    Args: {
      model_brand: string;
    };
    Returns: ModelSchema[];
  };
};
