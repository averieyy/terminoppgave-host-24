import { sendMessage } from "$lib/server/stream";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ params, cookies }) => {
  console.log(params);
  
  if (!params.channelid) return new Response('Could not find channel', { status: 404 });
  const channelid = parseInt(params.channelid as string);

  // TODO: Authenticate User

  // TODO: Connect to an actual channel

  let streamactive = false;
  let interval : number;

  const stream = new ReadableStream({
    start(controller) {
      streamactive = true;

      interval = setInterval(() => {
        if (controller) {
          const successful = sendMessage(controller, JSON.stringify({
            type: 'message',
            data: {
              user: 'admin',
              content: `This is a basic message. You are currently in channel ${channelid}. It is currently ${Date.now()}`,
            }
          }));

          if (!successful) streamactive = false;
        }
        if (!streamactive) clearInterval(interval);
      }, 1000);
    },
    cancel() {
      streamactive = false;
      clearInterval(interval);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  });
}