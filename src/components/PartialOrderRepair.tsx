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
  const [phone, setPhone] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const [date, setDate] = useState<string>('');
  /*   const month = new Date(date).getMonth();
   */
  const [reservedTimes, setReservedTimes] = useState<Date[]>([]);
  const [validTimes, setValidTimes] = useState<string[]>([]); // List of valid times
  const [time, setTime] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const denyReserve =
    loading ||
    !name ||
    !mail ||
    !phone ||
    !location ||
    !date ||
    !time ||
    selectedParts.length <= 0;

  useEffect(() => {
    const fetchAndGenerateTimes = async () => {
      if (!date) return;

      try {
        console.log('Fetching reserved times...');
        const timeslots = await getResveredTimeSlots(new Date(date));
        const formattedTimes = timeslots.map(
          (timeslot) => new Date(timeslot.time)
        );
        setReservedTimes(formattedTimes);

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

  const handleOrderTime = async () => {
    try {
      const datetime = createDateTimeObject(date, time);

      if (isTimeReserved(datetime, reservedTimes)) {
        alert('Selected time is already reserved. Please choose another time.');
        return;
      }

      setLoading(true);

      await reserveTimeSlot(datetime, mail);

      await sendMail(
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
      setValidTimes((prevTimes) => prevTimes.filter((t) => t !== time));
      setMail('');
      setName('');
      setComment('');
      setPhone('');
      setLocation('');
      setTime('');
      setDate('');

      setLoading(false);
    }
  };

  return (
    <div className="">
      {/* Form Box */}
      <div className="md:ml-4 p-4 md:w-[35rem] w-[23rem] flex flex-col">
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
              disabled={denyReserve}
              onClick={handleOrderTime}
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

export default PartialOrderRepair;
