import todoModel, { TodoUpdateDto } from '@/models/todo';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const data = await todoModel.getById(parseInt(params.id, 10));
  return Response.json({ success: true, data });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const todoId = parseInt(params.id, 10);
  const dto = await request.json();

  const data = await todoModel.update(todoId, dto as TodoUpdateDto);
  return Response.json({ success: true, data });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const data = await todoModel.remove(parseInt(params.id, 10));
  return Response.json({ success: true, data });
}
