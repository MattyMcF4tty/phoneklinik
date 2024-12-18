import { getBaseUrl } from '@/utils/misc';
import { DevicePartSchema } from './devicePartSchema';

export interface DeviceSchema {
  id: number;
  brand: string;
  model: string;
  version: string;
  type: string;
  image_url: string;
  release_date: string;
}

export default class Device {
  id: number;
  brand: string;
  model: string;
  version: string;
  parts: DevicePartSchema[] | null = null;
  type: string;
  image_url: string;
  release_date: Date;

  constructor(device: DeviceSchema) {
    this.id = device.id;
    this.brand = device.brand;
    this.model = device.model;
    this.version = device.version;
    this.type = device.type;
    this.image_url = device.image_url;
    this.release_date = new Date(device.release_date);
  }

  async fetchParts() {
    const response = await fetch(
      `${getBaseUrl()}/api/devices/${this.id}/parts`,
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

  toPlainObject(): {
    deviceData: DeviceSchema;
    partsData: DevicePartSchema[] | null;
  } {
    return {
      deviceData: {
        id: this.id,
        brand: this.brand,
        image_url: this.image_url,
        model: this.model,
        release_date: this.release_date.toDateString(),
        type: this.type,
        version: this.version,
      },
      partsData: this.parts ? this.parts : null,
    };
  }
}
