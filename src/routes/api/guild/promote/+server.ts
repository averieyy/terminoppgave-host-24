import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuildMember } from "$lib/server/database/types";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid, memberid }: { guildid: number, memberid: number } = await request.json();
  
  const member = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE userid = $1::integer AND guildid = $2::integer', user.id, guildid)
  if (!member || !member.administrator) return json({ message: 'Unauthorized' }, { status: 403 });

  const target = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE userid = $1::integer AND guildid = $2::integer', memberid, guildid);
  if (!target) return json({ message: 'Member not found' }, { status: 404 });

  if (target.administrator) return json({ message: 'User already an administrator' }, { status: 409 });
  
  await DatabaseConnection.execute('UPDATE guildmembers SET administrator = true WHERE guildid = $1::integer AND userid = $2::integer', guildid, target.userid);

  return json({ message: 'Successfully promoted member' }, { status: 200 });
}