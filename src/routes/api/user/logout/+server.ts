import { DatabaseConnection } from "$lib/server/database/connection";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  await DatabaseConnection.execute('DELETE FROM tokens WHERE content = $1::text', cookies.get('token'));
  cookies.delete('token', { path: '/' });

  return json({ message: 'Logged out' }, { status: 200 });
}