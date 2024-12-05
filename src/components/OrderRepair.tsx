'use client';

import { useEffect, useState } from 'react';
import LinkButton from '@/components/LinkButton';
import { queryDevices } from '@/utils/supabase/devices';
import { Brand } from '@/schemas/brandSchema';

interface OrderRepairProps {
  brands: Brand[];
}

const OrderRepair: React.FC<OrderRepairProps> = ({ brands }) => {
  const [models, setModels] = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);

  const [currentBrand, setCurrentBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [version, setVersion] = useState<string>('');

  const [location, setLocation] = useState<string>('');
  const locations = ['Fisketorvet'];

  useEffect(() => {
    const fetchModelsAndVersions = async () => {
      if (currentBrand) {
        const devices = await queryDevices({ brand: currentBrand });
        const uniqueModels = Array.from(
          new Set(devices.map((device) => device.model))
        );
        setModels(uniqueModels);
        setModel('');
        setVersions([]);
        setVersion('');
      } else {
        setModels([]);
        setModel('');
        setVersions([]);
        setVersion('');
      }

      if (model) {
        const devices = await queryDevices({ brand: currentBrand, model });
        const uniqueVersions = Array.from(
          new Set(devices.map((device) => device.version))
        );
        setVersions(uniqueVersions);
        setVersion('');
      } else {
        setVersions([]);
        setVersion('');
      }
    };

    fetchModelsAndVersions();
  }, [currentBrand, model]);

  return (
    <div className="">
      {/* Form Box */}
      <div className="ml-4 p-4 w-[35rem] flex flex-col">
        <div className="bg-gradient-to-r from-main-purple h-14 to-main-blue p-2 flex items-center rounded-t-lg">
          <h1 className="text-xl text-white font-bold">Vælg din reparation</h1>
        </div>

        <div className="bg-white p-4 rounded-b-lg shadow-md">
          {/* Dropdown for brand */}
          <select
            value={currentBrand}
            onChange={(e) => {
              setCurrentBrand(e.target.value);
              setModel(''); // Reset model and version when brand changes
              setVersion('');
            }}
            className="bg-gray-200 text-gray-600 w-full py-2 px-4 rounded mb-4"
          >
            <option value="">Vælg mærke</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>

          {/* Dropdown for model */}
          <select
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setVersion(''); // Reset version when model changes
            }}
            className={`w-full py-2 px-4 rounded mb-4 ${
              currentBrand
                ? 'bg-gray-200 text-gray-600'
                : 'bg-gray-300 text-gray-400'
            }`}
            disabled={!currentBrand}
          >
            <option value="">Vælg model</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Dropdown for version */}
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className={`w-full py-2 px-4 rounded mb-4 ${
              model ? 'bg-gray-200 text-gray-600' : 'bg-gray-300 text-gray-400'
            }`}
            disabled={!model}
          >
            <option value="">Vælg version</option>
            {versions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          {/* Dropdown for location */}
          <div className="flex flex-row">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-200 text-gray-600 w-full py-2 px-4 rounded mb-4 mr-4"
            >
              <option value="">Vælg lokation</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {/* Other input fields */}
            <input
              type="text"
              placeholder="Navn"
              className="w-full py-2 px-4 rounded mb-4 border"
            />
          </div>

          <div className="flex flex-row">
            <input
              type="date"
              className="w-full py-2 px-4 rounded mb-4 border mr-4"
            />
            <input
              type="time"
              className="w-full py-2 px-4 rounded mb-4 border"
            />
          </div>

          <div className="flex flex-row">
            <input
              type="tel"
              placeholder="Telefonnummer"
              className="w-full py-2 px-4 rounded mb-4 border mr-4"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full py-2 px-4 rounded mb-4 border"
            />
          </div>

          {/* Comment box */}
          <textarea
            placeholder="Evt. kommentar til bestillingen..."
            className="w-full h-24 border rounded-lg p-2 text-gray-600 mt-4"
          />
          <div className="flex items-center justify-center mt-4">
            <LinkButton variant={'navbar2'} url="" className="w-full">
              Bestil tid
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderRepair;
