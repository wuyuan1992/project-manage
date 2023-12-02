import * as configs from '@/configs';
import AwsEmailSender from './aws';

export abstract class EmailSender {
  abstract sendEmail(receiver: string | string[], title: string, content: string): Promise<boolean>;
}

function initEmailSender() {
  switch (configs.system.email.provider) {
    case 'AWS':
    default:
      return new AwsEmailSender();
  }
}

const globalForEmailSender = global as unknown as { emailSender: EmailSender };

export const emailSender = globalForEmailSender.emailSender || initEmailSender();

if (process.env.NODE_ENV !== 'production') globalForEmailSender.emailSender = emailSender;

export default emailSender;
