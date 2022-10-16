import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_PASSWORD;

// const defaultSender = `Student <${user}>`;
const defaultSender = user as string;

const transport: SMTPTransport.Options = {
  service: 'gmail',
  from: user,
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
  opts.from = from;
  opts.to = to;
  opts.subject = subject;

  if (text) opts.text = text;
  if (html) opts.html = html;

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

const createConfirmationHtml = (
  code: string
) => `<h1>Thank for your registration</h1>
  <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
 </p>`;

const confirmatinoSubject = 'Confirmation Email';

export const sendConfirmationEmail = async ({
  from = defaultSender,
  to,
  code,
}: {
  from?: string;
  to: string;
  code: string;
}) => {
  const subject = confirmatinoSubject;
  const html = createConfirmationHtml(code);
  const info = await sendEmail({ from, to, subject, html });

  return info;
};
