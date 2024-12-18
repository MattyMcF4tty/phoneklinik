import { Brand, BrandSchema } from '@/schemas/brandSchema';

export const getBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`/api/brands`, {
    method: 'GET',
    cache: 'no-cache',
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error);
  }

  const brandsData = responseData.data;

  const brands = brandsData.map((brandData: BrandSchema) => {
    return new Brand(brandData);
  });

  return brands;
};

//TODO: Create function
export const insertBrand = async (): Promise<boolean> => {
  return true;
};
