import * as configs from '@/configs';
import CloudflareAI from './cloudflare';
import GoogleAI from './google';

export interface History {
  role: 'user' | 'model';
  parts: string;
}

export abstract class AI {
  abstract completion<T>(prompt: string): Promise<T>;
  abstract chat<T>(prompt: string, history?: History[]): Promise<T>;
  abstract vision<T>(prompt: string, files: { path: string; mimeType: string }[]): Promise<T>;
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
