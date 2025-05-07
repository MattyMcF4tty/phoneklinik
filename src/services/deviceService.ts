import AppError from '@/schemas/errors/appError';
import Device from '@/schemas/new/device';
import { createClient } from '@/utils/config/supabase/serverClient';
import {
  deserializeFromDbFormat,
  Serialize,
  serializeToDbFormat,
} from '@/utils/dbFormat';

export default class DeviceService {
  static async getDeviceByBrandModelVersion(
    brand: string,
    model: string,
    version: string
  ): Promise<Device> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('brand', brand)
      .eq('model', model)
      .eq('version', version)
      .single();

    if (error) {
      throw new AppError(
        `Something went wrong fetching device ${brand} ${model} ${version}`,
        `Unexpected error fetching device ${brand} ${model} ${version}: ${error.message}`,
        500
      );
    }
    if (!data) {
      throw new AppError(
        `No device found with name ${brand} ${model} ${version}`,
        `No device found with name ${brand} ${model} ${version}`,
        404
      );
    }
    const device = deserializeFromDbFormat<Device>(data);
    return device;
  }

  static async getDevicesByBrandAndModel(
    brandName: string,
    modelName: string
  ): Promise<Device[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('brand', brandName)
      .eq('model', modelName)
      .order('release_date', { ascending: false });

    if (error) {
      throw new AppError(
        `Something went wrong fetching devices of brand ${brandName} and model ${modelName}`,
        `Unexpected error fetching devices for brand ${brandName} and model ${modelName}: ${error.message}`,
        500
      );
    }

    if (!data) {
      throw new AppError(
        `No devices found for brand ${brandName} and model ${modelName}`,
        `No devices found for brand ${brandName} and model ${modelName}`,
        404
      );
    }

    const devices = data.map((device: Serialize<Device>) => {
      return deserializeFromDbFormat<Device>(device);
    });

    return devices;
  }

  static async getDeviceById(deviceId: number): Promise<Device> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .single();

    if (error) {
      throw new AppError(
        `Something went wrong fetching device with id ${deviceId}`,
        `Unexpected error fetching device with id ${deviceId}: ${error.message}`,
        500
      );
    }

    if (!data) {
      throw new AppError(
        `No device found with id ${deviceId}`,
        `No device found with id ${deviceId}`,
        404
      );
    }

    const device = deserializeFromDbFormat<Device>(data);

    return device;
  }

  static brands = {
    getBrands: async () => {
      const supabase = await createClient();

      const { data: brandData, error } = await supabase.rpc(
        'get_unique_device_brands'
      );

      if (error) {
        throw new AppError(
          `Something went wrong fetching brands`,
          `Unexpected error fetching brands: ${error.message}`,
          500
        );
      }

      if (!brandData) {
        throw new AppError(`No brands found`, `No brands found`, 404);
      }

      return brandData as string[];
    },
    getBrandLogoUrl: async (brandName: string) => {
      const supabase = await createClient();

      const { data } = supabase.storage
        .from('brand-logos')
        .getPublicUrl(`${brandName}.png`);

      if (!data) {
        throw new AppError(
          `No logo found for brand ${brandName}`,
          `No logo found for brand ${brandName}`,
          404
        );
      }
      const brandLogoUrl = data.publicUrl;
      return brandLogoUrl;
    },
  };

  static models = {
    getUniqueModels: async (brandName: string) => {
      const supabase = await createClient();

      const { data: modelData, error } = await supabase.rpc(
        'get_unique_device_models_by_brand',
        {
          p_brand: brandName,
        }
      );

      if (error) {
        throw new AppError(
          `Something went wrong fetching models of brand ${brandName}`,
          `Unexpected error fetching models for brand ${brandName}: ${error.message}`,
          500
        );
      }
      if (!modelData) {
        throw new AppError(
          `No models found for brand ${brandName}`,
          `No models found for brand ${brandName}`,
          404
        );
      }

      return modelData as string[];
    },
    getModelImageUrl: async (brandName: string, modelName: string) => {
      const supabase = await createClient();

      const { data } = supabase.storage
        .from('device-model-images')
        .getPublicUrl(`${brandName}/${modelName}.png`);
      if (!data) {
        throw new AppError(
          `No image found for model ${modelName} of brand ${brandName}`,
          `No image found for model ${modelName} of brand ${brandName}`,
          404
        );
      }
      const modelImageUrl = data.publicUrl;
      return modelImageUrl;
    },
  };

  static async getDeviceModelsByBrand(brandName: string): Promise<string[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('devices')
      .select('model')
      .eq('brand', brandName)
      .order('model', { ascending: false });

    if (error) {
      throw new AppError(
        `Something went wrong fetching models of brand ${brandName}`,
        `Unexpected error fetching models for brand ${brandName}: ${error.message}`,
        500
      );
    }

    if (!data) {
      throw new AppError(
        `No models found for brand ${brandName}`,
        `No models found for brand ${brandName}`,
        404
      );
    }

    const models = data.map((currentData) => {
      return currentData.model as string;
    });

    return models;
  }

  static async updateDeviceById(id: number, updatedData: Omit<Device, 'id'>) {
    const supabase = await createClient();

    const serializedData = serializeToDbFormat(updatedData);

    const { data, error } = await supabase
      .from('devices')
      .update(serializedData)
      .eq('id', id);

    if (error) {
      throw new AppError(
        `Something went wrong updating device with ID ${id}`,
        `Unexpected error updating device with ID ${id}: ${error.message}`,
        500
      );
    }

    if (!data) {
      throw new AppError(
        `No device found with ID ${id}`,
        `No device found with ID ${id}`,
        404
      );
    }
    const device = deserializeFromDbFormat<Device>(data);

    return device;
  }
}
