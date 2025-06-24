import ImageZoomWrapper from '@/components/wrappers/ImageZoomWrapper';
import ValuationRequestClient from '@/lib/clients/valuationBookingClient';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import { NextPage } from 'next';
import Image from 'next/image';
import InternalNotesField from '@/components/inputfields/vationRequest/InternalNotesField';
import ValuationField from '@/components/inputfields/vationRequest/ValuationField';
import SubmitValuationButton from './components/SubmitValuationButton';
import RejectValuationButton from './components/RejectValuationButton';
import { notFound } from 'next/navigation';

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

  const valuationRequest = await ValuationRequestClient.id(
    validatedId
  ).getValuationRequest();

  if (!valuationRequest) {
    return notFound();
  }

  const disableUpdate =
    (valuationRequest.valuationStatus !== 'evaluating' &&
      valuationRequest.valuationStatus !== 'pending') ||
    valuationRequest.valuationResponse !== null;

  return (
    <div className="w-full grow flex flex-col gap-8">
      <div className="content-box flex flex-col gap-10">
        <div className="w-full flex justify-center items-center">
          <h1 className="italic">#{valuationRequest.id}</h1>
        </div>

        {/* Header */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-title">
              Evaluering af: {valuationRequest.deviceName}
            </h1>
            <p className="text-subtle">
              Oprettet:{' '}
              {new Date(valuationRequest.createdAt).toLocaleString('da-DK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex flex-col">
            <h2 className="text-subtitle">Status</h2>
            <p className="text-subtle">{valuationRequest.valuationStatus}</p>
          </div>
        </div>

        {/* Customer details */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col w-full">
              <h3>Fornavn</h3>
              <p className="bg-slate-100 p-1 rounded-sm h-8">
                {valuationRequest.firstName}
              </p>
            </div>

            <div className="flex flex-col w-full">
              <h3>Efternavn</h3>
              <p className="bg-slate-100 p-1 rounded-sm h-8">
                {valuationRequest.lastName}
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col w-full">
              <h3>Email</h3>
              <p className="bg-slate-100 p-1 rounded-sm h-8">
                {valuationRequest.email}
              </p>
            </div>

            <div className="flex flex-col w-full">
              <h3>Telefon</h3>
              <p className="bg-slate-100 p-1 rounded-sm h-8">
                {valuationRequest.phoneNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Device info */}
        <div className="flex flex-col gap-4 w-full">
          {/* Billeder */}
          <div className="flex flex-row gap-4 w-full justify-center items-center">
            {/* Forside */}
            <div className="w-full flex justify-center">
              <ImageZoomWrapper
                imageUrl={valuationRequest.images.frontUrl}
                altText="Forside"
              >
                <p>Forside</p>
                <Image
                  className="rounded-md"
                  src={valuationRequest.images.frontUrl}
                  alt="Forside"
                  layout="responsive"
                  width={100}
                  height={100}
                />
              </ImageZoomWrapper>
            </div>

            {/* Bagside */}
            <div className="w-full flex justify-center">
              <ImageZoomWrapper
                imageUrl={valuationRequest.images.rearUrl}
                altText="Bagside"
              >
                <p>Bagside</p>
                <Image
                  className="rounded-md"
                  src={valuationRequest.images.rearUrl}
                  alt="Bagside"
                  layout="responsive"
                  width={100}
                  height={100}
                />
              </ImageZoomWrapper>
            </div>

            {/* Batteri status */}
            <div className="w-full flex justify-center">
              <ImageZoomWrapper
                imageUrl={valuationRequest.images.batteryUrl}
                altText="Batteri status"
              >
                <p>Batteri status</p>
                <Image
                  className="rounded-md"
                  src={valuationRequest.images.batteryUrl}
                  alt="Batteri status"
                  layout="responsive"
                  width={100}
                  height={100}
                />
              </ImageZoomWrapper>
            </div>
          </div>

          {/* Notater */}
          <div className="flex flex-row justify-between gap-4 w-full h-fit">
            {/* Customer notes */}
            <div className="w-full flex flex-col min-h-32">
              <p>Kunde beskrivelse</p>
              <span className="w-full bg-slate-100 rounded-md p-1 h-full">
                {valuationRequest.customerNotes}
              </span>
            </div>

            {/* Internal notes */}
            <div className="w-full flex flex-col min-h-32">
              <p>Interne notater</p>
              <InternalNotesField
                disabled={disableUpdate}
                valuationId={valuationRequest.id}
                defaultValue={valuationRequest.internalNotes}
              />
            </div>
          </div>
        </div>

        {valuationRequest.valuationResponse ? (
          <div className="flex flex-row gap-4 w-full justify-between items-center">
            {/* Customer response */}
            <div className="flex flex-col">
              <p className="w-full text-end">Svar fra kunde</p>
              <span className="w-full bg-slate-100 rounded-md p-1 h-full text-2xl">
                {valuationRequest.valuationResponse ?? 'Ingen svar endnu'}
              </span>
            </div>

            {/* valuation price */}
            <div className="flex flex-col w-40">
              <p>Vurdering af enhed:</p>
              <div className="w-full flex flex-row items-center">
                <ValuationField
                  disabled={disableUpdate}
                  valuationId={valuationRequest.id}
                  defaultValue={valuationRequest.valuation}
                />
                <p className="text-2xl ml-2">kr.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-4">
            {/* valuation price */}
            <div className="flex flex-col w-40">
              <p>Vurdering af enhed:</p>
              <div className="w-full flex flex-row items-center">
                <ValuationField
                  disabled={disableUpdate}
                  valuationId={valuationRequest.id}
                  defaultValue={valuationRequest.valuation}
                />
                <p className="text-2xl ml-2">kr.</p>
              </div>
            </div>
            {!disableUpdate && (
              <div className="w-full flex flex-row gap-4">
                <RejectValuationButton valuationId={valuationRequest.id} />

                <SubmitValuationButton valuationId={valuationRequest.id} />
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
      </div>
    </div>
  );
};

export default ValuationPage;
