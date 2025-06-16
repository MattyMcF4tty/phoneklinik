'use server';

import ItemCard from '@components/cards/ItemCard';
import { BrandClient } from '@lib/clients/brandClient';
import { NextPage } from 'next';
import { deleteBrand } from './actions';
import AddBrandCard from './components/AddBrandCard';

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
            <form action={deleteBrand}>
              <input
                type="hidden"
                name="brandName"
                id="brandName"
                defaultValue={brand.name}
              />
              <button className="bg-red-600 text-white px-2 rounded-md">
                Slet
              </button>
            </form>
          </ItemCard>
        ))}
      </section>
    </div>
  );
};

export default Page;
