export default interface RepairBooking {
  id: number;
  name: string;
  email: string;
  phone: string;

  customerNotes: string;
  internalNotes: string;

  deviceId: number;
  reportedBrokenParts: number[];
  actualBrokenParts: number[];

  status:
    | 'pending'
    | 'repairing'
    | 'repaired'
    | 'queued'
    | 'cancelled'
    | 'no_show';
  pickUpCode: number;

  estimatedRepairTime: number;
  bookingDate: string;
  finishDate: string | null;
  createdAt: string;
}
