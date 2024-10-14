import type { User } from "./user";

export class Message {
  content: string;
  sender: User;
  id: number;

  constructor (content: string, sender: User, id: number) {
    this.content = content;
    this.sender = sender;
    this.id = id;
  }
}