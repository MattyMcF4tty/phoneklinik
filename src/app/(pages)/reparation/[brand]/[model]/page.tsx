import ItemCard from '@/components/cards/ItemCard';
import DeviceClient from '@/lib/clients/deviceClient';
import { ErrorNotFound } from '@/schemas/errors/appErrorTypes';
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
    if (err instanceof ErrorNotFound) {
      notFound();
    }

    throw err;
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full">
           <header className="relative h-[26vh] bg-gradient-to-r from-[#0d2d8b] via-[#1661c9] to-[#08a5f4] flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-sm">
Vælg din telefon       </h1>

        {/* wave bottom */}
        <svg
          className="absolute bottom-0 w-full h-16 text-gray-50"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,224L60,213.3C120,203,240,181,360,165.3C480,149,600,139,720,149.3C840,160,960,192,1080,208C1200,224,1320,224,1380,224L1440,224V320H0Z"
          />
        </svg>
      </header>      <div className="flex flex-wrap justify-evenly gap-8 ">
        {devices.map((device) => (
          <ItemCard
            key={device.id}
            itemName={`${device.model} ${device.version}`}
            imageUrl={device.imageUrl}
            buttons={
              <Link
                href={`/reparation/${brand}/${model}/${device.version}`}
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
