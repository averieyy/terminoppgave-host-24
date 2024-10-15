import type { StreamController } from "./stream";

export class User {
  
  static users: User[] = [];

  name: string;
  id: number;
  cookies: string[] = [];

  constructor (name: string) {
    this.name = name;
    this.id = this.genId();

    User.users.push(this);
  }

  static getFromCookie (cookie: string) : User | undefined {
    return User.users.find(u => u.cookies.includes(cookie));
  }

  genId () : number {
    // TODO: Let the database do this.
    const randomNumber = Math.floor(Math.random() * 0x1000000);
    
    // I do not care about duplicates for now, because the database will handle it after a while.
    this.id = randomNumber;
    return randomNumber;
  }

  genCookie () {
    const randomNumber = Math.floor(Math.random() * 0x100000000);
    const cookie = `${this.id.toString(16)}::${randomNumber.toString(16)}`;
    
    this.cookies.push(cookie);
    return cookie;
  }
}

export class Member extends User {
  displayName: string;
  controller: StreamController;

  constructor (user: User, controller: StreamController, displayName: string | undefined) {
    super(User.name);

    this.controller = controller;
    this.displayName = displayName || user.name;
  }
}