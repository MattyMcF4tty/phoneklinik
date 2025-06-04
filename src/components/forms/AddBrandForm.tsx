'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddBrandForm({ onSuccess }: { onSuccess?: () => void }) {
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onSuccess?.(); // close modal
        router.refresh(); // refresh to show new brand
      } else {
        setError(result.message || 'Noget gik galt.');
      }
    } catch (err) {
      console.error('Error uploading brand:', err);
      setError('Fejl ved upload.');
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="brandName"
        placeholder="Brandnavn"
        className="border p-2 rounded"
        required
      />
      <input
        type="file"
        name="brandImage"
        accept="image/*"
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Submit
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
