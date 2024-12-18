export interface TimeSlotSchema {
  id: number;
  time: string;
}

export class TimeSlot {
  id: number;
  time: Date;

  constructor(timeSlot: TimeSlotSchema) {
    this.id = timeSlot.id;
    this.time = new Date(timeSlot.time);
  }
}
