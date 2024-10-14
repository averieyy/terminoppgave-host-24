import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ params, cookies }) => {
  console.log(params);
  
  if (!params.channelid) return new Response('Could not find channel', { status: 404 });
  const channelid = parseInt(params.channelid as string);

  return new Response(`Channel id: ${channelid}`);
}