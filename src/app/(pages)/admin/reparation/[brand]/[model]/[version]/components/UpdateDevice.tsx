'use client';

import DeviceForm from '@components/forms/presets/DeviceForm';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import Brand from '@schemas/brand';
import Device from '@schemas/device';
import AppError from '@schemas/errors/appError';
import handleInternalApi from '@utils/api';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'sonner';

interface UpdateDeviceButtonProps {
  device: Device;
  brands: Brand[];
}

const UpdateDeviceButton: FC<UpdateDeviceButtonProps> = ({
  device,
  brands,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const router = useRouter();
  const deviceName = `${device.brand} ${device.model} ${device.version}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const reponse = await handleInternalApi('/devices', {
        method: 'PATCH',
        body: formData,
      });

      toast.success(reponse.message);
    } catch (err: unknown) {
      const error = err as AppError | Error;
      console.error(`Failed to update accessory '${deviceName}':` + error);
      toast.error(error.message ? error.message : 'Noget gik galt');
    } finally {
      setLoading(false);
      setShowPopUp(false);
      router.refresh();
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={() => {
          setShowPopUp(true);
        }}
        className="bg-blue-500 w-full py-2 text-white rounded-md"
      >
        Redigér
      </button>
      {showPopUp && (
        <PopUpWrapper>
          <div className="content-box max-h-[90vh] overflow-y-auto w-1/3 flex flex-col items-center">
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
              <h1 className="text-title">
                Redigér enhed &apos;{deviceName}&apos;
              </h1>
            </div>

            <DeviceForm
              className="flex flex-col gap-8 w-full"
              onSubmit={handleSubmit}
              buttonText="Gem ændringer"
              defaultDevice={device}
              brands={brands}
              loading={loading}
            />
          </div>
        </PopUpWrapper>
      )}
    </div>
  );
};

export default UpdateDeviceButton;
