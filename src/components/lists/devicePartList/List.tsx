'use client';

import React, { FC, useEffect } from 'react';
import PartListRow from './Row';
import useSessionStorage from '@/hooks/useSessionStorage';
import Link from 'next/link';
import Device from '@/schemas/device';
import DevicePart from '@/schemas/devicePart';
import PartVariant from '@/schemas/partVariant';

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
