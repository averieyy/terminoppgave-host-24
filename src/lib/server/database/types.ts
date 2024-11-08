export interface DatabaseFetchable {};

export interface IChannel extends DatabaseFetchable {
  id: number,
  name: string,
}

export interface IMessage extends DatabaseFetchable {
  id: number;
  content: string;
  senderid: number;
  channelid: number;
  sentat: Date;
}

export interface IUser extends DatabaseFetchable {
  id: number;
  username: string;
  hash: string;
  salt: string;
}