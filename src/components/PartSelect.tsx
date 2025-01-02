import { DevicePartSchema } from '@/schemas/devicePartSchema';
import React, { FC } from 'react';

interface PartSelectProps {
  parts: DevicePartSchema[];
}

const PartSelect: FC<PartSelectProps> = ({ parts }) => {
  return <div>PartSelect</div>;
};

export default PartSelect;
