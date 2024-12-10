 'use client';

import { useEffect, useState } from 'react';
import LinkButton from '@/components/LinkButton';
import { queryDevices } from '@/utils/supabase/devices';
import { BrandSchema } from '@/schemas/brandSchema';

interface OrderRepairProps {
  brands: BrandSchema[];
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
      <div className="ml-4 p-4 w-[35rem] flex flex-col">
        <div className="bg-gradient-to-r from-main-purple h-14 to-main-blue p-2 flex items-center rounded-t-lg">
          <h1 className="text-xl text-white font-bold">Vælg din reparation</h1>
        </div>

        <div className="bg-white p-4 rounded-b-lg shadow-md">
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

/* 
'use client';

import { useEffect, useState } from 'react';
import { DeviceSchema } from '@/schemas/deviceScema';
import { DevicePartSchema } from '@/schemas/devicePartSchema';
import {
  createDateTimeObject,
  generateTimeSlots,
  isTimeReserved,
  sendMail,
} from '@/utils/misc';
import {
  getResveredTimeSlots,
  reserveTimeSlot,
} from '@/utils/supabase/timeSlots';
import { Time } from '@/schemas/customTypes';
import { TimeSlot } from '@/schemas/timeSlotSchema';
import LinkButton from '@/components/LinkButton';
import { queryDevices } from '@/utils/supabase/devices';
import { Brand, BrandSchema } from '@/schemas/brandSchema';
import { getModels } from '@/utils/supabase/models';
import { getBrands } from '@/utils/supabase/brands';

interface OrderRepairProps {
  brands: Brand[]; // Accept brands directly as an array
}

export default function OrderRepair({ brands }: OrderRepairProps) {

  const [selectedModel, setSelectedModel] = useState<string>(''); // Keep track of the selected model
  const [versions, setVersions] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]); // Correct state variable name

  const [currentBrand, setCurrentBrand] = useState<string>('');
  const [version, setVersion] = useState<string>('');

  const [location, setLocation] = useState<string>('');
  const locations = ['Fisketorvet'];
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const [date, setDate] = useState<string>('');

  const [reservedTimes, setReservedTimes] = useState<Date[]>([]);
  const [validTimes, setValidTimes] = useState<string[]>([]); // List of valid times

  const [time, setTime] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (date) {
      const selectedMonth = new Date(date).getMonth();
      const selectedYear = new Date(date).getFullYear();

      // Fetch reserved times for the selected date
      const fetchReservedTimes = async () => {
        try {
          const timeslots = await getResveredTimeSlots(new Date(date));

          const formattedTimes = timeslots.map((timeslot) => {
            return timeslot.time;
          });

          setReservedTimes(formattedTimes);
        } catch (error) {
          console.error('Error fetching reserved times:', error);
        }
      };

      const generateValidTimes = () => {
        const unvalidatedTimes = generateTimeSlots();
        const validatedTimes = unvalidatedTimes.filter((timeSlot) => {
          const datetime = createDateTimeObject(date, timeSlot);

          // Check if the time is reserved
          const isReserved = reservedTimes.some(
            (reserved) => reserved.getTime() === datetime.getTime()
          );

          return !isReserved;
        });

        setValidTimes(validatedTimes);
      };

      fetchReservedTimes();
      generateValidTimes();
    }
  }, [date]);

  const handleOrderTime = async () => {
    try {
      const datetime = createDateTimeObject(date, time);

      if (isTimeReserved(datetime, reservedTimes)) {
        alert('Selected time is already reserved. Please choose another time.');
        return;
      }

      setLoading(true);

      await reserveTimeSlot(datetime, mail);

      /* await sendMail(
        `REPAIR: ${device.model} ${device.version}`,
        `Customer: ${name} has reserved a timeslot at ${location} on ${date} at ${time}.
        Parts needed:
        ${selectedParts
          .map((part) => `- ${part.name}, price of part: ${part.price}kr\n`)
          .join('')}
        Full price of repair: ${selectedParts.reduce(
          (total, part) => total + part.price,
          0
        )}kr
        
        Customer comment:
        "${comment}"
        
        Contact customer:
        Email: ${mail}
        Phone: ${phone}
        `
      ); 

      alert('Your time has been successfully reserved!');
    } catch (error) {
      console.error('Error handling order time:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchModelsAndVersions = async () => {
      if (currentBrand) {
        try {
          const devices = await queryDevices({ brand: currentBrand });
          const uniqueModels = Array.from(new Set(devices.map((device) => device.model)));
          setModels(uniqueModels); // Update the model list
          setSelectedModel(''); // Reset selected model when the brand changes
          setVersions([]); // Reset versions
          setVersion(''); // Reset version
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      } else {
        setModels([]);
        setSelectedModel('');
        setVersions([]);
        setVersion('');
      }
  
      if (selectedModel) {
        try {
          const devices = await queryDevices({ brand: currentBrand, model: selectedModel }); // Use selectedModel
          const uniqueVersions = Array.from(new Set(devices.map((device) => device.version)));
          setVersions(uniqueVersions); // Update the version list
          setVersion(''); // Reset version when models change
        } catch (error) {
          console.error('Error fetching versions:', error);
        }
      }
    };
  
    fetchModelsAndVersions();
  }, [currentBrand, selectedModel]);

  return (
    <div className="">
    
      <div className="ml-4 p-4 w-[35rem] flex flex-col">
        <div className="bg-gradient-to-r from-main-purple h-14 to-main-blue p-2 flex items-center rounded-t-lg">
          <h1 className="text-xl text-white font-bold">Vælg din reparation</h1>
        </div>

        <div className="bg-white p-4 rounded-b-lg shadow-md">

        <select
            value={currentBrand}
            onChange={(e) => {
              setCurrentBrand(e.target.value);
              setModels(''); // Reset model and version when brand changes
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

          <select
            value={models}
            onChange={(e) => {
              setModels(e.target.value);
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

          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className={`w-full py-2 px-4 rounded mb-4 ${
              models ? 'bg-gray-200 text-gray-600' : 'bg-gray-300 text-gray-400'
            }`}
            disabled={!models}
          >
            <option value="">Vælg version</option>
            {versions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* Dropdown for location
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

            {/* Other input fields 
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Navn"
              className="w-full py-2 px-4 rounded mb-4 border"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-row">
            <input
              type="date"
              name="date"
              id="date"
              className="w-full py-2 px-4 rounded mb-4 border mr-4"
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              name="time"
              id="time"
              className="w-full py-2 px-4 rounded mb-4 border"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">Vælg tid</option>
              {validTimes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row">
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Telefonnummer"
              className="w-full py-2 px-4 rounded mb-4 border mr-4"
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="w-full py-2 px-4 rounded mb-4 border"
              onChange={(e) => setMail(e.target.value)}
            />
          </div>

          {/* Comment box 
          <textarea
            name="comment"
            id="comment"
            placeholder="Evt. kommentar til bestillingen..."
            className="w-full h-24 border rounded-lg p-2 text-gray-600 mt-4"
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex items-center justify-center mt-4">
            <button
              disabled={loading}
              onClick={handleOrderTime}
              className="bg-gradient-to-r from-main-purple h-12 to-main-blue text-white w-full rounded-lg"
            >
              bestil tid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} */