import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuildMember } from "$lib/server/database/types";
import type { Guild } from "$lib/server/guild";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid }: { guildid: number } = await request.json();

  const guild = await DatabaseConnection.queryOne<Guild>('SELECT guilds.* FROM guildsettings INNER JOIN guilds ON guilds.id = guildsettings.guildid WHERE guildsettings.discoverable = TRUE AND guildsettings.guildid = $1::integer', guildid);
  if (!guild) return json({ message: 'Guild not found' }, { status: 403 });

  const member = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE userid = $1::integer AND guildid = $2::integer', user.id, guildid);
  if (member) return json({ message: 'Already a member' }, { status: 200 });

  await DatabaseConnection.execute('INSERT INTO guildmembers (guildid, userid) VALUES ($1::integer, $2::integer)', guildid, user.id);

  return json({ message: 'Joined guild' }, { status: 200 });
}