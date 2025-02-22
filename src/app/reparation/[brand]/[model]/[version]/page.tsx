import Navbar from '@/components/Navbar';
import PartSelectForm from '@/components/PartSelectForm';
import { decodeUrlSpaces } from '@/utils/misc';
import { queryDevices } from '@/utils/supabase/devices';
import Image from 'next/image';

export const revalidate = 86400; // Revalidate every 24 hours (in seconds)

interface Context {
  params: Promise<{ brand: string; model: string; version: string }>;
}

export default async function TelefonReparationPage({ params }: Context) {
  const { model, version, brand } = await params;
  const formattedModel = decodeUrlSpaces(model);
  const formattedBrand = decodeUrlSpaces(brand);
  const formattedVersion = decodeUrlSpaces(version);

  const device = (
    await queryDevices({
      brand: formattedBrand,
      model: formattedModel,
      version: formattedVersion,
    })
  )[0];
  if (!device) {
    throw new Error('Device does not exist');
  }
  await device.fetchParts();

  const { deviceData, partsData } = device.toPlainObject();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white min-h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <div className="flex w-full max-w-4xl items-center space-x-6 px-4">
          {/* Image */}
          <div className="flex-shrink-0">
            <Image
              src={device.image_url}
              alt={formattedModel}
              width={0}
              height={0}
              sizes="100vw"
              className="max-h-48 w-full h-full"
            />
          </div>
          {/* Text */}
          <div className="flex-grow max-w-full">
            <div>
              <h1 className="text-2xl md:text-4xl md:mt-0 mt-4 font-bold mb-4 text-start">
                {formattedModel} {formattedVersion} reparation
              </h1>
              <p className="text-sm md:text-lg mb-2 text-start">
                Har du brug for {formattedModel} {formattedVersion} reparation,
                kan du få hjælp hos PhoneKlinik. PhoneKlinik tilbyder skærmskift
                af {formattedModel} {formattedVersion} samt udskiftning af
                batteri og reparation af andre reservedele.
              </p>
              <p className="text-sm md:text-lg mb-6 text-start">
                Udvælg først nedenunder på skemaet hvilke dele der skal
                reparares og udfyld dernæst formen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*Pricing Section */}
      <div className="flex flex-col space-y-6 md:space-y-0 md:space-x-6 p-6">
        {partsData && (
          <PartSelectForm
            device={deviceData}
            parts={partsData}
            header={`Priser på ${formattedModel} ${formattedVersion} reparation`}
          />
        )}
      </div>
    </div>
  );
}
