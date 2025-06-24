'use server';

import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import { NextPage } from 'next';
import { notFound } from 'next/navigation';
import AddDeviceCard from '../components/AddDeviceCard';
import { BrandClient } from '@lib/clients/brandClient';

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

  const [models, allBrands] = await Promise.all([
    DeviceClient.getUniqueModels(formattedBrand),
    await BrandClient.query(),
  ]);

  if (models.length <= 0) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <header className="relative h-[26vh] bg-gradient-to-r from-[#0d2d8b] via-[#1661c9] to-[#08a5f4] flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-sm">
          Vælg din model
        </h1>

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
        <AddDeviceCard defaultDevice={{ brand: brand }} brands={allBrands} />
        {models.map((model) => (
          <ItemCard
            key={model.name}
            itemName={model.name}
            imageUrl={model.imageUrl}
            href={`/admin/reparation/${brand}/${model.name}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelSelectionPage;
