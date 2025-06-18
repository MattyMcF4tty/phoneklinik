import { createClient } from '@/lib/supabase/serverClient';
import {
  deserializeFromDbFormat,
  serializeToDbFormat,
  Serialize,
} from '@/utils/dbFormat';
import { ErrorNotFound, ErrorSupabase } from '@/schemas/errors/appErrorTypes';
import { convertToAvif } from '@/utils/image';
import Brand from '@/schemas/brand';
import DeviceClient from './deviceClient';
import AccessoryClient from './accessoryClient';

// Config
const brandTable = process.env.BRAND_TABLE_NAME as string;
const brandLogoBucket = process.env.BRAND_LOGO_BUCKET as string;

const deviceTable = process.env.DEVICE_TABLE as string;
const deviceImageBucket = process.env.DEVICE_IMAGE_BUCKET as string;

const accessoryTable = process.env.ACCESSORY_TABLE as string;
const accessoryImageBucket = process.env.ACCESSORY_IMAGE_BUCKET as string;

export class BrandClient {
  public static query() {
    return new BrandQueryBuilder();
  }
  public static brandName(name: Brand['name']) {
    return new BrandHandler(name);
  }

  static async createBrand(
    newBrand: Omit<Brand, 'imageUrl'>,
    brandImage: Buffer | Blob
  ): Promise<Brand> {
    const supabase = await createClient();

    const serializedBrand = serializeToDbFormat(newBrand);

    const { data: brandData, error } = await supabase
      .from(brandTable)
      .insert(serializedBrand)
      .select('name')
      .single();

    if (error) {
      console.error('Supabase insert error:', error.message);
      throw new ErrorSupabase(
        'Noget gik galt under oprettelsen af mærke.',
        `Supabase error creating brand: ${error.message}`
      );
    }

    if (!brandData) {
      throw new ErrorSupabase(
        'Noget gik galt under oprettelsen af mærke.',
        `Supabase returned with null when trying to create new brand`
      );
    }

    const deserializedBrand =
      deserializeFromDbFormat<Omit<Brand, 'imageUrl'>>(brandData);

    const imageAvif = await convertToAvif(brandImage);
    const { error: imageError } = await supabase.storage
      .from(brandLogoBucket)
      .upload(`${deserializedBrand.name}`, imageAvif, {
        contentType: 'image/avif',
      });

    if (imageError) {
      throw new ErrorSupabase(
        'Noget gik galt under upload af mærkets billede.',
        `Supabase error uploading brand [${deserializedBrand.name}] image: ${imageError.message}`
      );
    }

    const imageUrl = supabase.storage
      .from(brandLogoBucket)
      .getPublicUrl(`${deserializedBrand.name}`).data.publicUrl;

    return { ...deserializedBrand, imageUrl };
  }
}

class BrandQueryBuilder {
  private _name?: Brand['name'];

  public name(name: Brand['name']) {
    this._name = name;
    return this;
  }

  private async _fetchQuery(): Promise<Brand[]> {
    const supabase = await createClient();
    const query = supabase.from(brandTable).select('*');

    if (this._name) {
      query.eq('name', this._name);
    }

    const { data: brandData, error } = await query;

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af mærker.',
        `Supabase error fetching brand query: ${error.message}`
      );
    }

    if (!brandData) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af mærker.',
        'Supabase returned with null when trying to fetch brand query'
      );
    }

    const deserializedBrands = brandData.map(
      (serializedBrand: Serialize<Omit<Brand, 'imageUrl'>>) => {
        const deserializedBrand =
          deserializeFromDbFormat<Omit<Brand, 'imageUrl'>>(serializedBrand);

        const imageUrl = supabase.storage
          .from(brandLogoBucket)
          .getPublicUrl(`${deserializedBrand.name}`).data.publicUrl;

        return { ...deserializedBrand, imageUrl };
      }
    );

    return deserializedBrands;
  }

  protected then<TResult1 = Brand[], TResult2 = never>(
    onfulfilled?: ((value: Brand[]) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this._fetchQuery().then(onfulfilled, onrejected);
  }
}

class BrandHandler {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  public async getBrand() {
    const brands = await BrandClient.query().name(this._name);

    if (brands.length <= 0) {
      throw new ErrorNotFound(
        'Mærke ikke fundet.',
        `Brand [${this._name}] could not found`
      );
    }

