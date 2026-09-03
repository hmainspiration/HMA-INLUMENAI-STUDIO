/**
 * HMA INLUMENAI STUDIO (v2026.40)
 * Export utilities: Clean SVG, Technical Blueprint, PNG @2x/@4x, JSON, Standalone HTML
 */

import { AnimatedLayer, BoundingBoxSize, HMAPiece, HMAProjectData } from '../types/hma';
import { APP_VERSION, getShapeSvgPath, MODULE_PX } from '../data/hmaDefinitions';

/**
 * Downloads a text or binary blob to the user's browser
 */
export function downloadFile(content: string | Blob, filename: string, mimeType = 'text/plain') {
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates clean standalone SVG code without extra attributes
 */
export function generateCleanSvg(
  pieces: HMAPiece[],
  viewSize = 800,
  includeBackground = false,
  bgColor = '#060C04'
): string {
  const visiblePieces = pieces.filter((p) => p.visible);
  
  // Sort by zIndex
  const sortedPieces = [...visiblePieces].sort((a, b) => a.zIndex - b.zIndex);

  const piecesSvg = sortedPieces
    .map((p) => {
      const w = p.widthM * MODULE_PX * p.scaleX;
      const h = p.heightM * MODULE_PX * p.scaleY;
      const pathD = getShapeSvgPath(p.shapeType, w, h);
      const fill = p.wireframe ? 'none' : p.color;
      const stroke = p.wireframe ? p.color : 'none';
      const strokeWidth = p.wireframe ? '2' : '0';

      return `    <g transform="translate(${p.x}, ${p.y}) rotate(${p.rotation})" opacity="${p.opacity}">
      <path d="${pathD}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
    </g>`;
    })
    .join('\n');

  const bgRect = includeBackground
    ? `<rect width="100%" height="100%" fill="${bgColor}" />\n`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-viewSize / 2} ${-viewSize / 2} ${viewSize} ${viewSize}" width="${viewSize}" height="${viewSize}">
  <!-- HMA INLUMENAI STUDIO (${APP_VERSION}) - Clean SVG Export -->
  ${bgRect}  <g id="hma-isotype-root">
${piecesSvg}
  </g>
</svg>`;
}

/**
 * Generates Technical Blueprint SVG with millimeter grid, dimensions (in M and px), axes, and metadata
 */
export function generateTechnicalBlueprintSvg(
  pieces: HMAPiece[],
  activePresetName = 'HMA Master',
  boundingBoxSize: BoundingBoxSize = '11x11',
  viewSize = 1000
): string {
  const visiblePieces = pieces.filter((p) => p.visible).sort((a, b) => a.zIndex - b.zIndex);
  const half = viewSize / 2;
  const mod = MODULE_PX;

  // Grid lines
  let gridLines = '';
  for (let x = -half; x <= half; x += mod) {
    const isMajor = x === 0;
    gridLines += `    <line x1="${x}" y1="${-half}" x2="${x}" y2="${half}" stroke="${isMajor ? '#06B6D4' : '#1e293b'}" stroke-width="${isMajor ? 1.5 : 0.75}" stroke-dasharray="${isMajor ? 'none' : '4,4'}" />\n`;
  }
  for (let y = -half; y <= half; y += mod) {
    const isMajor = y === 0;
    gridLines += `    <line x1="${-half}" y1="${y}" x2="${half}" y2="${y}" stroke="${isMajor ? '#06B6D4' : '#1e293b'}" stroke-width="${isMajor ? 1.5 : 0.75}" stroke-dasharray="${isMajor ? 'none' : '4,4'}" />\n`;
  }

  // Bounding box
  let boundingBoxSvg = '';
  if (boundingBoxSize !== 'none') {
    const mult = parseInt(boundingBoxSize.split('x')[0], 10) || 11;
    const boxSize = mult * mod;
    boundingBoxSvg = `
    <!-- Bounding Box ${boundingBoxSize} -->
    <rect x="${-boxSize / 2}" y="${-boxSize / 2}" width="${boxSize}" height="${boxSize}" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="6,6" />
    <text x="${-boxSize / 2 + 10}" y="${-boxSize / 2 + 20}" fill="#10B981" font-family="JetBrains Mono, monospace" font-size="12" font-weight="bold">CAJA SEGURIDAD ${boundingBoxSize} (${mult}M = ${boxSize}px)</text>
    `;
  }

  // Pieces with cotas & wireframe highlights
  const piecesSvg = visiblePieces
    .map((p) => {
      const w = p.widthM * mod * p.scaleX;
      const h = p.heightM * mod * p.scaleY;
      const pathD = getShapeSvgPath(p.shapeType, w, h);

      return `    <!-- Piece: ${p.name} -->
    <g transform="translate(${p.x}, ${p.y}) rotate(${p.rotation})">
      <path d="${pathD}" fill="${p.color}" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1.5" />
      <circle cx="0" cy="0" r="3" fill="#38bdf8" />
    </g>
    <!-- Dimension Cotas -->
    <g transform="translate(${p.x}, ${p.y})">
      <line x1="0" y1="0" x2="${p.x > 0 ? 30 : -30}" y2="${p.y > 0 ? 30 : -30}" stroke="#64748b" stroke-width="1" stroke-dasharray="2,2" />
      <text x="${p.x > 0 ? 35 : -35}" y="${p.y > 0 ? 35 : -35}" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="9" text-anchor="${p.x > 0 ? 'start' : 'end'}">
        [${(p.x / mod).toFixed(2)}M, ${(p.y / mod).toFixed(2)}M] (${p.rotation}°)
      </text>
    </g>`;
    })
    .join('\n');

  const now = new Date().toISOString().split('T')[0];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-half} ${-half} ${viewSize} ${viewSize}" width="${viewSize}" height="${viewSize}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&amp;display=swap');
      text { font-family: 'JetBrains Mono', monospace; }
    </style>
  </defs>
  
  <!-- Fondo Blueprint Técnico -->
  <rect x="${-half}" y="${-half}" width="${viewSize}" height="${viewSize}" fill="#040915" />
  
  <!-- Retícula Paramétrica (1M = 67px) -->
  <g id="grid-lines" opacity="0.6">
${gridLines}
  </g>

  ${boundingBoxSvg}

  <!-- Isotipo Renderizado -->
  <g id="hma-isotype">
${piecesSvg}
  </g>

  <!-- Origen y Regla de Escala -->
  <g id="origin-axes">
    <circle cx="0" cy="0" r="6" fill="none" stroke="#06B6D4" stroke-width="2" />
    <circle cx="0" cy="0" r="2" fill="#06B6D4" />
    <text x="10" y="-10" fill="#06B6D4" font-size="11" font-weight="bold">ORIGEN (0,0)</text>
  </g>

  <!-- Bloque de Metadatos Técnico -->
  <g id="blueprint-metadata" transform="translate(${-half + 24}, ${half - 120})">
    <rect width="360" height="95" rx="6" fill="#060C04" stroke="#1e293b" stroke-width="1.5" />
    <text x="16" y="24" fill="#06B6D4" font-size="14" font-weight="bold">HMA MATRIX STUDIO — BLUEPRINT TÉCNICO</text>
    <text x="16" y="44" fill="#94a3b8" font-size="11">PRESET: ${activePresetName.toUpperCase()} | VERSIÓN: ${APP_VERSION}</text>
    <text x="16" y="62" fill="#64748b" font-size="10">MÓDULO BASE: 1M = ${MODULE_PX}px | SUBRETÍCULA: 0.5M = 33.5px</text>
    <text x="16" y="80" fill="#64748b" font-size="10">FECHA: ${now} | SISTEMA PARAMÉTRICO DE 13 FORMAS</text>
  </g>
</svg>`;
}

