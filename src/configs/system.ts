import { getStringEnv } from './util';

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
    provider: getStringEnv('EMAIL_PROVIDER', 'AWS'),
    aws: {
      accessKeyId: getStringEnv('AWS_ACCESS_KEY_ID'),
      secretAccessKey: getStringEnv('AWS_SECRET_ACCESS_KEY'),
      sourceEmail: getStringEnv('AWS_SES_SOURCE_EMAIL'),
      awsRegion: getStringEnv('AWS_REGION', 'ap-northeast-2'),
    },
  };
}
