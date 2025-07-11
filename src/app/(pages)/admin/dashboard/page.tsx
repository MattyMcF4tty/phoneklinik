import { NextPage } from 'next';
import ValuationRequestClient from '@/lib/clients/valuationBookingClient';
import Link from 'next/link';
import BookingList from '@/app/(pages)/admin/dashboard/components/BookingList';

const AdminDashboardPage: NextPage = async () => {
  const valuations = await ValuationRequestClient.query();

  return (
    <div className="flex flex-col w-full h-[calc(90vh_-_var(--navbar-height))] gap-8">
      <div className="flex flex-row gap-8 h-1/2">
        <div className="content-box w-full overflow-hidden">
          <h1 className="w-full text-center text-title">
            Anmodninger om salg af enhed
          </h1>

          <div className="overflow-y-scroll h-full pb-8">
            {valuations.map((valuation, index) => (
              <div
                className="w-full flex flex-col items-center"
                key={valuation.id}
              >
                {index > 0 && <hr className="my-1 w-[95%]" />}
                <Link
                  href={`/admin/brugtsalg/${valuation.id}`}
                  className={`flex flex-col w-full border border-transparent bg-transparent hover:bg-blue-50 hover:border-blue-300 rounded-md p-2`}
                >
                  <h2 className="font-semibold text-lg">
                    {valuation.deviceName}
                  </h2>
                  <span className="text-pretty max-h-12">
                    &quot;{valuation.customerNotes}&quot;
                  </span>
                  <p className="text-sm text-gray-500 italic">
                    Status: {valuation.valuationStatus}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="content-box w-full h-full">test</div>
      </div>

      <div className="content-box h-1/2 flex flex-col gap-2">
        <BookingList />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
