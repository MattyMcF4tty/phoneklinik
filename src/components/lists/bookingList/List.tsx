import RepairBooking from '@schemas/repairBooking';
import React, { FC, Suspense } from 'react';
import BookingListRow from './Row';
import DeviceClient from '@lib/clients/deviceClient';
import Device from '@schemas/device';

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
      <Suspense fallback={<p>Henter bookinger...</p>}>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingListRow
              key={booking.id}
              device={deviceMap.get(booking.deviceId) as Device}
              booking={booking}
            />
          ))
        ) : (
          <p>Ingen bookinger fundet</p>
        )}
      </Suspense>
    </ul>
  );
};

export default BookingList;
