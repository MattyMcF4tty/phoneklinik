'use server';

import RepairBookingClient from '@lib/clients/repairBookingClient';
import { ErrorBadRequest } from '@schemas/errors/appErrorTypes';
import RepairBooking from '@schemas/repairBooking';
import { ActionResponse } from '@schemas/types';
import { handleActionError } from '@utils/error';
import sendMail from '@utils/mail';

export async function updateBooking(
  prevState: ActionResponse<RepairBooking>,
  formData: FormData
): Promise<ActionResponse<RepairBooking>> {
  try {
    const internalNotes = formData.get('internalNotes')?.toString();
    const deviceName = formData.get('deviceName')?.toString();
    const repairStatus = formData.get('repairStatus')?.toString() as
      | 'pending'
      | 'repairing'
      | 'repaired'
      | 'queued'
      | 'cancelled'
      | 'no_show'
      | undefined;
    const appliedParts = formData
      .getAll('appliedPart')
      .map((part) => parseInt(part.toString(), 10));
    const actualPrice = Number(formData.get('actualPrice')?.toString());

    const bookingData = prevState.data;
    if (!bookingData) {
      throw new ErrorBadRequest(
        'Mangler booking data',
        `Expected booking data in prevState. Got ${bookingData}`
      );
    }

    const updatedBooking = await RepairBookingClient.id(
      bookingData.id
    ).updateBooking({
      internalNotes: internalNotes,
      repairStatus: repairStatus,
      appliedPartVariants: appliedParts,
      actualPrice: actualPrice,
    });

    if (repairStatus === 'repaired') {
      if (!deviceName) {
        throw new ErrorBadRequest(
          'Mangler enheds navn',
          `Missing deviceName in formData. Expected string, got ${deviceName}`
        );
      }

      const bookingMail = updatedBooking.email;
      const pickUpCode = updatedBooking.pickUpCode;

      sendMail(bookingMail, `Din ${deviceName} er klar til afhentning`, {
        plainText: `Hej,
      
      Din enhed (${deviceName}) er nu færdigrepareret og klar til afhentning.
      
      Du kan hente den hos os ved at oplyse følgende afhentningskode: ${pickUpCode}.
      
      Tak fordi du valgte PhoneKlinik – vi står altid klar til at hjælpe igen, hvis du skulle få brug for det.
      
      Venlig hilsen  
      PhoneKlinik`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Hej,</p>
            <p>Din enhed (<strong>${deviceName}</strong>) er nu færdigrepareret og klar til afhentning.</p>
            <p>
              Du kan hente den hos os ved at oplyse følgende afhentningskode:<br />
              <strong style="font-size: 1.2em;">${pickUpCode}</strong>
            </p>
            <p>Tak fordi du valgte PhoneKlinik – vi står altid klar til at hjælpe igen, hvis du skulle få brug for det.</p>
            <p>Venlig hilsen<br/>PhoneKlinik</p>
          </div>
        `,
      });
    }

    return {
      success: true,
      message: 'Booking opdateret',
      data: updatedBooking,
    };
  } catch (err: unknown) {
    return handleActionError(err, 'Noget gik galt under opdatering af booking');
  }
}
