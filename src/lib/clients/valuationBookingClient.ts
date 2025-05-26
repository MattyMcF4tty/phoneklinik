import { createClient } from '../supabase/serverClient';
import { deserializeFromDbFormat, serializeToDbFormat } from '@/utils/dbFormat';
import { convertToAvif } from '@/utils/image';
import { ErrorSupabase } from '@/schemas/errors/appErrorTypes';
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
}
