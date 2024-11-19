import DevicePart, { DevicePartSchema } from './devicePartSchema';

export interface DeviceSchema {
  id: number;
  brand: string;
  model: string;
  parts: DevicePartSchema[] | null;
  type: string;
}

export default class Device implements DeviceSchema {
  id: number;
  brand: string;
  model: string;
  parts: DevicePart[] | null;
  type: string;

  constructor(device: DeviceSchema) {
    this.id = device.id;
    this.brand = device.brand;
    this.model = device.model;
    this.parts = device.parts;
    this.type = device.type;
  }

  async fetchParts() {
    const response = await fetch(`/api/devices/${this.id}/parts`, {
      method: 'GET',
      cache: 'no-cache',
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.error);
    }

    const parts = responseData.data;
    this.parts = parts;

    return this.parts;
  }
}
