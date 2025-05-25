import PartVariant from './partVariant';

export default interface DevicePart {
  id: number;
  name: string;
  deviceId: number;
  description: string;
  variants: PartVariant[];
}
