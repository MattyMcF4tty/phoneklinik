export default interface Device {
  id: number;
  brand: string;
  model: string;
  version: string;
  type: string;
  releaseDate: Date;
  imageUrl: string;
}
