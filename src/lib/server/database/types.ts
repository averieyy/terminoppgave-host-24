export interface IChannel {
  id: number;
  name: string;
  guildid: number;
}

export interface IMessage {
  id: number;
  senderid: number;
  channelid: number;
  sentat: Date;
  deleted: boolean;
  replyto?: number;
  edited: boolean;
}

export interface IToken {
  id: number;
  content: string;
  userid: number;
  expires: Date;
}

export interface IGuild {
  id: number;
  name: string;
  description: string;
  colour: string;
}

export interface IGuildMember {
  guildid: number;
  userid: number;
  administrator: boolean;
}

export interface IGuildSettings {
  guildid: number;
  discoverable: boolean;
}

export interface IFile {
  id: number;
  path: string;
  displayname: string;
  mime: string;
  uploaded: Date;
}