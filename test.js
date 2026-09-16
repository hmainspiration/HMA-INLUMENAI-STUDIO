const code = `<svg width="40" height="40" viewBox="0 0 100 100">`;
const attrs = code.match(/<svg([^>]*)>/i)[1];
const widthMatch = attrs.match(/\bwidth=(["'])([^"']*)\1/i);
console.log(widthMatch);
