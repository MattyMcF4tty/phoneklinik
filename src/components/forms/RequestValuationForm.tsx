'use client';

import { valuationRequestAction } from '@/app/saelg-enhed/actions';
import { ActionResponse } from '@/schemas/new/types';
import React, { FC, useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface RequestValuationFormProps {}

const RequestValuationForm: FC<RequestValuationFormProps> = ({}) => {
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

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
      form.reset();
    } catch (err) {
      toast.error('Fejl ved indsendelse.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label className="label-default" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" className="input-default" />
      </div>

      <div>
        <label className="label-default" htmlFor="phoneNumber">
          phoneNumber
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          className="input-default"
        />
      </div>

      <div>
        <label className="label-default" htmlFor="deviceName">
          Enhedens navn
        </label>
        <input
          id="deviceName"
          name="deviceName"
          type="text"
          className="input-default"
        />
      </div>

      <div>
        <label htmlFor="customerNotes" className="label-default">
          Beskrivelse
        </label>
        <textarea
          name="customerNotes"
          id="customerNotes"
          placeholder="Beskriv skaderne for at hjælpe vores teknikere..."
          className="input-default min-h-20"
        />
      </div>

      <div>
        <label className="label-default" htmlFor="frontImage">
          Billede af enhedens forside
        </label>
        <input
          id="frontImage"
          name="frontImage"
          type="file"
          accept="image/*"
          className="input-default"
          required
        />
      </div>

      <div>
        <label className="label-default" htmlFor="rearImage">
          Billede af enhedens bagside
        </label>
        <input
          id="rearImage"
          name="rearImage"
          type="file"
          accept="image/*"
          className="input-default"
          required
        />
      </div>

      <div>
        <label className="label-default" htmlFor="batteryImage">
          Billede af enhedens batteri tilstand
        </label>
        <input
          id="batteryImage"
          name="batteryImage"
          type="file"
          accept="image/*"
          className="input-default"
          required
        />
      </div>

      <button disabled={loading} className="button-highlighted" type="submit">
        Anmod
      </button>
    </form>
  );
};

export default RequestValuationForm;
