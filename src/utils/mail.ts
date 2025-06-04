import nodemailer from 'nodemailer';
import ReactDOMServer from 'react-dom/server'; // ✅ Add this import

export default async function sendMail(
  toEmail: string,
  subject: string,
  body: {
    plainText: string;
    html?: string;
  },
  replyToEmail?: string
) {
  const transporter = nodemailer.createTransport({
    host: 'asmtp.dandomain.dk',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NO_REPLY_MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.NO_REPLY_MAIL,
    to: toEmail,
    subject,
    text: body.plainText,
    html: body.html,
    replyTo: replyToEmail,
  });

  console.log('Email sent:', info.messageId);
}
