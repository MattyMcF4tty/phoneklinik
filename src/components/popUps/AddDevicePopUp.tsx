// components/popUps/AddDevicePopUp.tsx
'use client';

import { useState } from 'react';
import AddDeviceForm from '../forms/AddDeviceForm';
import DeviceCard from '../cards/ItemCard';
import PopUpWrapper from '../wrappers/PopUpWrapper';

export default function AddDeviceModal({
  brand,
  model,
}: {
  brand: string;
  model?: string;
}) {
  const [open, setOpen] = useState(false);
  console.log('📦 AddDeviceModal received model:', model); // <--- add this

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <DeviceCard itemName="Tilføj enhed" />
      </button>

      {open && (
        <PopUpWrapper>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-3 text-gray-600 text-xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Tilføj ny enhed</h2>
              <AddDeviceForm
                brand={brand}
                model={model} // ✅ pass it down
                onSuccess={() => setOpen(false)}
              />
            </div>
          </div>
        </PopUpWrapper>
      )}
    </>
  );
}
