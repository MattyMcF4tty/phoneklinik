import ValuationRequestClient from '@/lib/clients/valuationBookingClient';
import AppError from '@/schemas/errors/appError';
import { ErrorBadRequest } from '@/schemas/errors/appErrorTypes';
import { ApiResponse } from '@/schemas/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiResponse>> {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());
  const deviceName = String(data.deviceLabel) || undefined;
  const customerNotes = String(data.customerNotes) || undefined;
  const email = String(data.email) || undefined;
  const phoneNumber = data.phoneNumber ? String(data.phoneNumber) : null;
  const firstName = String(data.firstName) || undefined;
  const lastName = String(data.lastName) || undefined;

  const frontImage = formData.get('frontImage') as Blob | undefined;
  const rearImage = formData.get('rearImage') as Blob | undefined;
  const batteryImage = formData.get('batteryImage') as Blob | undefined;

  // Validate required fields
  if (!firstName) {
    throw new ErrorBadRequest(
      'Mangler fornavn.',
      `Expected firstName in formData, got: ${firstName}`
    );
  }
  if (!lastName) {
    throw new ErrorBadRequest(
      'Mangler efternavn.',
      `Expected lastName in formData, got: ${lastName}`
    );
  }

  if (!deviceName) {
    throw new ErrorBadRequest(
      'Mangler navnet på enheden.',
      `Expected deviceName in formData, got: ${deviceName}`
    );
  }
  if (!email) {
    throw new ErrorBadRequest(
      'Mangler email.',
      `Expected email in formData, got: ${email}`
    );
  }

  if (!customerNotes) {
    throw new ErrorBadRequest(
      'Mangler beskrivelse af enhedens stand.',
      `Expected customerNotes in formData, got: ${customerNotes}`
    );
  }
  if (!frontImage) {
    throw new ErrorBadRequest(
      'Mangler billede af enhedens forside.',
      `Expected frontImage in formData, got: ${frontImage}`
    );
  }
  if (!rearImage) {
    throw new ErrorBadRequest(
      'Mangler billede af enhedens bagside.',
      `Expected rearImage in formData, got: ${rearImage}`
    );
  }
  if (!batteryImage) {
    throw new ErrorBadRequest(
      'Mangler billede af enhedens batteri tilstand.',
      `Expected batteryImage in formData, got: ${batteryImage}`
    );
  }

  await ValuationRequestClient.requestValuation(
    {
      firstName,
      lastName,
      email,
      phoneNumber,
      deviceName,
      customerNotes,
    },
    frontImage,
    rearImage,
    batteryImage
  );

  try {
    return NextResponse.json(
      {
        success: true,
        message: 'Vurdering af enhed anmodet. Du vil høre fra os snarest.',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.httpCode }
      );
    } else {
      console.error('Unexpected error in valuation request:', err);
      return NextResponse.json(
        { success: false, message: 'An unexpected error occurred.' },
        { status: 500 }
      );
    }
  }
}
