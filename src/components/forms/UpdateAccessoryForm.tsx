'use client';

import { updateAccessory } from '@/app/(pages)/admin/tilbehoer/[id]/actions';
import Accessory from '@schemas/accessory';
import Brand from '@schemas/brand';
import { ActionResponse } from '@schemas/types';
import React, { FC, useActionState, useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'sonner';

interface UpdateAccessoryProps {
  brands: Brand[];
  accessory: Accessory;
  types: string[];
}

const UpdateAccessoryForm: FC<UpdateAccessoryProps> = ({
  brands,
  accessory,
  types,
}) => {
  const initialState: ActionResponse<Omit<Accessory, 'images'> | undefined> = {
    success: undefined,
    message: '',
    data: accessory,
  };

  const [state, formAction] = useActionState(updateAccessory, initialState);
  const [showCustomType, setShowCustomType] = useState(false);
  const [localAccessory, setLocalAccessory] = useState(state.data || accessory);
  const [supportedDevices, setSupportedDevices] = useState(
    localAccessory.supportedDevices
  );

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message);
      if (state.data) {
        setLocalAccessory(state.data);
      }
    } else if (state.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="w-full grow flex flex-col gap-8">
      <input
        type="hidden"
        id="accessoryId"
        name="accessoryId"
        defaultValue={accessory.id}
      />
      <div className=" w-full content-box flex items-center flex-col gap-8">
        <div className="flex flex-col gap-2 w-full">
          <input
            type="text"
            name="accessoryName"
            id="accessoryName"
            className="text-title place-self-center w-full text-center"
            defaultValue={localAccessory.name}
          />
          <textarea
            name="accessoryDescription"
            id="accessoryDescription"
            defaultValue={localAccessory.description}
          />

          <p className="place-self-start font-medium mt-2 flex flex-row gap-2">
            Lavet af
            <select
              name="accessoryBrand"
              id="accessoryBrand"
              defaultValue={localAccessory.brand}
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
            className="w-24"
            defaultValue={localAccessory.price}
          />
          kr
        </p>
      </div>
      <div className="w-full content-box">
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
                <RxCross2 />
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
              if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
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
      >
        Gem ændringer
      </button>
    </form>
  );
};

export default UpdateAccessoryForm;
