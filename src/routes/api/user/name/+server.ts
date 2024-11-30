import { DatabaseConnection } from "$lib/server/database/connection";
import { Token } from "$lib/server/token";
import { User } from "$lib/server/user";
import { json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { username }: { username: string } = await request.json();
  // Check username
  if (!User.usernameValid(username)) return json({ message: 'Username not valid' }, { status: 400 })

  const existing = await DatabaseConnection.queryOne<{username: string}>('SELECT username FROM users WHERE username = $1::text', username);
  if (existing) return json({ message: 'Username already in use' }, { status: 409 });

  await DatabaseConnection.execute('UPDATE users SET username = $1::text WHERE id = $2::integer', username, user.id);

  return json({ message: "Updated username" }, { status: 200 });
}