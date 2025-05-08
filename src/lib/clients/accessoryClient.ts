import AppError from '@/schemas/errors/appError';
import Accessory from '@/schemas/new/accessory';
import { createClient } from '@/utils/config/supabase/serverClient';
import {
  deserializeFromDbFormat,
  Serialize,
  serializeToDbFormat,
} from '@/utils/dbFormat';

// Config
const accessoryTable = 'accessories';
const accessoryImageBucket = 'accessory-images';
const brandLogoBucket = 'brand-logos';

export default class AccessoryClient {
  public static async getUniqueBrands(): Promise<{
    name: string;
    imageUrl: string;
  }> {
    const supabase = await createClient();

    //TODO: Make this function in supabase
    const { data: brandData, error } = await supabase.rpc(
      'get_unique_accessory_brands'
    );

    if (error) {
      throw new AppError(
        'Something went wrong fetching accessory brands',
        `Unexpected error fetching unique accessory brands, ${error.message}`,
        500
      );
    }

    if (!brandData) {
      throw new AppError(
        'Something went wrong fetching accessory brands',
        `Supabase returned null when fetching unique accessory brands`,
        500
      );
    }

    const deserializedBrands: { name: string; imageUrl: string } =
      brandData.map((brandName: string) => {
        const imageUrl = supabase.storage
          .from(brandLogoBucket)
          .getPublicUrl(`${brandName}.png`).data.publicUrl;

        return {
          name: brandName,
          imageUrl: imageUrl,
        };
      });

    return deserializedBrands;
  }

  public static query() {
    return new AccessoryQueryBuilder();
  }

  public static id(id: number) {
    return new AccessoryHandler(id);
  }
}

class AccessoryQueryBuilder {
  private _id?: number;
  private _brand?: string;
  private _name?: string;
  private _supportedDevices?: number[];

  public id(id: number) {
    this._id = id;
    return this;
  }

  public brand(brand: string) {
    this._brand = brand;
    return this;
  }

  public name(name: string) {
    this._name = name;
    return this;
  }

  public supportedDevices(supportedDevices: number[]) {
    this._supportedDevices = supportedDevices;
    return this;
  }

  private async _fetchQuery() {
    const supabase = await createClient();

    const query = supabase.from(accessoryTable).select('*');

    if (this._id) {
      query.eq('id', this._id);
    }

    if (this._brand) {
      query.eq('brand', this._brand);
    }

    if (this._name) {
      query.eq('name', this._name);
    }

    if (this._supportedDevices) {
      query.contains('reference_device_id', this._supportedDevices);
    }

    const { data: accessoryData, error } = await query;

    if (error) {
      throw new AppError(
        'Something went wrong fetching accessories',
        `Unexpected error when trying to fetch accessory query: ${error.message}`,
        500
      );
    }

    if (!accessoryData) {
      throw new AppError(
        'Something went wrong fetching accessories',
        `Supabase returned null when trying to fetch accessory query`,
        500
      );
    }

    const deserializedAccessories: Accessory[] = accessoryData.map(
      (serializedAccessory: Serialize<Omit<Accessory, 'imageUrl'>>) => {
        const deserializedAccessory =
          deserializeFromDbFormat<Omit<Accessory, 'imageUrl'>>(
            serializedAccessory
          );

        const imageUrl = supabase.storage
          .from(accessoryImageBucket)
          .getPublicUrl(
            `${deserializedAccessory.brand}/${deserializedAccessory.name}`
          ).data.publicUrl;

        return { ...deserializedAccessory, imageUrl };
      }
    );

    return deserializedAccessories;
  }

  protected then<TResult1 = Accessory[], TResult2 = never>(
    onfulfilled?:
      | ((value: Accessory[]) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this._fetchQuery().then(onfulfilled, onrejected);
  }
}

class AccessoryHandler {
  private _id: number;

  constructor(id: number) {
    this._id = id;
  }

  public async getAccessory(): Promise<Accessory> {
    const supabase = await createClient();

    const accessories = await AccessoryClient.query().id(this._id);

    if (accessories.length <= 0) {
      throw new AppError(
        'Accessory not found',
        `Accessory [${this._id}] does not exist`,
        404
      );
    }

    return accessories[0];
  }

  public async updateAccessory(
    updatedAccessory: Partial<Omit<Accessory, 'id' | 'imageUrl'>>
  ): Promise<Accessory> {
    const supabase = await createClient();

    const serializedAccessory = serializeToDbFormat(updatedAccessory);

    const { data: accessoryData, error } = await supabase
      .from(accessoryTable)
      .update(serializedAccessory)
      .eq('id', this._id)
      .select('*')
      .single();

    if (error) {
      throw new AppError(
        'Something went wrong updating accessory',
        `Unexpected error when updating accessory [${this._id}]: ${error.message}`,
        500
      );
    }

    if (!accessoryData) {
      throw new AppError(
        'Something went wrong updating accessory',
        `Supabase returned null when updating accessory [${this._id}]`,
        500
      );
    }

    const deserializedAccessory =
      deserializeFromDbFormat<Omit<Accessory, 'imageUrl'>>(accessoryData);

    const imageUrl = supabase.storage
      .from(accessoryImageBucket)
      .getPublicUrl(
        `${deserializedAccessory.brand}/${deserializedAccessory.id}`
      ).data.publicUrl;

    return { ...deserializedAccessory, imageUrl };
  }

  public async deleteAccessory(): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from(accessoryTable)
      .delete()
      .eq('id', this._id);

    if (error) {
      throw new AppError(
        'Something went wrong deleting accessory.',
        `Unexpected error deleting accessory [${this._id}]: ${error.message}`,
        500
      );
    }

    return true;
  }
}
