'use server';

import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import sendMail from '@/utils/mail';
import { ActionResponse } from '@schemas/types';
import { handleActionError } from '@utils/error';

export async function contactPhoneKlinik(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const phoneNumber = formData.get('phoneNumber')?.toString();
    const message = formData.get('message')?.toString();

    if (!email) {
      throw new ErrorBadRequest(
        'Du skal angive din e-mailadresse.',
        `Expected email string in formdata. got ${email}`
      );
    }
    if (!name) {
      throw new ErrorBadRequest(
        'Du skal angive dit navn.',
        `Expected name string in formdata. got ${name}`
      );
    }
    if (!phoneNumber) {
      throw new ErrorBadRequest(
        'Du skal angive dit telefonnummer.',
        `Expected phoneNumber string in formdata. got ${phoneNumber}`
      );
    }
    if (!message) {
      throw new ErrorBadRequest(
        'Du skal skrive en besked.',
        `Expected message string in formdata. got ${message}`
      );
    }

    await sendMail(
      process.env.NEXT_PUBLIC_PHONEKLINIK_MAIL!,
      'Kunde spørgsmål',
      {
        plainText: `
      ${message}\n\n
      Kontakt oplysninger:\n
      ${email}
      ${phoneNumber}`,
      },
      email
    );

    return {
      success: true,
      message: 'Tak for din henvendelse. Vi vender tilbage hurtigst muligt.',
    };
  } catch (err: unknown) {
    return handleActionError(err, 'Noget gik galt under indsendelse');
  }
}
