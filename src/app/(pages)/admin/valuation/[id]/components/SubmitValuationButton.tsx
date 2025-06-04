'use client';

import PopUpWrapper from '@/components/wrappers/PopUpWrapper';
import { ActionResponse } from '@/schemas/new/types';
import ValuationRequest from '@/schemas/new/valuationRequest';
import React, { FC, useActionState, useEffect, useState } from 'react';
import { submitValuation } from '../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SubmitValuationButtonProps {
  valuationId: ValuationRequest['id'];
}

const SubmitValuationButton: FC<SubmitValuationButtonProps> = ({
  valuationId,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const initialState: ActionResponse<ValuationRequest['id']> = {
    success: false,
    message: '',
    loading: false,
    data: valuationId,
  };

  const [state, formAction] = useActionState(submitValuation, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setShowConfirmation(false);
      router.refresh();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="w-full">
      <button
        disabled={state.loading}
        className="button-highlighted w-full"
        onClick={() => setShowConfirmation(true)}
      >
        Send vurdering
      </button>
      {showConfirmation && (
        <PopUpWrapper>
          <div className="content-box w-fit h-fit flex flex-col items-center justify-center gap-8">
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <h1 className="text-title">Er du sikker?</h1>
              <span>
                Du kan ikke trække din vurdering tilbage når den først er blevet
                sendt.
              </span>
            </div>

            <div className="flex flex-row gap-4 w-full">
              <form action={formAction} className="w-full h-fit">
                <button
                  disabled={state.loading}
                  type="submit"
                  className="bg-green-600 text-white w-full rounded-md h-10"
                  onClick={() => (state.loading = true)}
                >
                  Ja
                </button>
              </form>

              <button
                disabled={state.loading}
                className="bg-red-500 text-white w-full rounded-md h-10"
                onClick={() => setShowConfirmation(false)}
              >
                Nej
              </button>
            </div>
          </div>
        </PopUpWrapper>
      )}
    </div>
  );
};

export default SubmitValuationButton;
