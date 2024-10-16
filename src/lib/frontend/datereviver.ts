export function DateReviver({}, value: any) {
  if (typeof value === 'string') {
    if (value.match(/\d*-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/)) {
      return new Date(value);
    }
  }
  return value;
}