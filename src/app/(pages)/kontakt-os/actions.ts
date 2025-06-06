'use server';

import AppError from '@/schemas/errors/appError';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import { ActionResponse } from '@/schemas/types';
import sendMail from '@/utils/mail';

export async function contactPhoneKlinik(formData: FormData) {
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const phoneNumber = formData.get('phoneNumber')?.toString();
  const message = formData.get('message')?.toString();

  if (!email) {
    throw new ErrorBadRequest(
      'Mangler email.',
      `Expected email string in formdata. got ${email}`
    );
  }
  if (!name) {
    throw new ErrorBadRequest(
      'Mangler navn.',
      `Expected name string in formdata. got ${name}`
    );
  }
  if (!phoneNumber) {
    throw new ErrorBadRequest(
      'Mangler telefon nummer.',
      `Expected phoneNumber string in formdata. got ${phoneNumber}`
    );
  }
  if (!message) {
    throw new ErrorBadRequest(
      'Mangler besked.',
      `Expected message string in formdata. got ${message}`
    );
  }

  try {
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

    return;
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error(err.details);
    } else {
      console.error('An error occurred while submitting valuation:', err);
    }
    return;
  }
}
