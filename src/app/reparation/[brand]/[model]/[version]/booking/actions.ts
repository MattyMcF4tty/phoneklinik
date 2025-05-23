'use server';

import RepairBookingClient from '@/lib/clients/repairBookingClient';
import { ActionResponse } from '@/schemas/new/types';

export default async function bookRepair(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  console.log('Form data:', formData);
  try {
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const customerNotes = formData.get('customerNotes') as string;
    const bookingDate = formData.get('bookingDate') as string;
    const bookingTime = formData.get('bookingTime') as string;
    const deviceId = formData.get('deviceId') as string;
    const deviceParts = formData.getAll('partIds').map(Number);

    if (!email || !firstName || !lastName || !deviceId) {
      return {
        success: false,
        message: 'Udfyld venligst alle felter.',
      };
    }
    if (!deviceParts.length) {
      return {
        success: false,
        message: 'Vælg venligst en eller flere dele.',
      };
    }

    if (!bookingDate || !bookingTime) {
      return {
        success: false,
        message: 'Vælg venligst en dato og et tidspunkt.',
      };
    }
    if (isNaN(Number(deviceId))) {
      console.error('Invalid device ID:', deviceId);
      return {
        success: false,
        message:
          'Der skete en fejl under booking af reparation. Prøv venligst igen.',
      };
    }
    if (deviceParts.some((partId) => isNaN(partId))) {
      console.error('Invalid device part in selected parts:', deviceParts);
      return {
        success: false,
        message:
          'Der skete en fejl under booking af reparation. Prøv venligst igen.',
      };
    }

    const name = firstName + ' ' + lastName;

    const booking = await RepairBookingClient.bookRepair({
      email,
      phone,
      name,
      customerNotes,
      bookingDate: new Date(`${bookingDate}T${bookingTime}`).toISOString(),
      reportedBrokenParts: deviceParts,
      deviceId: Number(deviceId),
    });

    console.log('Booking successful:', booking);

    return {
      success: true,
      message: 'Booking er gennemført. Du vil modtage en bekræftelse på email.',
    };
  } catch (err: unknown) {
    console.error(err);
    return {
      success: false,
      message:
        'Der skete en fejl under booking af reparation. Prøv venligst igen.',
    };
  }
}
