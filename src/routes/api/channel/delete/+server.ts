import { Channel } from "$lib/server/channel";
import { DatabaseConnection } from "$lib/server/database/connection";
import type { IGuildMember, IChannel } from "$lib/server/database/types";
import { Guild } from "$lib/server/guild";
import { Token } from "$lib/server/token";
import { ChannelMembers } from "$lib/server/user";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const { guildid, channelid }: { guildid: number, channelid: number } = await request.json();
  if (!guildid || !channelid) return json({ message: 'Guild id missing' }, { status: 400 });
  
  // Check if the user is admin
  const guildmember = await DatabaseConnection.queryOne<IGuildMember>('SELECT * FROM guildmembers WHERE guildid = $1::integer AND userid = $2::integer', guildid, user.id);
  if (!guildmember?.administrator) return json({ message: 'Unauthorized' }, { status: 403 })

  const guild = await DatabaseConnection.queryOne<Guild>('SELECT * FROM guilds WHERE id = $1::integer;', guildid);
  if (!guild) return json({ message: 'Guild not found' }, { status: 404 });

  // Check if channel exists
  const channel = await DatabaseConnection.queryOne<IChannel>('SELECT * FROM channel WHERE id = $1::integer AND guildid = $2::integer', channelid, guildid);
  if (!channel) return json({ message: 'Channel not found' }, { status: 404 });

  const chanobj = await Channel.byId(channelid);
  if (!chanobj) return json({ message: 'An error occured while trying to delete channel' }, { status: 500 })
  
  // Broadcast the deletion of the channel
  chanobj.broadcast({
    channelid
  }, 'channeldelete');

  // Delete channel
  await DatabaseConnection.execute('DELETE FROM textcontent c USING messages m WHERE c.messageid = m.id AND m.channelid = $1::integer', channelid);
  await DatabaseConnection.execute('DELETE FROM filecontent c USING messages m WHERE c.messageid = m.id AND m.channelid = $1::integer', channelid);
  await DatabaseConnection.execute('DELETE FROM messages WHERE channelid = $1::integer', channelid);
  await DatabaseConnection.execute('DELETE FROM channel WHERE id = $1::integer AND guildid = $2::integer', channelid, guildid);

  ChannelMembers[channelid] = [];

  return json({ message: 'Channel deleted' });
}