import AccessoryClient from '@lib/clients/accessoryClient';
import { BrandClient } from '@lib/clients/brandClient';
import { ErrorBadRequest } from '@schemas/errors/appErrorTypes';
import { NextPage } from 'next';
import Image from 'next/image';
import { deleteAccessory } from './actions';
import UpdateAccessoryButton from './components/UpdateAccessoryButton';
import DeleteAccessoryButton from './components/DeleteAccessoryButton';

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
      <div className="w-full grow flex flex-col gap-8">
        <div className=" w-full content-box flex items-center flex-col gap-8">
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-title place-self-center">{accessory.name}</h1>
            <span>{accessory.description}</span>

            <p className="place-self-start font-medium mt-2">
              Lavet af {accessory.brand}
            </p>
          </div>

          <p className="place-self-start font-semibold text-lg ">
            Pris: {accessory.price} kr
          </p>
        </div>
        <div className="w-full content-box">
          <h2 className="text-subtitle">Understøttede enheder</h2>

          <div className="flex flex-wrap">
            {accessory.supportedDevices.map((deviceName, index) => (
              <span key={index} className="text-subtle mr-2">
                {deviceName}
                {index < accessory.supportedDevices.length - 1 ? ',' : '.'}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-row w-full gap-4">
          <UpdateAccessoryButton
            accessory={accessory}
            brands={brands}
            types={types}
          />
          <DeleteAccessoryButton
            accessoryId={accessory.id}
            accessoryName={accessory.name}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
