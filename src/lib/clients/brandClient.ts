import Brand from '@/schemas/new/brand';
import { createClient } from '@/lib/supabase/serverClient';
import {
  deserializeFromDbFormat,
  serializeToDbFormat,
  Serialize,
} from '@/utils/dbFormat';
import { ErrorNotFound, ErrorSupabase } from '@/schemas/errors/appErrorTypes';

// Config
const brandTable = 'brands';
const brandLogoBucket = 'brand-images';

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

    const { error: imageError } = await supabase.storage
      .from(brandLogoBucket)
      .upload(`${deserializedBrand.name}`, brandImage, {
        contentType: 'image/png',
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
      throw new ErrorNotFound(
        'Mærke ikke fundet.',
        `Brand [${this._name}] could not found`
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
      const { error } = await supabase.storage
        .from(brandLogoBucket)
        .update(`${deserializedBrand.name}`, updatedImage, {
          contentType: 'image/png',
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
      throw new ErrorSupabase(
        'Noget gik galt under sletning af mærke.',
        `Supabase error deleting brand [${this._name}]: ${error.message}`
      );
    }

    if (!brandData) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af mærke.',
        `Supabase returned null when deleting brand [${this._name}].`
      );
    }

    return true;
  }
}
