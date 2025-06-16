'use client';

import Brand from '@schemas/brand';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'sonner';

interface UpdateAccessoryProps {
  brands: Brand[];
  types: string[];
}

const AddAccessoryForm: FC<UpdateAccessoryProps> = ({ brands, types }) => {
  const router = useRouter();
  const [showCustomType, setShowCustomType] = useState(false);
  const [supportedDevices, setSupportedDevices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();

    const form = e.currentTarget;
    console.log(form);
    const formData = new FormData(form);

    formData.append('supportedDevices', JSON.stringify(supportedDevices));

    try {
      const res = await fetch('/api/devices/valuation', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || 'Noget gik galt...');
        return;
      }

      toast.success(result.message || 'Valuering sendt!');
    } catch (err: unknown) {
      console.error('Unexpected error sending valuation request:', err);
      toast.error('Fejl ved indsendelse.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={(e) => handleSubmit}
      className="w-full h-full flex flex-col gap-8"
    ></form>
  );
};

export default AddAccessoryForm;
