export default interface Accessory {
  id: number;
  name: string;
  brand: string;
  description: string;
  supportedDevices: string[];
  price: number;
  type: string;
  imageUrl: string;
}
