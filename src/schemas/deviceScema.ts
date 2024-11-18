import DevicePart, { DevicePartSchema } from './devicePartSchema';

export interface DeviceSchema {
  id: number;
  brand: string;
  model: string;
  parts: DevicePartSchema[];
  type: string;
}

export default class Device implements DeviceSchema {
  id: number;
  brand: string;
  model: string;
  parts: DevicePart[];
  type: string;

  constructor(device: DeviceSchema) {
    this.id = device.id;
    this.brand = device.brand;
    this.model = device.model;
    this.parts = device.parts;
    this.type = device.type;
  }
}
