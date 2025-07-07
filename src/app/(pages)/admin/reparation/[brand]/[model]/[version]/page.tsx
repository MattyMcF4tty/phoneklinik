import { NextPage } from 'next';
import Image from 'next/image';
import DeviceClient from '@/lib/clients/deviceClient';
import DeleteDeviceButton from './components/DeleteDevice';
import { BrandClient } from '@lib/clients/brandClient';
import UpdateDeviceButton from './components/UpdateDevice';
import AdminPartList from '@/app/(pages)/admin/reparation/[brand]/[model]/[version]/components/AdminPartList';

interface DevicePageProps {
  params: Promise<{ brand: string; model: string; version: string }>;
}

const DevicePage: NextPage<DevicePageProps> = async ({ params }) => {
  const { brand, model, version } = await params;

  const formattedBrand = decodeURIComponent(brand);
  const formattedModel = decodeURIComponent(model);
  const formattedVersion = decodeURIComponent(version);

  const [device, allBrands] = await Promise.all([
    (
      await DeviceClient.query()
        .brand(formattedBrand)
        .model(formattedModel)
        .version(formattedVersion)
    )[0],
    await BrandClient.query(),
  ]);

  const deviceParts = await DeviceClient.id(device.id).getParts();
  const releaseDate = new Date(device.releaseDate);

  return (
    <div className="flex flex-col md:flex-row w-full grow gap-4">
      <div className="content-box w-full flex flex-col">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image container - full width on mobile, half on desktop */}
          <div className="relative w-full md:w-1/2 aspect-square">
            <Image
              className="object-contain"
              src={device.imageUrl || ''}
              alt={`${device.version} image`}
              fill
            />
          </div>

          {/* Device Info */}
          <div className="flex flex-col justify-center px-2">
            <h1 className="text-xl font-medium">
              {device.brand} {device.model} {device.version}
            </h1>
            <h2>Type: {device.type}</h2>
            <h2>Udgivelsesdato: {releaseDate.toLocaleDateString()}</h2>
          </div>
        </div>
      </div>

      {/* RIGHT: Editable Parts */}
      <div className="w-full flex flex-col gap-4 overflow-y-scroll">
        <div className="content-box w-full flex flex-col gap-4">
          <AdminPartList
            className="min-h-32"
            deviceId={device.id}
            parts={deviceParts}
          />
        </div>
        <div className="flex flex-row gap-4">
          <UpdateDeviceButton device={device} brands={allBrands} />
          <DeleteDeviceButton
            deviceBrand={device.brand}
            deviceId={device.id}
            deviceModel={device.model}
            deviceVersion={device.version}
          />
        </div>
      </div>
    </div>
  );
};

export default DevicePage;
