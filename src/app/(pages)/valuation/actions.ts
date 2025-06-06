'use server';

import { cookies } from 'next/headers';
import { getSearchParamsFromHeaders } from '@/utils/misc';
import { ActionResponse } from '@/schemas/types';
import { LimitedValuationRequest } from '@/schemas/valuationRequest';
import ValuationRequestClient from '@/lib/clients/valuationBookingClient';
import {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorUnauthorized,
} from '@/schemas/errors/appErrorTypes';
import { handleActionError } from '@/utils/error';

export async function validateValuationEmail(
  prevState: ActionResponse<LimitedValuationRequest | undefined>,
  formData: FormData
): Promise<ActionResponse<LimitedValuationRequest | undefined>> {
  try {
    const cookieStore = await cookies();

    // Get Id
    const params = await getSearchParamsFromHeaders();
    const idRaw = params.get('id')?.toString();
    const id = parseInt(idRaw ?? '', 10);
    if (isNaN(id)) {
      throw new ErrorBadRequest(
        'Ugyldigt id',
        `Expected id parameter to be positive integer. Got ${id}`
      );
    }

    // Get email input
    let userEmail: string;
    const cookieEmail = cookieStore.get(`valuationEmail_${id}`)?.value;

    if (!cookieEmail) {
      const inputEmail = formData.get('email')?.toString();
      if (!inputEmail) {
        throw new ErrorBadRequest(
          'Mangler email',
          `Expected email string in formData. Got ${inputEmail}`
        );
      } else {
        userEmail = inputEmail;
      }
    } else {
      userEmail = cookieEmail;
      console.log(
        `Used email from cookie [${`valuationEmail_${id}`}], value [${cookieEmail}].`
      );
    }

    // Get valuation request
    const valuationRequest = await ValuationRequestClient.id(
      id
    ).getValuationRequest();

    if (!valuationRequest) {
      // We are not telling the user. As only bad actors will try to access random valuation requests.
      throw new ErrorNotFound(
        'Ugyldig email',
        `Someones trying to access a valuation request that does not exist. id: [${id}], email: [${userEmail}] `
      );
    } else if (
      valuationRequest.email.toLowerCase() !== userEmail.toLowerCase()
    ) {
      throw new ErrorUnauthorized(
        'Ugyldig email',
        `Unauthorized access attempt detected for valuation request.

        Details:
        ─ ID: ${valuationRequest.id}
        ─ Actual email on record: ${valuationRequest.email}
        ─ Provided email: ${userEmail}
        ─ Timestamp: ${new Date().toISOString()}
        
        This may indicate a mistyped email or a potential unauthorized attempt to access restricted valuation data.`
      );
    }

    // Set cookie for user not to be required to sign in every time
    cookieStore.set(`valuationEmail_${id}`, userEmail, {
      path: '/',
      maxAge: 60 * 15, // 15 minutes
      httpOnly: false,
    });

    return {
      success: true,
      loading: false,
      data: {
        deviceName: valuationRequest.deviceName,
        email: valuationRequest.email,
        id: valuationRequest.id,
        valuation: valuationRequest.valuation,
        valuationResponse: valuationRequest.valuationResponse,
        valuationStatus: valuationRequest.valuationStatus,
      },
      message: `Email address '${valuationRequest.email}' successfully validated for valuation request '${valuationRequest.deviceName}'.`,
    };
  } catch (err: unknown) {
    return handleActionError(err);
  }
}

export async function answerValuation(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    // Get Id
    const params = await getSearchParamsFromHeaders();
    const idRaw = params.get('id')?.toString();
    const id = parseInt(idRaw ?? '', 10);
    if (isNaN(id)) {
      throw new ErrorBadRequest(
        'Ugyldigt id',
        `Expected id parameter to be positive integer. Got ${id}`
      );
    }

    const response = formData.get('response')?.toString();

    if (!response || (response !== 'accepted' && response !== 'rejected')) {
      throw new ErrorBadRequest(
        'Mangler svar',
        `Expected response to valuation request to be either [accepted] or [rejected]. Got ${response}`
      );
    }

    const valuationRequest = await ValuationRequestClient.id(
      id
    ).updateValuationRequest({ valuationResponse: response });

    return {
      success: true,
      message: 'Vi har modtaget dit svar',
    };
  } catch (err: unknown) {
    return handleActionError(
      err,
      'Noget gik galt da vi skulle modtage dit svar'
    );
  }
}
