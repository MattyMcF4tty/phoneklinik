'use server';

import Navbar from '@/components/Navbar';
import OrderRepair from '@/components/OrderRepair';
import { decodeUrlSpaces } from '@/utils/misc';
import { getBrands } from '@/utils/supabase/brands';
import { queryDeviceName, queryDevices } from '@/utils/supabase/devices';
import Image from 'next/image';

interface Context {
  params: Promise<{ brand: string; model: string; version: string }>;
}

async function handleSelectedParts(formData: FormData): Promise<void> {
  const selectedParts = formData.getAll('parts') as string[];
  console.log('Selected parts:', selectedParts);
}

export default async function TelefonReparationPage({ params }: Context) {
  const { model, version, brand } = await params;
  const formattedVersion = decodeUrlSpaces(version);

  const device = (await queryDevices({brand: brand, model: model, version:formattedVersion}))[0];
  if (!device) {
    throw new Error('Device does not exist');
  }
  await device.fetchParts();
  const brands = (await getBrands()).map((brand) => {
    return brand.toPlainObject();
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-main-purple to-main-blue text-white h-[30vh] flex flex-col justify-center items-center text-center px-6">
        <div className="flex w-full max-w-4xl items-center space-x-6">
          {/* Image */}
          <div className="flex-shrink-0">
            <Image
              src={device.image_url}
              alt={model}
              width={100}
              height={100}
              className="h-full object-contain max-h-48"
            />
          </div>
          {/* Text */}
          <div className="flex-grow">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 text-start">
              {model} {formattedVersion} reparation
            </h1>
            <p className="text-sm md:text-lg mb-6 text-start">
              Har du brug for {model} {formattedVersion} reparation, kan du få
              hjælp hos PhoneKlinik. PhoneKlinik tilbyder skærmskift af {model}{' '}
              {formattedVersion} samt udskiftning af batteri og reparation af
              andre reservedele.
            </p>
          </div>
        </div>
      </div>

      {/* Info Boxes Section */}
      <div className="flex flex-col md:flex-row justify-center items-start space-y-6 md:space-y-0 md:space-x-6 p-6">
        {/* Pricing Section */}
        <form
          action={handleSelectedParts}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col w-full mt-4 md:w-1/3"
        >
          <h1 className="text-xl font-bold mb-6">
            Priser på {model} {formattedVersion} reparation
          </h1>
          {device.parts && device.parts.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {device.parts.map((part) => (
                <label
                  key={part.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <input
                    type="checkbox"
                    name="parts"
                    value={part.id}
                    className="mr-2"
                  />
                  <span>{part.name}</span>
                  <span className="font-bold">{part.price} kr.</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Ingen dele fundet til denne enhed.</p>
          )}
          <button
            type="submit"
            className="bg-main-purple text-white rounded-lg px-4 py-2 mt-4"
          >
            Gem valg
          </button>
        </form>
        <div>
          <OrderRepair brands={brands} />
        </div>
      </div>
    </div>
  );
}
