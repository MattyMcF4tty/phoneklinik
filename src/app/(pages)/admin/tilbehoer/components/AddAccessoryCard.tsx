'use client';

import ItemCard from '@components/cards/ItemCard';
import AccessoryForm from '@components/forms/new/AccessoryForm';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import Accessory from '@schemas/accessory';
import Brand from '@schemas/brand';
import AppError from '@schemas/errors/appError';
import handleInternalApi from '@utils/api';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'sonner';

interface AddAccessoryCardProps {
  types: string[];
  brands: Brand[];
}

const AddAccessoryCard: FC<AddAccessoryCardProps> = ({ types, brands }) => {
  const router = useRouter();

  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const reponse = await handleInternalApi<Accessory>('/accessories', {
        method: 'POST',
        body: formData,
      });

      toast.success(reponse.message);
    } catch (err: unknown) {
      const error = err as AppError | Error;
      console.error(`Failed to create accessory:` + error);
      toast.error(error.message ? error.message : 'Noget gik galt');
    } finally {
      setLoading(false);
      setShowPopUp(false);
      router.refresh();
    }
  }

  return (
    <ItemCard itemName="Tilføj ny genstand">
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
              <h1 className="text-title">Tilføj tilbehør</h1>
            </div>
            <AccessoryForm
              brands={brands}
              types={types}
              className="flex flex-col items-center gap-8 w-full"
              onSubmit={handleSubmit}
              loading={loading}
              buttonText="Tilføj"
            />
          </div>
        </PopUpWrapper>
      )}
    </ItemCard>
  );
};

export default AddAccessoryCard;
