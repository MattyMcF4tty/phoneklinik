'use server';

import ValuationRequestClient from '@/lib/clients/valuationBookingClient';
import AppError from '@/schemas/errors/appError';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import { ActionResponse } from '@/schemas/types';
import ValuationRequest from '@/schemas/valuationRequest';

import sendMail from '@/utils/mail';

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
    ).updateValuationRequest({
      internalNotes: internalNotes,
      valuationStatus: 'evaluating',
    });

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
    ).updateValuationRequest({
      valuation: valuationNumber,
      valuationStatus: 'evaluating',
    });

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

export async function submitValuation(
  prevState: ActionResponse<ValuationRequest['id']>,
  formData: FormData
): Promise<ActionResponse<ValuationRequest['id']>> {
  try {
    if (!prevState.data) {
      throw new ErrorBadRequest(
        'Ugyldig ID angivet',
        `prevSate.data is ${prevState.data} Valuation ID must be a valid postive integer`
      );
    }

    const valuationRequest = await ValuationRequestClient.id(
      prevState.data
    ).updateValuationRequest({
      valuationStatus: 'evaluated',
      valuationResponse: 'pending',
    });

    sendMail(
      valuationRequest.email,
      `Vurdering af enhed: ${valuationRequest.deviceName}`,
      {
        plainText: `Hej,

        Vi har nu foretaget en vurdering af din enhed: ${valuationRequest.deviceName} (Sags-ID: ${valuationRequest.id}).
        
        Du kan se resultatet af vurderingen via følgende link:
        https://phoneklinik.dk/enhed/vurdering/${valuationRequest.id}
        
        Har du spørgsmål eller brug for yderligere information, er du meget velkommen til at kontakte os på ${process.env.NEXT_PUBLIC_PHONEKLINIK_MAIL}. Husk at oplyse dit sagsnummer: ${valuationRequest.id}.
        
        Med venlig hilsen  
        Phoneklinik`,

        html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
              <p>Hej,</p>
              <p>
                Vi har nu foretaget en vurdering af din enhed: 
                <strong>${valuationRequest.deviceName}</strong> 
                (Sags-ID: <strong>${valuationRequest.id}</strong>).
              </p>
              <p>
                Du kan se resultatet af vurderingen via følgende link:<br/>
                <a href="https://phoneklinik.dk/enhed/vurdering/${valuationRequest.id}">
                  https://phoneklinik.dk/enhed/vurdering/${valuationRequest.id}
                </a>
              </p>
              <p>
                Har du spørgsmål eller brug for yderligere information, er du meget velkommen til at kontakte os på 
                <a href="mailto:${process.env.NEXT_PUBLIC_PHONEKLINIK_MAIL}">${process.env.NEXT_PUBLIC_PHONEKLINIK_MAIL}</a>. Husk at oplyse dit sagsnummer: <strong>${valuationRequest.id}</strong>.
              </p>
              <p>Med venlig hilsen<br/>Phoneklinik</p>
            </div>
          `,
      }
    );

    return {
      success: true,
      message: 'Vurdering sendt succesfuldt.',
      data: valuationRequest.id,
    };
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error(err.details);
      return {
        success: false,
        message: err.message,
      };
    }
    console.error('An error occurred while submitting valuation:', err);
    return {
      success: false,
      message: 'Noget gik galt under vidersendelse af vurdering. Prøv igen.',
    };
  }
}

export async function rejectValuation(
  prevState: ActionResponse<ValuationRequest['id']>,
  formData: FormData
): Promise<ActionResponse<ValuationRequest['id']>> {
  try {
    if (!prevState.data) {
      throw new ErrorBadRequest(
        'Ugyldig ID angivet',
        `prevSate.data is ${prevState.data} Valuation ID must be a valid postive integer`
      );
    }

    const valuationRequest = await ValuationRequestClient.id(
      prevState.data
    ).updateValuationRequest({
      valuationStatus: 'rejected',
    });

    sendMail(
      valuationRequest.email,
      `Vurdering af enhed: ${valuationRequest.deviceName}`,
      {
        plainText: `Hej,
    
        Tak for din henvendelse omkring vurdering af din enhed: ${valuationRequest.deviceName} (Ref. ID: ${valuationRequest.id}).
        
        Vi har gennemgået informationerne, men må desværre meddele, at vi ikke er interesserede i at købe denne enhed.
        
        Hvis du har spørgsmål eller ønsker yderligere information, er du meget velkommen til at kontakte os på ${process.env.NEXT_PUBLIC_PHONEKLINIK_MAIL} og henvise til dit sagsnummer: ${valuationRequest.id}.
        
        Venlig hilsen  
        Phoneklinik`,

        html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <p>Hej,</p>
          <p>
            Tak for din henvendelse omkring vurdering af din enhed: 
            <strong>${valuationRequest.deviceName}</strong> 
            (Ref. ID: <strong>${valuationRequest.id}</strong>).
          </p>
          <p>
            Vi har gennemgået informationerne, men må desværre meddele, at vi ikke er interesserede i at købe denne enhed.
          </p>
          <p>
            Hvis du har spørgsmål eller ønsker yderligere information, er du meget velkommen til at kontakte os på 
            <a href="mailto:${process.env.NEXT_PUBLIC_PHONEKLINIK_MAIL}">${process.env.NEXT_PUBLIC_PHONEKLINIK_MAIL}</a> 
            og henvise til dit sagsnummer: <strong>${valuationRequest.id}</strong>.
          </p>
          <p>Venlig hilsen<br/>Phoneklinik</p>
        </div>
        `,
      }
    );

    return {
      success: true,
      message: 'Vurdering afvist!',
      data: valuationRequest.id,
    };
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error(err.details);
      return {
        success: false,
        message: err.message,
      };
    }
    console.error('An error occurred while rejecting valuation:', err);
    return {
      success: false,
      message: 'Noget gik galt under afvisning af vurdering. Prøv igen.',
    };
  }
}
