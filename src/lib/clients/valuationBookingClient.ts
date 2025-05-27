import { createClient } from '../supabase/serverClient';
import { deserializeFromDbFormat, serializeToDbFormat } from '@/utils/dbFormat';
import { convertToAvif } from '@/utils/image';
import { ErrorNotFound, ErrorSupabase } from '@/schemas/errors/appErrorTypes';
import ValuationRequest from '@/schemas/new/valuationRequest';

// Config
const valuationRequestTable = 'valuation_requests';
const valuationRequestBucket = 'valuation-images';

export default class ValuationRequestClient {
  public static async requestValuation(
    request: Pick<
      ValuationRequest,
      'email' | 'phoneNumber' | 'deviceName' | 'customerNotes'
    >,
    frontImage: Buffer | Blob,
    rearImage: Buffer | Blob,
    batteryImager: Buffer | Blob
  ): Promise<ValuationRequest> {
    const supabase = await createClient();

    const serializedRequest = serializeToDbFormat(request);

    const [frontImageAvif, rearImageAvif, batteryImageAvif] = await Promise.all(
      [
        convertToAvif(frontImage),
        convertToAvif(rearImage),
        convertToAvif(batteryImager),
      ]
    );

    const { data, error } = await supabase
      .from(valuationRequestTable)
      .insert(serializedRequest)
      .select('*')
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under anmodning af enheds vurdering',
        `Supabase error when trying to book device valuation: ${error.message}`
      );
    }

    if (!data) {
      throw new ErrorSupabase(
        'Noget gik galt under anmodning af enheds vurdering',
        'Supabase retuned no data when trying to book valuation of device'
      );
    }

    const deserialzedRequest =
      deserializeFromDbFormat<Omit<ValuationRequest, 'images'>>(data);

    const [frontImageResponse, rearImageResponse, batteryImageResponse] =
      await Promise.all([
        supabase.storage
          .from(valuationRequestBucket)
          .upload(`${deserialzedRequest.id}/front`, frontImageAvif, {
            contentType: 'image/avif',
          }),
        supabase.storage
          .from(valuationRequestBucket)
          .upload(`${deserialzedRequest.id}/rear`, rearImageAvif, {
            contentType: 'image/avif',
          }),
        supabase.storage
          .from(valuationRequestBucket)
          .upload(`${deserialzedRequest.id}/battery`, batteryImageAvif, {
            contentType: 'image/avif',
          }),
      ]);

    if (
      frontImageResponse.error ||
      rearImageResponse.error ||
      batteryImageResponse.error
    ) {
      throw new ErrorSupabase(
        'Noget gik galt under upload af billeder',
        `Supabase error when trying to upload images: ${frontImageResponse.error?.message}, ${rearImageResponse.error?.message}, ${batteryImageResponse.error?.message}`
      );
    }

    const frontUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${deserialzedRequest.id}/front`).data.publicUrl;
    const rearUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${deserialzedRequest.id}/rear`).data.publicUrl;
    const batteryUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${deserialzedRequest.id}/battery`).data.publicUrl;

    return {
      ...deserialzedRequest,
      images: {
        frontUrl,
        rearUrl,
        batteryUrl,
      },
    };
  }

  public static id(id: ValuationRequest['id']) {
    return new ValuationRequestHandler(id);
  }

  public static query() {
    return new ValuationRequestQueryBuilder();
  }
}

class ValuationRequestQueryBuilder {
  private _email?: ValuationRequest['email'];
  private _phoneNumber?: ValuationRequest['phoneNumber'];
  private _deviceName?: ValuationRequest['deviceName'];
  private _valuationStatus?: ValuationRequest['valutationStatus'];
  private _valuationResponse?: ValuationRequest['valutationResponse'];

  public email(email: ValuationRequest['email']) {
    this._email = email;
    return this;
  }

  public phoneNumber(phoneNumber: ValuationRequest['phoneNumber']) {
    this._phoneNumber = phoneNumber;
    return this;
  }

  public deviceName(deviceName: ValuationRequest['deviceName']) {
    this._deviceName = deviceName;
    return this;
  }

  public valuationStatus(
    valuationStatus: ValuationRequest['valutationStatus']
  ) {
    this._valuationStatus = valuationStatus;
    return this;
  }

  public valuationResponse(
    valuationResponse: ValuationRequest['valutationResponse']
  ) {
    this._valuationResponse = valuationResponse;
    return this;
  }

  private async _fetchQuery(): Promise<ValuationRequest[]> {
    const supabase = await createClient();

    let query = supabase.from(valuationRequestTable).select('*');

    if (this._email) {
      query = query.eq('email', this._email);
    }
    if (this._phoneNumber) {
      query = query.eq('phone_number', this._phoneNumber);
    }
    if (this._deviceName) {
      query = query.eq('device_name', this._deviceName);
    }
    if (this._valuationStatus) {
      query = query.eq('valuation_status', this._valuationStatus);
    }
    if (this._valuationResponse) {
      query = query.eq('valuation_response', this._valuationResponse);
    }

    const { data, error } = await query;

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af enheds vurderinger',
        `Supabase error when trying to fetch valuation requests: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      throw new ErrorNotFound(
        'Ingen vurderingsanmodninger fundet',
        'No valuation requests found with the given criteria'
      );
    }

    const deserializedRequests = data.map((request) => {
      return deserializeFromDbFormat<Omit<ValuationRequest, 'images'>>(request);
    });

    const requestsWithImages: ValuationRequest[] = deserializedRequests.map(
      (request) => {
        const frontUrl = supabase.storage
          .from(valuationRequestBucket)
          .getPublicUrl(`${request.id}/front`).data.publicUrl;
        const rearUrl = supabase.storage
          .from(valuationRequestBucket)
          .getPublicUrl(`${request.id}/rear`).data.publicUrl;
        const batteryUrl = supabase.storage
          .from(valuationRequestBucket)
          .getPublicUrl(`${request.id}/battery`).data.publicUrl;

        return { ...request, images: { frontUrl, rearUrl, batteryUrl } };
      }
    );

    return requestsWithImages;
  }

  public then<TResult1 = ValuationRequest[], TResult2 = never>(
    onfulfilled?:
      | ((value: ValuationRequest[]) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this._fetchQuery().then(onfulfilled, onrejected);
  }
}

