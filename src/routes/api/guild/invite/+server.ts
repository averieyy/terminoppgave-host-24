import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuildMember } from "$lib/server/database/types";
import type { Guild } from "$lib/server/guild";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";
import { randomUUID } from 'crypto';

export const POST : RequestHandler = async ({ cookies, request }) => {
  const token = cookies.get('token');
  const user = await Token.getUserFromToken(token);
  
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid }: { guildid: number } = await request.json();

  const guild = await DatabaseConnection.queryOne<Guild>('SELECT * FROM guilds WHERE id = $1::integer', guildid);
  if (!guild) return json({ message: 'Could not find guild' }, { status: 404 });

  const guildmember = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE guildid = $1::integer', guildid);
  if (!guildmember || !guildmember.administrator) return json({ message: 'Unauthorized' }, { status: 403 });

  const uuid = randomUUID();

  const success = await DatabaseConnection.queryOne<{ uuid: string }>('INSERT INTO invitation (guildid, uuid) VALUES ($1::integer, $2::text) RETURNING uuid;', guildid, uuid);
  if (!success) return json({ message: 'An error occured while trying to create invitation.' }, { status: 500 });

  return json({ uuid });
}