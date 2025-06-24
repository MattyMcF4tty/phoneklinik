import { createClient } from '@/lib/supabase/serverClient';
import {
  deserializeFromDbFormat,
  Serialize,
  serializeToDbFormat,
} from '@/utils/dbFormat';
import { ErrorNotFound, ErrorSupabase } from '@/schemas/errors/appErrorTypes';
import { convertToAvif } from '@/utils/image';
import Accessory from '@/schemas/accessory';
import Brand from '@schemas/brand';

// Config
const accessoryTable = process.env.ACCESSORY_TABLE as string;
const accessoryImageBucket = process.env.ACCESSORY_IMAGE_BUCKET as string;
const brandLogoBucket = process.env.BRAND_LOGO_BUCKET as string;

export default class AccessoryClient {
  public static async getUniqueBrands(): Promise<Brand[]> {
    const supabase = await createClient();

    const { data: brandData, error } = await supabase.rpc(
      'get_unique_accessory_brands'
    );

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt med at hente tilbehørs mærkerne.',
        `Supabase error fetching unique accessory brands, ${error.message}`
      );
    }

    if (!brandData) {
      throw new ErrorSupabase(
        'Noget gik galt med at hente tilbehørs mærkerne.',
        `Supabase returned null when fetching unique accessory brands`
      );
    }

    const deserializedBrands: Brand[] = brandData.map((brandName: string) => {
      const imageUrl = supabase.storage
        .from(brandLogoBucket)
        .getPublicUrl(`${brandName}`).data.publicUrl;

      return {
        name: brandName,
        imageUrl: imageUrl,
      };
    });

    return deserializedBrands;
  }

  public static async getUniqueTypes(): Promise<string[]> {
    const supabase = await createClient();

    const { data: typeData, error } = await supabase.rpc(
      'get_unique_accessory_types'
    );

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt med at hente tilbehørs typer.',
        `Supabase error fetching unique accessory types, ${error.message}`
      );
    }

    if (!typeData) {
      throw new ErrorSupabase(
        'Noget gik galt med at hente tilbehørs typer.',
        `Supabase returned null when fetching unique accessory types.`
      );
    }

    return typeData;
  }

  public static query() {
    return new AccessoryQueryBuilder();
  }

  public static id(id: number) {
    return new AccessoryHandler(id);
  }

  public static async createAccessory(
    newAccessory: Omit<Accessory, 'id' | 'imageUrl'>,
    accessoryImage: Buffer | Blob
  ): Promise<Accessory> {
    const supabase = await createClient();

    const serializedAccessory = serializeToDbFormat(newAccessory);

    const { data: accessoryData, error } = await supabase
      .from(accessoryTable)
      .insert(serializedAccessory)
      .select('*')
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under oprettelsen af tilbehøret',
        `Unexpected error creating new accessory: ${error.message}`
      );
    }

    if (!accessoryData) {
      throw new ErrorSupabase(
        'Noget gik galt under oprettelsen af tilbehøret',
        `Supabase returned null when trying to create new accessory`
      );
    }

    const deserializedAccessory =
      deserializeFromDbFormat<Omit<Accessory, 'imageUrl'>>(accessoryData);

    const accessoryImageAvif = await convertToAvif(accessoryImage);

    const { error: imageError } = await supabase.storage
      .from(accessoryImageBucket)
      .upload(
        `${deserializedAccessory.brand}/${deserializedAccessory.id}`,
        accessoryImageAvif,
        {
          contentType: 'image/avif',
        }
      );

    if (imageError) {
      throw new ErrorSupabase(
        'Noget gik galt under upload af tilbehørsbilledet',
        `Supabase error trying to upload image for new accessory [${deserializedAccessory.id}]: ${imageError.message}`
      );
    }

    const imageUrl = supabase.storage
      .from(accessoryImageBucket)
      .getPublicUrl(
        `${deserializedAccessory.brand}/${deserializedAccessory.name}`
      ).data.publicUrl;

    return { ...deserializedAccessory, imageUrl };
  }
}

class AccessoryQueryBuilder {
  private _id?: Accessory['id'];
  private _brand?: Accessory['brand'];
  private _name?: Accessory['name'];
  private _supportedDevices?: Accessory['supportedDevices'];
  private _type?: Accessory['type'];

  public id(id: Accessory['id']) {
    this._id = id;
    return this;
  }

  public brand(brand: Accessory['brand']) {
    this._brand = brand;
    return this;
  }

  public name(name: Accessory['name']) {
    this._name = name;
    return this;
  }

  public type(type: Accessory['type']) {
    this._type = type;
    return this;
  }

  public supportedDevices(supportedDevices: Accessory['supportedDevices']) {
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

    if (this._type) {
      query.eq('type', this._type);
    }

    if (this._supportedDevices) {
      query.contains('supportedDevices', this._supportedDevices);
    }

    const { data: accessoryData, error } = await query;

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt med at hente tilbehør.',
        `Supabase error when trying to fetch accessory query: ${error.message}`
      );
    }

    if (!accessoryData) {
      throw new ErrorSupabase(
        'Noget gik galt med at hente tilbehør.',
        `Supabase returned null when trying to fetch accessory query`
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
            `${deserializedAccessory.brand}/${deserializedAccessory.id}`
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
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this._fetchQuery().then(onfulfilled, onrejected);
  }
}

class AccessoryHandler {
  private _id: Accessory['id'];

  constructor(id: Accessory['id']) {
    this._id = id;
  }

  public async getAccessory(): Promise<Accessory> {
    const accessories = await AccessoryClient.query().id(this._id);

    if (accessories.length <= 0) {
      throw new ErrorNotFound(
        'Tilbehør ikke fundet.',
        `Accessory [${this._id}] could not be found`
      );
    }

    return accessories[0];
  }

  public async updateAccessory(
    updatedAccessory: Partial<Omit<Accessory, 'id' | 'imageUrl'>>,
    updatedImage?: Buffer | Blob
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
      throw new ErrorSupabase(
        'Noget gik galt med at opdatere tilbehør.',
        `Supabase error when updating accessory [${this._id}]: ${error.message}`
      );
    }

    if (!accessoryData) {
      throw new ErrorSupabase(
        'Noget gik galt med at opdatere tilbehør.',
        `Supabase returned null when updating accessory [${this._id}]`
      );
    }

    const deserializedAccessory =
      deserializeFromDbFormat<Omit<Accessory, 'imageUrl'>>(accessoryData);

    if (updatedImage) {
      const updatedImageAvif = await convertToAvif(updatedImage);
      const { error } = await supabase.storage
        .from(accessoryImageBucket)
        .update(
          `${deserializedAccessory.brand}/${deserializedAccessory.id}`,
          updatedImageAvif,
          { contentType: 'image/avif' }
        );

      if (error) {
        throw new ErrorSupabase(
          'Noget gik galt med at opdatere billede.',
          `Supabase error updating accessory [${deserializedAccessory.id}] image: ${error.message}`
        );
      }
    }

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
      throw new ErrorSupabase(
        'Noget gik galt med at slette tilbehør.',
        `Supabase error deleting accessory [${this._id}]: ${error.message}`
      );
    }

    return true;
  }
}
