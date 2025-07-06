import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import { ErrorNotFound } from '@/schemas/errors/appErrorTypes';
import WaveHeader from '@components/headers/WaveHeader';
import Device from '@schemas/device';
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
    if (err instanceof ErrorNotFound) {
      notFound();
    }

    throw err;
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <WaveHeader title={`Vælg din enhed`} />

      <div className="flex flex-wrap justify-evenly gap-8 ">
        {devices.map((device) => (
          <ItemCard
            key={device.id}
            itemName={`${device.model} ${device.version}`}
            imageUrl={device.imageUrl}
          >
            <div className="w-full flex justify-center">
              <Link
                href={`/reparation/${brand}/${model}/${device.version}`}
                className="bg-blue-500 rounded-md text-white w-3/5 h-8 flex justify-center items-center"
              >
                Fiks
              </Link>
            </div>
          </ItemCard>
        ))}
      </div>
    </div>
  );
};

export default VersionSelectionPage;
