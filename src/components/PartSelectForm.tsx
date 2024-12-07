'use client';

import { DevicePartSchema } from '@/schemas/devicePartSchema';
import React, { FC, useState } from 'react';
import PartialOrderRepair from './PartialOrderRepair';
import { DeviceSchema } from '@/schemas/deviceScema';

interface PartSelectFormProps {
  device: DeviceSchema;
  parts: DevicePartSchema[];
}

const PartSelectForm: FC<PartSelectFormProps> = ({ device, parts }) => {
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
    <div className="h-full w-full">
      <form onChange={handleFormChange}>
        {parts.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {parts.map((part) => (
              <label
                key={part.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <input
                  type="checkbox"
                  name="parts"
                  value={part.id}
                  className="mr-2 select-none	"
                />
                <span>{part.name}</span>
                <span className="font-bold">{part.price} kr.</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Ingen dele fundet til denne enhed.</p>
        )}
      </form>
      <p>Sammenlagt pris: {fullPrice}kr</p>

      <PartialOrderRepair device={device} selectedParts={selectedParts} />
    </div>
  );
};

export default PartSelectForm;
