'use client';

import DevicePart from '@/schemas/new/devicePart';
import React, { FC, useEffect } from 'react';
import PartListRow from './Row';
import Device from '@/schemas/new/device';
import useSessionStorage from '@/hooks/useSessionStorage';
import Link from 'next/link';

interface PartListProps {
  device: Device;
  parts: DevicePart[];
}

const PartList: FC<PartListProps> = ({ device, parts }) => {
  const [selectedParts, setSelectedParts] = useSessionStorage<DevicePart[]>(
    `${device.brand}_${device.model}_${device.version}_parts`,
    []
  );

  const combinedPartsPrice = selectedParts.reduce(
    (sum, part) => sum + part.price,
    0
  );

  const togglePart = (part: DevicePart) => {
    const exists = selectedParts.some((p) => p.id === part.id);
    if (exists) {
      setSelectedParts(selectedParts.filter((p) => p.id !== part.id));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full border-b flex flex-col gap-1 pb-2 mb-2">
        {parts.map((part) => (
          <PartListRow
            key={part.id}
            part={part}
            selected={selectedParts.some((p) => p.id === part.id)}
            onClick={() => togglePart(part)}
          />
        ))}
      </div>

      <div className="w-full flex justify-between mb-2">
        <p className="">Pris</p>
        <p className="">{combinedPartsPrice} kr.</p>
      </div>

      {selectedParts.length > 0 && (
        <Link
          href={`/reparation/${device.brand}/${device.model}/${device.version}/booking`}
          className="button-highlighted"
        >
          Book reparation
        </Link>
      )}
    </div>
  );
};

export default PartList;
