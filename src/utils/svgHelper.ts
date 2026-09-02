export function normalizeSvg(
  rawSvg: string,
  options?: { fillColor?: string | null; wireframe?: boolean },
  layerId?: string
): string {
  if (!rawSvg) return '';
  let svg = rawSvg.trim();
  if (!svg.includes('<svg')) return rawSvg;

  // Generate safe CSS-scoped identifier for this specific layer
  const cleanId = layerId ? layerId.replace(/[^a-zA-Z0-9_-]/g, '_') : Math.random().toString(36).substring(2, 9);
  const scopedClass = `vf-layer-${cleanId}`;

  // Extraer width y height del <svg ...> si no tiene viewBox
  const hasViewBox = /viewBox\s*=/i.test(svg);
  if (!hasViewBox) {
    const widthMatch = svg.match(/width\s*=\s*["']?([\d.]+)/i);
    const heightMatch = svg.match(/height\s*=\s*["']?([\d.]+)/i);
    if (widthMatch && heightMatch) {
      const w = widthMatch[1];
      const h = heightMatch[1];
      svg = svg.replace(/<svg\b([^>]*)>/i, `<svg$1 viewBox="0 0 ${w} ${h}">`);
    } else {
      svg = svg.replace(/<svg\b([^>]*)>/i, `<svg$1 viewBox="0 0 100 100">`);
    }
  }

  // Inject unique class into root <svg>
  svg = svg.replace(/<svg\b([^>]*)>/i, (_match, attrs) => {
    if (/\bclass\s*=/i.test(attrs)) {
      return `<svg${attrs.replace(/\bclass\s*=\s*["']([^"']*)["']/i, `class="$1 ${scopedClass}"`)}>`;
    }
    return `<svg class="${scopedClass}"${attrs}>`;
  });

  const color = options?.fillColor;
  const wireframe = options?.wireframe;

  let scopedCss = '';
  if (color) {
    scopedCss += `
      .${scopedClass} path:not([fill='none']),
      .${scopedClass} circle:not([fill='none']),
      .${scopedClass} rect:not([fill='none']),
      .${scopedClass} polygon:not([fill='none']),
      .${scopedClass} ellipse:not([fill='none']),
      .${scopedClass} g:not([fill='none']),
      .${scopedClass} shape:not([fill='none']) {
        fill: ${color} !important;
      }
      .${scopedClass} [fill='none'] {
        fill: none !important;
      }
    `;
  }

  if (wireframe) {
    scopedCss += `
      .${scopedClass} path,
      .${scopedClass} circle,
      .${scopedClass} rect,
      .${scopedClass} polygon,
      .${scopedClass} ellipse {
        fill: none !important;
        stroke: ${color || '#ffffff'} !important;
        stroke-width: 2px !important;
      }
    `;
  }

  if (scopedCss) {
    const styleTag = `<style>${scopedCss}</style>`;
    svg = svg.replace(/<svg\b([^>]*)>/i, `<svg$1>${styleTag}`);
  }

  return svg;
}

export function generatePatternDataUri(
  rawSvg: string,
  scale: number,
  spacing: number,
  fillColor?: string | null,
  wireframe?: boolean,
  layerId?: string
): { uri: string; totalSize: number } {
  const size = Math.max(8, scale || 24);
  const space = Math.max(0, spacing || 0);
  const total = size + space;

  // Normalizar el SVG para que tenga viewBox y estilos de color independientes
  let norm = normalizeSvg(rawSvg, { fillColor, wireframe }, layerId ? `pat-${layerId}` : undefined);

  // Reemplazar width y height del SVG interior por los valores de escala y posición
  norm = norm.replace(/<svg\b([^>]*)>/i, (_match, attrs) => {
    const cleanAttrs = attrs
      .replace(/\bwidth\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\bheight\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\bx\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\by\s*=\s*["'][^"']*["']/gi, '');
    return `<svg${cleanAttrs} width="${size}" height="${size}" x="${space / 2}" y="${space / 2}" preserveAspectRatio="xMidYMid meet">`;
  });

  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}">
    ${norm}
  </svg>`;

  const encoded = encodeURIComponent(fullSvg);
  return {
    uri: `data:image/svg+xml;utf8,${encoded}`,
    totalSize: total,
  };
}
