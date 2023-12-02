export async function GET(request: Request) {
  return Response.json({ msg: 'get todo list' });
}

export async function POST(request: Request) {
  return Response.json({ msg: 'create todo' });
}
