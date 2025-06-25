'use client';

import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import Device from '@schemas/device';
import DevicePart from '@schemas/devicePart';
import { ActionResponse } from '@schemas/types';
import { useRouter } from 'next/navigation';
import React, { FC, useActionState, useEffect, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'sonner';
import { addPart } from '../actions';
import PartForm from '@components/forms/new/PartForm';

interface AddPartButtonProps {
  deviceId: Device['id'];
}

const AddPartButton: FC<AddPartButtonProps> = ({ deviceId }) => {
  const [showPopUp, setShowPopUp] = useState(false);

  const router = useRouter();

  const initialState: ActionResponse<DevicePart | undefined> = {
    success: undefined,
    message: '',
  };

  const [state, formAction, pending] = useActionState(addPart, initialState);

  useEffect(() => {
    if (pending === true) {
      toast.loading('Tilføjer del...', { id: 'add-part' });
    } else {
      toast.dismiss('add-part');

      if (state.success === true) {
        toast.success(state.message || 'Del tilføjet');
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
        className="bg-blue-500 w-full py-2 text-white rounded-md"
      >
        Tilføj del
      </button>
      {showPopUp && (
        <PopUpWrapper>
          <div className="content-box max-h-[90vh] overflow-y-auto w-1/3 flex flex-col items-center">
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
              <h1 className="text-title">Tilføj del</h1>
            </div>

            <PartForm
              action={formAction}
              className="flex flex-col gap-8 w-full"
              buttonText="Gem ændringer"
              deviceId={deviceId}
              loading={pending}
            />
          </div>
        </PopUpWrapper>
      )}
    </div>
  );
};

export default AddPartButton;
