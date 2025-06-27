import DeviceClient from '@lib/clients/deviceClient';
import DevicePartClient from '@lib/clients/devicePartClient';
import DevicePartVariantClient from '@lib/clients/partVariantClient';
import RepairBookingClient from '@lib/clients/repairBookingClient';
import { ErrorBadRequest, ErrorNotFound } from '@schemas/errors/appErrorTypes';
import { NextPage } from 'next';
import InternalForm from './components/InternalForm';

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

  const [device, selectedParts, deviceParts] = await Promise.all([
    DeviceClient.id(booking.id).getDevice(),
    Promise.all(
      booking.selectedPartVariants.map(async (id) => {
        return DevicePartVariantClient.id(id).getVariant();
      })
    ),
    DeviceClient.id(booking.deviceId).getParts(),
  ]);

  const deviceName = `${device.brand} ${device.model} ${device.version}`;
  const bookingDate = new Date(booking.bookingDate);

  return (
    <div className="flex grow w-full items-center flex-col gap-4">
      {/* Title */}
      <div className="w-full content-box relative p-2 justify-center flex">
        <p className="absolute self-center left-4 text-subtle">#{booking.id}</p>
        <p className="absolute self-center right-4 text-subtle">
          {booking.repairStatus}
        </p>

        <h1 className="text-title">Reparation af {deviceName}</h1>
      </div>

      <div className="w-full">
        <div className="w-full flex flex-row gap-4 justify-between">
          {/* Customer information */}
          <div className="content-box w-full flex flex-col gap-2">
            <h2 className="text-subtitle place-self-center text-center border-b w-1/2">
              Bookingdetaljer
            </h2>

            <div className="w-full flex flex-col gap-4">
              <div className="border-l pl-1 hover:bg-slate-100 rounded-r-md">
                <p className="font-medium">Navn</p>
                <p>{booking.name}</p>
              </div>

              <div className="border-l pl-1 hover:bg-slate-100 rounded-r-md">
                <p className="font-medium">Email</p>
                <p>{booking.email}</p>
              </div>

              <div className="border-l pl-1 hover:bg-slate-100 rounded-r-md">
                <p className="font-medium">Telefon</p>
                <p>{booking.phone}</p>
              </div>

              <div className="border-l pl-1 hover:bg-slate-100 rounded-r-md">
                <p className="font-medium">Booking dato</p>
                <span>
                  <p>{bookingDate.toLocaleDateString()}</p>
                  <p>
                    {bookingDate.toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </span>
              </div>
              <div className="border-l pl-1 hover:bg-slate-100 rounded-r-md">
                <p className="font-medium">Afhentnings kode</p>
                <p>{booking.pickUpCode}</p>
              </div>
            </div>
          </div>

          {/* Booking info */}
          <div className="content-box w-full flex flex-col gap-4">
            <h2 className="text-subtitle place-self-center text-center border-b w-1/2">
              Reparationsønsker
            </h2>
            <div className="w-full flex flex-col gap-4">
              <div className="w-full">
                <p className="font-medium">Kunde beskrivelse</p>
                <span className="hover:bg-slate-100 break-words w-full block rounded-md p-1 italic hover:not-italic">
                  {booking.customerNotes}
                </span>
              </div>

              <div className="w-full">
                <p className="font-medium">Ønskede udskiftninger</p>
                <div className="flex flex-col gap-1">
                  {selectedParts.map((partVariant) => (
                    <span
                      key={partVariant.id}
                      className="flex flex-row justify-between items-center hover:bg-slate-100 rounded-md p-1 cursor-default"
                    >
                      <p>- {partVariant.name}</p>
                      <p className="text-subtle">{partVariant.price} kr</p>
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full">
                <p className="font-medium">Forventet pris (uden moms)</p>
                <div className="pl-1 hover:bg-gray-100 rounded-md ">
                  {booking.estimatedPrice} kr.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal information */}
      <div className="content-box w-full flex flex-col gap-4">
        <h2 className="text-subtitle place-self-center text-center border-b w-1/2">
          Intern info
        </h2>
        <InternalForm booking={booking} deviceParts={deviceParts} />
      </div>
    </div>
  );
};

export default Page;
