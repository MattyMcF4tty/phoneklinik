import Device from '@schemas/device';
import RepairBooking from '@schemas/repairBooking';
import Link from 'next/link';
import React, { FC } from 'react';

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

export default BookingListRow;
