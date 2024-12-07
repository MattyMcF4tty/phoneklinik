'use client';

import { useState } from 'react';
import { DeviceSchema } from '@/schemas/deviceScema';
import { DevicePartSchema } from '@/schemas/devicePartSchema';
import { sendMail } from '@/utils/misc';

interface PartialOrderRepairProps {
  device: DeviceSchema;
  selectedParts: DevicePartSchema[];
}

const PartialOrderRepair: React.FC<PartialOrderRepairProps> = ({
  device,
  selectedParts,
}) => {
  const [location, setLocation] = useState<string>('');
  const locations = ['Fisketorvet'];
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const handleOrderTime = async () => {
    // Brug reserveTimeSlot()
    setLoading(true);
    await sendMail(
      `REPAIR: ${device.model} ${device.version}`,
      `Customer: ${name} has reserved a timeslot at ${location} on ${date} at ${time}.
      Parts needed:
      ${selectedParts.map((part) => {
        return `- ${part.name}, price of part: ${part.price}kr\n     `; // Do not delete the space after. The mail is formatted weird. And this makes it uniform;
      })}
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
    setLoading(false);
  };

  return (
    <div className="">
      {/* Form Box */}
      <div className="ml-4 p-4 w-[35rem] flex flex-col">
        <div className="bg-gradient-to-r from-main-purple h-14 to-main-blue p-2 flex items-center rounded-t-lg">
          <h1 className="text-xl text-white font-bold">Vælg din reparation</h1>
        </div>

        <div className="bg-white p-4 rounded-b-lg shadow-md">
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
            <input
              type="time"
              name="time"
              id="time"
              className="w-full py-2 px-4 rounded mb-4 border"
              onChange={(e) => setTime(e.target.value)}
            />
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

          {/* Comment box */}
          <textarea
            name="comment"
            id="comment"
            placeholder="Evt. kommentar til bestillingen..."
            className="w-full h-24 border rounded-lg p-2 text-gray-600 mt-4"
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex items-center justify-center mt-4">
            <button disabled={loading} onClick={handleOrderTime}>
              bestil tid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartialOrderRepair;
