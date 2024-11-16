import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuildMember, IGuildSettings } from "$lib/server/database/types";
import { Guild } from "$lib/server/guild";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ cookies, request }) => {
  const token = cookies.get('token');
  const user = await Token.getUserFromToken(token);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid, guild, guildsettings }: {
    guildid: number,
    guild: Guild,
    guildsettings: IGuildSettings
  } = await request.json();

  const guildmember = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE guildid = $1::integer AND userid = $2::integer', guildid, user.id);

  if (!guildmember?.administrator) return json({ message: 'Unauthorized' }, { status: 403 });
  
  const guildexists = !!DatabaseConnection.queryOne<Guild>('SELECT * FROM guilds WHERE id = $1::integer', guildid);
  if (!guildexists) return json({ message: 'Not found' }, { status: 404 });

  const guildsettingsexist = !!DatabaseConnection.queryOne<IGuildSettings>('SELECT * FROM guildsettings WHERE guildid = $1::integer', guildid);
  if (!guildsettingsexist) DatabaseConnection.execute('INSERT INTO guildsettings (guildid, discoverable) VALUES ($1::integer, $2::boolean)', guildsettings.guildid, guildsettings.discoverable)
  else {
    DatabaseConnection.execute('UPDATE guildsettings SET discoverable = $1::boolean WHERE guildid = $2::integer', guildsettings.discoverable, guildid);
  }
  DatabaseConnection.execute('UPDATE guilds SET name = $1::text, colour = $2::text, description = $3::text WHERE id = $4::integer', guild.name, guild.colour, guild.description, guildid);

  return json({ message: 'Updated' }, { status: 200 });
}