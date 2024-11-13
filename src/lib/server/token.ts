import { DatabaseConnection } from "./database/connection";
import type { IToken } from "./database/types";
import type { User } from "./user";
import { randomBytes } from 'crypto';

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
    const response = await DatabaseConnection.queryOne<{ id: number }>('INSERT INTO tokens (content, userid, expires) VALUES ($1::text, $2::integer, $3::timestamp) RETURNING id;', token, user.id, now);

    if (response?.id) {
      return new Token(response.id, token, user, now);
    }
  }

  static async getUserFromToken(token: string | undefined): Promise<User | undefined> {
    if (!token) return;
    const user = await DatabaseConnection.queryOne<User>('SELECT users.* FROM tokens INNER JOIN users ON users.id = tokens.userid WHERE tokens.content = $1::text;', token);
    return user;
  }
}