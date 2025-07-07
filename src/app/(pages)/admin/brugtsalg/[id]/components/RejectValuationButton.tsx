'use client';

import PopUpWrapper from '@/components/wrappers/PopUpWrapper';
import React, { FC, useActionState, useEffect, useState } from 'react';
import { rejectValuation } from '../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ValuationRequest from '@/schemas/valuationRequest';
import { ActionResponse } from '@/schemas/types';

interface RejectValuationButtonProps {
  valuationId: ValuationRequest['id'];
}

const RejectValuationButton: FC<RejectValuationButtonProps> = ({
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

  const [state, formAction] = useActionState(rejectValuation, initialState);

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
        className="w-full text-white bg-red-600 px-6 py-3 font-semibold rounded shadow-md disabled:bg-slate-400"
        onClick={() => setShowConfirmation(true)}
      >
        Afvis vurdering
      </button>
      {showConfirmation && (
        <PopUpWrapper>
          <div className="content-box w-fit h-fit flex flex-col items-center justify-center gap-8">
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <h1 className="text-title">Er du sikker?</h1>
              <span>
                Du kan ikke trække din afvisning tilbage når den først er blevet
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

export default RejectValuationButton;
