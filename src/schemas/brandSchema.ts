export interface BrandSchema {
  id: number;
  name: string;
  image_url: string;
}

export class Brand implements BrandSchema {
  id: number;
  name: string;
  image_url: string;

  constructor(brand: BrandSchema) {
    this.id = brand.id;
    this.name = brand.name;
    this.image_url = brand.image_url;
  }

  toPlainObject(): BrandSchema {
    return {
      id: this.id,
      name: this.name,
      image_url: this.image_url,
    };
  }
}
