'use server';

import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import { NextPage } from 'next';

interface ModelSelectionPageProps {
  params: Promise<{
    brand: string;
  }>;
}

const ModelSelectionPage: NextPage<ModelSelectionPageProps> = async ({
  params,
}) => {
  const { brand } = await params;
  const models = await DeviceClient.getUniqueModels(brand);
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
