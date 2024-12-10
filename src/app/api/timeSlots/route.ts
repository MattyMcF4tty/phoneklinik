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
      requested_month: new Date(month).toISOString(),
    });

    console.log(timeSlots);

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
  const requestedTime = bodyData.requestedTime;
  const customerEmail = bodyData.customerEmail;

  if (!requestedTime || isNaN(Date.parse(requestedTime))) {
    return NextResponse.json(
      { error: `${requestedTime} is not a valid date object.` },
      { status: 400 }
    );
  } /* else if (
    typeof customerEmail != 'string' ||
    emailRegex.test(customerEmail)
  ) {
    return NextResponse.json(
      { error: `${customerEmail} is not a valid email.` },
      { status: 400 }
    );
  } */

  try {
    const timeSlots = await handleSupabaseFunction('reserve_time_slot', {
      requested_time: new Date(requestedTime).toISOString(),
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
