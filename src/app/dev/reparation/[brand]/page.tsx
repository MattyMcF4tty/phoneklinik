'use server';

import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import AppError from '@/schemas/errors/appError';
import { NextPage } from 'next';
import { notFound } from 'next/navigation';

interface ModelSelectionPageProps {
  params: Promise<{
    brand: string;
  }>;
}

const ModelSelectionPage: NextPage<ModelSelectionPageProps> = async ({
  params,
}) => {
  const { brand } = await params;
  const formattedBrand = decodeURIComponent(brand);

  let models: {
    name: string;
    imageUrl: string;
  }[];

  try {
    models = await DeviceClient.getUniqueModels(formattedBrand);
    if (models.length <= 0) {
      notFound();
    }
  } catch (err) {
    if (err instanceof AppError && err.httpCode === 404) {
      notFound();
    }

    throw err;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h1>Repair Page</h1>
      <div className="flex flex-wrap justify-evenly gap-8 ">
        {models.map((model) => (
          <ItemCard
            key={model.name}
            itemName={model.name}
            imageUrl={model.imageUrl}
            href={`/dev/reparation/${brand}/${model.name}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelSelectionPage;
