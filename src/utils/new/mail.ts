import nodemailer from 'nodemailer';
import ReactDOMServer from 'react-dom/server'; // ✅ Add this import

export default function sendMail(
  fromEmail: string,
  toEmail: string,
  subject: string,
  body: {
    plainText: string;
    html?: string;
  }
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

  (async () => {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text: body.plainText,
      html: body.html,
    });

    console.log('Email sent:', info.messageId);
  })();
}
