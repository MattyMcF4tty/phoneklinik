'use client';

import React, { FC, useActionState, useEffect, useState } from 'react';
import { ActionResponse } from '@schemas/types';
import { toast } from 'sonner';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import { useRouter } from 'next/navigation';
import { RxCross1 } from 'react-icons/rx';
import { deleteAccessory } from '../actions';
import Accessory from '@schemas/accessory';

interface DeleteAccessoryButtonProps {
  accessoryId: Accessory['id'];
  accessoryName: Accessory['name'];
}

const DeleteAccessoryButton: FC<DeleteAccessoryButtonProps> = ({
  accessoryId,
  accessoryName,
}) => {
  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState(false);

  const initialState: ActionResponse = {
    success: undefined,
    message: '',
  };
  const [state, formAction, pending] = useActionState(
    deleteAccessory,
    initialState
  );

  useEffect(() => {
    const loadingToastId = 'delete-accessory-toast';

    if (state.success !== undefined) {
      toast.dismiss(loadingToastId);

      if (state.success) {
        toast.success(state.message);
        router.push('/admin/tilbehoer');
      } else {
        toast.error(state.message);
      }
    } else if (pending) {
      toast.loading(`Sletter tilbehør...`, { id: loadingToastId });
    }
  }, [state, pending, router]);

  return (
    <div className="w-full">
      <button
        onClick={() => {
          setShowPopUp(true);
        }}
        className="bg-red-500 text-white w-full py-2 rounded-md"
      >
        Slet
      </button>
      {showPopUp && (
        <PopUpWrapper>
          <form
            action={formAction}
            className="w-1/4 content-box flex flex-col items-center gap-8"
          >
            <div className="relative w-full gap-4 flex flex-col items-center">
              <button
                onClick={() => {
                  setShowPopUp(false);
                }}
                disabled={pending}
                type="button"
                className="absolute top-0 left-0"
              >
                <RxCross1 />
              </button>
              <h1 className="text-title">Slet tilbehør</h1>
              <span>
                Er du sikker på, at du vil slette tilbehøret &apos;
                {accessoryName}&apos;?
                <p className="font-medium underline">
                  Denne handling kan ikke fortrydes.
                </p>
              </span>
            </div>
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex justify-center">
                <input
                  type="hidden"
                  name="accessoryId"
                  id="accessoryId"
                  defaultValue={accessoryId}
                />
                <button
                  disabled={pending}
                  className="
                  border bg-red-600 text-white px-2 rounded-md shadow-lg
                  hover:shadow-inner 
                  disabled:shadow-none disabled:bg-gray-300 disabled:border-transparent disabled:text-white"
                >
                  Bekræft sletning af &apos;{accessoryName}&apos;
                </button>
              </div>
            </div>
          </form>
        </PopUpWrapper>
      )}
    </div>
  );
};

export default DeleteAccessoryButton;
