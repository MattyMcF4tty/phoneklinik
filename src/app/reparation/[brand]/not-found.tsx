'use server';

import DeviceClient from '@/lib/clients/deviceClient';
import { NextPage } from 'next';
import Link from 'next/link';

const Page: NextPage = async () => {
  const models = await DeviceClient.getUniqueModels();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-bold mb-4">404 – Enhed ikke fundet</h1>
      <p className="mb-6">
        Vi servicere desværre ikke den enhed du leder efter.
      </p>
      <div>
        <h1>Enheder vi servicere:</h1>
        <div className="flex flex-row gap-4 flex-wrap justify-center">
          {models.map((model) => (
            <Link
              key={model.name}
              href={`/reparation/${model.brand}/${model.name}`}
              className="text-blue-600 underline"
            >
              {model.brand} {model.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
