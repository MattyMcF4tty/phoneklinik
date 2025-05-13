import AppError from '@/schemas/errors/appError';
import Device from '@/schemas/new/device';
import { createClient } from '@/lib/supabase/serverClient';
import {
  deserializeFromDbFormat,
  Serialize,
  serializeToDbFormat,
} from '@/utils/dbFormat';
import DevicePartClient from './devicePartClient';
import Brand from '@/schemas/new/brand';
import Model from '@/schemas/new/model';

// Config
const deviceTable = 'devices';
const deviceImageBucket = 'device-images';
const brandLogoBucket = 'brand-images';

export default class DeviceClient {
  public static id(id: number) {
    return new DeviceHandler(id);
  }

  public static query() {
    return new DeviceQueryBuilder();
  }

  public static async createDevice(
    newDevice: Omit<Device, 'id' | 'imageUrl'>,
    deviceImage: Buffer
  ): Promise<Device> {
    const supabase = await createClient();

    const serializedDevice = serializeToDbFormat(newDevice);

    const { data: deviceData, error } = await supabase
      .from(deviceTable)
      .insert(serializedDevice)
      .select('*')
      .single();

    if (error) {
      throw new AppError(
        'Something went wrong creating device',
        `Unexpected error when trying to create device: ${error.message}`,
        500
      );
    }

    if (!deviceData) {
      throw new AppError(
        'Something went wrong creating device',
        `Supabase returned null when trying to create device`,
        500
      );
    }

    const deserializedDevice =
      deserializeFromDbFormat<Omit<Device, 'imageUrl'>>(deviceData);

    const { error: imageError } = await supabase.storage
      .from(deviceImageBucket)
      .upload(
        `${deserializedDevice.brand}/${deserializedDevice.model}/${deserializedDevice.version}`,
        deviceImage,
        { contentType: 'image/png' }
      );

    if (imageError) {
      throw new AppError(
        'Something went wrong uploading device image',
        `Unexpected error uploading image for device [${deserializedDevice.id}]: ${imageError.message}`,
        500
      );
    }

    const imageUrl = supabase.storage
      .from(deviceImageBucket)
      .getPublicUrl(
        `${deserializedDevice.brand}/${deserializedDevice.model}/${deserializedDevice.version}`
      ).data.publicUrl;

    return { ...deserializedDevice, imageUrl };
  }

  public static async searchByName(
    name: string
  ): Promise<Pick<Device, 'id' | 'brand' | 'model' | 'version'>> {
    const supabase = await createClient();

    const lowerCaseName = name.toLowerCase();

    const { data: deviceNameData, error } = await supabase.rpc(
      'search_for_device_with_name',
      { p_name: lowerCaseName }
    );

    if (error) {
      throw new AppError(
        `Something went wrong searching for ${name}`,
        `Unexpected error when trying to search for device ${name}: ${error.message}`,
        500
      );
    }

    if (!deviceNameData) {
      throw new AppError(
        `Something went wrong searching for ${name}`,
        `Supabase returned with null when trying to search for device ${name}`,
        500
      );
    }

    const deserializedDeviceNames: Pick<
      Device,
      'id' | 'brand' | 'model' | 'version'
    > = deviceNameData.map(
      (
        serializedDeviceName: Serialize<
          Pick<Device, 'id' | 'brand' | 'model' | 'version'>
        >
      ) => {
        return deserializeFromDbFormat<
          Pick<Device, 'id' | 'brand' | 'model' | 'version'>
        >(serializedDeviceName);
      }
    );

    return deserializedDeviceNames;
  }

  /**
   * Fetches the unique device brands.
   */
  public static async getUniqueBrands(): Promise<Brand[]> {
    const supabase = await createClient();
    const { data: brandNames, error } = await supabase.rpc(
      'get_unique_device_brands'
    );
    if (error) {
      throw new AppError(
        'Something went wrong fetching brands.',
        `Unexpected error fetching unique device brands: ${error.message}`,
        500
      );
    }
    if (!brandNames) {
      throw new AppError('No brands found.', 'No brands found.', 404);
    }

    return brandNames.map((brandName: string) => {
      const imageUrl = supabase.storage
        .from(brandLogoBucket)
        .getPublicUrl(`${brandName}.png`).data.publicUrl;

      return {
        name: brandName,
        imageUrl,
      };
    });
  }

  /**
   * Fetches the unique device models for a given brand.
   */
  public static async getUniqueModels(brand?: string): Promise<Model[]> {
    const supabase = await createClient();
    const { data: modelData, error } = await supabase.rpc(
      'get_unique_device_models',
      { p_brand: brand }
    );

    if (error) {
      throw new AppError(
        'Something went wrong fetching models.',
        `Unexpected error fetching unique device models for brand ${brand}: ${error.message}`,
        500
      );
    }
    if (!modelData) {
      throw new AppError('No models found.', 'No models found.', 404);
    }

    const models: Model[] = modelData.map(
      (model: { name: string; brand: string; image_path: string }) => {
        const imageUrl = supabase.storage
          .from(deviceImageBucket)
          .getPublicUrl(model.image_path).data.publicUrl;

        return {
          name: model.name,
          brand: model.brand,
          imageUrl,
        };
      }
    );

    return models;
  }
}

