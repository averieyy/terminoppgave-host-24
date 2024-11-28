import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuildMember } from "$lib/server/database/types";
import type { Guild } from "$lib/server/guild";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";
import { randomUUID } from 'crypto';

export const POST : RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid, custom }: { guildid: number, custom: string } = await request.json();

  // Test for bad links
  if (custom.match(/[^a-z0-9-_]/) || custom.length < 3) return json({ message: 'Bad request' }, { status: 400 });

  const guild = await DatabaseConnection.queryOne<Guild>('SELECT * FROM guilds WHERE id = $1::integer', guildid);
  if (!guild) return json({ message: 'Could not find guild' }, { status: 404 });

  const guildmember = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE guildid = $1::integer AND userid = $2::integer', guildid, user.id);
  if (!guildmember?.administrator) return json({ message: 'Unauthorized' }, { status: 403 });

  const existinginvite = await DatabaseConnection.queryOne<{ uuid: string }>('SELECT * FROM invitation WHERE uuid = $1::text OR customlink = $1::text', custom);
  if (existinginvite) return json({ message: 'An invitation with that link already exists' }, { status: 409 });

  const uuid = randomUUID();

  const success = await DatabaseConnection.queryOne<{ uuid: string }>('INSERT INTO invitation (guildid, uuid, customlink) VALUES ($1::integer, $2::text, $3::text) RETURNING uuid;', guildid, uuid, custom);
  if (!success) return json({ message: 'An error occured while trying to create invitation.' }, { status: 500 });

  return json({ custom });
}