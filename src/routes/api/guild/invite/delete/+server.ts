import { DatabaseConnection } from '$lib/server/database/connection';
import type { IGuildMember } from '$lib/server/database/types';
import { Token } from '$lib/server/token.js'
import { json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid, uuid }: { guildid: number, uuid: string } = await request.json();

  const guildmember = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE guildid = $1::integer AND userid = $2::integer AND administrator = TRUE', guildid, user.id);
  if (!guildmember) return json({ message: 'Unauthorized' }, { status: 403 });

  const invitation = await DatabaseConnection.queryOne<{uuid: string}>('SELECT uuid FROM invitation WHERE guildid = $1::integer AND uuid = $2::text', guildid, uuid);
  if (!invitation) return json({ message: 'Could not find invitation' }, { status: 404 });

  await DatabaseConnection.execute('DELETE FROM invitation WHERE uuid = $1::text', uuid);

  return json({ message: 'Removed inviation' }, { status: 200 });
}