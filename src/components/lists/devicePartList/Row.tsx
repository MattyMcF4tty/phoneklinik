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
  const [selectedPartVariant, setSelectedPartVariant] = useState<
    PartVariant | undefined
  >(undefined);

  const [showVariants, setShowVariants] = useState(false);

  useEffect(() => {
    const selectedVariant = selectedVariants.find(
      (variant) => variant.partId === part.id
    );
    if (selectedVariant) {
      setSelectedPartVariant(selectedVariant);
    } else {
      setSelectedPartVariant(undefined);
    }
  }, [selectedVariants, setSelectedPartVariant]);

  return (
    <div
      onMouseLeave={() => setShowVariants(false)}
      className="relative h-10 w-full justify-between rounded-sm flex flex-col "
    >
      <button
        onClick={() => {
          selectedPartVariant
            ? toggleVariant(selectedPartVariant)
            : setShowVariants(!showVariants);
        }}
        type="button"
        className={`flex flex-col items-start hover:bg-slate-100 w-full h-10 justify-center border p-2 ${
          selectedPartVariant
            ? 'border-slate-400 font-medium'
            : 'bg-white border-transparent'
        }`}
      >
        <div className="w-full flex justify-between items-center">
          <p>{part.name}</p>
        </div>
        {selectedPartVariant ? (
          <span className="text-sm italic text-gray-500 flex items-center justify-between w-full">
            <p>{selectedPartVariant.name}</p>
            <p>{selectedPartVariant.price} kr.</p>
          </span>
        ) : (
          <span className="text-sm italic text-gray-500 w-full flex justify-start">
            {part.description}
          </span>
        )}
      </button>
      {showVariants && (
        <div className="absolute top-full left-0 w-full z-50 bg-white shadow-md">
          {part.variants.map((variant) => (
            <button
              key={variant.id}
              className={`w-full px-4 py-2 text-left border ${
                selectedPartVariant?.id === variant.id
                  ? 'bg-slate-100 font-medium border-slate-400'
                  : 'bg-white hover:bg-slate-50 border-transparent'
              }`}
              type="button"
              onClick={() => {
                toggleVariant(variant);
                setShowVariants(false);
              }}
            >
              <div className="w-full flex justify-between items-center h-full">
                <p>{variant.name}</p>
                <p>{variant.price}</p>
              </div>
              <span className="text-sm italic text-gray-500 w-full flex justify-start">
                {variant.description}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartListRow;
