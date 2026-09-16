const code = `<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">`;
const widthMatch = code.match(/\s+width=(["'])([^"']*)\1/i);
console.log(widthMatch[2]);
