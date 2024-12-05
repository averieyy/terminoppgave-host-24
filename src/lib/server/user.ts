import { DatabaseConnection } from "./database/connection";
import type { StreamController } from "./stream";
import { createHash, randomBytes, randomInt } from 'crypto';

export class User {
  
  username: string;
  id: number;
  hash: string;
  salt: string;
  pfp?: string;
  bio: string;

  constructor (name: string, id: number, hash: string, salt: string, bio: string, pfp?: string) {
    this.username = name;
    this.id = id;
    this.hash = hash;
    this.salt = salt;
    this.pfp = pfp;
    this.bio = bio;
  }

  static usernameValid (username: string) {
    return username.length >= 3 && username.length <= 16 && !username.match(/[^a-z0-9-_]/);
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
    const rawid = await DatabaseConnection.queryOne<{ id: number }>('INSERT INTO users (username, hash, salt) VALUES ($1::text, $2::text, $3::text) RETURNING id;', username, hash, salt);

    const id = rawid?.id;

    if (id) {
      const user = new User(username, id, hash, salt, '', undefined);
      return user;
    }
  }
}

export class Member extends User {
  displayName: string;
  controller: StreamController;

  constructor (user: User, controller: StreamController, displayName: string | undefined) {
    super(User.name, user.id, user.hash, user.salt, user.bio, user.pfp);

    this.controller = controller;
    this.displayName = displayName || user.username;
  }
}

export const ChannelMembers: {[ key: number ]: Member[]} = {};
export const OnlineMemberIds: number[] = [];