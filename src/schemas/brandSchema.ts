export interface BrandSchema {
  id: number;
  name: string;
}

export class Brand implements BrandSchema {
  id: number;
  name: string;

  constructor(brand: BrandSchema) {
    this.id = brand.id;
    this.name = brand.name;
  }
}
