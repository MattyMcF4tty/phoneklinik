import AccessoryClient from '@lib/clients/accessoryClient';
import { BrandClient } from '@lib/clients/brandClient';
import { ErrorBadRequest } from '@schemas/errors/appErrorTypes';
import { NextPage } from 'next';
import Image from 'next/image';
import UpdateAccessoryForm from '@components/forms/UpdateAccessoryForm';
import { deleteAccessory } from './actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id: idRaw } = await params;
  const id = parseInt(idRaw);
  if (isNaN(id) || id <= 0) {
    throw new ErrorBadRequest(
      'Ugyldigt id for tilbehør',
      `Expected id to be possitive integer. Got ${idRaw}`
    );
  }
  const accessory = await AccessoryClient.id(id).getAccessory();
  const types = await AccessoryClient.getUniqueTypes();
  const brand = await BrandClient.brandName(accessory.brand).getBrand();
  const brands = await BrandClient.query();

  return (
    <div className="flex flex-row grow w-full gap-8">
      <div className="relative w-full flex grow content-box overflow-hidden">
        <div className="absolute top-4 left-4 z-30 w-16 h-16">
          <Image
            src={brand.imageUrl}
            alt={`${brand.name} - logo`}
            fill
            style={{ objectFit: 'contain' }}
            className="rounded"
          />
        </div>

        <Image
          src={accessory.imageUrl}
          alt={`${accessory.name} - image`}
          style={{ objectFit: 'cover' }}
          fill
          className="absolute h-full w-full z-10"
        />
      </div>

      <div className="flex flex-col">
        <UpdateAccessoryForm
          types={types}
          brands={brands}
          accessory={accessory}
        />
        <form
          action={deleteAccessory}
          className="w-full flex mt-8 justify-center"
        >
          <input
            type="hidden"
            name="accessoryId"
            id="accessoryId"
            defaultValue={accessory.id}
          />
          <button className="bg-red-600 text-white px-2 rounded-md">
            Slet
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
