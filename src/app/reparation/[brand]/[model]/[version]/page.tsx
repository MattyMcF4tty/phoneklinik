'use server';

import Navbar from '@/components/Navbar';
import OrderRepair from '@/components/OrderRepair';
import PartSelectForm from '@/components/PartSelectForm';
import Device from '@/schemas/deviceScema';
import { decodeUrlSpaces } from '@/utils/misc';
import { getBrands } from '@/utils/supabase/brands';
import { queryDeviceName, queryDevices } from '@/utils/supabase/devices';
import Image from 'next/image';

interface Context {
  params: Promise<{ brand: string; model: string; version: string }>;
}

export default async function TelefonReparationPage({ params }: Context) {
  const { model, version, brand } = await params;
  const formattedVersion = decodeUrlSpaces(version);

  const device = new Device(
    (
      await queryDevices({
        brand: brand,
        model: model,
        version: formattedVersion,
      })
    )[0]
  );
  if (!device) {
    throw new Error('Device does not exist');
  }
  await device.fetchParts();

  const { deviceData, partsData } = device.toPlainObject();

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

      {/*Pricing Section */}
      <div className="flex flex-col space-y-6 md:space-y-0 md:space-x-6 p-6">
       
        {partsData && (
            <PartSelectForm device={deviceData} parts={partsData} header={`Priser på ${model} ${formattedVersion} reparation`}/>
          )}
      </div>
    </div>
  );
}
