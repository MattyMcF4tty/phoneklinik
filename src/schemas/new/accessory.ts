export default interface Accessory {
  name: string;
  brand: string;
  referenceDeviceId: number | null;
  imageUrl: string;
  stock: number;
  price: number;
}
