import { ErrorNotFound, ErrorSupabase } from '@/schemas/errors/appErrorTypes';
import { createClient } from '../supabase/serverClient';
import { deserializeFromDbFormat, serializeToDbFormat } from '@/utils/dbFormat';
import PartVariant from '@schemas/partVariant';
import DevicePart from '@schemas/devicePart';

// Config
const partVariantsTable = process.env.PART_VARIANTS_TABLE as string;

export default class DevicePartVariantClient {
  public static id(variantId: number) {
    return new DevicePartVariantHandler(variantId);
  }

  public static async addPartVariant(
    partId: DevicePart['id'],
    newVariant: Omit<PartVariant, 'id' | 'partId'>
  ) {
    const supabase = await createClient();

    const serializedVariant = serializeToDbFormat({
      ...newVariant,
      partId: partId,
    });

    const { data: variantData, error } = await supabase
      .from(partVariantsTable)
      .insert(serializedVariant)
      .select('*')
      .single();
    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under opretning af del variant',
        `Supabase error inserting part variant part [${partId}]: ${error.message}`
      );
    }

    if (!variantData) {
      throw new ErrorNotFound(
        'Ingen del varianter fundet',
        `No part variant found for new variant`
      );
    }

    const variant = deserializeFromDbFormat<PartVariant>(variantData);
    return variant;
  }

  public static async getPartVariants(partId: number): Promise<PartVariant[]> {
    const supabase = await createClient();

    const { data: variantsData, error } = await supabase
      .from(partVariantsTable)
      .select('*')
      .eq('part_id', partId)
      .order('grade_level', { ascending: true });

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af del varianter',
        `Supabase error fetching part variants for part [${partId}]: ${error.message}`
      );
    }

    if (!variantsData) {
      throw new ErrorNotFound(
        'Ingen del varianter fundet',
        `No part variants found for part with id [${partId}]`
      );
    }

    const deserializedPartVariants: PartVariant[] = variantsData.map(
      (variantData) => {
        return deserializeFromDbFormat<PartVariant>(variantData);
      }
    );

    return deserializedPartVariants;
  }
}

class DevicePartVariantHandler {
  private _variantId: number;

  constructor(variantId: number) {
    this._variantId = variantId;
  }

  public async getVariant(): Promise<PartVariant> {
    const supabase = await createClient();

    const { data: variantData, error } = await supabase
      .from(partVariantsTable)
      .select('*')
      .eq('id', this._variantId)
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af del variant',
        `Supabase error fetching part variant [${this._variantId}]: ${error.message}`
      );
    }

    if (!variantData) {
      throw new ErrorNotFound(
        'Del variant ikke fundet',
        `Part variant with id [${this._variantId}] could not be found`
      );
    }

    return deserializeFromDbFormat(variantData);
  }

  public async updatePartVariant(
    updatedVariant: Partial<Omit<PartVariant, 'id' | 'partId'>>
  ): Promise<PartVariant> {
    const supabase = await createClient();

    const serializedVariant = serializeToDbFormat(updatedVariant);

    const { data: variantData, error } = await supabase
      .from(partVariantsTable)
      .update(serializedVariant)
      .eq('id', this._variantId)
      .select('*')
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af del variant',
        `Supabase error updating part variant [${this._variantId}]: ${error.message}`
      );
    }

    if (!variantData) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af del variant',
        `Supabase update operation succeeded but no data was returned for part variant ID ${this._variantId}`
      );
    }

    const deserializedVariant =
      deserializeFromDbFormat<PartVariant>(variantData);

    return deserializedVariant;
  }

  public async deletePartVariant(): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from(partVariantsTable)
      .delete()
      .eq('id', this._variantId);

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af del variant',
        `Supabase error deleting part variant [${this._variantId}]: ${error.message}`
      );
    }

    return true;
  }
}
