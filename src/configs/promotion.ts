import { getBooleanEnv, getStringEnv } from './util';

const promotionConfig = {
  get companyTwitter() {
    return getStringEnv('COMPANY_TWITTER_URL', 'https://x.com');
  },
  get shouldSendEmailAfterRegistration() {
    return getBooleanEnv('SEND_EMAIL_AFTER_REGISTRATION', false);
  },
};

export default promotionConfig;
