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
  path: string;

  constructor (path: string, filename: string) {
    this.path = path;
  }

  static isFileContent(object: MessageContent): object is FileContent {
    return object.type == "file" &&
      'path' in object
  }
}