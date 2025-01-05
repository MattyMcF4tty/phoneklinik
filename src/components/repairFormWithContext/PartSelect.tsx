'use client';

import { DevicePartSchema } from '@/schemas/devicePartSchema';
import React, { FC, useEffect, useState } from 'react';
import { useRepairForm } from './RepairFormProvider';
import Device from '@/schemas/deviceScema';

const PartSelect: FC = () => {
  const repairFormData = useRepairForm();

  const currentDevice = repairFormData.device;

  const [deviceParts, setDeviceParts] = useState<DevicePartSchema[]>([]);
  const [priceOfParts, setPriceOfParts] = useState<number>(0);

  useEffect(() => {
    const fetchParts = async () => {
      repairFormData.setLoading(true);
      if (currentDevice) {
        const device = new Device(currentDevice);

        try {
          const currentDeviceParts = await device.fetchParts();
          if (currentDeviceParts) {
            setDeviceParts(currentDeviceParts);
          }
        } catch (error) {
          console.error('Failed to fetch device parts:', error);
        }
      }
      repairFormData.setLoading(false);
    };

    fetchParts();
  }, [currentDevice]);

  const handleFielsetChange = (e: React.ChangeEvent<HTMLFieldSetElement>) => {
    const checkboxes = e.currentTarget.querySelectorAll<HTMLInputElement>(
      'input[name="parts"]:checked'
    );

    // Extract the selected part IDs from the checkboxes
    const selectedIds = Array.from(checkboxes).map(
      (checkbox) => checkbox.value
    );

    // Filter the parts that match the selected IDs
    const selected = deviceParts.filter((part) =>
      selectedIds.includes(part.id.toString())
    );

    // Update the selected parts in the context
    repairFormData.setSelectedParts(selected);

    // Calculate the total price of the selected parts
    const totalPrice = repairFormData.selectedParts.reduce(
      (sum, part) => sum + part.price,
      0
    );
    setPriceOfParts(totalPrice);
  };

  return (
    <div>
      {currentDevice ? (
        <div>
          {repairFormData.loading ? (
            <p>Henter enhedens dele.</p>
          ) : (
            <div>
              <fieldset onChange={handleFielsetChange}>
                {deviceParts.map((part) => (
                  <label
                    key={part.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="">
                      <input
                        type="checkbox"
                        name="parts"
                        value={part.id}
                        className="mr-4 select-none"
                      />
                      <span className="">{part.name}</span>
                    </div>
                    <span className="font-bold">{part.price} kr.</span>
                  </label>
                ))}
              </fieldset>
              <p className="mt-2 mb-10 font-semibold">
                Total pris: {priceOfParts}kr
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">Ingen dele fundet til denne enhed.</p>
      )}
    </div>
  );
};

export default PartSelect;
