'use client';

import DevicePart from '@schemas/devicePart';
import RepairBooking from '@schemas/repairBooking';
import React, { FC, useEffect, useState } from 'react';

interface InternalFormProps {
  booking: RepairBooking;
  deviceParts: DevicePart[];
}

const InternalForm: FC<InternalFormProps> = ({ booking, deviceParts }) => {
  const [appliedParts, setAppliedParts] = useState(booking.appliedPartVariants);
  const partVariants = deviceParts.flatMap((part) => part.variants);
  const [actualPrice, setActualPrice] = useState(booking.actualPrice);
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

  const disableUpdate =
    booking.repairStatus === 'repaired' ||
    booking.repairStatus === 'no_show' ||
    booking.repairStatus === 'cancelled';

  const areArraysEqual = (a: number[], b: number[]) =>
    a.length === b.length && a.every((val) => b.includes(val));

  const hasChanges =
    internalNotes !== (booking.internalNotes || '') ||
    repairStatus !== booking.repairStatus ||
    !areArraysEqual(appliedParts, booking.appliedPartVariants);

  return (
    <form className="w-full flex flex-col gap-4">
      <div className="flex flex-row gap-4">
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
        </fieldset>

        <div className="w-full flex flex-col gap-4">
          <label
            htmlFor="actualPrice"
            className="w-full font-medium flex flex-col"
          >
            Aktuel pris af reparation
            <input
              disabled={disableUpdate}
              type="text"
              id="actualPrice"
              name="actualPrice"
              readOnly
              value={`${actualPrice} kr`}
              className="input-default bg-slate-100 font-normal"
            />
          </label>

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
