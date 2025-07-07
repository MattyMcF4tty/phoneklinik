'use client';

import { ActionResponse } from '@schemas/types';
import React, { FC, useActionState, useEffect } from 'react';
import { toast } from 'sonner';

interface ActionFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'action'> {
  action: (state: ActionResponse, payload: FormData) => Promise<ActionResponse>;
  onSuccess?: (state: ActionResponse) => void;
  whileLoading?: (loading: boolean) => void;
  onFail?: (state: ActionResponse) => void;
  initialActionState: ActionResponse;
  loadingText?: string;
}

const ActionForm: FC<ActionFormProps> = ({
  action,
  onSuccess,
  whileLoading,
  onFail,
  initialActionState,
  loadingText,
  children,
  ...rest
}: ActionFormProps) => {
  const [actionState, formAction, pending] = useActionState(
    action,
    initialActionState
  );

  useEffect(() => {
    if (pending === true) {
      if (whileLoading) {
        whileLoading(true);
      }
      toast.loading(loadingText || 'Loading...', { id: 'loading-toast' });
    } else {
      if (whileLoading) {
        whileLoading(false);
      }

      toast.dismiss('loading-toast');

      if (actionState.success === true) {
        toast.success(actionState.message || 'Success!');

        if (onSuccess) {
          onSuccess(actionState);
        }
      } else if (actionState.success === false) {
        toast.error(actionState.message || 'Noget gik galt!');

        if (onFail) {
          onFail(actionState);
        }
      }
    }
  }, [actionState, onSuccess, onFail, loadingText, pending, whileLoading]);

  return (
    <form {...rest} action={formAction}>
      {children}
    </form>
  );
};

export default ActionForm;
