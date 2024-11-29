export interface DevicePartSchema {
  id: number;
  name: string;
  price: number;
  device_id: number;
  inStock: boolean;
}

export default class DevicePart implements DevicePartSchema {
  id: number;
  name: string;
  price: number;
  device_id: number;
  inStock: boolean;

  constructor(devicePart: DevicePartSchema) {
    this.id = devicePart.id;
    this.name = devicePart.name;
    this.price = devicePart.price;
    this.device_id = devicePart.device_id;
    this.inStock = devicePart.inStock;
  }
}
