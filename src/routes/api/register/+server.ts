import { DatabaseConnection } from "$lib/server/database/connection";
import { Token, TOKEN_TIMEOUT } from "$lib/server/token";
import { User } from "$lib/server/user";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { username, password }: { username: string, password: string } = await request.json();

  if (!username) return json({ message: 'Username missing' }, { status: 400 });
  if (!password) return json({ message: 'Password missing' }, { status: 400 });

  // Check if the username is good
  if (User.usernameValid(username)) return json({ message: 'Your username must be between 3 and 16 characters long and can only include lowercase english letters, numbers, dashes, and underscores.'}, { status: 400 });

  // Check if the password is good
  if (password.length < 8) return json({ message: 'Password must be 8 characters or longer' }, { status: 400 });

  // Check if username if unique
  const existing = await DatabaseConnection.queryOne<User>('SELECT * FROM users WHERE username = $1::text', username);
  if (existing) return json({ message: 'Username already in use' }, { status: 409 });

  const salt = User.genSalt();
  const hash = User.hashPassword(password, salt);

  const user = await User.createNewUser(username, hash, salt);
  if (!user) return json({ message: 'An error occured while trying to create new user' }, { status: 500 });

  const token = await Token.createNewToken(user);
  if (!token) return json({ message: 'An error occured while trying to store token' }, { status: 500 })

  cookies.set('token', token.content, { path: '/', secure: false, maxAge: TOKEN_TIMEOUT });

  return json({ message: 'Registered new user successfully' }, { status: 200 });
}