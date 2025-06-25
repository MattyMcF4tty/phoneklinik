'use client';

import DevicePart from '@schemas/devicePart';
import React, { FC, useState } from 'react';
import PartVariantList from '../partVariantList/List';
import UpdatePartButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/UpdatePartButton';
import DeletePartButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/DeletePartButton';

interface AdminPartListRowProps extends React.HTMLAttributes<HTMLLIElement> {
  devicePart: DevicePart;
}

const AdminPartListRow: FC<AdminPartListRowProps> = ({
  devicePart,
  ...rest
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <li {...rest}>
      <div
        className="flex flex-col pb-4 border-b border-slate-300 gap-2"
        onMouseOver={() => setShowSettings(true)}
        onMouseLeave={() => setShowSettings(false)}
      >
        <span className="font-semibold">{devicePart.name}</span>
        {devicePart.description !== '' ? (
          <span className="text-subtle">{devicePart.description}</span>
        ) : (
          <span className="text-red-500 italic">Mangler beskrivelse!</span>
        )}
        {showSettings && (
          <div className="flex flex-row w-full gap-2">
            <UpdatePartButton
              deviceId={devicePart.deviceId}
              part={devicePart}
            />

            <DeletePartButton part={devicePart} />
          </div>
        )}
      </div>

      <PartVariantList
        className="flex flex-col gap-2"
        partId={devicePart.id}
        variants={devicePart.variants}
      />
    </li>
  );
};

export default AdminPartListRow;
