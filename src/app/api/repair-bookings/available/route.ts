import RepairBookingClient from '@/lib/clients/repairBookingClient';
import AppError from '@/schemas/errors/appError';
import { ApiResponse } from '@schemas/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest
): Promise<NextResponse<ApiResponse<string[]>>> {
  try {
    const searchParams = req.nextUrl.searchParams;
    const dateString = searchParams.get('date') || '';

    const date = new Date(dateString);

    const timeSlots = await RepairBookingClient.getAvailableSlots(date);

    return NextResponse.json(
      {
        message: `Found ${timeSlots.length} timeslots.`,
        success: true,
        data: timeSlots,
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
