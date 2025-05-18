import PartList from '@/components/lists/devicePartList/List';
import DeviceClient from '@/lib/clients/deviceClient';
import { NextPage } from 'next';
import Image from 'next/image';

interface DevicePageProps {
  params: Promise<{ brand: string; model: string; version: string }>;
}

const DevicePage: NextPage<DevicePageProps> = async ({ params }) => {
  const { brand, model, version } = await params;

  const formattedBrand = decodeURIComponent(brand);
  const formattedModel = decodeURIComponent(model);
  const formattedVersion = decodeURIComponent(version);

  const device = (
    await DeviceClient.query()
      .brand(formattedBrand)
      .model(formattedModel)
      .version(formattedVersion)
  )[0];

  const deviceParts = await DeviceClient.id(device.id).getParts();
  const releaseDate = new Date(device.releaseDate);

  return (
    <div className="flex w-full grow gap-4">
      <div className="content-box w-full flex flex-col">
        <div className="flex flex-row">
          <div className="relative w-1/2 aspect-square">
            <Image
              className="object-contain"
              src={device.imageUrl || ''}
              alt={`${device.version} image`}
              fill
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-medium">
              {device.brand} {device.model} {device.version}
            </h1>
            <h2>Type: {device.type}</h2>
            <h2>Udgivelsesdato: {releaseDate.toLocaleDateString()}</h2>
          </div>
        </div>
      </div>
      <div className="content-box w-full h-full gap-4 flex flex-wrap">
        <PartList device={device} parts={deviceParts} />
      </div>
    </div>
  );
};

export default DevicePage;
