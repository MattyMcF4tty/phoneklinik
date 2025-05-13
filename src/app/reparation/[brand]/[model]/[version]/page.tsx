import DeviceSearchField from '@/components/searchFields/DeviceSearchField';
import DeviceClient from '@/lib/clients/deviceClient';
import { NextPage } from 'next';

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

  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-4 w-full grow border">
      <div className=" bg-white shadow-lg rounded-lg col-start-1 col-span-1 row-start-1 row-span-1">
        {device.brand}
        <DeviceSearchField />
      </div>
      <div className=" bg-white shadow-lg rounded-lg col-start-2 col-span-1 row-start-1 row-span-3">
        {device.model}
      </div>
      <div className=" bg-white shadow-lg rounded-lg col-start-1 col-span-1 row-start-2 row-span-2">
        {device.version}
      </div>
    </div>
  );
};

export default DevicePage;
