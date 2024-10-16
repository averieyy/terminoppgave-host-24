import type { User } from "./user";

export class Message {
  content: string;
  sender: User;
  id: number;
  datetime: Date;

  constructor (content: string, sender: User, datetime: Date = new Date()) {
    this.content = content;
    this.sender = sender;
    this.id = this.genId();
    this.datetime = datetime;
  }

  genId() {
    const id = Math.floor(Math.random() * 0x100000000);
    return id;
  }

  toSendable (): object {
    return {
      content: this.content,
      user: this.sender.name,
      datetime: this.datetime
    }
  }
}