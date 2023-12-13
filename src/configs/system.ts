import { getBooleanEnv, getNumericEnv, getStringEnv } from './util';

const systemConfig = {
  get supabase() {
    return getSupabaseEnv();
  },
  get postgres() {
    return getPostgresEnv();
  },
  get email() {
    return getEmailEnv();
  },
  get app() {
    return getAppEnv();
  },
};

export default systemConfig;

// implements
function getSupabaseEnv() {
  return {
    projectUrl: getStringEnv('NEXT_PUBLIC_SUPABASE_URL'),
    apiKey: getStringEnv('SUPABASE_SERVICE_ROLE_KEY'),
  };
}

function getPostgresEnv() {
  return { url: getStringEnv('POSTGRES_PRISMA_URL') };
}

function getEmailEnv() {
  return {
    provider: getStringEnv('EMAIL_PROVIDER', 'GMAIL'),
    aws: {
      accessKeyId: getStringEnv('AWS_ACCESS_KEY_ID'),
      secretAccessKey: getStringEnv('AWS_SECRET_ACCESS_KEY'),
      sourceEmail: getStringEnv('AWS_SES_SOURCE_EMAIL'),
      awsRegion: getStringEnv('AWS_REGION', 'ap-northeast-2'),
    },
    resend: {
      apiKey: getStringEnv('RESEND_API_KEY'),
      sourceEmail: getStringEnv('RESEND_SOURCE_EMAIL'),
    },
    gmail: {
      username: getStringEnv('GMAIL_USERNAME'),
      password: getStringEnv('GMAIL_PASSWORD'),
      from: getStringEnv('GMAIL_SENDER_FROM'),
      host: getStringEnv('GMAIL_SENDER_HOST'),
      port: getNumericEnv('GMAIL_SENDER_PORT', 465),
      secure: getBooleanEnv('GMAIL_SENDER_SECURE', true),
    },
  };
}

function getAppEnv() {
  return {
    name: getStringEnv('APP_NAME', 'Wuyuan'),
    website: getStringEnv('APP_WEBSITE', 'http://www.x.com'),
  };
}
