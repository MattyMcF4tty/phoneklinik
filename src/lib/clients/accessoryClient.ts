import AppError from '@/schemas/errors/appError';
import Accessory from '@/schemas/new/accessory';
import { createClient } from '@/utils/config/supabase/serverClient';
import { deserializeFromDbFormat, Serialize } from '@/utils/dbFormat';

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
  private _brand?: string;
  private _name?: string;
  private _referenceDeviceId?: number;

  public brand(brand: string) {
    this._brand = brand;
    return this;
  }

  public name(name: string) {
    this._name = name;
    return this;
  }

  public referenceDeviceId(referenceDeviceId: number) {
    this._referenceDeviceId = referenceDeviceId;
    return this;
  }

  private async _fetchQuery() {
    const supabase = await createClient();

    const query = supabase.from(accessoryTable).select('*');

    if (this._brand) {
      query.eq('brand', this._brand);
    }

    if (this._name) {
      query.eq('name', this._name);
    }

    if (this._referenceDeviceId) {
      query.eq('reference_device_id', this._referenceDeviceId);
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
}
