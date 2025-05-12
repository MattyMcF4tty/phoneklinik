import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import AppError from '@/schemas/errors/appError';
import Device from '@/schemas/new/device';
import { NextPage } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface VersionSelectionPageProps {
  params: Promise<{
    brand: string;
    model: string;
  }>;
}

const VersionSelectionPage: NextPage<VersionSelectionPageProps> = async ({
  params,
}) => {
  const { brand, model } = await params;

  const formattedBrand = decodeURIComponent(brand);
  const formattedModel = decodeURIComponent(model);

  let devices: Device[];

  try {
    devices = await DeviceClient.query()
      .brand(formattedBrand)
      .model(formattedModel);

    if (devices.length <= 0) {
      notFound();
    }
  } catch (err: unknown) {
    if (err instanceof AppError && err.httpCode === 404) {
      notFound();
    }

    throw err;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-wrap justify-evenly gap-8 ">
        {devices.map((device) => (
          <ItemCard
            key={device.id}
            itemName={`${device.model} ${device.version}`}
            imageUrl={device.imageUrl}
            buttons={
              <Link
                href={`/dev/reparation/${brand}/${model}/${device.version}`}
                className="bg-blue-500 rounded-md text-white w-3/5 h-8 flex justify-center items-center"
              >
                Fiks
              </Link>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default VersionSelectionPage;
