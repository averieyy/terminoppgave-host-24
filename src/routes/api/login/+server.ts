import { User } from "$lib/server/user";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = ({ cookies }) => {
  const user = new User('user');
  const cookie = user.genCookie();

  cookies.set('token', cookie, { path: '/' });

  return new Response('asdf');
}