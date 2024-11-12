export class Guild {
  id: number;
  name: string;
  description: string;
  colour: string;

  constructor (id: number, name: string, description: string, colour: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    if (!colour.match(/^#[a-fA-F0-9]{6}$/))
      this.colour = Guild.generateRandomColour();
    else this.colour = colour;
  }

  static generateRandomColour(): string {
    const r = 0x80 + Math.floor(Math.random() * 0x80);
    const g = 0x60 + Math.floor(Math.random() * 0xa0);
    const b = 0xa0 + Math.floor(Math.random() * 0x60);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
}