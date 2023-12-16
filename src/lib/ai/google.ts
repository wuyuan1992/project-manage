import * as configs from '@/configs';
import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import { AI } from '.';

export default class GoogleAI implements AI {
  private completionModel: GenerativeModel;
  private visionModel: GenerativeModel;

  constructor() {
    const { apiKey, model, visionModel, generationConfig } = configs.system.ai.google;
    const client = new GoogleGenerativeAI(apiKey);

    this.completionModel = client.getGenerativeModel({
      model,
      generationConfig,
    });

    this.visionModel = client.getGenerativeModel({
      model: visionModel,
      generationConfig,
    });
  }

  async completion<T>(prompt: string): Promise<T> {
    try {
      const result = await this.completionModel.generateContent(prompt).then((res) => res.response);
      return result.text() as T;
    } catch (err) {
      console.log('GoogleAI completionModel fetch error', err);
      throw new Error('GoogleAI completionModel fetch error');
    }
  }

  async vision<T>(prompt: string, files: { path: string; mimeType: string }[]): Promise<T> {
    try {
      // [
      //   { path: "image1.png", mimeType: "image/png") },
      //   { path: "image2.jpeg", mimeType: "image/jpeg") },
      // ];
      const images = files.map((file) => fileToGenerativePart(file));

      const result = (await this.visionModel.generateContent([prompt, ...images]).then((res) => res.response)).text();
      return result as T;
    } catch (err) {
      console.log('GoogleAI visionModel fetch error', err);
      throw new Error('GoogleAI visionModel fetch error');
    }
  }

  async chat<T>(prompt: string, history: { role: 'user' | 'model'; parts: string }[] = []): Promise<T> {
    const chat = this.completionModel.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1024,
      },
    });
    const result = (await chat.sendMessage(prompt)).response.text();
    console.log(result);
    return result as T;
  }
}

function fileToGenerativePart({ path, mimeType }: { path: string; mimeType: string }) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  };
}
