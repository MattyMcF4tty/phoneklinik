'use client';

import DevicePart from '@/schemas/new/devicePart';
import React, { FC } from 'react';

interface PartListRowProps {
  part: DevicePart;
  selected: boolean;
  onClick: () => void;
}

const PartListRow: FC<PartListRowProps> = ({ part, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`min-h-10 flex w-full flex-row justify-between p-2 rounded-sm border ${
        selected
          ? 'border-slate-400 font-medium'
          : 'bg-white border-transparent hover:bg-slate-100'
      }`}
    >
      <div className="flex flex-col items-start">
        <p>{part.name}</p>
        <span className="text-sm italic text-gray-500">{part.description}</span>
      </div>
      <p>{part.price} kr.</p>
    </button>
  );
};

export default PartListRow;
