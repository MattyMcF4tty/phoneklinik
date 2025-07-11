'use client';

import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import Device from '@schemas/device';
import DevicePart from '@schemas/devicePart';
import { ActionResponse } from '@schemas/types';
import { useRouter } from 'next/navigation';
import React, { FC, useActionState, useEffect, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'sonner';
import { updatePart } from '../actions';
import PartForm from '@components/forms/presets/PartForm';

interface UpdatePartButtonProps {
  deviceId: Device['id'];
  part: DevicePart;
}

const UpdatePartButton: FC<UpdatePartButtonProps> = ({ deviceId, part }) => {
  const [showPopUp, setShowPopUp] = useState(false);

  const router = useRouter();

  const initialState: ActionResponse<DevicePart> = {
    success: undefined,
    message: '',
  };

  const [state, formAction, pending] = useActionState(updatePart, initialState);

  useEffect(() => {
    if (pending === true) {
      toast.loading('Opdatere del...', { id: 'update-part' });
    } else {
      toast.dismiss('update-part');

      if (state.success === true) {
        toast.success(state.message || 'Del opdateret');
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
        Redigér del
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
              <h1 className="text-title">
                Redigér del &apos;{part.name}&apos;
              </h1>
            </div>

            <PartForm
              action={formAction}
              className="flex flex-col gap-8 w-full"
              buttonText="Gem ændringer"
              defaultPart={part}
              deviceId={deviceId}
              loading={pending}
            />
          </div>
        </PopUpWrapper>
      )}
    </div>
  );
};

export default UpdatePartButton;
