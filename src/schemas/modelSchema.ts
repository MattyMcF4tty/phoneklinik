export interface ModelSchema {
  id: number;
  name: string;
  brand: string;
  image_url: string;
}

export class Model implements ModelSchema {
  id: number;
  name: string;
  brand: string;
  image_url: string;

  constructor(model: ModelSchema) {
    this.id = model.id;
    this.name = model.name;
    this.brand = model.brand;
    this.image_url = model.image_url;
  }
}
