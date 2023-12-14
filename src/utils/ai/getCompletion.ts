import ai from '@/lib/ai';

export default function getCompletion(prompt: string) {
  return ai.completion<string>(prompt);
}
