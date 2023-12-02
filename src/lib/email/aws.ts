import * as configs from '@/configs';
import { Credentials, SES } from 'aws-sdk';
import { EmailSender } from '.';

export default class AwsEmailSender implements EmailSender {
  private ses: SES;
  private sourceEmail: string;

  constructor() {
    const { accessKeyId, secretAccessKey, awsRegion, sourceEmail } = configs.system.email.aws;

    this.ses = new SES({
      region: awsRegion,
      credentials: new Credentials({
        accessKeyId,
        secretAccessKey,
      }),
    });

    this.sourceEmail = sourceEmail;
  }

  sendEmail(receiver: string | string[], title: string, content: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.ses.sendEmail(
        {
          Source: this.sourceEmail,
          Destination: {
            ToAddresses: Array.isArray(receiver) ? receiver : [receiver],
          },
          Message: {
            Subject: {
              Charset: 'UTF-8',
              Data: title,
            },
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: content,
              },
            },
          },
        },
        (err, data) => {
          if (err) {
            console.error('AWS SES error', err);
            resolve(false);
          } else {
            console.log(data);
            resolve(true);
          }
        },
      );
    });
  }
}
