import ValuationList from '@components/lists/valutionList/List';
import ValuationRequestClient from '@lib/clients/valuationBookingClient';
import { NextPage } from 'next';

const AdminValuationPage: NextPage = async ({}) => {
  const [
    requestsAwaitingValuation,
    requestsAwaitingResponse,
    requestsAwaitingPurchase,
    requestsBought,
    requestsRejectedByCustomer,
    requestsRejectedByInternal,
  ] = await Promise.all([
    ValuationRequestClient.query().valuationStatus('pending'),
    ValuationRequestClient.query().valuationResponse('pending'),
    ValuationRequestClient.query().valuationResponse('accepted'),
    ValuationRequestClient.query().valuationStatus('bought'),
    ValuationRequestClient.query().valuationResponse('rejected'),
    ValuationRequestClient.query().valuationStatus('rejected'),
  ]);

  return (
    <div className="flex grow w-full flex-col gap-8">
      {/* Pending evaluation */}
      <ValuationList
        important={true}
        title="Afventer vurdering"
        valuationRequests={requestsAwaitingValuation}
      />

      {/* Pending customer response */}
      <ValuationList
        title="Afventer svar fra kunde"
        valuationRequests={requestsAwaitingResponse}
      />

      {/* Pending purchase */}
      <ValuationList
        title="Afventer køb"
        valuationRequests={requestsAwaitingPurchase}
      />

      {/* Bought */}
      <ValuationList title="Købt" valuationRequests={requestsBought} />

      {/* Rejected by seller */}
      <ValuationList
        title="Afvist af kunde"
        valuationRequests={requestsRejectedByCustomer}
      />

      {/* Rejected by us */}
      <ValuationList
        title="Afvist af os"
        valuationRequests={requestsRejectedByInternal}
      />
    </div>
  );
};

export default AdminValuationPage;