class ValuationRequestHandler {
  private _id: ValuationRequest['id'];

  constructor(id: ValuationRequest['id']) {
    this._id = id;
  }

  public async getValuationRequest(): Promise<ValuationRequest> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(valuationRequestTable)
      .select('*')
      .eq('id', this._id)
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under hentning af enheds vurdering',
        `Supabase error when trying to fetch valuation request: ${error.message}`
      );
    }

    if (!data) {
      throw new ErrorNotFound(
        'Ingen vurderingsanmodning fundet',
        `No valuation request found with id: ${this._id}`
      );
    }

    const deserializedRequest =
      deserializeFromDbFormat<Omit<ValuationRequest, 'images'>>(data);
    const frontUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${this._id}/front`).data.publicUrl;
    const rearUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${this._id}/rear`).data.publicUrl;
    const batteryUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${this._id}/battery`).data.publicUrl;

    return {
      ...deserializedRequest,
      images: { frontUrl, rearUrl, batteryUrl },
    };
  }

  public async updateValuationRequest(
    updatedRequest: Partial<Omit<ValuationRequest, 'id' | 'images'>>,
    images: Partial<{
      front: Buffer | Blob;
      rear: Buffer | Blob;
      battery: Buffer | Blob;
    }>
  ): Promise<ValuationRequest> {
    const supabase = await createClient();

    const serializedRequest = serializeToDbFormat(updatedRequest);
    const { data, error } = await supabase
      .from(valuationRequestTable)
      .update(serializedRequest)
      .eq('id', this._id)
      .select('*')
      .single();

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af enheds vurdering',
        `Supabase error when trying to update valuation request: ${error.message}`
      );
    }
    if (!data) {
      throw new ErrorSupabase(
        'Noget gik galt under opdatering af enheds vurdering',
        `Supabase update operation succeeded but no data was returned for valuation request ID ${this._id}`
      );
    }

    const deserializedRequest =
      deserializeFromDbFormat<Omit<ValuationRequest, 'images'>>(data);

    await Promise.all(
      Object.entries(images).map(async ([key, image]) => {
        if (!image) return null;

        const imageAvif = await convertToAvif(image);

        const { error: uploadError } = await supabase.storage
          .from(valuationRequestBucket)
          .upload(`${this._id}/${key}`, imageAvif, {
            contentType: 'image/avif',
          });
        if (uploadError) {
          throw new ErrorSupabase(
            'Noget gik galt under upload af billeder',
            `Supabase error when trying to upload image ${key}: ${uploadError.message}`
          );
        }
      })
    );

    const frontUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${this._id}/front`).data.publicUrl;
    const rearUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${this._id}/rear`).data.publicUrl;
    const batteryUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${this._id}/battery`).data.publicUrl;

    return {
      ...deserializedRequest,
      images: { frontUrl, rearUrl, batteryUrl },
    };
  }

  public async deleteValuationRequest(): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from(valuationRequestTable)
      .delete()
      .eq('id', this._id);

    if (error) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af enheds vurdering',
        `Supabase error when trying to delete valuation request: ${error.message}`
      );
    }

    const { error: storageError } = await supabase.storage
      .from(valuationRequestBucket)
      .remove([`${this._id}/front`, `${this._id}/rear`, `${this._id}/battery`]);

    if (storageError) {
      throw new ErrorSupabase(
        'Noget gik galt under sletning af billeder',
        `Supabase storage error when trying to delete images: ${storageError.message}`
      );
    }

    return true;
  }

  public async getImages(): Promise<ValuationRequest['images']> {
    const supabase = await createClient();

    const frontUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${this._id}/front`).data.publicUrl;

    const rearUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${this._id}/rear`).data.publicUrl;

    const batteryUrl = supabase.storage
      .from(valuationRequestBucket)
      .getPublicUrl(`${this._id}/battery`).data.publicUrl;

    return {
      frontUrl,
      rearUrl,
      batteryUrl,
    };
  }
}
