export default interface ValuationRequest {
  id: number;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  deviceName: string;
  customerNotes: string;
  internalNotes: string;
  valuationStatus:
    | 'pending'
    | 'evaluating'
    | 'evaluated'
    | 'rejected'
    | 'bought';
  valutationResponse: 'pending' | 'accepted' | 'rejected' | null;
  valuation: number | null;
  createdAt: string;
  images: {
    frontUrl: string;
    rearUrl: string;
    batteryUrl: string;
  };
}
