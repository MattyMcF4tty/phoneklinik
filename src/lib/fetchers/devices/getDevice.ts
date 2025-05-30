import Device from '@/schemas/new/device';

export default async function getDevice(
  query: Partial<Pick<Device, 'id' | 'brand' | 'model' | 'version' | 'type'>>
) {}
