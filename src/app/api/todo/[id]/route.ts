import todoModel, { TodoUpdateDto, TodoUpdateSchema } from '@/models/todo';
import { validateRequest } from '@/utils/validator';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const data = await todoModel.getById(parseInt(params.id, 10));
  return Response.json({ success: true, data });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const requestBody = await request.json();
  return validateRequest<TodoUpdateDto>(requestBody, TodoUpdateSchema, async (dto) => {
    const data = await todoModel.update(parseInt(params.id, 10), dto);
    return Response.json({ success: true, data });
  });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const data = await todoModel.remove(parseInt(params.id, 10));
  return Response.json({ success: true, data });
}
