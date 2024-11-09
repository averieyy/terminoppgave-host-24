import { DatabaseConnection } from "./database/connection";
import type { IMessage } from "./database/types";
import type { User } from "./user";

export class Message {
  content: string;
  sender: User;
  datetime: Date;

  constructor (content: string, sender: User, datetime: Date = new Date()) {
    this.content = content;
    this.sender = sender;
    this.datetime = datetime;
  }

  static async fromIMessage(m: IMessage): Promise<Message | undefined> {
    const user = await DatabaseConnection.queryOne<User>('SELECT * FROM users WHERE id = $1::integer', m.senderid);
    if (!user) return;

    return new Message(m.content, user, m.sentat);
  }

  toSendable (): object {
    return {
      content: this.content,
      user: this.sender.username,
      datetime: this.datetime
    }
  }
}