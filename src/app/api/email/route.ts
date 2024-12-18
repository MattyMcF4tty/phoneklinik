import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const bodyData = await req.json();
  const title = bodyData.title;
  const body = bodyData.body;

  if (!title) {
    return NextResponse.json(
      { error: 'Missing title in body' },
      { status: 400 }
    );
  }
  if (!body) {
    return NextResponse.json(
      { error: 'Missing body in body' },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NO_REPLY_MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NO_REPLY_MAIL,
    to: process.env.PHONEKLINIK_MAIL,
    subject: title,
    text: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
