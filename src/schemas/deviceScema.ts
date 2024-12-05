import DevicePart from './devicePartSchema';

export interface DeviceSchema {
  id: number;
  brand: string;
  model: string;
  version: string;
  type: string;
  image_url: string;
}

export default class Device implements DeviceSchema {
  id: number;
  brand: string;
  model: string;
  version: string;
  parts: DevicePart[] | null = null;
  type: string;
  image_url: string;

  constructor(device: DeviceSchema) {
    this.id = device.id;
    this.brand = device.brand;
    this.model = device.model;
    this.version = device.version;
    this.type = device.type;
    this.image_url = device.image_url;
  }

  async fetchParts() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/devices/${this.id}/parts`,
      {
        method: 'GET',
        cache: 'no-cache',
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.error);
    }

    const parts = responseData.data;
    this.parts = parts;

    return this.parts;
  }
}
