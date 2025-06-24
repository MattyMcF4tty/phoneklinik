import { NextPage } from 'next';
import Image from 'next/image';
import DeviceClient from '@/lib/clients/deviceClient';
import EditableDeviceForm from '@/components/forms/EditableDeviceForm';
import EditablePartList from '@/components/lists/devicePartList/EditablePartList';

interface DevicePageProps {
  params: { brand: string; model: string; version: string };
}

const DevicePage: NextPage<DevicePageProps> = async ({ params }) => {
  const { brand, model, version } = params;

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
    <div className="flex flex-col md:flex-row w-full grow gap-4">
      {/* LEFT: Image + Device Info + Editable form */}
      <div className="content-box w-full md:w-1/2 flex flex-col gap-4">
        <div className="relative w-1/2 h-1/2 aspect-square">
          <Image
            className="object-contain"
            src={device.imageUrl || ''}
            alt={`${device.version} image`}
            fill
          />
        </div>

        <div className="flex flex-col justify-center px-2">
          <h1 className="text-xl font-medium">
            {device.brand} {device.model} {device.version}
          </h1>
          <h2>Type: {device.type}</h2>
          <h2>Udgivelsesdato: {releaseDate.toLocaleDateString()}</h2>
        </div>

        {/* Editable Device Info Form */}
        <EditableDeviceForm device={device} />
      </div>

      {/* RIGHT: Editable Parts */}
      <div className="content-box w-full md:w-1/2 flex flex-col gap-4">
        <EditablePartList deviceId={device.id} parts={deviceParts} />
      </div>
    </div>
  );
};

export default DevicePage;
