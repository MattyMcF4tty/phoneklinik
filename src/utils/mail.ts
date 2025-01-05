import { DevicePartSchema } from '@/schemas/devicePartSchema';
import { DeviceSchema } from '@/schemas/deviceScema';
import { sendMail } from './misc';

export interface bookRepair {
  device: DeviceSchema;
  selectedParts: DevicePartSchema[];
  email: string;
  phone: string;
  name: string;
  comment: string;
  date: string;
  time: string;
  location: string;
}

export const bookRepair = async ({
  device,
  selectedParts,
  email,
  phone,
  name,
  comment,
  date,
  time,
  location,
}: bookRepair) => {
  await sendMail(
    `REPAIR: ${device.model} ${device.version}`,
    `Customer: ${name} has reserved a timeslot at ${location} on ${date} at ${time}.
          Parts needed:
          ${selectedParts
            .map((part) => `- ${part.name}, price of part: ${part.price}kr\n`)
            .join('')}
          Full price of repair: ${selectedParts.reduce(
            (total, part) => total + part.price,
            0
          )}kr
          
          Customer comment:
          "${comment}"
          
          Contact customer:
          Email: ${email}
          Phone: ${phone}
          `
  );
};
