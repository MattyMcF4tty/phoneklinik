// app/reparation/page.tsx   (or wherever this lives)
'use server';

import { NextPage } from 'next';
import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import AddDeviceCard from './components/AddDeviceCard';
import { BrandClient } from '@lib/clients/brandClient';
import { brands } from '@fortawesome/fontawesome-svg-core/import.macro';

const BrandSelectionPage: NextPage = async () => {
  const [deviceBrands, allBrands] = await Promise.all([
    DeviceClient.getUniqueBrands(),
    await BrandClient.query(),
  ]);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <header className="relative h-[26vh] bg-gradient-to-r from-[#0d2d8b] via-[#1661c9] to-[#08a5f4] flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-sm">
          Vælg dit mærke
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
        <AddDeviceCard brands={allBrands} />
        {deviceBrands.map((brand) => (
          <ItemCard
            key={brand.name}
            itemName={brand.name}
            imageUrl={brand.imageUrl}
            href={`/admin/reparation/${brand.name}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BrandSelectionPage;
