import { ZodType } from 'zod';

export async function validateRequest<T>(data: T, schema: ZodType<T>, handler: (data: T) => void) {
  const response = schema.safeParse(data);

  if (response.success) {
    return handler(response.data);
  }
  return new Response(JSON.stringify({ message: 'Invalid request', errors: response.error.errors }), {
    status: 422,
  });
}
