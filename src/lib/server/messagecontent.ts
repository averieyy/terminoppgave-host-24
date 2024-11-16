export interface MessageContent {
  type: string
}

export class TextContent implements MessageContent {
  type = 'text';
  content: string;

  constructor (content: string) {
    this.content = content;
  }

  static isTextContent(object: MessageContent): object is TextContent {
    return object.type == "text" &&
      'content' in object;
  }
}

export class FileContent implements MessageContent {
  type = "file";
  fileid: number;
  filename: string;

  constructor (fileid: number, filename: string) {
    this.fileid = fileid;
    this.filename = filename;
  }

  static isFileContent(object: MessageContent): object is FileContent {
    return object.type == "file" &&
      'fileid' in object &&
      'filename' in object;
  }
}