import { Channel } from "$lib/server/channel";
import { Message } from "$lib/server/message";
import { User } from "$lib/server/user";
import type { RequestHandler } from "@sveltejs/kit";

export const POST : RequestHandler = async ({ cookies, params, request }) => {
  const channelid = params.channelid;
  if (!channelid) return new Response('Channel not found', { status: 404 });
  
  const channel = Channel.byId(parseInt(channelid));
  if (!channel) return new Response('Channel not found', { status: 404 });

  const cookie = cookies.get('token');
  if (!cookie) return new Response('Not authenticated token', { status: 403 });

  const user = User.getFromCookie(cookie);
  if (!user) return new Response('Not authenticated user', { status: 403 });

  const { content } = await request.json();
  if (!content) return new Response('Requires body field "content"', { status: 400 });

  const messageobject = new Message(content, user);

  channel.messages.push(messageobject);

  channel.broadcast(messageobject.toSendable(), 'channelmessage');

  for (let message of channel.messages) {
    console.log(message.content);
  }

  return new Response('Works well (totally)', { status: 200 });
}