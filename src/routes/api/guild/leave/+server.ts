import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuildMember } from "$lib/server/database/types";
import { Guild } from "$lib/server/guild";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const token = cookies.get('token');
  const user = await Token.getUserFromToken(token);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid }: { guildid: number } = await request.json();

  const guild = await DatabaseConnection.queryOne<Guild>('SELECT * FROM guilds WHERE id = $1::integer', guildid);
  if (!guild) return json({ messages: 'Guild not found' }, { status: 404 });

  const guildmember = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE userid = $1::integer AND guildid = $2::integer', user.id, guildid);
  if (!guildmember) return json({ message: 'User not member of guild' }, { status: 403 });

  await DatabaseConnection.execute('DELETE FROM guildmembers WHERE userid = $1::integer AND guildid = $2::integer', user.id, guildid);

  return json({ message: 'Left guild' }, { status: 200 });
}