/**
 * Renders SVG to HTML5 Canvas and exports high resolution PNG (@2x or @4x)
 */
export async function exportHighResPng(
  svgString: string,
  viewSize: number,
  scaleFactor: 2 | 4 = 2,
  transparent = true,
  filename = 'hma-matrix-export.png'
): Promise<void> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const width = viewSize * scaleFactor;
    const height = viewSize * scaleFactor;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('No se pudo inicializar el contexto 2D de Canvas'));
      return;
    }

    if (!transparent) {
      ctx.fillStyle = '#060C04';
      ctx.fillRect(0, 0, width, height);
    }

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) {
          downloadFile(blob, filename, 'image/png');
          resolve();
        } else {
          reject(new Error('Fallo al generar Blob de imagen PNG'));
        }
      }, 'image/png');
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

/**
 * Exports complete JSON project state with version tag 2026.26
 */
export function exportProjectJson(
  pieces: HMAPiece[],
  layers: AnimatedLayer[],
  activePresetId: string,
  paletteMode: 'luz' | 'profundo',
  artDirector = 'HMA Lead Designer',
  notes = 'Proyecto paramétrico HMA'
): void {
  const project: HMAProjectData = {
    version: '2026.36',
    appName: 'HMA INLUMENAI STUDIO',
    timestamp: new Date().toISOString(),
    activePresetId,
    paletteMode,
    pieces,
    layers,
    metadata: {
      artDirector,
      notes,
      gridModuleSize: MODULE_PX
    }
  };

  const jsonStr = JSON.stringify(project, null, 2);
  downloadFile(jsonStr, `HMA_MATRIX_PROJECT_${activePresetId}_${APP_VERSION}.json`, 'application/json');
}

/**
 * Standalone Autonomous HTML Generator for Animated SVG Editor
 */
