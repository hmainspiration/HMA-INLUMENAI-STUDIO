function buildSvgPattern({
  id,
  svgCode,
  color,
  baseSize = 150,
  gapX = 40,
  gapY = 40,
  itemScale = 1.0,
  itemRotation = 0,
  stagger = false, // brick-x
  patternRotation = 0,
}) {
  // 1. Extract inner content and viewBox
  let viewBox = '0 0 300 300';
  let origW = 300;
  let origH = 300;
  
  const svgMatch = svgCode.match(/<svg([^>]*)>([\s\S]*?)<\/svg>/i);
  let innerElements = svgCode;
  
  if (svgMatch) {
    const attrs = svgMatch[1];
    innerElements = svgMatch[2];
    
    const viewBoxMatch = attrs.match(/\bviewBox=(["'])([^"']*)\1/i);
    const widthMatch = attrs.match(/\bwidth=(["'])([^"']*)\1/i);
    const heightMatch = attrs.match(/\bheight=(["'])([^"']*)\1/i);
    
    if (viewBoxMatch) {
      viewBox = viewBoxMatch[2].trim();
      const parts = viewBox.split(/[\s,]+/);
      if (parts.length >= 4) {
        origW = parseFloat(parts[2]) || 300;
        origH = parseFloat(parts[3]) || 300;
      }
    } else if (widthMatch && heightMatch) {
      origW = parseFloat(widthMatch[2]) || 300;
      origH = parseFloat(heightMatch[2]) || 300;
      viewBox = `0 0 ${origW} ${origH}`;
    }
  }

  // Color injection
  if (color) {
    innerElements = innerElements
      .replace(/fill=["'](?!none|transparent)([^"']*)["']/ig, `fill="${color}"`)
      .replace(/stroke=["'](?!none|transparent)([^"']*)["']/ig, `stroke="${color}"`);
  }

  const ar = origW / origH;
  let itemW = baseSize;
  let itemH = baseSize;
  if (ar >= 1) {
    itemW = baseSize;
    itemH = Math.max(10, baseSize / ar);
  } else {
    itemH = baseSize;
    itemW = Math.max(10, baseSize * ar);
  }

  const finalItemW = itemW * Math.max(0.1, itemScale);
  const finalItemH = itemH * Math.max(0.1, itemScale);

  const cellW = finalItemW + Math.max(0, gapX);
  const cellH = finalItemH + Math.max(0, gapY);

  const posX = (cellW - finalItemW) / 2;
  const posY = (cellH - finalItemH) / 2;

  const tileW = cellW;
  const tileH = stagger ? cellH * 2 : cellH;

  const renderSingleItem = (x, y) => {
    return `
      <g transform="translate(${x}, ${y})">
        <svg width="${finalItemW}" height="${finalItemH}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" style="overflow:visible;">
          <g transform="rotate(${itemRotation} ${origW / 2} ${origH / 2})">
            ${innerElements}
          </g>
        </svg>
      </g>
    `;
  };

  let itemsHtml = renderSingleItem(posX, posY);
  if (stagger) {
    // Second item offset by half width in the second row
    itemsHtml += renderSingleItem((posX + cellW / 2) % cellW, posY + cellH);
  }

  const rotAttr = patternRotation ? ` patternTransform="rotate(${patternRotation})"` : '';

  return `
    <svg width="100%" height="100%" style="width:100%; height:100%; display:block; overflow:visible;" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="${id}" width="${tileW}" height="${tileH}" patternUnits="userSpaceOnUse"${rotAttr}>
          ${itemsHtml}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#${id})" />
    </svg>
  `;
}

const sampleSvg = `<svg width="200" height="100" viewBox="0 0 200 100"><rect width="200" height="100" fill="#3D80FD"/><text x="10" y="60" fill="#fff" font-family="sans-serif" font-size="20">INLUMENAI</text></svg>`;
const generated = buildSvgPattern({
  id: 'test-pat',
  svgCode: sampleSvg,
  color: '#3D80FD',
  baseSize: 120,
  gapX: 30,
  gapY: 30,
  itemScale: 1,
  itemRotation: 0,
  stagger: true
});
console.log("SUCCESS, Pattern generated! Length:", generated.length);
console.log(generated.slice(0, 400));
