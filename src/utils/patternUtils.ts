/**
 * HMA INLUMENAI - Pattern Generator Utilities
 * Robust SVG Pattern construction with aspect-ratio preservation,
 * custom spacing (Gap X, Gap Y), item scaling, rotation, stagger/brick layouts.
 */

export interface PatternConfig {
  id: string;
  svgCode: string;
  color?: string;
  baseSize?: number; // Base reference size in px (patternScale)
  gapX?: number; // Horizontal gap between elements (px)
  gapY?: number; // Vertical gap between elements (px)
  itemScale?: number; // Inner element scale (0.1x to 2.5x)
  itemRotation?: number; // Rotation of the element inside each cell (deg)
  stagger?: boolean; // Brick offset (50% shift on alternate rows)
  patternRotation?: number; // General pattern angle (deg)
}

/**
 * Generates an SVG string containing a <defs><pattern> and a filled <rect>
 * that tiles infinitely without clipping, distortion or resolution loss.
 */
export function buildSvgPatternMarkup(config: PatternConfig): string {
  const {
    id,
    svgCode,
    color,
    baseSize = 160,
    gapX = 40,
    gapY = 40,
    itemScale = 1.0,
    itemRotation = 0,
    stagger = false,
    patternRotation = 0,
  } = config;

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

  // Color injection respecting transparent / none values
  if (color) {
    innerElements = innerElements
      .replace(/fill=["'](?!none|transparent)([^"']*)["']/gi, `fill="${color}"`)
      .replace(/stroke=["'](?!none|transparent)([^"']*)["']/gi, `stroke="${color}"`);
  }

  // Calculate actual item dimensions based on original SVG aspect ratio
  const ar = origW / Math.max(1, origH);
  let itemW = baseSize;
  let itemH = baseSize;
  if (ar >= 1) {
    itemW = baseSize;
    itemH = Math.max(8, baseSize / ar);
  } else {
    itemH = baseSize;
    itemW = Math.max(8, baseSize * ar);
  }

  const boundedScale = Math.max(0.1, Math.min(3.0, itemScale));
  const finalW = itemW * boundedScale;
  const finalH = itemH * boundedScale;

  const cellW = Math.max(10, finalW + Math.max(0, gapX));
  const cellH = Math.max(10, finalH + Math.max(0, gapY));

  const posX = (cellW - finalW) / 2;
  const posY = (cellH - finalH) / 2;

  const tileW = cellW;
  const tileH = stagger ? cellH * 2 : cellH;

  const renderItem = (x: number, y: number) => `
    <g transform="translate(${x.toFixed(2)}, ${y.toFixed(2)})">
      <svg width="${finalW.toFixed(2)}" height="${finalH.toFixed(2)}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" style="overflow:visible;">
        <g transform="rotate(${itemRotation} ${(origW / 2).toFixed(2)} ${(origH / 2).toFixed(2)})">
          ${innerElements}
        </g>
      </svg>
    </g>
  `;

  let itemsHtml = renderItem(posX, posY);
  if (stagger) {
    itemsHtml += renderItem((posX + cellW / 2) % cellW, posY + cellH);
  }

  const rotAttr = patternRotation ? ` patternTransform="rotate(${patternRotation})"` : '';

  return `<svg width="100%" height="100%" style="width:100%; height:100%; display:block; overflow:visible;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="${id}" width="${tileW.toFixed(2)}" height="${tileH.toFixed(2)}" patternUnits="userSpaceOnUse"${rotAttr}>
      ${itemsHtml}
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#${id})" />
</svg>`;
}
