export interface AccessorySchema {
  id: number;
  name: string;
  price: number;
  supported_devices: string[];
  description: string;
}

export class Accessory implements AccessorySchema {
  id: number;
  name: string;
  price: number;
  supported_devices: string[];
  description: string;

  constructor(accessory: AccessorySchema) {
    this.id = accessory.id;
    this.name = accessory.name;
    this.price = accessory.price;
    this.supported_devices = accessory.supported_devices;
    this.description = accessory.description;
  }
}
