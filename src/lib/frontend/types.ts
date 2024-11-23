export interface messagecontent {
  type: string,
}

export class TextContent implements messagecontent {
  type = 'text';
  content: string;

  constructor (content: string) {
    this.content = content;
  }

  static isTextContent (m: messagecontent): m is TextContent {
    return m.type == 'text' && 'content' in m;
  }
}

export class FileContent implements messagecontent {
  type = 'file';
  path: string;
  displayname: string;
  mime: string;

  constructor (path: string, displayname: string, mime: string) {
    this.path = path;
    this.displayname = displayname;
    this.mime = mime;
  }

  static isTextContent(file : messagecontent) {
    return 'mime' in file && [
      'text/plain',
      'script/javascript',
      'text/html',
    ].includes(file.mime as string);
  }
}

export class Message {
  content: messagecontent[];
  user: string;
  datetime: Date;
  id: number;
  senderid: number;
  replyto: {
    id: number,
    sender: string,
    content: messagecontent[],
    deleted: boolean;
  } | null;

  constructor (content: messagecontent[], user: string, date: Date, id: number, senderid: number, replyto: {id: number, sender: string, content: messagecontent[], deleted: boolean} | null) {
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