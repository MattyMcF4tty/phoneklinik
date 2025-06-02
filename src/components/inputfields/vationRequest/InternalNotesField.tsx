'use client';

import { updateInternalNotes } from '@/app/admin/valuation/[id]/actions';
import { ActionResponse } from '@/schemas/new/types';
import ValuationRequest from '@/schemas/new/valuationRequest';
import React, { FC, useActionState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface InternalNotesFieldProps {
  disabled?: boolean;
  valuationId: ValuationRequest['id'];
  defaultValue?: ValuationRequest['internalNotes'];
}

const InternalNotesField: FC<InternalNotesFieldProps> = ({
  disabled,
  valuationId,
  defaultValue = '',
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initialState: ActionResponse<ValuationRequest['internalNotes']> = {
    success: undefined,
    loading: false,
    message: '',
    data: defaultValue,
  };

  const [state, formAction] = useActionState(updateInternalNotes, initialState);

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
      <textarea
        disabled={disabled}
        id="internalNotes"
        name="internalNotes"
        className="w-full bg-slate-100 p-1 h-full rounded-md"
        defaultValue={state.data}
        onChange={handleAutoSave}
      />
      {state.loading && <p className="text-sm text-gray-500">Gemmer...</p>}
    </form>
  );
};

export default InternalNotesField;
