'use server';

import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import { NextPage } from 'next';

const BrandSelectionPage: NextPage = async () => {
  const brands = await DeviceClient.getUniqueBrands();
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-wrap justify-evenly gap-8">
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
