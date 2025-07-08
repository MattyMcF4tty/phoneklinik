'use client';

import RepairBooking from '@schemas/repairBooking';
import React, { FC, useEffect, useState, useMemo } from 'react';
import Device from '@schemas/device';
import Link from 'next/link';
import { addWeeks, endOfWeek, startOfWeek } from 'date-fns';
import handleInternalApi from '@utils/api';
import { toast } from 'sonner';

/* --- LIST --- */

const BookingList: FC = () => {
  const today = new Date();
  const [bookingRange, setBookingRange] = useState<{ start: Date; end: Date }>({
    start: startOfWeek(today),
    end: endOfWeek(today),
  });
  const [bookings, setBookings] = useState<RepairBooking[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const deviceMap = useMemo(() => {
    return new Map(devices.map((device) => [device.id, device]));
  }, [devices]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const bookingsResponse = await handleInternalApi('/repair-bookings', {
        method: 'GET',
        params: {
          startDate: bookingRange.start.toISOString(),
          endDate: bookingRange.end.toISOString(),
        },
      });

      if (bookingsResponse.success === false) {
        toast.error(bookingsResponse.message);
        setLoading(false);

        return;
      }

      const periodBookings = bookingsResponse.data;

      setBookings(periodBookings);
      console.log(`Found ${periodBookings.length} bookings.`);

      const uniqueDeviceIds = [
        ...new Set(periodBookings.map((b) => b.deviceId)),
      ];

      if (uniqueDeviceIds.length > 0) {
        const params = uniqueDeviceIds.reduce<Record<string, number[]>>(
          (acc, id) => {
            if (!acc.id) acc.id = [];
            acc.id.push(id);
            return acc;
          },
          {}
        );

        const devicesResponse = await handleInternalApi('/devices', {
          method: 'GET',
          params,
        });

        if (devicesResponse.success === false) {
          toast.error(devicesResponse.message);
          setLoading(false);

          return;
        }
        const bookingDevices = devicesResponse.data;
        console.log(`Fetched ${bookingDevices.length} devices.`);
        setDevices(bookingDevices);
      }

      setLoading(false);
    };

    fetchBookings();
  }, [bookingRange]);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="overflow-hidden">
        <h1 className="w-full text-center text-title">
          Reparation af enheder denne uge
        </h1>
        <ul className="w-full h-full overflow-y-scroll flex flex-col p-1 gap-2">
          {loading ? (
            <p>Henter bookings...</p>
          ) : (
            bookings.map((booking) => (
              <BookingListRow
                key={booking.id}
                device={deviceMap.get(booking.deviceId) as Device}
                booking={booking}
              />
            ))
          )}
        </ul>
      </div>

      <div className="w-full flex gap-4 justify-center mt-8">
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => {
            setBookingRange((prev) => ({
              start: addWeeks(prev.start, -1),
              end: addWeeks(prev.end, -1),
            }));
          }}
        >
          Forrige uge
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => {
            setBookingRange((prev) => ({
              start: addWeeks(prev.start, 1),
              end: addWeeks(prev.end, 1),
            }));
          }}
        >
          Næste uge
        </button>
      </div>
    </div>
  );
};

export default BookingList;

/* --- ROW --- */
interface BookingListRowProps {
  booking: RepairBooking;
  device: Device;
}

const BookingListRow: FC<BookingListRowProps> = ({ booking, device }) => {
  const deviceName = `${device.brand} ${device.model} ${device.version}`;
  const bookingDate = new Date(booking.bookingDate);
  return (
    <li className="w-full h-10 bg-slate-100 shadow-sm rounded-md hover:shadow-md">
      <Link
        href={`/admin/reparation/booking/${booking.id}`}
        className="w-full h-full flex flex-row p-2 text-left"
      >
        <span className="w-3/12">{booking.email}</span>
        <span className="w-3/12">{deviceName}</span>
        <span className="w-1/12">{booking.estimatedRepairTime} minutter</span>
        <span className="w-2/12">{booking.estimatedPrice} kr</span>
        <span className="w-1/12">{booking.pickUpCode}</span>

        <span className="w-2/12">
          {bookingDate.toLocaleTimeString()} {bookingDate.toLocaleDateString()}
        </span>
      </Link>
    </li>
  );
};
