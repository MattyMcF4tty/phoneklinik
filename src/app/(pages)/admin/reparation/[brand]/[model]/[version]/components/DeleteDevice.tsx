'use client';

import React, { FC, useActionState, useEffect, useState } from 'react';
import { ActionResponse } from '@schemas/types';
import { toast } from 'sonner';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import { useRouter } from 'next/navigation';
import { RxCross1 } from 'react-icons/rx';
import { deleteDevice } from '../actions';
import Device from '@schemas/device';

interface DeleteDeviceButtonProps {
  deviceId: Device['id'];
  deviceBrand: Device['brand'];
  deviceModel: Device['model'];
  deviceVersion: Device['version'];
}

const DeleteDeviceButton: FC<DeleteDeviceButtonProps> = ({
  deviceId,
  deviceBrand,
  deviceModel,
  deviceVersion,
}) => {
  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState(false);
  const [confirmationString, setConfirmationString] = useState('');
  const deviceName = `${deviceBrand} ${deviceModel} ${deviceVersion}`;

  const initialState: ActionResponse = {
    success: undefined,
    message: '',
  };

  const [state, formAction, pending] = useActionState(
    deleteDevice,
    initialState
  );

  useEffect(() => {
    const loadingToastId = 'delete-device-toast';

    if (state.success !== undefined) {
      toast.dismiss(loadingToastId);

      if (state.success) {
        toast.success(state.message);
        router.push('/admin/reparation');
      } else {
        toast.error(state.message);
      }
    } else if (pending) {
      toast.loading(`Sletter enhed...`, { id: loadingToastId });
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
        Slet enhed
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
              <h1 className="text-title">
                Slet enhed &apos;{deviceName}&apos;
              </h1>
              <span>
                Er du sikker på, at du vil slette enheden &apos;{deviceName}
                &apos; samt alle alle dele og del-varianter forbundet med denne
                enhed?
                <p className="font-medium underline">
                  Denne handling kan ikke fortrydes.
                </p>
              </span>
            </div>
            <div className="w-full flex flex-col gap-4">
              <div>
                <label htmlFor="confirmation" className="select-none">
                  Skriv &apos;{deviceName}&apos; for at bekræfte sletning
                </label>
                <input
                  type="text"
                  className="input-default"
                  name="confirmation"
                  id="confirmation"
                  value={confirmationString}
                  required
                  onChange={(e) => setConfirmationString(e.target.value)}
                  placeholder={deviceName}
                />
              </div>

              <div className="w-full flex justify-center">
                <input
                  type="hidden"
                  name="deviceId"
                  id="deviceId"
                  defaultValue={deviceId}
                />
                <button
                  disabled={!confirmationString.match(deviceName) || pending}
                  className="
                border bg-red-600 text-white px-2 rounded-md shadow-lg
                hover:shadow-inner 
                disabled:shadow-none disabled:bg-gray-300 disabled:border-transparent disabled:text-white"
                >
                  Bekræft sletning af &apos;{deviceName}&apos;
                </button>
              </div>
            </div>
          </form>
        </PopUpWrapper>
      )}
    </div>
  );
};

export default DeleteDeviceButton;
