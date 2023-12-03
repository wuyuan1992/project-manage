import todoModel, { TodoCreateDto, TodoCreateSchema } from '@/models/todo';
import { validateRequest } from '@/utils/validator';

export async function GET(request: Request) {
  const list = await todoModel.findByAuthorId(1);
  return Response.json({ success: true, data: list });
}

export async function POST(request: Request) {
  const requestBody = await request.json();
  return validateRequest<TodoCreateDto>(requestBody, TodoCreateSchema, async (dto) => {
    const todo = await todoModel.create(dto);
    return Response.json({ success: true, data: todo });
  });
}
