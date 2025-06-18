'use client';

import Brand from '@schemas/brand';
import React, { FC, useActionState, useEffect, useState } from 'react';
import { deleteBrand } from '../actions';
import { ActionResponse } from '@schemas/types';
import { toast } from 'sonner';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import { useRouter } from 'next/navigation';
import { RxCross1 } from 'react-icons/rx';
interface DeleteBrandButtonProps {
  brandName: Brand['name'];
}

const DeleteBrandButton: FC<DeleteBrandButtonProps> = ({ brandName }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [confirmationString, setConfirmationString] = useState('');

  const initialState: ActionResponse = {
    success: undefined,
    message: '',
  };
  const [state, formAction] = useActionState(deleteBrand, initialState);

  useEffect(() => {
    const loadingToastId = 'delete-brand-toast';

    if (state.success !== undefined) {
      setLoading(false);
      toast.dismiss(loadingToastId);

      if (state.success) {
        toast.success(state.message);
        router.refresh();
      } else {
        toast.error(state.message);
      }
    } else if (loading) {
      toast.loading(`Sletter mærket '${brandName}'...`, { id: loadingToastId });
    }
  }, [state, loading]);

  return (
    <div className="w-full">
      <button
        onClick={() => {
          setShowPopUp(true);
        }}
        className="bg-red-500 text-white w-full py-1 rounded-md"
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
                disabled={loading}
                type="button"
                className="absolute top-0 left-0"
              >
                <RxCross1 />
              </button>
              <h1 className="text-title">Slet mærke '{brandName}'</h1>
              <span>
                Er du sikker på, at du vil slette mærket '{brandName}' samt alle
                enheder og alt tilbehør forbundet med dette mærke?{' '}
                <p className="font-medium underline">
                  Denne handling kan ikke fortrydes.
                </p>
              </span>
            </div>
            <div className="w-full flex flex-col gap-4">
              <div>
                <label htmlFor="confirmation" className="select-none">
                  Skriv '{brandName}' for at bekræfte sletning
                </label>
                <input
                  type="text"
                  className="input-default"
                  name="confirmation"
                  id="confirmation"
                  value={confirmationString}
                  required
                  onChange={(e) => setConfirmationString(e.target.value)}
                  placeholder={brandName}
                />
              </div>

              <div className="w-full flex justify-center">
                <input
                  type="hidden"
                  name="brandName"
                  id="brandName"
                  defaultValue={brandName}
                />
                <button
                  onClick={() => {
                    setLoading(true);
                  }}
                  disabled={!confirmationString.match(brandName)}
                  className="
                  border bg-red-600 text-white px-2 rounded-md shadow-lg
                  hover:shadow-inner 
                  disabled:shadow-none disabled:bg-gray-300 disabled:border-transparent disabled:text-white"
                >
                  Bekræft sletning af '{brandName}'
                </button>
              </div>
            </div>
          </form>
        </PopUpWrapper>
      )}
    </div>
  );
};

export default DeleteBrandButton;
