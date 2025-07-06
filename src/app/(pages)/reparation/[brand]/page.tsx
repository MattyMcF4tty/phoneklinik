'use server';

import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import { ErrorNotFound } from '@/schemas/errors/appErrorTypes';
import WaveHeader from '@components/headers/WaveHeader';
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
    if (err instanceof ErrorNotFound) {
      notFound();
    }

    throw err;
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <WaveHeader title="Vælg din model" />

      <div className="flex flex-wrap justify-evenly gap-8 ">
        {models.map((model) => (
          <ItemCard
            key={model.name}
            itemName={model.name}
            imageUrl={model.imageUrl}
            href={`/reparation/${brand}/${model.name}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelSelectionPage;
