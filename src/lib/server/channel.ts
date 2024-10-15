import type { Message } from "./message";
import type { Member, User } from "./user";

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

Channel.channels.push(new Channel(12, 'Channel'));