import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import { NextPage } from 'next';
import Link from 'next/link';

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
  const devices = await DeviceClient.query().brand(brand).model(model);
  console.log(devices);
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
