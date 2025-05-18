import DevicePart from '@/schemas/new/devicePart';
import { createClient } from '@/lib/supabase/serverClient';
import {
  deserializeFromDbFormat,
  Serialize,
  serializeToDbFormat,
} from '@/utils/dbFormat';
import { ErrorNotFound, ErrorSupabase } from '@/schemas/errors/appErrorTypes';

// Config
const partsTable = 'device_parts';

export default class DevicePartClient {
  public static query() {
    return new DevicePartQueryBuilder();
  }

  public static id(id: number) {
    return new DevicePartHandler(id);
  }

  public async addPart(
    deviceId: number,
    deviceData: Omit<DevicePart, 'id' | 'createdAt' | 'deviceId'>
  ): Promise<DevicePart> {
    const supabase = await createClient();

    const serializedPart = serializeToDbFormat({
      ...deviceData,
      deviceId: deviceId,
    });

    const { data: partData, error } = await supabase
      .from(partsTable)
      .insert(serializedPart)
      .select('*')
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under tilføjelsen af del.',
        `Supabase error when trying to add new part: ${error.message}`
      );
    }

    if (!partData) {
      throw new ErrorSupabase(
        'Noget gik galt under tilføjelsen af del.',
        `Supabase insert operation succeeded but no data was returned for part.`
      );
    }

    const deserializedPart = deserializeFromDbFormat<DevicePart>(partData);

    return deserializedPart;
  }
}

class DevicePartQueryBuilder {
  private _id?: number;
  private _deviceId?: number;
  private _name?: string;

  public id(id: number) {
    this._id = id;
    return this;
  }

  public deviceId(deviceId: number) {
    this._deviceId = deviceId;
    return this;
  }

  public name(name: string) {
    this._name = name;
    return this;
  }

  private async _fetchQuery() {
    const supabase = await createClient();

    const query = supabase.from(partsTable).select('*');

    if (this._id) {
      query.eq('id', this._id);
    }

    if (this._deviceId) {
      query.eq('device_id', this._deviceId);
    }

    if (this._name) {
      query.eq('name', this._name);
    }

    const { data: partData, error } = await query;

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under henting af dele.',
        `Supabase error when trying to fetch parts query ${
          this._id &&
          `id: ${this._id} ${this._name && `name: ${this._name}`} ${
            this._deviceId && `deviceId: ${this._deviceId}`
          }`
        }`
      );
    }

    if (!partData) {
      throw new ErrorSupabase(
        'Noget gik galt under henting af dele.',
        `Supabase returned null when trying to fetch parts query ${
          this._id &&
          `id: ${this._id} ${this._name && `name: ${this._name}`} ${
            this._deviceId && `deviceId: ${this._deviceId}`
          }`
        }`
      );
    }

    const deserializedParts = partData.map(
      (serializedPart: Serialize<DevicePart>) => {
        return deserializeFromDbFormat<DevicePart>(serializedPart);
      }
    );

    return deserializedParts;
  }

  public then<TResult1 = DevicePart[], TResult2 = never>(
    onfulfilled?:
      | ((value: DevicePart[]) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this._fetchQuery().then(onfulfilled, onrejected);
  }
}

class DevicePartHandler {
  private _id: number;

  constructor(id: number) {
    this._id = id;
  }

  public async getPart() {
    const parts = await DevicePartClient.query().id(this._id);

    if (parts.length <= 0) {
      throw new ErrorNotFound(
        'Del ikke fundet',
        `Part with id [${this._id}] could not be found`
      );
    }

    return parts[0];
  }

  public async updatePart(
    updatedPart: Partial<Omit<DevicePart, 'id'>>
  ): Promise<DevicePart> {
    const supabase = await createClient();

    const serializedPart = serializeToDbFormat(updatedPart);

    const { data: partData, error } = await supabase
      .from(partsTable)
      .update(serializedPart)
      .eq('id', this._id)
      .select('*')
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af del.',
        `Supabase error occurred when trying to update part [${this._id}]: ${error.message}`
      );
    }

    if (!partData) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af del.',
        `Supabase update operation succeeded but no data was returned for part ID ${this._id}`
      );
    }

    const deserializedPart = deserializeFromDbFormat<DevicePart>(partData);

    return deserializedPart;
  }

  public async deletePart(): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from(partsTable)
      .delete()
      .eq('id', this._id);

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af del',
        `Supabase error deleting part [${this._id}]: ${error.message}`
      );
    }

    console.log(`Device part ${this._id} has been deleted succesfully.`);
    return true;
  }
}
