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
    return json({ message: 'Password has to be longer than 8 characters' }, { status: 400 });
  }

  const user = await DatabaseConnection.queryOne<IUser>('SELECT * from users where username = $1::text', username);
  if (!user) return json({message: 'Could not find user'}, { status: 404 });

  const userobj = User.users.find(u => u.id == user.id);

  if (!userobj) return json({message: 'Could not find user'}, { status: 404 });

  if (User.hashPassword(password, user.salt) !== user.hash)
    return json({ message: 'Password does not match' }, { status: 200 });

  const cookie = userobj.genCookie();

  cookies.set('token', cookie, { path: '/', secure: false });

  return json({ message: 'Logged in as ' + username }, { status: 200 });
}