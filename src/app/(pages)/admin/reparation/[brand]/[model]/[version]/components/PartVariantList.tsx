'use client';

import PartVariant from '@schemas/partVariant';
import React, { FC, useState } from 'react';
import AddVariantButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/AddVariantButton';
import DevicePart from '@schemas/devicePart';
import DeleteVariantButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/DeleteVariantButton';
import UpdateVariantButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/UpdateVariantButton';

/* --- LIST --- */
interface PartVariantListProps extends React.HTMLAttributes<HTMLUListElement> {
  partId: DevicePart['id'];
  variants: PartVariant[];
}

const PartVariantList: FC<PartVariantListProps> = ({
  partId,
  variants,
  ...rest
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ul
      {...rest}
      onMouseOver={(e) => {
        setShowSettings(true);
        if (rest.onMouseOver) {
          rest.onMouseOver(e);
        }
      }}
      onMouseLeave={(e) => {
        setShowSettings(false);
        if (rest.onMouseLeave) {
          rest.onMouseLeave(e);
        }
      }}
    >
      {variants.map((variant) => (
        <PartVariantListRow
          key={variant.id}
          className="bg-slate-200 rounded-md p-2 text-sm italic w-full flex flex-col gap-2"
          variant={variant}
        />
      ))}
      {showSettings && <AddVariantButton partId={partId} />}
    </ul>
  );
};

export default PartVariantList;

/* --- ROW --- */
interface PartVariantListRowProps extends React.HTMLAttributes<HTMLLIElement> {
  variant: PartVariant;
}

const PartVariantListRow: FC<PartVariantListRowProps> = ({
  variant,
  ...rest
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <li
      {...rest}
      onMouseOver={(e) => {
        setShowSettings(true);
        if (rest.onMouseOver) {
          rest.onMouseOver(e);
        }
      }}
      onMouseLeave={(e) => {
        setShowSettings(false);
        if (rest.onMouseLeave) {
          rest.onMouseLeave(e);
        }
      }}
    >
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1">
          <p className="font-semibold">{variant.name}</p>
          {variant.description !== '' ? (
            <p className="text-xs text-gray-400">{variant.description}</p>
          ) : (
            <p className=" text-red-500">Mangler beskrivelse!</p>
          )}
        </div>
        <p>{variant.price} kr</p>
      </div>

      {showSettings && (
        <div className="flex flex-row w-full gap-2">
          <UpdateVariantButton variant={variant} />
          <DeleteVariantButton variant={variant} />
        </div>
      )}
    </li>
  );
};
