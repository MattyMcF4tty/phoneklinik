'use client';

import DevicePart from '@schemas/devicePart';
import React, { FC, useState } from 'react';
import AdminPartListRow from './Row';
import AddPartButton from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/AddPartButton';

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
