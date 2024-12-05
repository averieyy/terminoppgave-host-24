import { DatabaseConnection } from "$lib/server/database/connection";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { biography }: { biography?: string } = await request.json();
  if (biography && biography.length > 128) return json({ message: 'Bio too long' }, { status: 400 });

  await DatabaseConnection.execute('UPDATE users SET bio = $1::text WHERE id = $2::integer', biography, user.id);

  return json({ message: 'Updated biography' }, { status: 200 });
}