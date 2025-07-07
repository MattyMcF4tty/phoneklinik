import RepairBooking from '@schemas/repairBooking';
import React, { FC } from 'react';
import DeviceClient from '@lib/clients/deviceClient';
import Device from '@schemas/device';
import Link from 'next/link';

/* --- LIST --- */
interface BookingListProps {
  bookings: RepairBooking[];
}

const BookingList: FC<BookingListProps> = async ({ bookings }) => {
  const uniqueDeviceIds = [...new Set(bookings.map((b) => b.deviceId))];
  const devicesArray = await Promise.all(
    uniqueDeviceIds.map((id) => DeviceClient.id(id).getDevice())
  );

  const deviceMap = new Map(devicesArray.map((device) => [device.id, device]));

  return (
    <ul className="w-full h-full overflow-y-scroll flex flex-col p-1 gap-2">
      {bookings.map((booking) => (
        <BookingListRow
          key={booking.id}
          device={deviceMap.get(booking.deviceId) as Device}
          booking={booking}
        />
      ))}
    </ul>
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
    <li className="w-full  h-10 bg-slate-100 shadow-sm rounded-md hover:shadow-md">
      <Link
        href={`/admin/reparation/booking/${booking.id}`}
        className="w-full h-full flex flex-row justify-between p-2"
      >
        <span>{booking.email}</span>
        <span>{deviceName}</span>
        <span>{booking.estimatedRepairTime} minutter</span>
        <span>{booking.estimatedPrice} kr</span>
        <span>{booking.pickUpCode}</span>

        <span>
          {bookingDate.toLocaleTimeString()} {bookingDate.toLocaleDateString()}
        </span>
      </Link>
    </li>
  );
};
