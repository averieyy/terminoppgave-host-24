import { DatabaseConnection } from "./database/connection";
import type { IUser } from "./database/types";
import type { StreamController } from "./stream";
import { createHash, randomBytes } from 'crypto';

export class User {
  
  static users: User[] = [];

  name: string;
  id: number;
  hash: string;
  salt: string;
  cookies: string[] = [];

  constructor (name: string, id: number, hash: string, salt: string) {
    this.name = name;
    this.id = id;
    this.hash = hash;
    this.salt = salt;
  }

  static getFromCookie (cookie: string) : User | undefined {
    return User.users.find(u => u.cookies.includes(cookie));
  }

  genCookie () : string {
    let cookie = randomBytes(16).toString('base64');

    while (User.users.find(u => u.cookies.includes(cookie))) {
      cookie = randomBytes(16).toString('base64');
    }
    
    this.cookies.push(cookie);
    return cookie;
  }

  static genSalt(): string {
    return randomBytes(16).toString('base64');
  }

  static hashPassword(password: string, salt: string) {
    const hash = createHash('shake256');

    hash.update(password + salt);
    
    return hash.digest().toString('base64');
  }

  static async createNewUser (username: string, hash: string, salt: string): Promise<User | undefined> {
    const ids = await DatabaseConnection.queryOne<number[]>('INSERT INTO users (username, hash, salt) VALUES ($1::text, $2::text, $3::text) RETURNING id;', username, hash, salt);
  
    if (ids.length > 0) {
      const id = ids[0];
      const user = new User(username, id, hash, salt);
      User.users.push(user);
      return user;
    }
  }
}

export class Member extends User {
  displayName: string;
  controller: StreamController;

  constructor (user: User, controller: StreamController, displayName: string | undefined) {
    super(User.name, user.id, user.hash, user.salt);

    this.controller = controller;
    this.displayName = displayName || user.name;
  }
}

User.users = (await DatabaseConnection.query<IUser>('SELECT * FROM users;'))
  .map(u => new User(u.username, u.id, u.hash, u.salt));