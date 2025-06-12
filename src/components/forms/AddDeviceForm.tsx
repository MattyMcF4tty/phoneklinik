'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddDeviceForm({
  brand,
  onSuccess,
}: {
  brand: string;
  onSuccess?: () => void;
}) {
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // ✅ Dynamically import server function inside client-safe wrapper
  useEffect(() => {
    async function loadModels() {
      try {
        const { fetchModelsByBrand } = await import(
          '@/app/(pages)/admin/reparation/[brand]/actions'
        );
        const fetchedModels = await fetchModelsByBrand(brand);
        setModels(fetchedModels);
      } catch (err) {
        setError('Kunne ikke hente modeller.');
        console.error(err);
      }
    }

    loadModels();
  }, [brand]);

  return (
    <form className="flex flex-col gap-4">
      <label className="text-sm text-gray-600">Model</label>
      <select
        required
        className="border p-2 rounded"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option value="">Vælg model</option>
        {models.map((model) => (
          <option key={model.name} value={model.name}>
            {model.name}
          </option>
        ))}
        <option value="__new">➕ Tilføj ny model</option>
      </select>

      {selectedModel === '__new' && (
        <input
          required
          type="text"
          name="newModelName"
          placeholder="Nyt modelnavn"
          value={newModelName}
          onChange={(e) => setNewModelName(e.target.value)}
          className="border p-2 rounded"
        />
      )}

      <input
        type="text"
        name="type"
        placeholder="Type (f.eks. tablet, telefon)"
        className="border p-2 rounded"
        required
      />

      <input
        type="date"
        name="releaseDate"
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        name="deviceName"
        placeholder="Enhedsnavn"
        className="border p-2 rounded"
        required
      />

      <input
        type="file"
        name="deviceImage"
        accept="image/*"
        className="border p-2 rounded"
        required
      />

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Opret enhed
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
