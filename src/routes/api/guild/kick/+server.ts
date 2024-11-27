import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuildMember } from "$lib/server/database/types";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid, userid }: { guildid: number, userid: number } = await request.json();

  const usermember = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE userid = $1::integer AND guildid = $2::integer', user.id, guildid);
  if (!usermember?.administrator) return json({ message: 'Unauthorized' }, { status: 403 });

  const targetmember = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE userid = $1::integer AND guildid = $2::integer', userid, guildid);
  if (!targetmember) return json({ message: 'Could not find user' }, { status: 404 });
  if (targetmember.administrator) return json({ message: 'User is administrator' }, { status: 409 });

  await DatabaseConnection.execute('DELETE FROM guildmembers WHERE guildid = $1::integer AND userid = $2::integer', guildid, userid);

  return json({ message: 'Kicked member' }, { status: 200 });
}