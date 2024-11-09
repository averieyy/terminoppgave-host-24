export interface IChannel {
  id: number;
  name: string;
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