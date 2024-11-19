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
  displayname: string;

  constructor (path: string, displayname: string) {
    this.path = path;
    this.displayname = displayname;
  }

  static isFileContent(object: MessageContent): object is FileContent {
    return object.type == "file" &&
      'path' in object &&
      'displayname' in object;
  }
}

export class TextFileContent implements MessageContent {
  type = "textfile";
  path: string;
  displayname: string;
  preview: string;

  constructor (path: string, displayname: string, preview: string) {
    this.path = path;
    this.displayname = displayname;
    this.preview = preview;
  }

  static isTextFileContent(object: MessageContent): object is TextFileContent {
    return object.type == "textfile" &&
      'path' in object &&
      'preview' in object &&
      'displayname' in object;
  }
}

export class ImageContent implements MessageContent {
  type = "image";
  path: string;

  constructor (path: string) {
    this.path = path;
  }

  static isImageContent(object: MessageContent): object is ImageContent {
    return object.type == "image" &&
      'path' in object;
  }
}