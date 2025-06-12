'use client';

import { NextPage } from 'next';
import { ActionResponse } from '@/schemas/types';
import { startTransition, useActionState, useEffect } from 'react';
import { answerValuation, validateValuationEmail } from './actions';
import PopUpWrapper from '@/components/wrappers/PopUpWrapper';
import { LimitedValuationRequest } from '@/schemas/valuationRequest';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const ValuationPage: NextPage = () => {
  const searchParams = useSearchParams();

  const requestInitialState: ActionResponse<LimitedValuationRequest> = {
    success: undefined,
    message: '',
  };

  const [requestState, requestFormAction] = useActionState(
    validateValuationEmail,
    requestInitialState
  );

  // Auto sign in from cookie
  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) {
      throw new Error('Mangler id');
    }

    const cookieString = document.cookie;
    const match = cookieString.match(
      new RegExp(`valuationEmail_${id}=([^;]+)`)
    );

    if (match) {
      const [email] = match;

      const formData = new FormData();
      formData.append('email', decodeURIComponent(email));

      startTransition(() => {
        requestFormAction(formData);
      });
    }
  }, [searchParams]);

  const responseInitialState: ActionResponse = {
    success: undefined,
    message: '',
  };

  const [responseState, responseFormAction] = useActionState(
    answerValuation,
    responseInitialState
  );

  useEffect(() => {
    if (responseState.success === true) {
      window.location.reload();
    } else if (responseState.success === false) {
      toast.error(responseState.message);
    }
  }, [responseState]);

  if (requestState.success === true && requestState.data) {
    const valuationRequest = requestState.data;

    const response = valuationRequest.valuationResponse;
    const status = valuationRequest.valuationStatus;
    return (
      <div className="w-full flex flex-col grow justify-center items-center">
        <div className="content-box w-1/2 h-fit flex gap-4 flex-col text-base/7">
          <h1 className="text-title">
            Vurdering af din {valuationRequest.deviceName}
          </h1>
          {response === 'accepted' ? (
            <span>
              Tak fordi du har accepteret vores vurdering. Du er meget velkommen
              til at aflevere din {valuationRequest.deviceName} i butikken i
              vores åbningstider. Vi ser frem til at gennemføre handlen til den
              aftalte pris.
            </span>
          ) : response === 'rejected' ? (
            <span>
              Vi beklager, at du har valgt ikke at acceptere vores vurdering af
              din {valuationRequest.deviceName}. Vi sætter pris på din interesse
              og står naturligvis til rådighed, hvis du skulle få behov for
              yderligere information eller ændrer mening.
            </span>
          ) : status === 'pending' || status === 'evaluating' ? (
            <span>
              Din vurdering er modtaget og afventer behandling. Vi kontakter
              dig, så snart vi har kigget på oplysningerne.
            </span>
          ) : status === 'evaluated' ? (
            <div className="flex flex-col gap-2">
              <span>
                Tak for din henvendelse. Vi har nu vurderet din{' '}
                {valuationRequest.deviceName}.
              </span>
              <span className="flex flex-row">
                Vurderet pris: {valuationRequest.valuation} kr
              </span>
              <span>
                Hvis du ønsker at sælge enheden til os til den angivne pris,
                bedes du acceptere nedenfor. Du er også velkommen til at
                kontakte os, hvis du har spørgsmål.
              </span>
              <div className="flex flex-row w-full justify-between gap-4">
                <form action={responseFormAction} className="w-full">
                  <input
                    type="hidden"
                    id="response"
                    name="response"
                    defaultValue="rejected"
                  />
                  <button className="border border-slate-400 h-full w-full">
                    nej
                  </button>
                </form>
                <form action={responseFormAction} className="w-full">
                  <input
                    type="hidden"
                    id="response"
                    name="response"
                    defaultValue="accepted"
                  />
                  <button className="button-highlighted w-full">Ja</button>
                </form>
              </div>
            </div>
          ) : status === 'rejected' ? (
            <span>
              Tak for din henvendelse. Efter en grundig gennemgang af
              oplysningerne om din {valuationRequest.deviceName}, må vi desværre
              meddele, at vi ikke har mulighed for at opkøbe enheden på
              nuværende tidspunkt. Har du spørgsmål eller ønsker yderligere
              information, er du meget velkommen til at kontakte os på{' '}
              <a href="mailto:info@phoneklinik.dk" className="underline">
                {process.env.NEXT_PUBLIC_PHONEKLINIK_MAIL}
              </a>
              . Angiv venligst reference-ID {valuationRequest.id} ved
              henvendelse.
            </span>
          ) : (
            status === 'bought' && (
              <div className="flex flex-col gap-2">
                <span>
                  Vi har nu købt din {valuationRequest.deviceName}. Tak for
                  handlen!
                </span>
                <span className="flex flex-row">
                  Beløb:
                  <p className="font-semibold">{valuationRequest.valuation}</p>
                </span>
              </div>
            )
          )}
        </div>
      </div>
    );
  } else {
    return (
      <PopUpWrapper>
        <form
          action={requestFormAction}
          className="content-box flex flex-col gap-4"
        >
          <div className="w-full flex flex-col">
            <h1 className="text-title">Bekræft venligst din e-mail</h1>
            <span>
              For at få adgang til din vurdering, bedes du bekræfte din
              e-mailadresse.
            </span>
          </div>

          <div className="flex flex-col w-full">
            <input
              className="input-default"
              placeholder="email"
              required={true}
              type="email"
              id="email"
              name="email"
            />
            {requestState.success === false ? (
              <p className="text-sm text-red-600">{requestState.message}</p>
            ) : null}
          </div>
        </form>
      </PopUpWrapper>
    );
  }
};

export default ValuationPage;
