'use client';

import ImageField from '@components/inputfields/ImageField';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import Brand from '@schemas/brand';
import AppError from '@schemas/errors/appError';
import handleInternalApi from '@utils/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'sonner';

interface UpdateBrandButtonProps {
  brand: Brand;
}

const UpdateBrandButton: FC<UpdateBrandButtonProps> = ({ brand }) => {
  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const reponse = await handleInternalApi<Brand>('/brands', {
        method: 'PATCH',
        body: formData,
      });

      toast.success(reponse.message);
    } catch (err: unknown) {
      const error = err as AppError | Error;
      console.error(`Failed to update brand '${brand.name}'` + error);
      toast.error(error.message ? error.message : 'Noget gik galt');
    } finally {
      setLoading(false);
      router.refresh();
    }
  }

  return (
    <div className="w-full">
      <button
        className="w-full py-1 bg-blue-500 text-white rounded-md"
        onClick={() => {
          setShowPopUp(true);
        }}
        type="button"
      >
        Redigér
      </button>
      {showPopUp && (
        <PopUpWrapper>
          <div className="w-1/4 content-box flex flex-col items-center gap-8">
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
              <h1 className="text-title">Redigér mærke '{brand.name}'</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <ImageField
                id="brandImage"
                name="brandImage"
                defaultImage={{
                  src: brand.imageUrl,
                  alt: `${brand.name} - Billede`,
                }}
                labelText="Skift billede"
              />
              <input
                type="hidden"
                name="brandName"
                id="brandName"
                defaultValue={brand.name}
              />
              <label htmlFor="brandName" className="flex flex-col">
                <p className="label-default">Skift mærke navn</p>
                <input
                  type="text"
                  name="newBrandName"
                  id="newBrandName"
                  className="input-default"
                  placeholder={brand.name}
                />
              </label>
              <button type="submit" className="button-highlighted">
                Opdater
              </button>
            </form>
          </div>
        </PopUpWrapper>
      )}
    </div>
  );
};

export default UpdateBrandButton;
