import { DatabaseConnection } from "$lib/server/database/connection";
import type { IChannel } from "$lib/server/database/types";
import { Guild } from "$lib/server/guild";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);

  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid, name }: { guildid: number, name: string } = await request.json();
  if (!guildid || !name) return json({ message: 'Guild id or channel name missing' }, { status: 400 });

  const guild = await DatabaseConnection.queryOne<Guild>('SELECT * FROM guilds WHERE id = $1::integer;', guildid);
  if (!guild) return json({ message: 'Guild not found' }, { status: 404 });

  const existingChannel = await DatabaseConnection.queryOne<IChannel>('SELECT * FROM channel WHERE guildid = $1::integer AND name = $2::text;', guildid, name);
  if (existingChannel) return json({ message: `A channel called ${name} already exists in ${guild.name}` }, { status: 409 });

  // Add channel
  const channelid = await DatabaseConnection.queryOne<{ id: number }>('INSERT INTO channel (name, guildid) VALUES ($1::text, $2::integer) RETURNING id;', name, guildid);
  if (!channelid) return json({ message: 'An error occured while trying to add channel' }, { status: 500 });

  return json({ id: channelid.id });
}