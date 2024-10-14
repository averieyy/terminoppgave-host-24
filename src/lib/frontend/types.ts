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

export class Message implements messageData {
  content: string;
  user: string;

  constructor (content: string, user: string) {
    this.content = content;
    this.user = user;
  }
}

export interface messageData { };

export interface serverMessage<T> {
  type: 'message' | 'typing',
  data: T,
}