import { getTasks } from '@/utils/ai/getCompletion';

export async function GET(request: Request) {
  const q = new URLSearchParams(new URL(request.url).search).get('q');
  if (!q) {
    return Response.json({ success: false, url: request.url });
  }

  const prompt = decodeURIComponent(q);
  const data = await getTasks(prompt);

  return Response.json({ success: true, prompt, data });
}
