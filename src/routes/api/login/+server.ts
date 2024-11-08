import { DatabaseConnection } from "$lib/server/database/connection";
import type { IUser } from "$lib/server/database/types";
import { User } from "$lib/server/user";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {

  const { username, password } : { username: string, password: string } = await request.json();

  if (!username || !password) {
    return json({message: 'Username or password missing'}, { status: 400 });
  }

  if (password.length < 8) {
    return new Response('Password has to be longer than 8 characters', { status: 400 });
  }

  const db = new DatabaseConnection();

  const user = await DatabaseConnection.queryOne<IUser>('SELECT * from users where username = $1::text', username);
  if (!user) return json({message: 'Could not find user'}, { status: 404 });

  const userobj = User.users.find(u => u.id == user.id);

  if (!userobj) return json({message: 'Could not find user'}, { status: 404 })

  const cookie = userobj.genCookie();

  console.log(userobj);

  cookies.set('token', cookie, { path: '/', secure: false });

  return new Response('Logged in as ' + username);
}