import { emailRegex, timeRegex } from '@/schemas/customTypes';
import { handleSupabaseFunction } from '@/utils/config/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const month = searchParams.get('month');

  if (!month || isNaN(Date.parse(month))) {
    return NextResponse.json(
      { error: `${month} is not a valid date object.` },
      { status: 400 }
    );
  }

  try {
    const timeSlots = await handleSupabaseFunction('get_reserved_time_slots', {
      month: new Date(month),
    });

    return NextResponse.json({ data: timeSlots }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const requestedDate = bodyData.requestedDate;
  const requestedTime = bodyData.requestedTime;
  const customerEmail = bodyData.customerEmail;

  if (!requestedDate || isNaN(Date.parse(requestedDate))) {
    return NextResponse.json(
      { error: `${requestedDate} is not a valid date object.` },
      { status: 400 }
    );
  } else if (!requestedTime || timeRegex.test(requestedTime)) {
    return NextResponse.json(
      { error: `${requestedTime} is not a valid time. Must be HH:MM:SS` },
      { status: 400 }
    );
  } else if (
    typeof customerEmail != 'string' ||
    emailRegex.test(customerEmail)
  ) {
    return NextResponse.json(
      { error: `${customerEmail} is not a valid email.` },
      { status: 400 }
    );
  }

  try {
    const timeSlots = await handleSupabaseFunction('reserve_time_slot', {
      requested_date: new Date(requestedDate),
      requested_time: requestedTime,
      requester_email: customerEmail,
    });

    const timeSlot = timeSlots[0];

    return NextResponse.json({ data: timeSlot }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
