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

  static isTextFileContent(file : messagecontent): file is FileContent {
    return 'mime' in file && [
      'text/plain',
      'script/javascript',
      'text/html',
    ].includes(file.mime as string);
  }

  static isFileContent(file: messagecontent): file is FileContent {
    return 'mime' in file &&
      'path' in file &&
      'displayname' in file;
  }
}

export class Message {
  content: messagecontent[];
  user: string;
  datetime: Date;
  id: number;
  senderid: number;
  edited: boolean;
  replyto: {
    id: number,
    sender: string,
    content: messagecontent[],
    deleted: boolean;
  } | null;

  constructor (content: messagecontent[], user: string, date: Date, id: number, senderid: number, replyto: {id: number, sender: string, content: messagecontent[], deleted: boolean} | null, edited: boolean) {
    this.content = content;
    this.user = user;
    this.datetime = date;
    this.id = id;
    this.senderid = senderid;
    this.replyto = replyto;
    this.edited = edited;
  }
}

export interface user {
  name: string,
  id: number,
}

export interface member extends user {
  displayname: string,
}