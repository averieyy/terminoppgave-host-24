import { DatabaseConnection } from "$lib/server/database/connection";
import type { IUser } from "$lib/server/database/types";
import { User } from "$lib/server/user";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { username, password }: { username: string, password: string } = await request.json();

  if (!username) return json({ message: 'Username missing' }, { status: 400 });
  if (!password) return json({ message: 'Password missing' }, { status: 400 });

  // Check if the password is good
  if (password.length < 8) return json({ message: 'Password must be 8 characters or longer' }, { status: 400 });

  // Check if username if unique
  const users = await DatabaseConnection.query<IUser>('SELECT * FROM users WHERE username = $1::text', username);
  if (users.length > 0) return json({ message: 'Username already in use' }, { status: 409 });

  // Unique username and good password
  const salt = User.genSalt();
  const hash = User.hashPassword(password, salt);

  const user = await User.createNewUser(username, hash, salt);

  if (!user) return json({ message: 'An error occured while trying to create new user' }, { status: 500 });

  const token = user.genCookie();

  cookies.set('token', token, { path: '/', secure: false });

  return json({ message: 'Registered new user successfully' }, { status: 200 });
}