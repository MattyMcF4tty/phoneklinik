export interface DevicePartSchema {
  id: number;
  name: string;
  price: number;
  deviceId: number;
  inStock: boolean;
}

export default class DevicePart implements DevicePartSchema {
  id: number;
  name: string;
  price: number;
  deviceId: number;
  inStock: boolean;

  constructor(devicePart: DevicePartSchema) {
    this.id = devicePart.id;
    this.name = devicePart.name;
    this.price = devicePart.price;
    this.deviceId = devicePart.deviceId;
    this.inStock = devicePart.inStock;
  }
}
