import * as configs from '@/configs';
import { AI } from '.';

export default class CloudflareAI implements AI {
  private baseUrl = 'https://api.cloudflare.com/client/v4';

  async completion<T>(prompt: string): Promise<T> {
    const { apiEmail, apiKey, identifier, model } = configs.system.ai.cloudflare;

    try {
      const response = await fetch(`${this.baseUrl}/accounts/${identifier}/ai/run/${model}`, {
        body: JSON.stringify({ prompt }),
        headers: {
          'X-Auth-Email': apiEmail,
          'X-Auth-Key': apiKey,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const data = await response.json();

      if (!data?.success || !data?.result?.response) {
        console.log('CloudflareAI response error', data);
        throw new Error('CloudflareAI response error');
      }
      return data.result.response;
    } catch (err) {
      console.log('CloudflareAI fetch error', err);
      throw new Error('CloudflareAI fetch error');
    }
  }
}
