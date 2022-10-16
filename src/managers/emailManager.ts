import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_PASSWORD;

const defaultSender = `Student <${user}>`;

const transport: SMTPTransport.Options = {
  service: 'gmail',
  auth: {
    user,
    pass,
  },
};

const createMailOpts = ({
  from = defaultSender,
  to,
  subject,
  text,
  html,
}: {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}): Mail.Options => {
  const opts: Mail.Options = {};
  console.log(html);
  opts.from = from;
  opts.to = to;
  opts.subject = subject;

  if (text) opts.text = text;
  if (html) opts.html = html;

  console.log(opts)
  return opts;
};

const sendEmail = async ({
  from = defaultSender,
  to,
  subject,
  text,
  html,
}: {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  const transporter = nodemailer.createTransport(transport);

  try {
    const info = await transporter.sendMail(
      createMailOpts({ from, to, subject, text, html })
    );
    return info;
  } catch (e) {
    return null;
  }
};

const confirmationHtml = `<h1>Thank for your registration</h1>
  <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
 </p>`;

const confirmatinoSubject = 'Confirmation Email';

export const sendConfirmationEmail = async ({
  from = defaultSender,
  to,
  subject = confirmatinoSubject,
  html = confirmationHtml,
}: {
  from?: string;
  to: string;
  subject?: string;
  html?: string;
}) => {
  const info = await sendEmail({ from, to, subject, html });

  return info;
};
