import { DatabaseConnection } from "./database/connection";
import type { IChannel, IMessage } from "./database/types";
import { Message } from "./message";
import { ChannelMembers, User, type Member } from "./user";

export class Channel {

  id: number;
  name: string;
  members: Member[] = [];

  constructor (id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static async byId(id: number) : Promise<Channel | undefined> {
    const channel = await DatabaseConnection.queryOne<IChannel>('SELECT * FROM channel WHERE id = $1::integer', id);
  
    if (!channel) return;

    return Channel.fromIChannel(channel);
  }

  async connect (member: Member): Promise<Message[]> {
    if (!ChannelMembers[this.id]) ChannelMembers[this.id] = [member];
    else ChannelMembers[this.id].push(member);

    const messages = await DatabaseConnection.query<IMessage>('SELECT * FROM messages WHERE channelid = $1::integer AND deleted = FALSE', this.id);

    const messageobjs: Message[] = [];

    for (let m of messages) {
      const message = await Message.fromIMessage(m);
      if (message) messageobjs.push(message);
    }

    return messageobjs;
  }

  disconnect(member: Member) {
    const memberindex = this.members.findIndex(m => m.id == member.id);
    
    if (memberindex == -1) return;
    
    this.members.splice(memberindex, 1);
  }

  broadcast(message: string | object, event: string = 'channelmessage') {
    for (const member of ChannelMembers[this.id]) {
      member.controller.sendMessage(event, message);
    }
  }

  static fromIChannel(channel: IChannel): Channel {
    return new Channel(channel.id, channel.name);
  }
}