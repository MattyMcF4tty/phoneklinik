'use client';

import ImageField from '@components/inputfields/ImageField';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import Accessory from '@schemas/accessory';
import Brand from '@schemas/brand';
import AppError from '@schemas/errors/appError';
import handleInternalApi from '@utils/api';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';
import { RxCross1, RxCross2 } from 'react-icons/rx';
import { toast } from 'sonner';

interface UpdateAccessoryButtonProps {
  accessory: Accessory;
  brands: Brand[];
  types: string[];
}

const UpdateAccessoryButton: FC<UpdateAccessoryButtonProps> = ({
  accessory,
  brands,
  types,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);

  const router = useRouter();

  const [showCustomType, setShowCustomType] = useState(false);
  const [supportedDevices, setSupportedDevices] = useState(
    accessory.supportedDevices
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);

      const form = e.currentTarget;
      const formData = new FormData(form);

      const reponse = await handleInternalApi<Accessory>('/accessories', {
        method: 'PATCH',
        body: formData,
      });

      toast.success(reponse.message);
    } catch (err: unknown) {
      const error = err as AppError | Error;
      console.error(`Failed to update accessory '${accessory.name}:'` + error);
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
          <form
            className="absolute max-h-[90vh] overflow-y-auto w-1/3 content-box flex flex-col items-center gap-8"
            onSubmit={handleSubmit}
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
              <h1 className="text-title">
                Redigér tilbehør '{accessory.name}'
              </h1>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <input
                type="hidden"
                id="accessoryId"
                name="accessoryId"
                defaultValue={accessory.id}
              />
              <div className="flex flex-col gap-4 w-full">
                <ImageField
                  placeholder={{
                    src: accessory.imageUrl,
                    alt: `${accessory.name} - Billede`,
                  }}
                  labelText="Skift billede"
                  name="accessoryImage"
                  id="accessoryImage"
                />
                <label htmlFor="accessoryName">
                  <p className="label-default">Tilbehør navn</p>
                  <input
                    type="text"
                    name="accessoryName"
                    id="accessoryName"
                    className="input-default"
                    defaultValue={accessory.name}
                  />
                </label>

                <label htmlFor="accessoryDescription">
                  <p className="label-default">Tilbehør beskrivelse</p>
                  <textarea
                    name="accessoryDescription"
                    id="accessoryDescription"
                    className="input-default"
                    defaultValue={accessory.description}
                  />
                </label>

                <p className="place-self-start font-medium mt-2 flex flex-row gap-2">
                  Lavet af
                  <select
                    name="accessoryBrand"
                    id="accessoryBrand"
                    defaultValue={accessory.brand}
                  >
                    {brands.map((brand) => (
                      <option key={brand.name} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </p>
                <p className="place-self-start font-medium mt-2 flex flex-row gap-2">
                  Tilbehørs type:
                  <select
                    id="accessoryType"
                    name="accessoryType"
                    defaultValue={accessory.type}
                    onChange={(e) => {
                      setShowCustomType(e.target.value === 'custom');
                    }}
                  >
                    {types.map((type, index) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                    <option key={'custom'} value={'custom'}>
                      Ny type
                    </option>
                  </select>
                  {showCustomType && (
                    <input
                      type="text"
                      className="input-default"
                      id="customType"
                      name="customType"
                    />
                  )}
                </p>
              </div>

              <p className="place-self-start font-semibold text-lg flex flex-row gap-2">
                Pris:
                <input
                  type="number"
                  name="accessoryPrice"
                  id="accessoryPrice"
                  className="w-24 input-default"
                  defaultValue={accessory.price}
                />
                kr
              </p>
            </div>
            <div className="w-full ">
              <h2 className="text-subtitle">Understøttede enheder</h2>

              <div className="flex flex-wrap gap-2">
                {supportedDevices.map((deviceName, index) => (
                  <div
                    key={index}
                    className="text-subtle rounded-full px-2 h-6 bg-slate-100 flex items-center justify-center"
                  >
                    <button
                      type="button"
                      className="h-full hover:text-red-600"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        const newDeviceArray = [...supportedDevices];
                        newDeviceArray.splice(index, 1);
                        setSupportedDevices(newDeviceArray);
                      }}
                    >
                      <RxCross1 />
                    </button>
                    <input
                      style={{
                        width: `${deviceName.length + 2}ch`,
                      }}
                      className="bg-transparent text-center text-base h-full items-center flex"
                      type="text"
                      readOnly
                      id="supportedDevices"
                      name="supportedDevices"
                      defaultValue={deviceName}
                    />
                  </div>
                ))}
                <input
                  type="text"
                  className="border-b outline-none h-6 w-36 focus:bg-slate-100 px-1 rounded-md focus:shadow-inner focus-within:bg-slate-100"
                  placeholder="Enhed"
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      e.currentTarget.value.trim() !== ''
                    ) {
                      e.preventDefault();
                      setSupportedDevices([
                        ...supportedDevices,
                        e.currentTarget.value.trim(),
                      ]);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white h-12 w-40 rounded-md place-self-center"
              disabled={loading}
            >
              Gem ændringer
            </button>
          </form>
        </PopUpWrapper>
      )}
    </div>
  );
};

export default UpdateAccessoryButton;
