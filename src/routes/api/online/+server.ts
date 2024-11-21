import { Token } from "$lib/server/token";
import { OnlineMemberIds } from "$lib/server/user";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
  const user = await Token.getUserFromToken(cookies);
  if (!user) return json({ message: 'Unauthorized' }, { status: 403 });

  const stream = new ReadableStream({
    start() {
      if (!OnlineMemberIds.includes(user.id)) OnlineMemberIds.push(user.id);
    },
    cancel () {
      if (OnlineMemberIds.includes(user.id)) OnlineMemberIds.splice(
        OnlineMemberIds.indexOf(user.id), 1
      );
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream'
    },
    status: 201
  });
}