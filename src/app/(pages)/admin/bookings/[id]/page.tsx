import DeviceClient from '@lib/clients/deviceClient';
import DevicePartClient from '@lib/clients/devicePartClient';
import RepairBookingClient from '@lib/clients/repairBookingClient';
import { ErrorBadRequest, ErrorNotFound } from '@schemas/errors/appErrorTypes';
import { NextPage } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id } = await params;
  const formattedId = parseInt(id, 10);
  if (isNaN(formattedId) || formattedId <= 0) {
    throw new ErrorBadRequest(
      'Ugyldigt booking id',
      `Invalid booking id. Expected id to be positive integer. Got ${id}`
    );
  }
  const booking = await RepairBookingClient.id(formattedId).getBooking();
  if (!booking) {
    throw new ErrorNotFound(
      'Booking findes ikke',
      `Repair booking [${formattedId}] could not be found.`
    );
  }

  const device = await DeviceClient.id(booking.id).getDevice();
  const deviceName = `${device.brand} ${device.model} ${device.version}`;

  return (
    <div className="flex grow w-full content-box relative p-4 items-center flex-col gap-2">
      <p className="absolute top-4 left-4 text-subtle">#{booking.id}</p>
      <h1 className="text-title">Reparation af {deviceName}</h1>
      <div className="w-full grow border"></div>
    </div>
  );
};

export default Page;
