'use client';

import ItemCard from '@components/cards/ItemCard';
import DeviceForm from '@components/forms/presets/DeviceForm';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import Brand from '@schemas/brand';
import Device from '@schemas/device';
import AppError from '@schemas/errors/appError';
import handleInternalApi from '@utils/api';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'sonner';

interface AddDeviceCardProps {
  brands: Brand[];
  defaultDevice?: Partial<Device>;
}

const AddDeviceCard: FC<AddDeviceCardProps> = ({ defaultDevice, brands }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const reponse = await handleInternalApi<Device>('/devices', {
        method: 'POST',
        body: formData,
      });

      toast.success(reponse.message);
      setShowPopUp(false);
      router.refresh();
    } catch (err: unknown) {
      const error = err as AppError | Error;
      console.error(`Failed to create device:` + error);
      toast.error(error.message ? error.message : 'Noget gik galt');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ItemCard itemName="Tilføj ny enhed">
      <div className="w-full h-full flex justify-center flex-col">
        <div className="h-full w-full flex items-center justify-center">
          <IoIosAdd className="w-full h-1/3" />
        </div>

        <button
          onClick={() => {
            setShowPopUp(true);
          }}
          className="h-20 bg-blue-500 text-white rounded-md"
        >
          Tilføj
        </button>
      </div>
      {showPopUp && (
        <PopUpWrapper>
          <div className="content-box flex flex-col w-1/3 gap-8">
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
              <h1 className="text-title">Tilføj enhed</h1>
            </div>
            <DeviceForm
              onSubmit={handleSubmit}
              brands={brands}
              className="flex flex-col gap-4 w-full"
              defaultDevice={defaultDevice}
            />
          </div>
        </PopUpWrapper>
      )}
    </ItemCard>
  );
};

export default AddDeviceCard;
