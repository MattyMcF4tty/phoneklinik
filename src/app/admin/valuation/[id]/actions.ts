'use server';

import ValuationRequestClient from '@/lib/clients/valuationBookingClient';
import AppError from '@/schemas/errors/appError';
import { ActionResponse } from '@/schemas/new/types';
import ValuationRequest from '@/schemas/new/valuationRequest';

export async function updateInternalNotes(
  prevState: ActionResponse<ValuationRequest['internalNotes']>,
  formData: FormData
): Promise<ActionResponse<ValuationRequest['internalNotes']>> {
  const valuationId = formData.get('valuationId') as string | null;
  const internalNotes = formData.get('internalNotes') as string | null;

  if (!valuationId || parseInt(valuationId, 10) <= 0) {
    return {
      success: false,
      message: 'Invalid valuation ID provided. It must be a positive integer.',
    };
  }

  if (internalNotes === null) {
    return {
      success: false,
      message: 'Internal notes nodes missing in formData.',
    };
  }

  try {
    const valuationRequest = await ValuationRequestClient.id(
      parseInt(valuationId, 10)
    ).updateValuationRequest({ internalNotes: internalNotes });

    return {
      success: true,
      message: 'Interne noter opdateret succesfuldt.',
      data: valuationRequest.internalNotes,
    };
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error(err.details);
      return {
        success: false,
        message: err.message,
      };
    }
    console.error('An error occurred while updating internal notes:', err);
    return {
      success: false,
      message: 'Noget gik galt under opdatering af interne noter. Prøv igen.',
    };
  }
}

export async function updateValuation(
  prevState: ActionResponse<ValuationRequest['valuation']>,
  formData: FormData
): Promise<ActionResponse<ValuationRequest['valuation']>> {
  const valuationId = formData.get('valuationId') as string | null;
  const valuation = formData.get('valuation') as string | null;

  if (valuation === null) {
    return {
      success: false,
      message: 'valuation missing in formData.',
    };
  }

  const valuationNumber = !isNaN(Number(valuation)) ? Number(valuation) : null;

  if (!valuationId || parseInt(valuationId, 10) <= 0) {
    return {
      success: false,
      message: 'Invalid valuation ID provided. It must be a positive integer.',
    };
  }

  try {
    const valuationRequest = await ValuationRequestClient.id(
      parseInt(valuationId, 10)
    ).updateValuationRequest({ valuation: valuationNumber });

    return {
      success: true,
      message: 'Vurdering opdateret succesfuldt.',
      data: valuationRequest.valuation,
    };
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error(err.details);
      return {
        success: false,
        message: err.message,
      };
    }
    console.error('An error occurred while updating valuation:', err);
    return {
      success: false,
      message: 'Noget gik galt under opdatering af vurdering. Prøv igen.',
    };
  }
}
