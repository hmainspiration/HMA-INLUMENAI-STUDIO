const code = `<svg width="590" height="800" viewBox="0 0 590 800"><text>INLUMENAI</text></svg>`;

function getProcessedSvgCode(code, color, forPattern = false) {
  let processed = code;
  if (color) {
    processed = processed.replace(/fill=["'](?!none|transparent)([^"']*)["']/ig, `fill="${color}"`).replace(/stroke=["'](?!none|transparent)([^"']*)["']/ig, `stroke="${color}"`);
  }
  processed = processed.replace(/<svg([^>]*)>/i, (match, p1) => {
    let attrs = p1;
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
    return `<svg${newAttrs} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">`;
  });
  return processed;
}

console.log(getProcessedSvgCode(code, undefined, true));
