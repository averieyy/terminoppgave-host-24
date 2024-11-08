import { DatabaseConnection } from "./database/connection";
import type { IChannel, IMessage } from "./database/types";
import { Message } from "./message";
import { User, type Member } from "./user";

export class Channel {
  static channels: Channel[] = [];

  messages: Message[] = [];
  id: number;
  name: string;
  members: Member[] = [];

  constructor (id: number, name: string) {
    this.id = id;
    this.name = name;

    Channel.channels.push(this);
  }

  static byId(id: number) : Channel | undefined {
    return Channel.channels.find(c => c.id == id);
  }

  connect (member: Member) {
    this.members.push(member);

    return this.messages;
  }

  disconnect(member: Member) {
    const memberindex = this.members.findIndex(m => m.id == member.id);
    
    if (memberindex == -1) return;
    
    this.members.splice(memberindex, 1);
  }

  broadcast(message: string | object, event: string = 'channelmessage') {
    for (const member of this.members) {
      member.controller.sendMessage(event, message);
    }
  }
}

// Init channels
Channel.channels = (await DatabaseConnection.query<IChannel>('SELECT * FROM channel;')).map(c => new Channel(c.id, c.name));

for (const channel of Channel.channels) {
  const messages = await DatabaseConnection.query<IMessage>('SELECT * FROM messages WHERE channelid = $1::integer;', channel.id);

  const messageObjects = [];

  for (let m of messages) {
    const sender = User.users.find(u => u.id == m.senderid);

    if (sender)
      messageObjects.push(new Message(m.content, sender, m.sentat));
  }

  channel.messages = messageObjects;
}