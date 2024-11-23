import { DatabaseConnection } from "$lib/server/database/connection";
import type { IFile } from "$lib/server/database/types";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";
import { existsSync, readFileSync, statSync } from 'fs';

export const GET: RequestHandler = async ({ cookies, params }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 404 });

  const file = await DatabaseConnection.queryOne<IFile>('SELECT * FROM files WHERE path = $1::text', params.fileid);
  if (!file) return json({ message: 'File not found' }, { status: 404 });

  const filepath = './uploads/'+file.path;
  if (!existsSync(filepath) || !statSync(filepath).isFile()) return json({ message: 'File not found' }, { status: 404 });
  const filecontent = readFileSync(filepath);

  const mimetype = 
    ['application/xhtml+xml', 'text/html'].includes(file.mime) ? 'text/plain' // Test if the file is html or xhtml (should be shown as plaintext)
    : file.mime;

  return new Response(filecontent, { headers: { 'Content-Type': mimetype } });
}