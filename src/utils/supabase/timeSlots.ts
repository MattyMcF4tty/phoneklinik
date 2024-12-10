import { TimeSlot, TimeSlotSchema } from '@/schemas/timeSlotSchema';
import { validateEmail, validateTime } from '../misc';
import { Time } from '@/schemas/customTypes';

export const reserveTimeSlot = async (
  requestedTime: Date,
  customerEmail: string
): Promise<TimeSlot> => {
  // Validate arguments
  /*   const validatedEmail = validateEmail(customerEmail);
   */
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/timeSlots`,
    {
      method: 'POST',
      cache: 'no-cache',
      body: JSON.stringify({
        requestedTime: requestedTime.toDateString(),
        customerEmail: customerEmail,
      }),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error);
  }

  const timeSlotData = responseData.data;

  const timeSlot = new TimeSlot(timeSlotData);

  return timeSlot;
};

export const getResveredTimeSlots = async (
  month: Date
): Promise<TimeSlot[]> => {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_WEBSITE_URL
    }/api/timeSlots?month=${month.toDateString()}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error);
  }

  const timeSlotsData = responseData.data;

  if (timeSlotsData.lenght <= 0) {
    return [];
  }

  const timeSlots = timeSlotsData.map((timeSlot: TimeSlotSchema) => {
    return new TimeSlot(timeSlot);
  });

  return timeSlots;
};
