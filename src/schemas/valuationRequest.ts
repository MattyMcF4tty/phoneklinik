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
  valuationResponse: 'pending' | 'accepted' | 'rejected' | null;
  valuation: number | null;
  createdAt: string;
  images: {
    frontUrl: string;
    rearUrl: string;
    batteryUrl: string;
  };
}

export type LimitedValuationRequest = Pick<
  ValuationRequest,
  | 'id'
  | 'deviceName'
  | 'email'
  | 'valuationResponse'
  | 'valuationStatus'
  | 'valuation'
>;
