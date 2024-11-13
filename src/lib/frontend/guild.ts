export function shortHand(text: string) : string {
  const words = text.split(' ');
  const initials = words.map(w => w[0]);

  if (initials.length == 1) return text.slice(0,2);
  return initials.slice(0,4).join('');
}