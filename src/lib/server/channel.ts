import { DatabaseConnection } from "./database/connection";
import type { IChannel, IMessage } from "./database/types";
import { Message } from "./message";
import { ChannelMembers, Member } from "./user";

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

  static nameValid(name: string): boolean {
    return !name.match(/[^a-z0-9-_]/) && name.length < 32 && name.length !== 0;
  }

  disconnect(member: Member) {
    const memberindex = this.members.findIndex(m => m.id == member.id);
    if (memberindex != -1)
      this.members.splice(memberindex, 1);

    const channelmemberindex = ChannelMembers[this.id].findIndex(m => m.id == member.id);
    if (channelmemberindex != -1)
      ChannelMembers[this.id].splice(channelmemberindex, 1);
  }

  broadcast(message: string | object, event: string = 'channelmessage') {
    const members = ChannelMembers[this.id];
    if (!members || members.length == 0) return;
    for (const member of members) {
      member.controller.sendMessage(event, message);
    }
  }

  static fromIChannel(channel: IChannel): Channel {
    return new Channel(channel.id, channel.name);
  }
}