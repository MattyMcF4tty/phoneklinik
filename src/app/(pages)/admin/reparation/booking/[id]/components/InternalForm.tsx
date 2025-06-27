'use client';

import DevicePart from '@schemas/devicePart';
import RepairBooking from '@schemas/repairBooking';
import { ActionResponse } from '@schemas/types';
import React, { FC, useActionState, useEffect, useState } from 'react';
import { updateBooking } from '../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface InternalFormProps {
  booking: RepairBooking;
  deviceParts: DevicePart[];
  deviceName: string;
}

const InternalForm: FC<InternalFormProps> = ({
  booking,
  deviceParts,
  deviceName,
}) => {
  const router = useRouter();

  const [appliedParts, setAppliedParts] = useState(booking.appliedPartVariants);
  const partVariants = deviceParts.flatMap((part) => part.variants);
  const [actualPrice, setActualPrice] = useState(booking.actualPrice ?? 0);
  const [internalNotes, setInternalNotes] = useState(
    booking.internalNotes || ''
  );
  const [repairStatus, setRepairStatus] = useState(booking.repairStatus);

  useEffect(() => {
    const total = partVariants
      .filter((variant) => appliedParts.includes(variant.id))
      .reduce((sum, variant) => sum + variant.price, 0);
    setActualPrice(total);
  }, [appliedParts, partVariants]);

  const areArraysEqual = (a: number[], b: number[]) =>
    a.length === b.length && a.every((val) => b.includes(val));

  const hasChanges =
    internalNotes !== (booking.internalNotes || '') ||
    repairStatus !== booking.repairStatus ||
    !areArraysEqual(appliedParts, booking.appliedPartVariants);

  const initalState: ActionResponse<RepairBooking> = {
    success: undefined,
    message: '',
    data: booking,
  };

  const [state, formAction, pending] = useActionState(
    updateBooking,
    initalState
  );

  const disableUpdate =
    booking.repairStatus === 'repaired' ||
    booking.repairStatus === 'no_show' ||
    booking.repairStatus === 'cancelled' ||
    pending;

  useEffect(() => {
    if (pending === true) {
      toast.loading('Opdatere booking...', { id: 'update-booking' });
    } else {
      toast.dismiss('update-booking');

      if (state.success === true) {
        toast.success(state.message || 'Booking opdateret');
        router.refresh();
      } else if (state.success === false) {
        toast.error(state.message || 'Noget gik galt');
      }
    }
  }, [pending, state, router]);

  return (
    <form action={formAction} className="w-full flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <input
          type="hidden"
          name="deviceName"
          id="deviceName"
          defaultValue={deviceName}
        />
        <label
          htmlFor="internalNotes"
          className="w-full font-medium flex flex-col"
        >
          Noter
          <textarea
            disabled={disableUpdate}
            id="internalNotes"
            name="internalNotes"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className="input-default min-h-40 w-full bg-slate-100 font-normal rounded-md"
          />
        </label>

        <fieldset className="w-full font-medium flex flex-col">
          <legend>Påsatte dele</legend>
          <div className="flex flex-col gap-1 p-2 rounded-md">
            {partVariants.map((variant) => {
              const isChecked = appliedParts.includes(variant.id);
              return (
                <label
                  key={variant.id}
                  className="flex items-center gap-2 hover:bg-slate-100"
                >
                  <input
                    disabled={disableUpdate}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setAppliedParts((prev) =>
                        isChecked
                          ? prev.filter((id) => id !== variant.id)
                          : [...prev, variant.id]
                      );
                    }}
                  />
                  {variant.name} ({variant.price} kr)
                </label>
              );
            })}
          </div>
          {appliedParts.map((part) => (
            <input
              key={part}
              type="hidden"
              name="appliedPart"
              id="appliedPart"
              value={part}
            />
          ))}
        </fieldset>

        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col">
            <p className="w-full font-medium ">
              Faktisk pris for reparationen (uden moms)
            </p>
            <p>{actualPrice} kr.</p>
            <input
              type="hidden"
              name="actualPrice"
              id="actualPrice"
              value={actualPrice}
            />
          </div>

          <label
            htmlFor="repairStatus"
            className="w-full font-medium flex flex-col"
          >
            Reparations status
            <select
              disabled={disableUpdate}
              name="repairStatus"
              id="repairStatus"
              value={repairStatus}
              onChange={(e) =>
                setRepairStatus(e.target.value as RepairBooking['repairStatus'])
              }
              className="font-normal"
            >
              <option value="pending" disabled hidden>
                Afventer
              </option>
              <option value="repairing">Under reparation</option>
              <option value="repaired">Repareret</option>
              <option value="queued">I kø</option>
              <option value="cancelled">Annulleret</option>
              <option value="no_show">Ikke fremmødt</option>
            </select>
          </label>
        </div>
      </div>
      {hasChanges && !disableUpdate && (
        <button type="submit" className="button-highlighted">
          Gem ændringer
        </button>
      )}
    </form>
  );
};

export default InternalForm;
