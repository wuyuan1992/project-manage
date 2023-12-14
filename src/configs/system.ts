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
  get ai() {
    return getAIEnv();
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

function getAIEnv() {
  return {
    provider: getStringEnv('AI_PROVIDER', 'GOOGLE'),
    cloudflare: {
      apiEmail: getStringEnv('CLOUDFLARE_API_EMAIL'),
      apiKey: getStringEnv('CLOUDFLARE_API_KEY'),
      identifier: getStringEnv('CLOUDFLARE_IDENTIFIER'),
      model: getStringEnv('CLOUDFLARE_AI_MODEL'),
    },
    google: {
      model: getStringEnv('GOOGLE_AI_MODEL', 'gemini-pro'),
      visionModel: getStringEnv('GOOGLE_AI_VISION_MODEL', 'gemini-pro-vision'),
      apiKey: getStringEnv('GOOGLE_GEMINI_API_KEY'),
      generationConfig: {
        maxOutputTokens: getNumericEnv('GOOGLE_GEMINI_API_CONFIG_MAX_TOKEN', 2048),
        temperature: getNumericEnv('GOOGLE_GEMINI_API_CONFIG_TEMPERATURE', 0.9),
        topP: getNumericEnv('GOOGLE_GEMINI_API_CONFIG_TOP_P', 0.1),
        topK: getNumericEnv('GOOGLE_GEMINI_API_CONFIG_TOP_K', 16),
      },
    },
  };
}
