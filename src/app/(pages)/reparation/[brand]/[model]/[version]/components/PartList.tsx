'use client';

import React, { FC, useEffect, useState } from 'react';
import useSessionStorage from '@/hooks/useSessionStorage';
import Link from 'next/link';
import Device from '@/schemas/device';
import DevicePart from '@/schemas/devicePart';
import PartVariant from '@/schemas/partVariant';

/* --- LIST --- */
interface PartListProps {
  device: Device;
  parts: DevicePart[];
}

const PartList: FC<PartListProps> = ({ device, parts }) => {
  const [selectedPartVariants, setSelectedPartVariants] = useSessionStorage<
    PartVariant[]
  >(`${device.brand}_${device.model}_${device.version}_parts`, []);

  // ✅ Save device.id once in sessionStorage (no hook needed)
  useEffect(() => {
    sessionStorage.setItem(
      `${device.brand}_${device.model}_${device.version}_id`,
      JSON.stringify(device.id)
    );
  }, [device.brand, device.model, device.version, device.id]);
  const combinedPartsPrice = selectedPartVariants.reduce(
    (sum, part) => sum + part.price,
    0
  );

  const togglePart = (part: PartVariant) => {
    console.log('Toggling part:', part);

    const exists = selectedPartVariants.some((p) => p.id === part.id);
    if (exists) {
      setSelectedPartVariants(
        selectedPartVariants.filter((p) => p.id !== part.id)
      );
    } else {
      setSelectedPartVariants([...selectedPartVariants, part]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Part List */}
      <div className="w-full flex flex-col gap-3">
        {parts.map((part) => (
          <div
            key={part.id}
            className="rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
          >
            <PartListRow
              part={part}
              selectedVariants={selectedPartVariants}
              toggleVariant={(partVariant) => togglePart(partVariant)}
            />
          </div>
        ))}
      </div>

      {/* Total Price */}
      <div className="w-full flex justify-between items-center border-t pt-4 text-base font-medium">
        <p className="text-gray-700">Pris i alt</p>
        <p className="text-gray-900">{combinedPartsPrice} kr.</p>
      </div>

      {/* Book Repair Button */}
      {selectedPartVariants.length > 0 && (
        <Link
          href={`/reparation/${device.brand}/${device.model}/${device.version}/booking`}
          className="bg-blue-600 text-white font-semibold text-center px-6 py-3 rounded-md shadow hover:bg-primary-dark transition-colors"
        >
          Book reparation
        </Link>
      )}
    </div>
  );
};

export default PartList;

/* --- ROW --- */
interface PartListRowProps {
  part: DevicePart;
  selectedVariants: PartVariant[];
  toggleVariant: (partVariant: PartVariant) => void;
}

const PartListRow: FC<PartListRowProps> = ({
  part,
  selectedVariants,
  toggleVariant,
}) => {
  const [selectedPartVariant, setSelectedPartVariant] = useState<
    PartVariant | undefined
  >(undefined);
  const [showVariants, setShowVariants] = useState(false);

  useEffect(() => {
    const selectedVariant = selectedVariants.find(
      (variant) => variant.partId === part.id
    );
    setSelectedPartVariant(selectedVariant);
  }, [selectedVariants, part.id]);

  return (
    <div
      onMouseLeave={() => setShowVariants(false)}
      className="relative w-full"
    >
      <button
        onClick={() => {
          if (selectedPartVariant) {
            toggleVariant(selectedPartVariant);
          } else {
            setShowVariants(!showVariants);
          }
        }}
        type="button"
        className={`w-full flex flex-col items-start justify-center p-3 rounded-md border transition-colors duration-150 ${
          selectedPartVariant
            ? 'bg-blue-50 border-blue-300'
            : 'bg-white border-gray-200 hover:bg-blue-50'
        }`}
      >
        <div className="w-full flex justify-between items-center font-medium text-gray-800">
          <p>{part.name}</p>
        </div>

        {selectedPartVariant ? (
          <div className="w-full flex justify-between items-center text-sm text-gray-600 ">
            <span className="italic">{selectedPartVariant.name}</span>
            <span>{selectedPartVariant.price} kr.</span>
          </div>
        ) : (
          <p className="text-sm text-left italic text-gray-500 mt-1">
            {part.description}
          </p>
        )}
      </button>

      {showVariants && (
        <div className="absolute top-full left-0 w-full z-50 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          {part.variants.map((variant) => (
            <button
              key={variant.id}
              className={`w-full px-4 py-2 text-left text-sm transition-colors duration-100 ${
                selectedPartVariant?.id === variant.id
                  ? 'bg-blue-100 font-medium text-blue-900'
                  : 'hover:bg-blue-50'
              }`}
              type="button"
              onClick={() => {
                toggleVariant(variant);
                setShowVariants(false);
              }}
            >
              <div className="flex justify-between items-center">
                <p>{variant.name}</p>
                <p>{variant.price} kr.</p>
              </div>
              <p className="text-xs italic text-gray-500 mt-1">
                {variant.description}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
