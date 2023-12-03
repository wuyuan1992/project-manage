import * as configs from '@/configs';
import { Resend } from 'resend';
import { EmailSender } from '.';

export default class ResendEmailSender implements EmailSender {
  private resend: Resend;
  private sourceEmail: string;

  constructor() {
    const { apiKey, sourceEmail } = configs.system.email.resend;
    this.resend = new Resend(apiKey);
    this.sourceEmail = sourceEmail;
  }

  sendEmail(receiver: string | string[], title: string, content: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.resend.emails.send({
          from: this.sourceEmail,
          to: receiver,
          subject: title,
          html: content,
        });

        if (!result || result.error) {
          resolve(false);
          return;
        }
        console.error('Resend sent email');
        resolve(Boolean(result?.data?.id));
      } catch (err) {
        console.error('Resend error', err);
        resolve(false);
      }
    });
  }
}
