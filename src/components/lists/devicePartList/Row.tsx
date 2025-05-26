'use client';

import DevicePart from '@/schemas/new/devicePart';
import PartVariant from '@/schemas/new/partVariant';
import React, { FC, useEffect, useState } from 'react';

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
  const [selectedPartVariant, setSelectedPartVariant] = useState<PartVariant | undefined>(undefined);
  const [showVariants, setShowVariants] = useState(false);

  useEffect(() => {
    const selectedVariant = selectedVariants.find(
      (variant) => variant.partId === part.id
    );
    setSelectedPartVariant(selectedVariant);
  }, [selectedVariants]);

  return (
    <div
      onMouseLeave={() => setShowVariants(false)}
      className="relative w-full"
    >
      <button
        onClick={() => {
          selectedPartVariant
            ? toggleVariant(selectedPartVariant)
            : setShowVariants(!showVariants);
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
          <p className="text-sm text-left italic text-gray-500 mt-1">{part.description}</p>
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
              <p className="text-xs italic text-gray-500 mt-1">{variant.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartListRow;
