import ValuationRequestClient from '@/lib/clients/valuationBookingClient';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import { NextPage } from 'next';
import Image from 'next/image';

interface ValuationPageProps {
  params: Promise<{ id: string }>;
}

const ValuationPage: NextPage<ValuationPageProps> = async ({ params }) => {
  const { id } = await params;
  const validatedId = parseInt(id, 10);
  if (isNaN(validatedId)) {
    throw new ErrorBadRequest(
      'Ugyldig ID angivet',
      'Valuation ID must be a valid postive integer'
    );
  }

  const valuation = await ValuationRequestClient.id(
    validatedId
  ).getValuationRequest();

  return (
    <div className="w-full grow grid grid-cols-3 grid-rows-2 gap-8">
      <div className="content-box col-start-1 row-start-1 row-span-2 flex flex-col">
        <h1 className="text-xl font-semibold w-full text-center">
          Billeder af enhed
        </h1>
        <div className="flex flex-col w-full max-h-1/3">
          <h2>Forside</h2>
          <Image
            src={valuation.images.frontUrl}
            alt="Forside"
            layout="responsive"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col w-full max-h-1/3">
          <h2>Forside</h2>
          <Image
            src={valuation.images.rearUrl}
            alt="Forside"
            layout="responsive"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col w-full max-h-1/3">
          <h2>Forside</h2>
          <Image
            src={valuation.images.batteryUrl}
            alt="Forside"
            layout="responsive"
            width={100}
            height={100}
          />
        </div>
      </div>
      <div className="content-box">
        <h1 className="font-semibold text-xl">Anmodning</h1>
        <div className="flex flex-col gap-2"></div>
      </div>
    </div>
  );
};

export default ValuationPage;
