'use client';

import React, { FC, useActionState, useEffect } from 'react';
import { ActionResponse } from '@schemas/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteVariant } from '../actions';
import PartVariant from '@schemas/partVariant';

interface DeleteVariantButtonProps {
  variant: PartVariant;
}

const DeleteVariantButton: FC<DeleteVariantButtonProps> = ({ variant }) => {
  const router = useRouter();

  const initialState: ActionResponse = {
    success: undefined,
    message: '',
  };

  const [state, formAction, pending] = useActionState(
    deleteVariant,
    initialState
  );

  useEffect(() => {
    if (pending === true) {
      toast.loading('Sletter del...', { id: 'delete-part' });
    } else {
      toast.dismiss('delete-part');

      if (state.success === true) {
        toast.success(state.message || 'Del slettet');
        router.refresh();
      } else if (state.success === false) {
        toast.error(state.message || 'Noget gik galt');
      }
    }
  }, [pending, state, router]);

  return (
    <form action={formAction} className="w-full">
      <input
        type="hidden"
        name="variantId"
        id="variantId"
        defaultValue={variant.id}
      />
      <input
        type="hidden"
        name="partId"
        id="partId"
        defaultValue={variant.partId}
      />
      <button className="bg-red-500 text-white w-full py-2 rounded-md">
        Slet del-variant
      </button>
    </form>
  );
};

export default DeleteVariantButton;
