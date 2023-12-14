import * as configs from '@/configs';
import CloudflareAI from './cloudflare';
import GoogleAI from './google';

export abstract class AI {
  abstract completion<T>(prompt: string): Promise<T>;
}

function initAI() {
  switch (configs.system.ai.provider as 'CLOUDFLARE' | 'GOOGLE') {
    case 'CLOUDFLARE':
      return new CloudflareAI();
    case 'GOOGLE':
    default:
      return new GoogleAI();
  }
}

const globalForAI = global as unknown as { ai: AI };

export const ai = globalForAI.ai || initAI();

if (process.env.NODE_ENV !== 'production') globalForAI.ai = ai;

export default ai;
