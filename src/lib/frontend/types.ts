export interface messagecontent {
  type: string,
}

export class TextContent implements messagecontent {
  type = 'text';
  content: string;

  constructor (content: string) {
    this.content = content;
  }
}

export class FileContent implements messagecontent {
  type = 'file';
  path: string;
  displayname: string;

  constructor (path: string, displayname: string) {
    this.path = path;
    this.displayname = displayname;
  }
}

export class TextFileContent implements messagecontent {
  type = 'textfile';
  path: string;
  displayname: string;
  preview: string;

  constructor (path: string, displayname: string, preview: string) {
    this.path = path;
    this.displayname = displayname;
    this.preview = preview;
  }
}

export class ImageContent implements messagecontent {
  type = 'image';
  path: string;

  constructor (path: string) {
    this.path = path;
  }
}

export class Message {
  content: messagecontent[];
  user: string;
  datetime: Date;
  id: number;
  senderid: number;
  replyto?: number;

  constructor (content: messagecontent[], user: string, date: Date, id: number, senderid: number, replyto?: number) {
    this.content = content;
    this.user = user;
    this.datetime = date;
    this.id = id;
    this.senderid = senderid;
    this.replyto = replyto;
  }
}

export interface user {
  name: string,
  id: number,
}

export interface member extends user {
  displayname: string,
}