import RepairBookingClient from '@lib/clients/repairBookingClient';
import AppError from '@schemas/errors/appError';
import { ErrorBadRequest } from '@schemas/errors/appErrorTypes';
import RepairBooking from '@schemas/repairBooking';
import { ApiResponse } from '@schemas/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<RepairBooking[]>>> {
  try {
    const searchParams = req.nextUrl.searchParams;

    const startString = searchParams.get('startDate');
    const endString = searchParams.get('endDate');

    if (!startString) {
      throw new ErrorBadRequest(
        'Mangler periode start dato.',
        'Missing startDate parameter'
      );
    }
    if (!endString) {
      throw new ErrorBadRequest(
        'Mangler periode slut dato.',
        'Missing endDate parameter'
      );
    }

    const startDate = new Date(startString);
    const endDate = new Date(endString);

    // Validate dates
    if (isNaN(startDate.getTime())) {
      throw new ErrorBadRequest(
        'Ugyldig periode start dato.',
        `Invalid startDate parameter. Expected ISO string, got: ${startString}`
      );
    }
    if (isNaN(endDate.getTime())) {
      throw new ErrorBadRequest(
        'Ugyldig periode slut dato.',
        `Invalid endDate parameter. Expected ISO string, got: ${endString}`
      );
    }

    // Check if end is after start
    if (startDate.getTime() > endDate.getTime()) {
      throw new ErrorBadRequest(
        'Ugyldig periode.',
        `Invalid period. startDate cannot be later than endDate.`
      );
    }

    const bookings = await RepairBookingClient.getBookings({
      start: startDate,
      end: endDate,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Found ${bookings.length} bookings in period.`,
        data: bookings,
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
