'use client';

import BookRepairForm from '@/components/forms/BookRepairForm';
import useSessionStorage from '@/hooks/useSessionStorage';
import PartVariant from '@/schemas/new/partVariant';
import { NextPage } from 'next';
import { useParams } from 'next/navigation';

interface BookingPageProps {}

const BookingPage: NextPage<BookingPageProps> = ({}) => {
  const { brand, model, version } = useParams() as {
    brand?: string;
    model?: string;
    version?: string;
  };

  if (!brand || !model || !version) {
    throw new Error('Mangler brand, model eller version');
  }

  const formattedBrand = decodeURIComponent(brand);
  const formattedModel = decodeURIComponent(model);
  const formattedVersion = decodeURIComponent(version);

  const [parts, setParts] = useSessionStorage<PartVariant[]>(
    `${formattedBrand}_${formattedModel}_${formattedVersion}_parts`,
    []
  );

  const totalPrice = parts.reduce((sum, part) => sum + part.price, 0);
  const vatPrice = totalPrice * 0.25;

  return (
    <div className="w-full flex flex-col gap-4 grow">
      <h1 className="content-box text-2xl font-semibold text-center">
        Reparation af {formattedBrand} {formattedModel} {formattedVersion}
      </h1>

      <div className="w-full md:flex md:flex-row gap-4">
        <div className="content-box mb-4 md:w-1/3 flex flex-col hover:cursor-default gap-4">
          <h1 className="w-full text-xl font-medium text-center border-b h-10">
            Kvittering
          </h1>

          <div className="flex flex-col border-b px-2 pb-4 gap-2 overflow-y-scroll">
            {parts.map((part) => (
              <div
                key={part.id}
                className="hover:bg-slate-100 rounded-md w-full h-10 flex flex-row justify-between items-center"
              >
                <div className="flex flex-col">
                  <h3 className="text-base">{part.name}</h3>
                </div>

                <p className="">{part.price} kr.</p>
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col items-center px-2 pb-4 gap-2 border-b">
            <div className="w-full justify-between flex flex-row">
              <p className="text-base">Eksklusiv moms</p>
              <p>{totalPrice} kr.</p>
            </div>
            <div className="w-full justify-between flex flex-row">
              <p className="text-base">Moms (25%)</p>
              <p>{vatPrice} kr.</p>
            </div>
          </div>

          <div className="w-full justify-between text-lg font-medium flex flex-row px-2">
            <h1>Total</h1>
            <h1>{totalPrice + vatPrice} kr.</h1>
          </div>
        </div>
        <div className="content-box md:w-2/3 overflow-y-scroll">
          <h1 className="w-full text-xl font-medium text-center h-10 mb-4">
            Kontaktoplysninger
          </h1>
          <BookRepairForm
            deviceName={{
              brand: formattedBrand,
              model: formattedModel,
              version: formattedVersion,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
