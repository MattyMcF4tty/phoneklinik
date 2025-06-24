'use server';

import ItemCard from '@components/cards/ItemCard';
import { BrandClient } from '@lib/clients/brandClient';
import { NextPage } from 'next';
import AddBrandCard from './components/AddBrandCard';
import DeleteBrandButton from './components/DeleteBrandButton';
import UpdateBrandButton from './components/UpdateBrandButton';

const Page: NextPage = async ({}) => {
  const brands = await BrandClient.query();
  return (
    <div className="flex flex-col w-full gap-8 items-center">
      <h1 className="text-title w-1/6 border-b-2 text-center">Mærker</h1>
      <section className="w-full h-fit flex flex-wrap gap-8">
        <AddBrandCard />
        {brands.map((brand) => (
          <ItemCard
            key={brand.name}
            itemName={brand.name}
            imageUrl={brand.imageUrl}
          >
            <div className="w-full flex justify-center mt-4 gap-4">
              <UpdateBrandButton brand={brand} />
              <DeleteBrandButton brandName={brand.name} />
            </div>
          </ItemCard>
        ))}
      </section>
    </div>
  );
};

export default Page;
