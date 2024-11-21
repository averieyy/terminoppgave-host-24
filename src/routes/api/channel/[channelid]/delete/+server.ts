import { Channel } from "$lib/server/channel";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { IMessage, IGuildMember } from "$lib/server/database/types";
import { Token } from "$lib/server/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ cookies, request, params }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  if (!params.channelid) return json({ message: 'Missing channelid' }, { status: 400 })

  const channel = await Channel.byId(parseInt(params.channelid));
  if (!channel) return json({ message: 'Channel not found' }, { status: 404 });

  const member = await DatabaseConnection.queryOne<IGuildMember>('SELECT guildmembers.* FROM channel INNER JOIN guildmembers ON channel.guildid = guildmembers.guildid WHERE channel.id = $1::integer AND guildmembers.userid = $2::integer', params.channelid, user.id);
  
  if (!member) return json({ message: 'Unauthorized' }, { status: 403 });
  
  const { messageid }: { messageid: number } = await request.json();
  const message = await DatabaseConnection.queryOne<IMessage>('SELECT * FROM messages WHERE channelid = $1::integer AND id = $2::integer', params.channelid, messageid);
  if (!message || !(member.administrator || member.userid == message.senderid))
    json({ message: 'Unauthorized' }, { status: 403 });

  await DatabaseConnection.execute('DELETE FROM textcontent WHERE messageid = $1::integer', messageid);
  await DatabaseConnection.execute('DELETE FROM filecontent WHERE messageid = $1::integer', messageid);
  await DatabaseConnection.execute('DELETE FROM imagecontent WHERE messageid = $1::integer', messageid);
  await DatabaseConnection.execute('DELETE FROM textfilecontent WHERE messageid = $1::integer', messageid);
  await DatabaseConnection.execute('UPDATE messages SET deleted = true WHERE id = $1::integer', messageid);

  channel.broadcast({ id: messageid }, 'delete');

  return json({ message: 'Deleted message' }, { status: 200 });
}