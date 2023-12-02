import todoModel, { TodoCreateDto } from '@/models/todo';

export async function GET(request: Request) {
  const list = await todoModel.findByAuthorId(1);
  return Response.json({ success: true, data: list });
}

export async function POST(request: Request) {
  const dto = await request.json();
  const todo = await todoModel.create(dto as TodoCreateDto);
  return Response.json({ success: true, data: todo });
}
