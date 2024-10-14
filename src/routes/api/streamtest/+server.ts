import type { RequestHandler } from "@sveltejs/kit";

export const GET : RequestHandler = () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue('data: asdf\n\n');

      setInterval(() => controller.enqueue('data: This is a message from the server.\n\n'), 1000);
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    }
  });
}