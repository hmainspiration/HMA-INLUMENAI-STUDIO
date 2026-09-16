const code = `<svg width="800" height="600">`;
let w = 380, h = 380;
const svgMatch = code.match(/<svg([^>]*)>/i);
if (svgMatch) {
  const attrs = svgMatch[1];
  const widthMatch = attrs.match(/\bwidth=(["'])([^"']*)\1/i);
  const heightMatch = attrs.match(/\bheight=(["'])([^"']*)\1/i);
  const viewBoxMatch = attrs.match(/\bviewBox=(["'])([^"']*)\1/i);
  
  if (widthMatch && heightMatch) {
    w = parseFloat(widthMatch[2]) || 380;
    h = parseFloat(heightMatch[2]) || 380;
  } else if (viewBoxMatch) {
    const parts = viewBoxMatch[2].split(/\s|,/);
    if (parts.length >= 4) {
      w = parseFloat(parts[2]) || 380;
      h = parseFloat(parts[3]) || 380;
    }
  }
}
console.log(w, h);
