import { Channel } from "$lib/server/channel";
import { DatabaseConnection } from "$lib/server/database/connection";
import { Message } from "$lib/server/message";
import { Token } from "$lib/server/token";
import { User } from "$lib/server/user";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST : RequestHandler = async ({ cookies, params, request }) => {
  const channelid = params.channelid;
  if (!channelid) return json({ message: 'Channel not found' }, { status: 404 });
  
  const channel = await Channel.byId(parseInt(channelid));
  if (!channel) return json({ message: 'Channel not found' }, { status: 404 });

  const cookie = cookies.get('token');
  if (!cookie) return json({ message: 'Not authenticated token' }, { status: 403 });

  const user = await Token.getUserFromToken(cookie);
  if (!user) return json({ message: 'Not authenticated user' }, { status: 403 });

  const { content, datetime } : { content: string, datetime: number } = await request.json();
  if (!content) return json({ message: 'Requires body field "content"' }, { status: 400 });

  const messageobject = new Message(content, user, new Date(datetime));

  // Log to database
  await DatabaseConnection.execute('INSERT INTO messages (content, senderid, channelid, sentat) VALUES ($1::text, $2::integer, $3::integer, $4::timestamp)',
    messageobject.content,
    messageobject.sender.id,
    channelid,
    messageobject.datetime);

  channel.broadcast(messageobject.toSendable(), 'channelmessage');

  return json({ message: 'Message sent in channel' }, { status: 200 });
}