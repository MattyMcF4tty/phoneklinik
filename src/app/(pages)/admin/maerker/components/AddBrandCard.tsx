'use client';

import ItemCard from '@components/cards/ItemCard';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import Brand from '@schemas/brand';
import { ApiResponse } from '@schemas/types';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'sonner';

const AddBrandCard: FC = () => {
  const router = useRouter();
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const response = await fetch('/api/brands', {
      method: 'POST',
      body: formData,
    });

    const data: ApiResponse<Brand> = (await response.json()).data;
    const responseMessage = data.message;
    if (!response.ok) {
      toast.error(responseMessage || 'Noget gik galt');
      setLoading(false);
    }

    toast.success(responseMessage || 'Mærke oprettet');
    setLoading(false);
    setShowPopUp(false);
    router.refresh();
  }

  useEffect(() => {
    let toastId: string | number | undefined;

    if (loading) {
      toastId = toast.loading('Opretter mærke');
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [loading]);
  return (
    <ItemCard itemName="Tilføj nyt mærke">
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
          <form
            onSubmit={handleSubmit}
            className="content-box w-1/4 flex flex-col items-center gap-8"
          >
            <div className="relative flex justify-center items-center w-full">
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
              <h1 className="text-title">Tilføj mærke</h1>
            </div>

            <div className="flex flex-col w-full">
              <label htmlFor="brandImageLabel">Mærkets navn</label>
              <input
                className="input-default"
                type="text"
                id="brandName"
                name="brandName"
              />
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="brandImageLabel">Tilbehør billede</label>
                <input
                  type="file"
                  id="brandImage"
                  name="brandImage"
                  accept="image/*"
                />
              </div>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="button-highlighted w-1/3"
            >
              Tilføj
            </button>
          </form>
        </PopUpWrapper>
      )}
    </ItemCard>
  );
};

export default AddBrandCard;
