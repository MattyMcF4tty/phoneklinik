import RepairBookingClient from '@/lib/clients/repairBookingClient';
import AppError from '@/schemas/errors/appError';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const dateString = searchParams.get('date') || '';

    const date = new Date(dateString);

    const timeSlots = await RepairBookingClient.getAvailableSlots(date);

    return NextResponse.json({ data: timeSlots }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      console.error('Error:', err.details);
      return NextResponse.json(
        { error: err.message },
        { status: err.httpCode }
      );
    }
    return NextResponse.json({ error: 'Noget gik galt' }, { status: 500 });
  }
}
