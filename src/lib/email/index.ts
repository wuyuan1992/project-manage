import * as configs from '@/configs';
import AwsEmailSender from './aws';
import GmailSender from './gmail';
import ResendEmailSender from './resend';

export abstract class EmailSender {
  abstract sendEmail(receiver: string | string[], title: string, content: string): Promise<boolean>;
}

function initEmailSender() {
  switch (configs.system.email.provider as 'AWS' | 'RESEND' | 'GMAIL') {
    case 'RESEND':
      return new ResendEmailSender();
    case 'AWS':
      return new AwsEmailSender();
    case 'GMAIL':
    default:
      return new GmailSender();
  }
}

const globalForEmailSender = global as unknown as { emailSender: EmailSender };

export const emailSender = globalForEmailSender.emailSender || initEmailSender();

if (process.env.NODE_ENV !== 'production') globalForEmailSender.emailSender = emailSender;

export default emailSender;
