import { DatabaseConnection } from "./database/connection";
import type { IMessage } from "./database/types";
import { FileContent, type MessageContent, TextContent } from "./messagecontent";
import { readFileSync } from 'fs';
import type { User } from "./user";

export class Message {
  sender: User;
  datetime: Date;
  content: MessageContent[];
  id: number;
  deleted: boolean;
  replyto?: Message;

  constructor (content: MessageContent[], sender: User, datetime: Date = new Date(), id: number, replyto?: Message, deleted = false) {
    this.content = content;
    this.sender = sender;
    this.datetime = datetime;
    this.id = id;
    this.replyto = replyto;
    this.deleted = deleted;
  }

  static async fromIMessage(m: IMessage): Promise<Message | undefined> {
    const user = await DatabaseConnection.queryOne<User>('SELECT * FROM users WHERE id = $1::integer', m.senderid);
    if (!user) return;

    const messagecontent: MessageContent[] = [
      ...(await DatabaseConnection.query<{content: string}>(
        'SELECT content FROM textcontent WHERE messageid = $1::integer',
        m.id))
        .map(c => new TextContent(c.content)),
      ...(await DatabaseConnection.query<{path: string,displayname: string, mime: string}>(
        'SELECT path, displayname, mime FROM filecontent INNER JOIN files ON files.id = filecontent.fileid WHERE messageid = $1::integer',
        m.id))
        .map(c => new FileContent(c.path, c.displayname, c.mime)),
    ];

    const fetchReply: () => Promise<Message | undefined> = async () => {
      if (m.replyto) {
        const reply = await DatabaseConnection.queryOne<IMessage>('SELECT * FROM messages WHERE id = $1::integer AND channelid = $2::integer', m.replyto, m.channelid);
        if (!reply || reply.channelid !== m.channelid) return;

        const message = await this.fromIMessage(reply);
        return message;
      }
      else return;
    }

    return new Message(messagecontent, user, m.sentat, m.id, await fetchReply(), m.deleted);
  }

  toSendable (): object {
    return {
      content: this.content,
      user: this.sender.username,
      datetime: this.datetime,
      id: this.id,
      senderid: this.sender.id,
      replyto: this.replyto ? {
        id: this.replyto.id,
        sender: !this.replyto.deleted && this.replyto.sender.username,
        content: !this.replyto.deleted ? this.replyto.content : [],
        deleted: this.replyto.deleted
      } : null
    }
  }
}