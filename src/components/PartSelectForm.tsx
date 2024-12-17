'use client';

import { DevicePartSchema } from '@/schemas/devicePartSchema';
import React, { FC, useState } from 'react';
import PartialOrderRepair from './PartialOrderRepair';
import { DeviceSchema } from '@/schemas/deviceScema';

interface PartSelectFormProps {
  device: DeviceSchema;
  parts: DevicePartSchema[];
  header: string;
}

const PartSelectForm: FC<PartSelectFormProps> = ({ device, parts, header }) => {
  const [selectedParts, setSelectedParts] = useState<DevicePartSchema[]>([]);

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);

    // Get selected part IDs from the form data
    const selectedIds = formData.getAll('parts') as string[];

    // Update the selected parts state based on selected IDs
    const selected = parts.filter((part) =>
      selectedIds.includes(part.id.toString())
    );
    setSelectedParts(selected);
  };

  const fullPrice = selectedParts.reduce(
    (total, part) => total + part.price,
    0
  );

  return (
    <div className="h-full w-full flex flex-col justify-center md:flex md:flex-row">
      <div className='md:w-1/5 mt-4'>
      <form onChange={handleFormChange}>
        {parts.length > 0 ? (
          <div className="flex flex-col space-y-4">
                  <h1 className='text-xl font-bold mb-6'>{header}</h1>

            {parts.map((part) => (
              
              <label
                key={part.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className=''>
                <input
                  type="checkbox"
                  name="parts"
                  value={part.id}
                  className="mr-4 select-none"
                />
                <span className=''>{part.name}</span>
                </div>
                <span className="font-bold">{part.price} kr.</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Ingen dele fundet til denne enhed.</p>
        )}
      </form>
      <p className='mt-2 mb-10'>Total pris: {fullPrice}kr</p>
      </div>
      <div className='md:ml-10'>

      <PartialOrderRepair device={device} selectedParts={selectedParts} />
      </div>
    </div>
  );
};

export default PartSelectForm;
