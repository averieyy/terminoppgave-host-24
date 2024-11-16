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