export function shortHand(text: string) : string {
  const words = text.split(' ');
  const initials = words.map(w => w[0]);

  if (initials.length == 1) return text.slice(0,2);
  return initials.slice(0,4).join('');
}

export function isLight(colour: string): boolean {
  if (!colour.match(/^#[a-f0-9A-F]{6}$/)) return false;
  const red = parseInt(colour.slice(1, 3), 16);
  const green = parseInt(colour.slice(3, 5), 16);
  const blue = parseInt(colour.slice(5, 7), 16);

  return (red + green + blue) / 3 >= 128;
}