class DeviceQueryBuilder {
  private _brand?: string;
  private _model?: string;
  private _version?: string;
  private _id?: number;

  constructor() {}

  public id(id: number) {
    this._id = id;

    return this;
  }

  public brand(brand: string) {
    this._brand = brand;

    return this;
  }

  public model(model: string) {
    this._model = model;

    return this;
  }

  public version(version: string) {
    this._version = version;

    return this;
  }

  private async _fetchQuery(): Promise<Device[]> {
    const supabase = await createClient();

    const query = supabase.from(deviceTable).select('*');

    if (this._id) {
      query.eq('id', this._id);
    }

    if (this._brand) {
      query.eq('brand', this._brand);
    }

    if (this._model) {
      query.eq('model', this._model);
    }

    if (this._version) {
      query.eq('version', this._version);
    }

    const { data: deviceData, error } = await query;

    if (error) {
      throw new AppError(
        'Something went wrong fetching devices',
        `Unexpected error when trying to get devices for ${
          this._id && `id: ${this._id}`
        } ${this._brand && `brand: ${this._brand}`} ${
          this._model && `model: ${this._model}`
        } ${this._version && `version: ${this._version}`}: ${error.message}`
      );
    }

    if (!deviceData) {
      console.warn(
        'Supabse returned with null data when trying to fetch device query.'
      );
      return [];
    }

    const deserializedDevices: Device[] = deviceData.map(
      (serializedDevice: Serialize<Omit<Device, 'imageUrl'>>) => {
        const deserializedDevice =
          deserializeFromDbFormat<Omit<Device, 'imageUrl'>>(serializedDevice);

        const imageUrl = supabase.storage
          .from(deviceImageBucket)
          .getPublicUrl(
            `${deserializedDevice.brand}/${deserializedDevice.model}/${deserializedDevice.version}.png`
          ).data.publicUrl;

        return { ...deserializedDevice, imageUrl };
      }
    );

    return deserializedDevices;
  }

  /**
   * @internal This allows autofetching by awaiting the promise from the client
   */
  protected then<TResult1 = Device[], TResult2 = never>(
    onfulfilled?:
      | ((value: Device[]) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this._fetchQuery().then(onfulfilled, onrejected);
  }
}

class DeviceHandler {
  private _id: number;

  constructor(id: number) {
    this._id = id;
  }

  public async getParts() {
    return await DevicePartClient.query().deviceId(this._id);
  }

  async getDevice(): Promise<Device> {
    const devices = await DeviceClient.query().id(this._id);

    if (devices.length <= 0) {
      throw new AppError(
        'Device not found',
        `Device with id [${this._id}] does not exist`,
        404
      );
    }

    return devices[0];
  }

  async updateDevice(
    updatedData: Partial<Omit<Device, 'id' | 'imageUrl'>>,
    updatedImage?: Buffer
  ): Promise<Device> {
    const supabase = await createClient();

    const serializedDevice = serializeToDbFormat(updatedData);

    const { data: deviceData, error } = await supabase
      .from(deviceTable)
      .update(serializedDevice)
      .eq('id', this._id)
      .select('*')
      .single();

    if (error) {
      throw new AppError(
        'Something went wrong updating device',
        `Unexpected error updating device [${this._id}]:`,
        500
      );
    }

    if (!deviceData) {
      throw new AppError(
        'Something went wrong updating device',
        `Supabase returned with null when updating device [${this._id}]`,
        500
      );
    }

    // Device image is moved by the database locally

    const deserializedDevice =
      deserializeFromDbFormat<Omit<Device, 'imageUrl'>>(deviceData);

    if (updatedImage) {
      const { error } = await supabase.storage
        .from(deviceImageBucket)
        .update(
          `${deserializedDevice.brand}/${deserializedDevice.model}/${deserializedDevice.version}`,
          updatedImage,
          { contentType: 'image/png' }
        );

      if (error) {
        throw new AppError(
          'Something went wrong updating device image',
          `Unexpected error updating device [${deserializedDevice.id}] image: ${error.message}`,
          500
        );
      }
    }

    const imageUrl = supabase.storage
      .from(deviceImageBucket)
      .getPublicUrl(
        `${deserializedDevice.brand}/${deserializedDevice.model}/${deserializedDevice.version}`
      ).data.publicUrl;

    return { ...deserializedDevice, imageUrl };
  }

  async deleteDevice(): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from(deviceTable)
      .delete()
      .eq('id', this._id);

    if (error) {
      throw new AppError(
        'Failed to delete device',
        `Unexpected error trying to delete device [${this._id}]: ${error.message}`
      );
    }

    return true;
  }
}
