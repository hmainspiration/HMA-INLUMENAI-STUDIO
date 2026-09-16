// Let's test how SVG pattern math works with aspect ratio and spacing
const svgCode = `<svg viewBox="0 0 600 200" width="600" height="200"><rect width="600" height="200" fill="blue"/><text x="50" y="120" font-size="100" fill="white">INLUMENAI</text></svg>`;

// Extract viewBox or width/height from the svgCode
function getSvgDimensions(code) {
  let w = 300, h = 300;
  const svgMatch = code.match(/<svg([^>]*)>/i);
  if (svgMatch) {
    const attrs = svgMatch[1];
    const viewBoxMatch = attrs.match(/\bviewBox=(["'])([^"']*)\1/i);
    const widthMatch = attrs.match(/\bwidth=(["'])([^"']*)\1/i);
    const heightMatch = attrs.match(/\bheight=(["'])([^"']*)\1/i);
    if (viewBoxMatch) {
      const parts = viewBoxMatch[2].trim().split(/[\s,]+/);
      if (parts.length >= 4) {
        w = parseFloat(parts[2]) || 300;
        h = parseFloat(parts[3]) || 300;
      }
    } else if (widthMatch && heightMatch) {
      w = parseFloat(widthMatch[2]) || 300;
      h = parseFloat(heightMatch[2]) || 300;
    }
  }
  return { w, h, aspectRatio: w / h };
}

console.log(getSvgDimensions(svgCode));
