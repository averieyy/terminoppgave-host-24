import { DatabaseConnection } from "./database/connection";
import type { IMessage } from "./database/types";
import { FileContent, ImageContent, type MessageContent, TextContent } from "./messagecontent";
import type { User } from "./user";

export class Message {
  sender: User;
  datetime: Date;
  content: MessageContent[];

  constructor (content: MessageContent[], sender: User, datetime: Date = new Date()) {
    this.content = content;
    this.sender = sender;
    this.datetime = datetime;
  }

  static async fromIMessage(m: IMessage): Promise<Message | undefined> {
    const user = await DatabaseConnection.queryOne<User>('SELECT * FROM users WHERE id = $1::integer', m.senderid);
    if (!user) return;

    const messagecontent: MessageContent[] = [
      ...(await DatabaseConnection.query<{content: string}>(
        'SELECT content FROM textcontent WHERE messageid = $1::integer',
        m.id))
        .map(c => new TextContent(c.content)),
      ...(await DatabaseConnection.query<{path: string,displayname: string}>(
        'SELECT path, displayname FROM filecontent INNER JOIN files ON files.id = filecontent.fileid WHERE messageid = $1::integer',
        m.id))
        .map(c => new FileContent(c.path, c.displayname)),
      ...(await DatabaseConnection.query<{path: string,displayname: string}>(
        'SELECT path FROM imagecontent INNER JOIN files ON files.id = imagecontent.fileid WHERE messageid = $1::integer',
        m.id))
        .map(c => new ImageContent(c.path)),
      // Other content types
    ];

    return new Message(messagecontent, user, m.sentat);
  }

  toSendable (): object {
    return {
      content: this.content,
      user: this.sender.username,
      datetime: this.datetime
    }
  }
}