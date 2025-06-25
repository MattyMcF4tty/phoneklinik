import { NextPage } from 'next';
import ValuationRequestClient from '@/lib/clients/valuationBookingClient';
import Link from 'next/link';

const AdminDashboardPage: NextPage = async () => {
  const valuations = await ValuationRequestClient.query();

  return (
    <div className="grid grid-cols-2 grid-rows-2 w-full grow gap-8">
      <div className="content-box row-start-1 col-start-1 row-span-1 col-span-1 w-full">
        <h1 className="w-full text-center font-semibold text-xl">
          Anmodninger om salg af enhed
        </h1>

        <div className="overflow-y-scroll h-full">
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
      <div className="content-box row-start-1 col-start-2 row-span-1 col-span-1">
        test
      </div>
      <div className="content-box row-start-2 col-start-1 row-span-1 col-span-2">
        test
      </div>
    </div>
  );
};

export default AdminDashboardPage;
