import ItemCard from '@components/cards/ItemCard';
import AccessoryClient from '@lib/clients/accessoryClient';
import { NextPage } from 'next';
import AddAccessoryCard from './components/AddAccessoryCard';
import { BrandClient } from '@lib/clients/brandClient';
import { deleteAccessory } from './[id]/actions';

interface PageProps {
  searchParams: Promise<{ type: string }>;
}

const Page: NextPage<PageProps> = async ({ searchParams }) => {
  const { type } = await searchParams;
  const accessoryQuery = AccessoryClient.query();
  if (type) {
    accessoryQuery.type(type);
  }
  const accessories = await accessoryQuery;

  const types = await AccessoryClient.getUniqueTypes();
  const brands = await BrandClient.query();

  return (
    <div className="flex flex-col w-full gap-8 items-center">
      <h1 className="text-title w-1/6 border-b-2 text-center">Tilbehør</h1>
      <section className="w-full h-fit flex flex-wrap gap-8">
        <AddAccessoryCard types={types} brands={brands} />
        {accessories.map((accessory) => (
          <ItemCard
            itemName={accessory.name}
            href={`/admin/tilbehoer/${accessory.id}`}
            imageUrl={accessory.imageUrl}
            key={accessory.id}
          >
            <div className="flex flex-col gap-2 items-center">
              <span className="w-full h-fit text-subtle text-wrap line-clamp-2 text-center">
                {accessory.supportedDevices.map((deviceName, index) => (
                  <span key={index} className="text-subtle mr-2">
                    {deviceName}
                    {index < accessory.supportedDevices.length - 1 ? ',' : '.'}
                  </span>
                ))}
              </span>
              <h2 className="text-subtitle">{accessory.price} kr.</h2>
            </div>
          </ItemCard>
        ))}
      </section>
    </div>
  );
};

export default Page;
