import type { User } from "./user";

export class Message {
  content: string;
  sender: User;
  id: number;

  constructor (content: string, sender: User) {
    this.content = content;
    this.sender = sender;
    this.id = this.genId();
  }

  genId() {
    const id = Math.floor(Math.random() * 0x100000000);
    return id;
  }

  toSendable (): object {
    return {
      content: this.content,
      user: this.sender.name
    }
  }
}