    return brands[0];
  }

  public async updateBrand(
    updatedBrand: Partial<Omit<Brand, 'id' | 'imageUrl'>>,
    updatedImage?: Buffer | Blob
  ): Promise<Brand> {
    const supabase = await createClient();

    const serializedBrand = serializeToDbFormat(updatedBrand);

    // Image name is updated by the database locally
    const { data: brandData, error } = await supabase
      .from(brandTable)
      .update(serializedBrand)
      .eq('name', this._name)
      .select('name')
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af mærke.',
        `Supabase error trying to update brand [${this._name}]: ${error.message}`
      );
    }

    if (!brandData) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af mærke.',
        `Supabase returned null trying to update brand [${this._name}]`
      );
    }

    const deserializedBrand =
      deserializeFromDbFormat<Omit<Brand, 'imageUrl'>>(brandData);

    if (updatedImage) {
      const imageAvif = await convertToAvif(updatedImage);
      const { error } = await supabase.storage
        .from(brandLogoBucket)
        .update(`${deserializedBrand.name}`, imageAvif, {
          contentType: 'image/avif',
        });

      if (error) {
        throw new ErrorSupabase(
          'Noget gik galt under opdatering af mærkets billede.',
          `Supabase error updating image for brand [${this._name}]`
        );
      }
    }

    const imageUrl = supabase.storage
      .from(brandLogoBucket)
      .getPublicUrl(`${deserializedBrand.name}`).data.publicUrl;

    return { ...deserializedBrand, imageUrl };
  }

  public async deleteBrand(): Promise<boolean> {
    const supabase = await createClient();

    // Delete brand data and its image
    const [{ error: deleteBrandError }, { error: deleteBrandImageError }] =
      await Promise.all([
        supabase.from(brandTable).delete().eq('name', this._name),
        supabase.storage.from(brandLogoBucket).remove([this._name]),
      ]);

    if (deleteBrandError) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af mærke.',
        `Supabase error deleting brand [${this._name}]: ${deleteBrandError.message}`
      );
    }
    if (deleteBrandImageError) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af mærke.',
        `Supabase error deleting brand [${this._name}] image: ${deleteBrandImageError.message}`
      );
    }

    // Delete all devices from this brand.
    const devices = await DeviceClient.query().brand(this._name);
    const deviceImagePaths = devices
      .map((device) => device.imageUrl.split(`${deviceImageBucket}/`)[1])
      .filter((path) => !!path);

    const [{ error: deleteDeviceError }, { error: deleteDeviceImageError }] =
      await Promise.all([
        supabase.from(deviceTable).delete().eq('brand', this._name),
        deviceImagePaths.length > 0
          ? supabase.storage.from(deviceImageBucket).remove(deviceImagePaths)
          : Promise.resolve({ error: null }),
      ]);

    if (deleteDeviceError) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af mærke.',
        `Supabase error deleting all devices from brand [${this._name}]: ${deleteDeviceError.message}`
      );
    }

    if (deleteDeviceImageError) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af mærke.',
        `Supabase error deleting all images of devices from brand [${this._name}]: ${deleteDeviceImageError.message}`
      );
    }

    // Delete all accessories from this brand.
    const accessories = await AccessoryClient.query().brand(this._name);
    const accessoryImagePaths = accessories
      .map(
        (accessory) => accessory.imageUrl.split(`${accessoryImageBucket}/`)[1]
      )
      .filter((path) => !!path);

    const [
      { error: deleteAccessoryError },
      { error: deleteAccessoryImageError },
    ] = await Promise.all([
      supabase.from(accessoryTable).delete().eq('brand', this._name),
      accessoryImagePaths.length > 0
        ? supabase.storage
            .from(accessoryImageBucket)
            .remove(accessoryImagePaths)
        : Promise.resolve({ error: null }),
    ]);

    if (deleteAccessoryError) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af mærke.',
        `Supabase error deleting all accessories from brand [${this._name}]: ${deleteAccessoryError.message}`
      );
    }

    if (deleteAccessoryImageError) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af mærke.',
        `Supabase error deleting all images of accessories from brand [${this._name}]: ${deleteAccessoryImageError.message}`
      );
    }

    return true;
  }
}
