import { ErrorNotFound, ErrorSupabase } from '@/schemas/errors/appErrorTypes';
import { createClient } from '../supabase/serverClient';
import { deserializeFromDbFormat, serializeToDbFormat } from '@/utils/dbFormat';
import PartVariant from '@schemas/partVariant';

// Config
const partVariantsTable = process.env.PART_VARIANTS_TABLE as string;

export default class DevicePartVariantClient {
  public static id(partId: number, variantId: number) {
    return new DevicePartVariantHandler(partId, variantId);
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

    if (!variantsData || variantsData.length === 0) {
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
  private _partId: number;
  private _variantId: number;

  constructor(partId: number, variantId: number) {
    this._partId = partId;
    this._variantId = variantId;
  }

  public async getVariant(): Promise<PartVariant> {
    const supabase = await createClient();

    const { data: variantData, error } = await supabase
      .from(partVariantsTable)
      .select('*')
      .eq('id', this._variantId)
      .eq('part_id', this._partId)
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af del variant',
        `Supabase error fetching part variant [${this._variantId}] for part [${this._partId}]: ${error.message}`
      );
    }

    if (!variantData) {
      throw new ErrorNotFound(
        'Del variant ikke fundet',
        `Part variant with id [${this._variantId}] for part [${this._partId}] could not be found`
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
      .eq('part_id', this._partId)
      .select('*')
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af del variant',
        `Supabase error updating part variant [${this._variantId}] on part [${this._partId}]: ${error.message}`
      );
    }

    if (!variantData) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af del variant',
        `Supabase update operation succeeded but no data was returned for part variant ID ${this._variantId} on part ${this._partId}`
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
      .eq('id', this._variantId)
      .eq('part_id', this._partId);

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af del variant',
        `Supabase error deleting part variant [${this._variantId}] on part [${this._partId}]: ${error.message}`
      );
    }

    return true;
  }
}
