export class User {
  
  name: string;
  id: number;
  cookies: string[] = [];

  constructor (name: string, id: number) {
    this.name = name;
    this.id = id;
  }

  genId () : number {
    // TODO: Let the database do this.
    const randomNumber = Math.floor(Math.random() * 0x1000000);
    
    // I do not care about duplicates for now, because the database will handle it after a while.
    this.id = randomNumber;
    return randomNumber;
  }

  genCookie () {
    const randomNumber = Math.floor(Math.random() * 0x100000000);
    const cookie = `${this.id.toString(16)}::${randomNumber.toString(16)}`;
    
    this.cookies.push(cookie);
    return cookie;
  }
}

export class Member extends User {
  displayName: string;

  constructor (name: string, id: number, displayName: string) {
    super(name, id);

    this.displayName = displayName;
  }
}