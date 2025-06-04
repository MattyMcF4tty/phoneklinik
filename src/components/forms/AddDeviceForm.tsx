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

  useEffect(() => {
    fetch(`/api/models?brand=${encodeURIComponent(brand)}`)
      .then((res) => res.json())
.then((data) => setModels(data.data || [])) // ✅
      .catch(() => setModels([]));
  }, [brand]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (selectedModel === '__new') {
      formData.set('modelName', newModelName);
    } else {
      formData.set('modelName', selectedModel);
    }

    formData.set('brand', brand);

    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        onSuccess?.();
        router.refresh();
      } else {
        setError(result.message || 'Noget gik galt.');
      }
    } catch (err) {
      console.error(err);
      setError('Uventet fejl.');
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="text-sm text-gray-600">Model</label>
      <select
        required
        className="border p-2 rounded"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option value="">Vælg model</option>
        {models.map((model) => (
          <option key={model.id} value={model.name}>
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
