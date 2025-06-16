'use client';

import ItemCard from '@components/cards/ItemCard';
import PopUpWrapper from '@components/wrappers/PopUpWrapper';
import Brand from '@schemas/brand';
import React, { FC, useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';

interface AddAccessoryCardProps {
  types: string[];
  brands: Brand[];
}

const AddAccessoryCard: FC<AddAccessoryCardProps> = ({ types, brands }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCustomType, setShowCustomType] = useState(false);
  const [supportedDevices, setSupportedDevices] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const response = await fetch('/api/accessories', {
      method: 'POST',
      body: formData,
    });
    console.log(response.json());
  }

  return (
    <ItemCard itemName="Tilføj ny genstand">
      <div className="w-full h-full flex justify-center flex-col">
        <IoIosAdd className="w-full h-full" />

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
            className="content-box w-1/4 flex flex-col items-center"
          >
            <div className="flex flex-col gap-2 w-full">
              <input
                type="text"
                name="accessoryName"
                id="accessoryName"
                className="text-title place-self-center input-default"
                placeholder="Tilbehør navn"
              />
              <textarea
                name="accessoryDescription"
                id="accessoryDescription"
                className="input-default min-h-20"
                placeholder="Tilbehør beskrivelse"
              />

              <p className="place-self-start font-medium mt-2 flex flex-row gap-2">
                Lavet af
                <select name="accessoryBrand" id="accessoryBrand">
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
                className="input-default"
              />
              kr
            </p>

            <div>
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

            <div className="flex flex-col">
              <label htmlFor="accessoryImageLabel">Tilbehør billede</label>
              <input
                type="file"
                id="accessoryImage"
                name="accessoryImage"
                accept="image/*"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="button-highlighted h-12 w-40 rounded-md place-self-center"
            >
              Gem ændringer
            </button>
          </form>
        </PopUpWrapper>
      )}
    </ItemCard>
  );
};

export default AddAccessoryCard;
