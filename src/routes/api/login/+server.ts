import { User } from "$lib/server/user";
import type { RequestHandler } from "@sveltejs/kit";

// Debug purposes
export const GET: RequestHandler = ({ cookies }) => {
  const user = new User('user');
  const cookie = user.genCookie();

  cookies.set('token', cookie, { path: '/', secure: false });

  return new Response('asdf');
}

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { username, password } : { username: string, password: string } = await request.json();

  if (!username || !password) {
    return new Response('Username or password missing', { status: 400 });
  }

  if (password.length < 8) {
    return new Response('Password has to be longer than 8 characters', { status: 400 });
  }

  const user = new User(username);
  const cookie = user.genCookie();

  cookies.set('token', cookie, { path: '/', secure: false });

  return new Response('Logged in as ' + username);
}