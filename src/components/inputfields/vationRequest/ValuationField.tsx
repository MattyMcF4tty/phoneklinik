'use client';

import { updateValuation } from '@/app/(pages)/admin/valuation/[id]/actions';
import { ActionResponse } from '@/schemas/types';
import ValuationRequest from '@/schemas/valuationRequest';
import React, { FC, useActionState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface ValuationFieldProps {
  disabled?: boolean;
  valuationId: ValuationRequest['id'];
  defaultValue?: ValuationRequest['valuation'];
}

const ValuationField: FC<ValuationFieldProps> = ({
  disabled,
  valuationId,
  defaultValue = null,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initialState: ActionResponse<ValuationRequest['valuation']> = {
    success: undefined,
    loading: false,
    message: '',
    data: defaultValue,
  };

  const [state, formAction] = useActionState(updateValuation, initialState);

  const handleAutoSave = () => {
    // cancel any pending save
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // set new timeout
    timeoutRef.current = setTimeout(() => {
      formRef.current?.requestSubmit();
      state.loading = true;
    }, 2000);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message);
    } else if (state.success === false) {
      toast.error(state.message);
    }

    console.log(state);
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="w-full flex flex-col h-full"
    >
      <input
        type="hidden"
        name="valuationId"
        id="valuationId"
        defaultValue={valuationId}
      />
      <input
        disabled={disabled}
        type="text"
        id="valuation"
        name="valuation"
        className="w-full bg-slate-100 p-1 h-full text-2xl rounded-md"
        defaultValue={state.data ?? ''}
        onChange={handleAutoSave}
      />
      {state.loading && <p className="text-sm text-gray-500">Gemmer...</p>}
    </form>
  );
};

export default ValuationField;
