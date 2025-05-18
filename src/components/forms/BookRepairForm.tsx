'use client';

import bookRepair from '@/app/reparation/[brand]/[model]/[version]/booking/actions';
import { useSearchParams } from 'next/navigation';
import React, { FC, useState } from 'react';

interface BookRepairFormProps {}

const BookRepairForm: FC<BookRepairFormProps> = () => {
  const searchParams = useSearchParams();
  const brokenParts = searchParams.getAll('brokenParts');

  const [selectedDate, setSelectedDate] = useState<string>('');
  const availabeSlots = ['17:30', '20:30', '12:23', '21:12'];

  const validatedParts = brokenParts.flatMap((part) => {
    const partId = Number(part);
    return Number.isInteger(partId) ? [partId] : [];
  });

  return (
    <form className="w-full h-full bg-transparent flex flex-col items-center">
      <div className="w-full flex flex-col mb-4 gap-4">
        <div className="w-full flex flex-row gap-4">
          <div className="w-1/2 flex flex-col">
            <label htmlFor="firstName" className="label-default">
              Fornavn
            </label>
            <input
              name="firstName"
              id="firstName"
              type="text"
              className="input-default"
              required
            />
          </div>

          <div className="w-1/2 flex flex-col">
            <label htmlFor="lastName" className="label-default">
              Efternavn
            </label>
            <input
              name="lastName"
              id="lastName"
              type="text"
              className="input-default"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="label-default">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            className="input-default"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="label-default">
            Telefon
          </label>
          <input
            name="phone"
            id="phone"
            type="tel"
            className="input-default"
            required
          />
        </div>

        <div className="w-full flex flex-row gap-4">
          <div className="flex flex-col w-1/2">
            <label htmlFor="bookingDate" className="label-default">
              Vælg dag
            </label>
            <input
              name="bookingDate"
              className="input-default"
              type="date"
              required
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col w-1/2">
            <label htmlFor="bookingTime" className="label-default">
              Vælg tid
            </label>
            <select
              required
              name="bookingTime"
              className="input-default"
              disabled={!selectedDate}
            >
              {availabeSlots.map((slot) => (
                <option key={slot} className="bg-white" value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
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

        <input
          type="hidden"
          name="deviceId"
          id="deviceId"
          defaultValue={/* deviceId */ ''}
        />
        {validatedParts.length > 0 &&
          validatedParts.map((partId) => (
            <input
              type="hidden"
              name="partIds"
              id="partIds"
              defaultValue={partId}
              key={partId}
            />
          ))}
      </div>
      <button formAction={bookRepair} className="button-highlighted">
        Book reparation
      </button>
    </form>
  );
};

export default BookRepairForm;
