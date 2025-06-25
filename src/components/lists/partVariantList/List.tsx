'use client';

import PartVariant from '@schemas/partVariant';
import React, { FC, useState } from 'react';
import PartVariantListRow from './Row';
import AddVariantButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/AddVariantButton';
import DevicePart from '@schemas/devicePart';

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
