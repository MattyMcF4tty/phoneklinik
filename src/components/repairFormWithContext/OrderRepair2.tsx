'use client';

import React, { FC, useEffect, useState } from 'react';
import { useRepairForm } from './RepairFormProvider';
import { getResveredTimeSlots } from '@/utils/supabase/timeSlots';
import { createDateTimeObject, generateTimeSlots } from '@/utils/misc';
import { getModels } from '@/utils/supabase/models';
import { queryDevices } from '@/utils/supabase/devices';
import { BrandSchema } from '@/schemas/brandSchema';

interface OrderRepairProps {
  brands: BrandSchema[];
}

const OrderRepair: FC<OrderRepairProps> = ({ brands }) => {
  const repairFormData = useRepairForm();

  const [location, setLocation] = useState<string>('');
  const locations = ['Fisketorvet'];
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const [date, setDate] = useState<string>('');
  /*   const month = new Date(date).getMonth();
   */
  const [validTimes, setValidTimes] = useState<string[]>([]); // List of valid times
  const [time, setTime] = useState<string>('');

  const [models, setModels] = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);

  const [currentBrand, setCurrentBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [version, setVersion] = useState<string>('');

  const denyReserve =
    repairFormData.loading ||
    !name ||
    !mail ||
    !phone ||
    !location ||
    !date ||
    !time ||
    repairFormData.selectedParts.length <= 0 ||
    !repairFormData.bookingData;

  useEffect(() => {
    const fetchAndGenerateTimes = async () => {
      if (!date) return;

      try {
        console.log('Fetching reserved times...');
        const timeslots = await getResveredTimeSlots(new Date(date));
        const formattedTimes = timeslots.map(
          (timeslot) => new Date(timeslot.time)
        );

        // Generate valid times after reserved times have been updated
        const unvalidatedTimes = generateTimeSlots();
        const validatedTimes = unvalidatedTimes.filter((timeSlot) => {
          const datetime = createDateTimeObject(date, timeSlot);
          return !formattedTimes.some(
            (reserved) => reserved.getTime() === datetime.getTime()
          );
        });

        setValidTimes(validatedTimes);
      } catch (error) {
        console.error('Error fetching reserved times:', error);
      }
    };

    fetchAndGenerateTimes();
  }, [date]);

  // Fetch brand models
  useEffect(() => {
    repairFormData.setDevice(undefined);
    repairFormData.setSelectedParts([]);

    setModel('');
    setModels([]);
    const fecthModels = async () => {
      if (currentBrand) {
        const modelsData = await getModels(currentBrand);
        const modelNames = modelsData.map((modelData) => {
          return modelData.name;
        });
        setModels(modelNames);
      }
    };

    fecthModels();
  }, [currentBrand]);

  // Fetch model versions
  useEffect(() => {
    repairFormData.setDevice(undefined);
    repairFormData.setSelectedParts([]);

    setVersion('');
    setVersions([]);
    const fetchVersions = async () => {
      if (model) {
        const devices = await queryDevices({
          brand: currentBrand,
          model: model,
        });
        const versionNames = devices.map((device) => {
          return device.version;
        });
        setVersions(versionNames);
      }
    };

    fetchVersions();
  }, [model]);

  // Fetch model versions
  useEffect(() => {
    repairFormData.setDevice(undefined);
    repairFormData.setSelectedParts([]);

    const fetchVersions = async () => {
      if (version) {
        const devices = await queryDevices({
          brand: currentBrand,
          model: model,
          version: version,
        });

        // TODO FIX
        if (devices[0]) {
          const deviceData = devices[0].toPlainObject().deviceData;
          repairFormData.setDevice(deviceData);
        } else {
          console.error('No such device exist;', currentBrand, model, version);
        }
      }
    };

    fetchVersions();
  }, [version]);

  useEffect(() => {
    if (denyReserve) {
      repairFormData.setBookingData({
        comment: comment,
        date: date,
        email: mail,
        name: name,
        phone: phone,
        time: time,
        location: location,
      });
    }
  }, [
    comment,
    date,
    mail,
    name,
    phone,
    time,
    location,
    repairFormData.selectedParts,
    repairFormData.loading,
  ]);

  return (
    <div className="">
      {/* Form Box */}
      <div className="md:ml-4 p-4 md:w-[35rem] w-[23rem] flex flex-col">
        <div className="bg-gradient-to-r from-main-purple h-14 to-main-blue p-2 flex items-center rounded-t-lg">
          <h1 className="text-xl text-white font-bold">Vælg din reparation</h1>
        </div>

        <div className="bg-white p-4 rounded-b-lg shadow-md">
          <select
            value={currentBrand}
            onChange={(e) => {
              setCurrentBrand(e.target.value);
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

          {/* SELECT MODEL */}
          <select
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
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

          {/* SELECT VERSION */}
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
              name="name"
              id="name"
              placeholder="Navn"
              className="w-full py-2 px-4 rounded mb-4 border"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className="flex flex-row">
            <input
              type="date"
              name="date"
              id="date"
              className="w-full py-2 px-4 rounded mb-4 border mr-4"
              onChange={(e) => setDate(e.target.value)}
              value={date}
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
              placeholder="tlf. nr."
              className="w-full py-2 px-4 rounded mb-4 border mr-4"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="w-full py-2 px-4 rounded mb-4 border"
              onChange={(e) => setMail(e.target.value)}
              value={mail}
            />
          </div>

          {/* Comment box */}
          <textarea
            name="comment"
            id="comment"
            placeholder="Evt. kommentar til bestillingen..."
            className="w-full h-24 border rounded-lg p-2 text-gray-600 mt-4"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex items-center justify-center mt-4">
            <button
              type="submit"
              disabled={denyReserve}
              className={`h-12 text-white w-full rounded-lg ${
                denyReserve
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-main-purple to-main-blue'
              }`}
            >
              bestil tid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderRepair;
