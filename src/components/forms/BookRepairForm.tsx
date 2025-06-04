'use client';

import bookRepair from '@/app/(pages)/reparation/[brand]/[model]/[version]/booking/actions';
import useSessionStorage from '@/hooks/useSessionStorage';
import Device from '@/schemas/device';
import DevicePart from '@/schemas/devicePart';
import { ActionResponse } from '@/schemas/types';

import React, { FC, useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BookRepairFormProps {
  deviceName: Pick<Device, 'brand' | 'model' | 'version'>;
}

const BookRepairForm: FC<BookRepairFormProps> = ({ deviceName }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedParts] = useSessionStorage<DevicePart[]>(
    `${deviceName.brand}_${deviceName.model}_${deviceName.version}_parts`,
    []
  );
  const [deviceId] = useSessionStorage<number | undefined>(
    `${deviceName.brand}_${deviceName.model}_${deviceName.version}_id`,
    undefined
  );

  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const response = await fetch(
          `/api/repair-bookings/available?date=${selectedDate}`
        );
        const responseJson = await response.json();

        if (!response.ok) {
          throw new Error(responseJson.error);
        }

        setAvailableSlots(responseJson.data || []);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Noget gik galt';
        toast.error(errorMessage);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const initialState: ActionResponse = {
    success: undefined,
    message: '',
  };

  const [state, formAction] = useActionState(bookRepair, initialState);

  useEffect(() => {
    if (state.success === true) {
      toast.success('Reparation booket!');
    } else if (state.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="w-full h-full bg-transparent flex flex-col items-center"
    >
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
              {loadingSlots ? (
                <option className="bg-white" disabled>
                  Henter tider...
                </option>
              ) : availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <option key={slot} className="bg-white" value={slot}>
                    {slot.slice(0, 5)}
                  </option>
                ))
              ) : (
                <option className="bg-white" disabled>
                  Ingen tider fundet
                </option>
              )}
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
          defaultValue={deviceId}
        />
        {selectedParts.length > 0 &&
          selectedParts.map((part) => (
            <input
              type="hidden"
              name="partIds"
              id="partIds"
              defaultValue={part.id}
              key={part.id}
            />
          ))}
      </div>
      <button className="button-highlighted">Book reparation</button>
    </form>
  );
};

export default BookRepairForm;
