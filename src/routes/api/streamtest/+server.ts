import { DatabaseConnection } from "$lib/server/database/connection";
import type { User } from "$lib/server/user";
import type { RequestHandler } from "@sveltejs/kit";

export const GET : RequestHandler = () => {
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue('data: asdf\n\n');
      
      const users = (await DatabaseConnection.pool.query<User>('SELECT * FROM users;')).rows;

      console.log(users);

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