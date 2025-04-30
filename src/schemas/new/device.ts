import DevicePart from '../devicePartSchema';

export default interface Device {
  id: number;
  brand: string;
  model: string;
  version: string;
  type: string;
  release_date: Date;
  parts: DevicePart[] | null;
}
