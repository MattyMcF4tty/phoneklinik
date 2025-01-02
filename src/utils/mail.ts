import { DevicePartSchema } from '@/schemas/devicePartSchema';
import { DeviceSchema } from '@/schemas/deviceScema';

interface bookRepair {
  device: DeviceSchema;
  selectedParts: DevicePartSchema[];
  email: string;
  phone: string;
  name: string;
  comment: string;
  timeSlot: Date;
}

export const bookRepair = async () => {};
