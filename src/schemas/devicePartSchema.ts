export interface DevicePartSchema {
  part: string;
  price: number;
}

export default class DevicePart implements DevicePartSchema {
  part: string;
  price: number;

  constructor(devicePart: DevicePartSchema) {
    this.part = devicePart.part;
    this.price = devicePart.price;
  }
}
