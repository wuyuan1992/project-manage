export async function GET(request: Request, { params }: { params: { id: string } }) {
  const todoId = parseInt(params.id);
  return Response.json({ msg: `get detail of todo by id ${todoId}` });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const todoId = parseInt(params.id);
  const data = request.body;
  return Response.json({ msg: `update todo by id ${todoId}`, data });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const todoId = parseInt(params.id);
  const data = request.body;
  return Response.json({ msg: `delete todo by id ${todoId}` });
}
