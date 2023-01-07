import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailManager {
  constructor(private configService: ConfigService) {}

  user = this.configService.get('GMAIL_USER');

  pass = this.configService.get('GMAIL_PASSWORD');

  defaultSender = this.user;

  transport: SMTPTransport.Options = {
    service: 'gmail',
    from: this.user,
    auth: {
      user: this.user,
      pass: this.pass,
    },
  };

  createMailOpts = ({
    from = this.defaultSender,
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

  sendEmail = async ({
    from = this.defaultSender,
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
    const transporter = nodemailer.createTransport(this.transport);

    try {
      const info = await transporter.sendMail(
        this.createMailOpts({ from, to, subject, text, html }),
      );
      return info;
    } catch (e) {
      return null;
    }
  };

  sendConfirmationEmail = async ({
    from = this.defaultSender,
    to,
    code,
  }: {
    from?: string;
    to: string;
    code: string;
  }) => {
    const confirmationSubject = 'Confirmation Email';

    const createConfirmationHtml = (
      code: string,
    ) => `<h1>Thank for your registration</h1>
    <p>To finish registration please follow the link below:
      <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
    </p>`;

    const subject = confirmationSubject;
    const html = createConfirmationHtml(code);
    const info = await this.sendEmail({ from, to, subject, html });

    return info;
  };

  sendRecoveryEmail = async ({
    from = this.defaultSender,
    to,
    code,
  }: {
    from?: string;
    to: string;
    code: string;
  }) => {
    const recoverySubject = 'Recovery Email';

    const createRecoveryEmail = (code: string) => `<h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
        <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`;

    const subject = recoverySubject;
    const html = createRecoveryEmail(code);
    const info = await this.sendEmail({ from, to, subject, html });

    return info;
  };
}
