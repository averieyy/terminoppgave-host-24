import { Channel } from "$lib/server/channel";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { IChannel, IGuildMember } from "$lib/server/database/types";
import { Guild } from "$lib/server/guild";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { channelid, guildid, name }: { channelid: number, name: string, guildid: number } = await request.json();
  if (!channelid || !name) return json({ message: 'channel id or channel name missing' }, { status: 400 });
  if (!Channel.nameValid(name)) return json({ message: 'Channel name invalid' }, { status: 400 });

  // Check if the user is admin
  const guildmember = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE guildid = $1::integer AND userid = $2::integer', guildid, user.id);
  if (!guildmember?.administrator) return json({ message: 'Unauthorized' }, { status: 403 })

  const guild = await DatabaseConnection.queryOne<Guild>('SELECT * FROM guilds WHERE id = $1::integer;', guildid);
  if (!guild) return json({ message: 'Guild not found' }, { status: 404 });

  const existingChannel = await DatabaseConnection.queryOne<IChannel>('SELECT * FROM channel WHERE id = $1::integer AND guildid = $2::integer;', channelid, guildid);
  if (!existingChannel) return json({ message: `Channel not found` }, { status: 404 });

  // Add channel
  await DatabaseConnection.execute('UPDATE channel SET name = $1::text WHERE id = $2::integer', name, channelid);

  return json({ message: 'Channel edited' });
}