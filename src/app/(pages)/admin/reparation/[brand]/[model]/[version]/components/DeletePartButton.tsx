'use client';

import React, { FC, useActionState, useEffect, useState } from 'react';
import { ActionResponse } from '@schemas/types';
import { toast } from 'sonner';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import { useRouter } from 'next/navigation';
import { RxCross1 } from 'react-icons/rx';
import { deletePart } from '../actions';
import DevicePart from '@schemas/devicePart';

interface DeletePartButtonProps {
  part: DevicePart;
}

const DeletePartButton: FC<DeletePartButtonProps> = ({ part }) => {
  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState(false);
  const [confirmationString, setConfirmationString] = useState('');

  const initialState: ActionResponse = {
    success: undefined,
    message: '',
  };

  const [state, formAction, pending] = useActionState(deletePart, initialState);

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
    <div className="w-full">
      <button
        onClick={() => {
          setShowPopUp(true);
        }}
        className="bg-red-500 text-white w-full py-2 rounded-md"
      >
        Slet del
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
              <h1 className="text-title">Slet delen &apos;{part.name}&apos;</h1>
              <span>
                Er du sikker på, at du vil slette delen &apos;{part.name}&apos;
                samt alle alle del-varianter forbundet med denne del?
                <p className="font-medium underline">
                  Denne handling kan ikke fortrydes.
                </p>
              </span>
            </div>
            <div className="w-full flex flex-col gap-4">
              <div>
                <label htmlFor="confirmation" className="select-none">
                  Skriv &apos;{part.name}&apos; for at bekræfte sletning
                </label>
                <input
                  type="text"
                  className="input-default"
                  name="confirmation"
                  id="confirmation"
                  value={confirmationString}
                  required
                  onChange={(e) => setConfirmationString(e.target.value)}
                  placeholder={part.name}
                />
              </div>

              <div className="w-full flex justify-center">
                <input
                  type="hidden"
                  name="partId"
                  id="partId"
                  defaultValue={part.id}
                />
                <button
                  disabled={!confirmationString.match(part.name) || pending}
                  className="
                border bg-red-600 text-white px-2 rounded-md shadow-lg
                hover:shadow-inner 
                disabled:shadow-none disabled:bg-gray-300 disabled:border-transparent disabled:text-white"
                >
                  Bekræft sletning af &apos;{part.name}&apos;
                </button>
              </div>
            </div>
          </form>
        </PopUpWrapper>
      )}
    </div>
  );
};

export default DeletePartButton;
