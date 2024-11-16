import { DatabaseConnection } from "$lib/server/database/connection";
import type { IFile } from "$lib/server/database/types";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";
import { existsSync, readFileSync, statSync } from 'fs';

export const GET: RequestHandler = async ({ cookies, params }) => {
  const token = cookies.get('token');
  const user = Token.getUserFromToken(token);
  if (!user) return json({ message: 'Unauthorized' }, { status: 404 });

  const file = await DatabaseConnection.queryOne<IFile>('SELECT * FROM files WHERE path = $1::text', params.fileid);
  if (!file) return json({ message: 'File not found' }, { status: 404 });

  const filepath = './uploads/'+file.path;
  if (!existsSync(filepath) || !statSync(filepath).isFile()) return json({ message: 'File not found' }, { status: 404 });

  return json({
    displayname: file.displayname,
    mime: file.mime,
    uploaded: file.uploaded,
    path: file.path
  });
}