export interface BrandSchema {
  id: number;
  name: string;
  iconUrl: string;
}

export class Brand implements BrandSchema {
  id: number;
  name: string;
  iconUrl: string;

  constructor(brand: BrandSchema) {
    this.id = brand.id;
    this.name = brand.name;
    this.iconUrl = brand.iconUrl;
  }
}
