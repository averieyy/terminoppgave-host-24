import { Channel } from "$lib/server/channel";
import { StreamController } from "$lib/server/stream";
import { Token } from "$lib/server/token";
import { Member } from "$lib/server/user";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params, cookies }) => {
  if (!params.channelid) return json({message: 'Could not find channel'}, { status: 404 });
  const channelid = parseInt(params.channelid as string);

  const channel = await Channel.byId(channelid);
  if (!channel) return json({ message: 'Could not find channel' }, { status: 404 });

  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Not authenticated' }, { status: 403 });
  
  let channelmember : Member;

  const stream = new ReadableStream({
    async start(controller) {
      channelmember = new Member(user, new StreamController(controller), user.username);
      const messages = (await channel.connect(channelmember))
        .sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

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