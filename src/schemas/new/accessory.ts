export default interface Accessory {
  id: number;
  name: string;
  brand: string;
  description: string;
  supportedDevices: number[];
  imageUrl: string;
  stock: number;
  price: number;
}
