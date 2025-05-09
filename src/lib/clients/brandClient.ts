import AppError from '@/schemas/errors/appError';
import Brand from '@/schemas/new/brand';
import { createClient } from '@/utils/config/supabase/serverClient';
import {
  deserializeFromDbFormat,
  serializeToDbFormat,
  Serialize,
} from '@/utils/dbFormat';

// Config
const brandTable = 'brands';
const brandLogoBucket = 'brand-logos';

export class BrandClient {
  public static query() {
    return new BrandQueryBuilder();
  }
  public static async brandName(name: string) {
    return new BrandHandler(name);
  }

  static async createBrand(
    newBrand: Omit<Brand, 'imageUrl'>,
    brandImage: Buffer
  ) {
    const supabase = await createClient();

    const serializedBrand = serializeToDbFormat(newBrand);

    const { data: brandData, error } = await supabase
      .from(brandTable)
      .insert(serializedBrand)
      .select('name')
      .single();

    if (error) {
      throw new AppError(
        'Something went wrong creating brand',
        `Unexpected error creating brand: ${error.message}`,
        500
      );
    }

    if (!brandData) {
      throw new AppError(
        'Something went wrong creating brand',
        `Supabase returned with null when trying to create new brand`,
        500
      );
    }

    const deserializedBrand =
      deserializeFromDbFormat<Omit<Brand, 'imageUrl'>>(brandData);

    const { error: imageError } = await supabase.storage
      .from(brandLogoBucket)
      .upload(`${deserializedBrand.name}`, brandImage, {
        contentType: 'image/png',
      });

    if (imageError) {
      throw new AppError(
        'Something went wrong uploading brand image',
        `Unexpected error uploading brand [${deserializedBrand.name}] image: ${imageError.message}`
      );
    }

    const imageUrl = supabase.storage
      .from(brandLogoBucket)
      .getPublicUrl(`${deserializedBrand.name}`).data.publicUrl;

    return { ...deserializedBrand, imageUrl };
  }
}

class BrandQueryBuilder {
  private _name?: string;

  public name(name: string) {
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
      throw new AppError(
        'Something went wrong getting brands',
        `Unexpected error fetching brand query: ${error.message}`,
        500
      );
    }

    if (!brandData) {
      console.warn(
        'Supabase returned with null when trying to fetch brand query'
      );
      return [];
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
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
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
      throw new AppError(
        'Brand not found',
        `Brand [${this._name}] does not exist`,
        404
      );
    }

    return brands[0];
  }

  public async updateBrand(
    updatedBrand: Partial<Omit<Brand, 'id' | 'imageUrl'>>,
    updatedImage?: Buffer
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
      throw new AppError(
        'Something went wrong updating brand.',
        `Unexpected error trying to update brand [${this._name}]: ${error.message}`,
        500
      );
    }

    if (!brandData) {
      throw new AppError(
        'Something went wrong updating brand.',
        `Supabase returned null trying to update brand [${this._name}]`,
        500
      );
    }

    const deserializedBrand =
      deserializeFromDbFormat<Omit<Brand, 'imageUrl'>>(brandData);

    if (updatedImage) {
      const { error } = await supabase.storage
        .from(brandLogoBucket)
        .update(`${deserializedBrand.name}`, updatedImage, {
          contentType: 'image/png',
        });

      if (error) {
        throw new AppError(
          'Something went wrong updating brand image',
          `Unexpected error updating image for brand [${this._name}]`,
          500
        );
      }
    }

    const imageUrl = supabase.storage
      .from(brandLogoBucket)
      .getPublicUrl(`${deserializedBrand.name}.png`).data.publicUrl;

    return { ...deserializedBrand, imageUrl };
  }

  public async deleteBrand(): Promise<boolean> {
    const supabase = await createClient();

    const { data: brandData, error } = await supabase
      .from(brandTable)
      .delete()
      .eq('name', this._name);

    // Image, Accessories and devices are deleted on the database

    if (error) {
      throw new AppError(
        'Something went wrong deleting brand',
        `Unexpected error deleting brand [${this._name}]: ${error.message}`,
        500
      );
    }

    if (!brandData) {
      throw new AppError(
        'Something went wrong deleting brand',
        `Supabase returned null when deleting brand [${this._name}].`,
        500
      );
    }

    return true;
  }
}
