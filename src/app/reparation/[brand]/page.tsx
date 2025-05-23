'use server';

import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import { ErrorNotFound } from '@/schemas/errors/appErrorTypes';
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
           <header className="relative h-[26vh] bg-gradient-to-r from-[#0d2d8b] via-[#1661c9] to-[#08a5f4] flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-sm">
Vælg din model.        </h1>

        {/* wave bottom */}
        <svg
          className="absolute bottom-0 w-full h-16 text-gray-50"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,224L60,213.3C120,203,240,181,360,165.3C480,149,600,139,720,149.3C840,160,960,192,1080,208C1200,224,1320,224,1380,224L1440,224V320H0Z"
          />
        </svg>
      </header>
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
