import * as configs from '@/configs';
import nodemailer, { Transporter } from 'nodemailer';
import { EmailSender } from '.';

export default class GmailSender implements EmailSender {
  private transport: Transporter;
  private sourceEmail: string;

  constructor() {
    const { username, password, from, host, port, secure } = configs.system.email.gmail;

    this.transport = nodemailer.createTransport({
      pool: true,
      host,
      port,
      // use TLS
      secure,
      auth: {
        user: username,
        pass: password,
      },
    });
    this.sourceEmail = from;
  }

  sendEmail(receiver: string | string[], title: string, content: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.transport.sendMail({
          from: this.sourceEmail,
          to: receiver,
          subject: title,
          html: content,
        });

        if (!result || result.error) {
          resolve(false);
          return;
        }
        console.log('Gmail sent');
        resolve(Boolean(result?.data?.id));
      } catch (err) {
        console.error('Gmail error', err);
        resolve(false);
      }
    });
  }
}
