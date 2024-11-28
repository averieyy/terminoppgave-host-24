import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuildMember } from "$lib/server/database/types";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid }: { guildid: number, memberid: number } = await request.json();
  
  const member = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE userid = $1::integer AND guildid = $2::integer', user.id, guildid)
  if (!member?.administrator) return json({ message: 'Unauthorized' }, { status: 403 });

  await DatabaseConnection.execute('DELETE FROM guildmembers WHERE guildid = $1::integer', guildid);
  await DatabaseConnection.execute('DELETE FROM invitation WHERE guildid = $1::integer', guildid);
  await DatabaseConnection.execute('UPDATE guildsettings SET discoverable = false WHERE guildid = $1::integer', guildid);
  await DatabaseConnection.execute('UPDATE guilds SET name = \'\', description = \'\', deleted = TRUE WHERE id = $1::integer', guildid);

  return json({ message: 'Deleted guild' }, { status: 200 });
}