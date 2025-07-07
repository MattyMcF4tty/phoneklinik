'use client';

import React, { FC, useState } from 'react';
import { toast } from 'sonner';

const RequestValuationForm: FC = () => {
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
    } catch (err: unknown) {
      console.error('Unexpected error sending valuation request:', err);
      toast.error('Fejl ved indsendelse.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="gap-3 flex flex-col" onSubmit={handleFormSubmit}>
      <div>
        <label className="label-default" htmlFor="firstName">
          Fornavn
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          className="input-default"
          required
        />
      </div>

      <div>
        <label className="label-default" htmlFor="lastName">
          Efternavn
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          className="input-default"
          required
        />
      </div>

      <div>
        <label className="label-default" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input-default"
          required
        />
      </div>

      <div>
        <label className="label-default" htmlFor="phoneNumber">
          Telefonnummer (valgfrit)
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          className="input-default"
        />
      </div>

      <div>
        {/* The deviceLabel is called so because Chrome autocomplete is annoying AF!!!!! 
            Don't change it to name instead of label                                    */}
        <label className="label-default" htmlFor="deviceLabel">
          Enhed
        </label>

        <input
          id="deviceLabel"
          name="deviceLabel"
          type="text"
          className="input-default"
          required
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
          required
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
