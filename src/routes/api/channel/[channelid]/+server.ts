import { Channel } from "$lib/server/channel";
import { Message } from "$lib/server/message";
import { StreamController } from "$lib/server/stream";
import { Member, User } from "$lib/server/user";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ params, cookies }) => {
  console.log(params);
  
  if (!params.channelid) return new Response('Could not find channel', { status: 404 });
  const channelid = parseInt(params.channelid as string);

  const channel = Channel.byId(channelid);
  if (!channel) return new Response('Could not find channel', { status: 404 });

  const token = cookies.get('token');
  if (!token) return new Response('Not authenticated', { status: 403 });

  const user = User.getFromCookie(token);
  if (!user) return new Response('Not authenticated', { status: 403 });
  
  let channelmember : Member;

  const stream = new ReadableStream({
    start(controller) {
      channelmember = new Member(user, new StreamController(controller), 'user');
      const messages = channel.connect(channelmember);
      
      channelmember.controller.sendMessage('history', messages.map(m => m.toSendable()));
    },
    cancel() {
      channel.disconnect(channelmember);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  });
}