import { DatabaseConnection } from "$lib/server/database/connection";
import type { Guild } from "$lib/server/guild";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const token = cookies.get('token');
  const user = await Token.getUserFromToken(token);

  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { uuid }: { uuid: string } = await request.json();

  const guild = await DatabaseConnection.queryOne<Guild>('SELECT guilds.* FROM invitation INNER JOIN guilds ON invitation.guildid = guilds.id WHERE invitation.uuid = $1::text', uuid);
  if (!guild) return json({ message: 'Guild not found' }, { status: 404 });

  const success = await DatabaseConnection.queryOne<{guildid: number}>('INSERT INTO guildmembers (guildid, userid) VALUES ($1::integer, $2::integer) RETURNING guildid;', guild.id, user.id);
  if (!success) return json({ message: 'An error occured while trying to join server.' }, { status: 500 });

  return json({ message: 'Joined server' });
}