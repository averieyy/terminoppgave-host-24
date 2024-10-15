export class StreamController {
  private controller : ReadableStreamDefaultController<string>;

  constructor (controller: ReadableStreamDefaultController<string>) {
    this.controller = controller;
  }

  sendMessage(event: string, content: string | object) : boolean {
    const stringcontent = typeof content == 'string' ? content : JSON.stringify(content);
    try {
      this.controller.enqueue(`event: ${event}\ndata: ${stringcontent}\n\n`);
      return true;
    }
    catch {
      return false;
    }
  }
}