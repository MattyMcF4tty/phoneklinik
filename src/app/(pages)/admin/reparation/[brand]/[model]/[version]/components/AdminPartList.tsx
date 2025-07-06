'use client';

import DevicePart from '@schemas/devicePart';
import React, { FC, useState } from 'react';
import AddPartButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/AddPartButton';
import DeletePartButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/DeletePartButton';
import UpdatePartButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/UpdatePartButton';
import PartVariantList from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/PartVariantList';

/* --- LIST --- */
interface AdminDevicePartListProps
  extends React.HTMLAttributes<HTMLUListElement> {
  parts: DevicePart[];
  deviceId: number;
}

const AdminPartList: FC<AdminDevicePartListProps> = ({
  parts,
  deviceId,
  ...rest
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ul
      {...rest}
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
      {parts.map((part) => (
        <AdminPartListRow
          className="rounded-md border border-slate-300 w-full p-2 mb-2 flex flex-col gap-4"
          key={part.id}
          devicePart={part}
        />
      ))}
      {showSettings && <AddPartButton deviceId={deviceId} />}
    </ul>
  );
};

export default AdminPartList;

/* --- ROW --- */
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
