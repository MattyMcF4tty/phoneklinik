import { Model, ModelSchema } from '@/schemas/modelSchema';

export const getModels = async (brand: string): Promise<Model[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/models?brand=${brand}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error);
  }

  const modelsData = responseData.data;

  const models = modelsData.map((modelData: ModelSchema) => {
    return new Model(modelData);
  });

  return models;
};
