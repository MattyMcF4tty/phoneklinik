'use client';

import { useState } from 'react';
import AddBrandForm from '../forms/AddBrandForm';
import BrandCard from '../cards/BrandCard';
import PopUpWrapper from '../wrappers/PopUpWrapper';

export default function AddBrandModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <BrandCard itemName="Tilføj mærke" />{' '}
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
              <h2 className="text-xl font-bold mb-4">Tilføj nyt mærke</h2>
              <AddBrandForm onSuccess={() => setOpen(false)} />
            </div>
          </div>
        </PopUpWrapper>
      )}
    </>
  );
}
