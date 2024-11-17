import { DatabaseConnection } from "$lib/server/database/connection";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";
import { randomUUID } from 'crypto';
import { existsSync, writeFileSync, statSync, mkdirSync } from 'fs';

export const POST: RequestHandler = async ({ cookies, request }) => {
  const token = cookies.get('token');
  const user = Token.getUserFromToken(token);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return json({ message: 'File feild required' }, { status: 400 });

  if (file.size >= 25165824) return json({ message: 'File too big' }, { status: 400 });

  const filename = randomUUID();

  // Write to file
  if (!existsSync('./uploads') || !statSync('./uploads').isDirectory())
    mkdirSync('./uploads');

  writeFileSync('./uploads/' + filename, Buffer.from(await file.arrayBuffer()));

  DatabaseConnection.execute('INSERT INTO files (path, displayname, mime, uploaded) VALUES ($1::text, $2::text, $3::text, $4::timestamp)', filename, file.name, file.type, new Date());

  return json({ path: filename });
}