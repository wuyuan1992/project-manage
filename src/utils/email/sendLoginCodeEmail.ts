import * as configs from '@/configs';
import emailSender from '@/lib/email';
import tokenEmailRenderer from './templates/code';

export default function sendLoginCodeEmail(receiver: string | string[], code: string) {
  const { name, website } = configs.system.app;

  const title = `Login Code [${code}]. From ${name}}`;
  const tokenEmailContent = tokenEmailRenderer({
    validationCode: code,
    appName: name,
    appUrl: website,
  });
  return emailSender.sendEmail(receiver, title, tokenEmailContent);
}