export function generateAutonomousAnimatedHtml(
  layers: AnimatedLayer[],
  aspectRatio: '16:9' | '9:16' | '21:9' = '16:9',
  title = 'MOTION HMA MATRIX - Canvas Animado',
  canvasBgColor = '#060C04'
): string {
  let width = 1920;
  let height = 1080;
  
  if (aspectRatio === '9:16') {
    width = 1080;
    height = 1920;
  } else if (aspectRatio === '21:9') {
    width = 2560; // Standard 21:9 resolution width
    height = 1080;
  }

  const activeLayers = layers.filter((l) => l.visible && l.exportable);
  const hasMotionLayers = activeLayers.some(
    (l) => l.isMotionSequence || l.animationType === 'inlumenai-morph'
  );

  const layersHtml = activeLayers
    .map((l, idx) => {
      const isMotion = l.isMotionSequence || l.animationType === 'inlumenai-morph';
      const animClass = !isMotion && l.animationType !== 'none' ? `anim-${l.animationType}` : '';
      const wireframeClass = l.wireframe || l.motionWireframe ? 'wireframe-mode' : '';

      if (isMotion) {
        // Generate SVG markup for the 13 shapes
        const shapeRects = Array.from({ length: 13 })
          .map((_, sIdx) => {
            const numStr = sIdx + 1 < 10 ? `0${sIdx + 1}` : `${sIdx + 1}`;
            return `<g class="g-forma-${numStr}"><rect class="rect-forma-${numStr}" width="67" height="67" x="-33.5" y="-33.5" rx="33.5" ry="33.5" fill="#14E5C3" /></g>`;
          })
          .join('\n        ');

        return `
    <!-- Layer (Motion GSAP): ${l.name} -->
    <div id="motion-layer-${l.id || idx}" class="layer-item ${wireframeClass}" style="
      position: absolute;
      left: ${l.x}px;
      top: ${l.y}px;
      width: ${l.width}px;
      height: ${l.height}px;
      transform: translate(-50%, -50%) rotate(${l.rotation}deg);
      opacity: ${l.opacity};
      filter: blur(${l.blur}px);
      mix-blend-mode: ${l.blendMode};
      z-index: ${l.zIndex};
    ">
      <svg viewBox="0 0 1080 1080" style="width: 100%; height: 100%; overflow: visible;">
        <g class="motion-group">
          ${shapeRects}
        </g>
      </svg>
    </div>`;
      }

      const isHtmlIframe = l.animationType === 'html-iframe';
      const isPattern = !!l.isPattern;
      const color = l.color;
      const getProcessedSvgCode = (code: string, c?: string) => {
        if (!c) return code;
        return code.replace(/fill="[^"]*"/g, `fill="${c}"`).replace(/stroke="[^"]*"/g, `stroke="${c}"`);
      };

      const innerContent = isHtmlIframe
        ? `<iframe srcdoc="${l.svgCode.replace(/"/g, '&quot;')}" style="width: 100%; height: 100%; border: 0; pointer-events: none; ${l.wireframe ? 'opacity: 0.5;' : ''}" sandbox="allow-scripts allow-same-origin"></iframe>`
        : l.isPattern
        ? `<svg width="100%" height="100%"><defs><pattern id="pat-${l.id}" width="${l.patternScale || 24}" height="${l.patternScale || 24}" patternUnits="userSpaceOnUse">${getProcessedSvgCode(l.svgCode, color)}</pattern></defs><rect width="100%" height="100%" fill="url(#pat-${l.id})"/></svg>`
        : getProcessedSvgCode(l.svgCode, color);

      return `
    <!-- Layer: ${l.name} -->
    <div class="layer-item ${wireframeClass}" style="
      position: absolute;
      left: ${isPattern ? '50%' : `calc(50% + ${l.x}px)`};
      top: ${isPattern ? '50%' : `calc(50% + ${l.y}px)`};
      width: ${isPattern ? '100%' : `${l.width}px`};
      height: ${isPattern ? '100%' : `${l.height}px`};
      transform: translate(-50%, -50%) rotate(${l.rotation}deg) scale(${l.scale ?? 1});
      opacity: ${l.opacity};
      filter: blur(${l.blur}px);
      mix-blend-mode: ${l.blendMode};
      z-index: ${l.zIndex};
      color: ${l.color || 'inherit'};
      --anim-duration: ${l.animDuration}s;
      --anim-x: ${l.animX}px;
      --anim-y: ${l.animY}px;
      --anim-delay: ${l.animDelay}s;
      --base-opacity: ${l.opacity};
    ">
      <div class="${animClass}" style="width: 100%; height: 100%;">
        ${innerContent}
      </div>
    </div>`;
    })
    .join('\n');

  const gsapScriptTag = hasMotionLayers
    ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize GSAP Sequences for Motion layers
      const TARGET_CENTER = 540;
      const CLOCK_RADIUS = 360;
      const UNIT_M = 67;

      document.querySelectorAll('[id^="motion-layer-"]').forEach((el) => {
        const svg = el.querySelector('svg');
        if (!svg) return;

        for (let i = 1; i <= 13; i++) {
          const numStr = i < 10 ? '0' + i : '' + i;
          gsap.set(el.querySelector('.g-forma-' + numStr), { x: TARGET_CENTER, y: TARGET_CENTER, rotation: 0 });
        }

        const tl = gsap.timeline({ repeat: -1 });

        // 1. Clock expansion
        for (let i = 1; i <= 13; i++) {
          const numStr = i < 10 ? '0' + i : '' + i;
          let targetX = TARGET_CENTER;
          let targetY = TARGET_CENTER;
          if (i <= 12) {
            const rad = ((i * 30 - 90) * Math.PI) / 180;
            targetX = TARGET_CENTER + CLOCK_RADIUS * Math.cos(rad);
            targetY = TARGET_CENTER + CLOCK_RADIUS * Math.sin(rad);
          }
          tl.to(el.querySelector('.g-forma-' + numStr), { x: targetX, y: targetY, duration: 1.0, ease: 'power3.inOut' }, 0.05 * i);
        }

        tl.to({}, { duration: 0.5 });

        // 2. Collapse to center
        for (let i = 1; i <= 13; i++) {
          const numStr = i < 10 ? '0' + i : '' + i;
          tl.to(el.querySelector('.g-forma-' + numStr), { x: TARGET_CENTER, y: TARGET_CENTER, duration: 0.8, ease: 'power3.inOut' }, '<0.02');
        }

        tl.to({}, { duration: 0.5 });
      });
    });
  </script>`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} (${APP_VERSION})</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #040915;
      color: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    .stage-container {
      position: relative;
      width: ${width}px;
      height: ${height}px;
      max-width: 95vw;
      max-height: 95vh;
      background-color: ${canvasBgColor};
      aspect-ratio: ${aspectRatio === '16:9' ? '16 / 9' : aspectRatio === '21:9' ? '21 / 9' : '9 / 16'};
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.15);
      border-radius: 12px;
      overflow: hidden;
    }
    .layer-item svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .wireframe-mode path, .wireframe-mode rect, .wireframe-mode circle {
      fill: none !important;
      stroke: #06B6D4 !important;
      stroke-width: 2px !important;
    }
    /* Keyframe Animations */
    @keyframes hma-float {
      0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
      50% { transform: translate(-50%, -50%) translateY(var(--anim-y, -25px)) rotate(3deg); }
    }
    @keyframes hma-bounce {
      0%, 100% { transform: translate(-50%, -50%) translateY(0) scaleY(1); }
      40% { transform: translate(-50%, -50%) translateY(var(--anim-y, -40px)) scaleY(1.05); }
      60% { transform: translate(-50%, -50%) translateY(0) scaleY(0.95); }
    }
    @keyframes hma-pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: var(--base-opacity, 1); }
      50% { transform: translate(-50%, -50%) scale(1.15); opacity: calc(var(--base-opacity, 1) * 0.75); }
    }
    @keyframes hma-spin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    @keyframes hma-custom-path {
      0% { transform: translate(-50%, -50%) translate(0, 0); }
      25% { transform: translate(-50%, -50%) translate(var(--anim-x, 40px), calc(var(--anim-y, -30px) * 0.5)); }
      50% { transform: translate(-50%, -50%) translate(0px, var(--anim-y, -50px)); }
      75% { transform: translate(-50%, -50%) translate(calc(var(--anim-x, -40px) * -1), calc(var(--anim-y, -30px) * 0.5)); }
      100% { transform: translate(-50%, -50%) translate(0, 0); }
    }
    .anim-float { animation: hma-float var(--anim-duration, 4s) ease-in-out infinite; animation-delay: var(--anim-delay, 0s); }
    .anim-bounce { animation: hma-bounce var(--anim-duration, 2.5s) ease infinite; animation-delay: var(--anim-delay, 0s); }
    .anim-pulse { animation: hma-pulse var(--anim-duration, 3s) ease-in-out infinite; animation-delay: var(--anim-delay, 0s); }
    .anim-spin { animation: hma-spin var(--anim-duration, 8s) linear infinite; animation-delay: var(--anim-delay, 0s); }
    .anim-custom-path { animation: hma-custom-path var(--anim-duration, 6s) ease-in-out infinite; animation-delay: var(--anim-delay, 0s); }
  </style>
</head>
<body>
  <div class="stage-container">
${layersHtml}
  </div>
  ${gsapScriptTag}
</body>
</html>`;
}
