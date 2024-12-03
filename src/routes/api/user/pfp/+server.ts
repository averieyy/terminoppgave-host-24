import { DatabaseConnection } from "$lib/server/database/connection";
import type { IFile } from "$lib/server/database/types";
import { Token } from "$lib/server/token";
import { User } from "$lib/server/user";
import { json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { path }: { path: string } = await request.json();

  // Get file id
  const file = await DatabaseConnection.queryOne<IFile>('SELECT * FROM files WHERE path = $1::text', path);
  if (!file) return json({ message: 'Image not found' }, { status: 404 });
  if (!file.mime.startsWith('image')) return json({ message: 'Image file is not an image' }, { status: 400 });

  // Check if the user has a profile picture
  const existing = await DatabaseConnection.queryOne<{username: string}>('SELECT userid FROM pfp WHERE userid = $1::integer', user.id);
  if (!existing) await DatabaseConnection.execute('INSERT INTO pfp (userid, fileid) VALUES ($1::integer, $2::integer)', user.id, file.id);
  else await DatabaseConnection.execute('UPDATE pfp SET fileid = $1::integer WHERE userid = $2::integer', file.id, user.id);

  return json({ message: "Updated profile picture" }, { status: 200 });
}