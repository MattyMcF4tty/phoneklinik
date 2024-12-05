import { Time } from './customTypes';

export interface TimeSlotSchema {
  id: number;
  date: Date;
  time: Time;
  customerEmail: string | null;
  status: string | null;
}

export class TimeSlot implements TimeSlotSchema {
  id: number;
  date: Date;
  time: Time;
  customerEmail: string | null;
  status: string | null;

  constructor(timeSlot: TimeSlotSchema) {
    this.id = timeSlot.id;
    this.date = timeSlot.date;
    this.time = timeSlot.time;
    this.customerEmail = timeSlot.customerEmail;
    this.status = timeSlot.status;
  }
}
