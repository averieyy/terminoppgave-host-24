import type { Cookies } from "@sveltejs/kit";
import { DatabaseConnection } from "./database/connection";
import type { IFile, IToken } from "./database/types";
import { User } from "./user";
import { randomBytes } from 'crypto';

export const TOKEN_TIMEOUT = 60 * 60 * 24 * 7; // One week

export class Token {
  id: number;
  content: string;
  user: User;
  expires: Date;
  
  constructor (id: number, content: string, user: User, expires: Date) {
    this.id = id;
    this.content = content;
    this.user = user;
    this.expires = expires;
  }

  static async createNewToken(user: User): Promise<Token | undefined> {
    let token = randomBytes(16).toString('base64');
    
    while ((await DatabaseConnection.query<IToken>('SELECT * FROM tokens WHERE content = $1::text', token)).length !== 0) {
      token = randomBytes(16).toString('base64');
    }

    const now = new Date();
    const response = await DatabaseConnection.queryOne<{ id: number }>('INSERT INTO tokens (content, userid, expires) VALUES ($1::text, $2::integer, $3::timestamp) RETURNING id;', token, user.id, new Date(now.getTime() + TOKEN_TIMEOUT));

    if (response?.id) {
      return new Token(response.id, token, user, now);
    }
  }

  static async getUserFromToken(cookies: Cookies): Promise<User | undefined> {
    const token = cookies.get('token');
    if (!token) return;

    const now = Date.now();

    // Remove old tokens
    await DatabaseConnection.execute('DELETE FROM tokens WHERE expires < NOW()');

    const user_token = await DatabaseConnection.queryOne<User & IToken>('SELECT * FROM tokens INNER JOIN users ON users.id = tokens.userid WHERE tokens.content = $1::text;', token);

    if (!user_token || user_token.expires.getTime() < now) return;

    // Update token
    await DatabaseConnection.execute('UPDATE tokens SET expires = $1::timestamp WHERE content = $2::text', new Date(now + TOKEN_TIMEOUT * 1000), token);
    cookies.set('token', token, { path: '/', secure: false, maxAge: TOKEN_TIMEOUT });

    // Get pfp
    const pfp = await DatabaseConnection.queryOne<IFile>('SELECT f.* FROM pfp p INNER JOIN files f ON f.id = p.fileid WHERE userid = $1::integer', user_token.userid);

    return new User(
      user_token.username,
      user_token.userid,
      user_token.hash,
      user_token.salt,
      user_token.bio,
      pfp?.path
    );
  }
}