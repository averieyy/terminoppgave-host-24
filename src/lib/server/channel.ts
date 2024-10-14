import type { Message } from "./message";

export class Channel {
  messages: Message[] = [];
  id: number;
  name: string;

  constructor (id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}