export default interface RepairBooking {
  id: number;
  name: string;
  email: string;
  phone: string;

  customerNotes: string;
  internalNotes: string;

  deviceId: number;
  selectedPartVariants: number[];
  appliedPartVariants: number[];

  estimatedPrice: number;
  actualPrice: number;

  status:
    | 'pending'
    | 'repairing'
    | 'repaired'
    | 'queued'
    | 'cancelled'
    | 'no_show';
  pickUpCode: string;

  estimatedRepairTime: number;
  bookingDate: string;
  finishDate: string | null;
  createdAt: string;
}
