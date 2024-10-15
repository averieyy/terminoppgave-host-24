export interface messagecontent {
  type: string,
}

export class TextContent implements messagecontent {
  type = 'message';
  content: string;

  constructor (content: string) {
    this.content = content;
  }
}

export class Message {
  content: string;
  user: string;

  constructor (content: string, user: string) {
    this.content = content;
    this.user = user;
  }
}

export interface user {
  name: string,
  id: number,
}

export interface member extends user {
  displayname: string,
}