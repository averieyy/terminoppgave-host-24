import { DatabaseConnection } from "./database/connection";
import type { IUser } from "./database/types";
import type { StreamController } from "./stream";
import { randomBytes } from 'crypto';

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

console.log(User.users);