export interface IChannel {
  id: number;
  name: string;
  guildid: number;
}

export interface IMessage {
  id: number;
  content: string;
  senderid: number;
  channelid: number;
  sentat: Date;
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