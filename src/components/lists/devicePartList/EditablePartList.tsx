'use client';

import { addVariant, updatePart, updateVariant } from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/actions';
import { useState } from 'react';

export default function EditablePartList({ deviceId, parts }: { deviceId: number; parts: any[] }) {
  return (
    <div className="content-box p-4">
      <h2 className="text-lg font-medium mb-2">Parts</h2>
      <div className="flex flex-col gap-4">
        {parts.map((part) => (
  <div key={part.id} className="border rounded p-3 bg-gray-50">
    <PartEditRow part={part} />

    <div className="ml-4 mt-2 flex flex-col gap-2">
      {part.variants.map((variant: any) => (
        <VariantEditRow key={variant.id} variant={variant} partId={part.id} />
      ))}

      {/* ✅ INSERT HERE */}
      <AddVariantForm partId={part.id} />
    </div>
  </div>
))}

      </div>
    </div>
  );
}

function PartEditRow({ part }: { part: any }) {
  const [name, setName] = useState(part.name);

  return (
    <form action={updatePart} className="flex gap-2 items-center">
      <input type="hidden" name="id" value={part.id} />
      <input
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <button type="submit" className="btn">💾 Gem navn</button>
    </form>
  );
}
function VariantEditRow({ variant, partId }: { variant: any; partId: number }) {
  const [name, setName] = useState(variant.name);
  const [price, setPrice] = useState(variant.price);

  return (
    <form action={updateVariant} className="flex gap-2 items-center">
      <input type="hidden" name="partId" value={partId} />
      <input type="hidden" name="variantId" value={variant.id} />

      <input
        name="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 w-48 rounded"
      />

      <input
        name="price"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border px-2 py-1 w-24 rounded"
      />
      <button type="submit" className="btn">💾 Gem</button>
    </form>
  );
}

function AddVariantForm({ partId }: { partId: number }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  return (
    <form action={addVariant} className="flex gap-2 items-center mt-2">
      <input type="hidden" name="partId" value={partId} />

      <input
        name="name"
        placeholder="Ny variant navn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-2 py-1 w-48 rounded"
      />

      <input
        name="price"
        type="number"
        placeholder="Pris"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border px-2 py-1 w-24 rounded"
      />

      <button type="submit" className="btn">➕ Tilføj</button>
    </form>
  );
}


