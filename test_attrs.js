const code = `<svg id="Layer_1" viewBox="0 0 100 100" width="500" height="500">`;
let attrs = code.match(/<svg([^>]*)>/i)[1];
const widthMatch = attrs.match(/\s+width=(["'])([^"']*)\1/i);
const heightMatch = attrs.match(/\s+height=(["'])([^"']*)\1/i);
const viewBoxMatch = attrs.match(/\s+viewBox=(["'])([^"']*)\1/i);

let newAttrs = attrs
  .replace(/\s+width=(["'])([^"']*)\1/i, '')
  .replace(/\s+height=(["'])([^"']*)\1/i, '')
  .replace(/\s+preserveAspectRatio=(["'])([^"']*)\1/i, '');

if (!viewBoxMatch && widthMatch && heightMatch) {
 const w = parseFloat(widthMatch[2]);
 const h = parseFloat(heightMatch[2]);
 if (!isNaN(w) && !isNaN(h)) {
    newAttrs += ` viewBox="0 0 ${w} ${h}"`;
 }
}
console.log(`<svg${newAttrs} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">`);
