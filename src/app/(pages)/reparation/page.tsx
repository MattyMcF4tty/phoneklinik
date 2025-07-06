// app/reparation/page.tsx   (or wherever this lives)
'use server';

import { NextPage } from 'next';
import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import WaveHeader from '@components/headers/WaveHeader';

const BrandSelectionPage: NextPage = async () => {
  const brands = await DeviceClient.getUniqueBrands(); // [{ name, imageUrl }]
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <WaveHeader title="Vælg din enhed" />

      <div className="flex flex-wrap justify-evenly gap-8 ">
        {brands.map((brand) => (
          <ItemCard
            key={brand.name}
            itemName={brand.name}
            imageUrl={brand.imageUrl}
            href={`/reparation/${brand.name}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BrandSelectionPage;
