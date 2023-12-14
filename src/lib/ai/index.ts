import * as configs from '@/configs';
import CloudflareAI from './cloudflare';

export abstract class AI {
  abstract completion<T>(prompt: string): Promise<T>;
}

function initAI() {
  switch (configs.system.ai.provider as 'CLOUDFLARE') {
    case 'CLOUDFLARE':
    default:
      return new CloudflareAI();
  }
}

const globalForAI = global as unknown as { ai: AI };

export const ai = globalForAI.ai || initAI();

if (process.env.NODE_ENV !== 'production') globalForAI.ai = ai;

export default ai;
