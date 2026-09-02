import { LogoData } from '../types';

export function generateInlumenaiStandaloneHtml(
  logosToAnimate: LogoData[],
  isLoopMode: boolean,
  showTechnicalGuides: boolean,
  isWireframe: boolean,
  bgColor: 'black' | 'transparent' | 'white',
  playbackSpeed: number = 1
): string {
  const bgColorHex = bgColor === 'black' ? '#040915' : bgColor === 'white' ? '#FFFFFF' : 'transparent';
  
  // Create clock guides SVG
  const clockTicks = Array.from({ length: 12 }).map((_, i) => {
    const hour = i + 1;
    const angleRad = ((hour * 30 - 90) * Math.PI) / 180;
    const TARGET_CENTER = 540;
    const CLOCK_RADIUS = 360;
    const xOuter = TARGET_CENTER + (CLOCK_RADIUS + 14) * Math.cos(angleRad);
    const yOuter = TARGET_CENTER + (CLOCK_RADIUS + 14) * Math.sin(angleRad);
    const xInner = TARGET_CENTER + (CLOCK_RADIUS - 14) * Math.cos(angleRad);
    const yInner = TARGET_CENTER + (CLOCK_RADIUS - 14) * Math.sin(angleRad);
    const xText = TARGET_CENTER + (CLOCK_RADIUS + 36) * Math.cos(angleRad);
    const yText = TARGET_CENTER + (CLOCK_RADIUS + 36) * Math.sin(angleRad);
    return `
      <g>
        <line x1="${xInner}" y1="${yInner}" x2="${xOuter}" y2="${yOuter}" stroke="#334155" stroke-width="2" />
        <circle cx="${xOuter}" cy="${yOuter}" r="2" fill="#475569" />
        <text x="${xText}" y="${yText}" fill="#64748B" font-size="12" font-family="monospace" text-anchor="middle" dominant-baseline="middle">${hour}</text>
      </g>
    `;
  }).join('');

  // Initial shapes based on the first logo to animate
  const initialShapes = logosToAnimate[0].shapes.map(shape => {
    const UNIT_M = 67;
    return `
      <g class="g-${shape.id}">
        <rect class="rect-${shape.id}" 
              width="${UNIT_M}" height="${UNIT_M}" 
              x="0" y="0" 
              rx="${UNIT_M / 2}" ry="${UNIT_M / 2}" 
              fill="${isWireframe ? 'transparent' : shape.color}" 
              stroke="${isWireframe ? shape.color : 'none'}" 
              stroke-width="${isWireframe ? 2 : 0}" />
      </g>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Motion - Standalone Render</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, html {
      width: 100%;
      height: 100%;
      background: ${bgColorHex};
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .svg-container {
      width: 100%;
      height: 100%;
      max-width: 100vmin;
      max-height: 100vmin;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }
  </style>
</head>
<body>
  <div class="svg-container">
    <svg viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid meet">
      <!-- Technical Guides -->
      <g class="clock-guides-main" style="opacity: ${showTechnicalGuides ? 0.6 : 0};">
        <circle cx="540" cy="540" r="360" fill="none" stroke="#1E293B" stroke-width="1" stroke-dasharray="4 4" />
        <circle cx="540" cy="540" r="134" fill="none" stroke="#1E293B" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" />
        <line x1="180" y1="540" x2="900" y2="540" stroke="#1E293B" stroke-width="1" stroke-dasharray="2 6" />
        <line x1="540" y1="180" x2="540" y2="900" stroke="#1E293B" stroke-width="1" stroke-dasharray="2 6" />
        <circle cx="540" cy="540" r="4" fill="#0EA5E9" />
        ${clockTicks}
      </g>
      <!-- Shapes -->
      <g class="master-rotation-group">
        ${initialShapes}
      </g>
    </svg>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const TARGET_CENTER = 540;
      const CLOCK_RADIUS = 360;
      const UNIT_M = 67;
      
      const logosToAnimate = ${JSON.stringify(logosToAnimate)};
      const isLoopMode = ${isLoopMode};
      const showTechnicalGuides = ${showTechnicalGuides};
      const isWireframe = ${isWireframe};
      const playbackSpeed = ${playbackSpeed};

      function findPointPiece(shapes) {
        return shapes.find(s => Math.abs(s.length - s.width) < 0.01) || shapes[0];
      }

      function calculateClockPositions(shapes) {
        const pointShape = findPointPiece(shapes);
        const otherShapes = shapes.filter(s => s.id !== pointShape.id).sort((a, b) => a.id.localeCompare(b.id));
        const map = {};
        otherShapes.forEach((shape, i) => {
          const hour = i + 1;
          const angleRad = ((hour * 30 - 90) * Math.PI) / 180;
          map[shape.id] = {
            x: TARGET_CENTER + CLOCK_RADIUS * Math.cos(angleRad),
            y: TARGET_CENTER + CLOCK_RADIUS * Math.sin(angleRad),
            hour
          };
        });
        map[pointShape.id] = { x: TARGET_CENTER, y: TARGET_CENTER, hour: 0 };
        return map;
      }

      gsap.set('.master-rotation-group', { svgOrigin: '540 540' });
      gsap.set('.clock-guides-main', { opacity: showTechnicalGuides ? 0.6 : 0 });

      // Initialize base shapes
      const baseShapes = logosToAnimate[0].shapes;
      baseShapes.forEach((shape) => {
        gsap.set('.g-' + shape.id, { x: TARGET_CENTER, y: TARGET_CENTER, rotation: 0 });
        gsap.set('.rect-' + shape.id, { x: -UNIT_M / 2, y: -UNIT_M / 2 });
      });

      const tl = gsap.timeline({ repeat: -1 });
      tl.timeScale(playbackSpeed);

      logosToAnimate.forEach((st, idx) => {
        const label = 'state_' + st.serviceId + '_' + idx;
        const clockPos = calculateClockPositions(st.shapes);
        const sortedShapes = [...st.shapes].sort((a, b) => a.id.localeCompare(b.id));

        // 1. FORMAR RELOJ
        tl.addLabel(label + '_clock');
        
        tl.set('.master-rotation-group', {
          x: 0, y: 0, scale: 1, rotation: 0, svgOrigin: '540 540'
        });

        tl.to('.clock-guides-main', { opacity: showTechnicalGuides ? 0.7 : 0, duration: 0.35 }, '<');

        sortedShapes.forEach(shape => {
          const target = clockPos[shape.id];
          tl.to('.rect-' + shape.id, {
            fill: isWireframe ? 'transparent' : shape.color,
            stroke: isWireframe ? shape.color : 'none',
            strokeWidth: isWireframe ? 2 : 0,
            attr: {
              width: UNIT_M, height: UNIT_M,
              rx: UNIT_M / 2, ry: UNIT_M / 2
            },
            x: -UNIT_M / 2, y: -UNIT_M / 2,
            duration: 0.35, ease: 'power2.out'
          }, '<');
          tl.to('.g-' + shape.id, {
            x: target.x, y: target.y, rotation: 0,
            duration: 1.0, ease: 'power3.inOut'
          }, '<0.015');
        });

        tl.to({}, { duration: 0.3 });

        // 2. METAMORFOSIS HACIA ISOTIPO
        tl.addLabel(label + '_morph');
        tl.to('.clock-guides-main', { opacity: 0.15, duration: 0.4 }, '<');

        st.shapes.forEach(shape => {
          tl.to('.g-' + shape.id, {
            x: shape.x, y: shape.y, rotation: shape.rotation,
            duration: 1.3, ease: 'power3.inOut'
          }, label + '_morph');
          tl.to('.rect-' + shape.id, {
            attr: {
              width: shape.width, height: shape.length,
              rx: shape.width / 2, ry: shape.width / 2
            },
            x: -shape.width / 2, y: -shape.length / 2,
            duration: 1.3, ease: 'power3.inOut'
          }, label + '_morph');
        });

        // 3. ISOTIPO CONSOLIDADO (HOLD)
        tl.addLabel(label + '_complete');
        tl.to({}, { duration: 2.0 });

        // 4. RETORNO AL RELOJ
        tl.addLabel(label + '_return');
        tl.to('.clock-guides-main', {
          opacity: showTechnicalGuides ? 0.7 : 0, duration: 0.3
        });

        sortedShapes.forEach(shape => {
          const target = clockPos[shape.id];
          tl.to('.g-' + shape.id, {
            x: target.x, y: target.y, rotation: 0,
            duration: 0.9, ease: 'power3.inOut'
          }, '<0.01');
          tl.to('.rect-' + shape.id, {
            attr: {
              width: UNIT_M, height: UNIT_M,
              rx: UNIT_M / 2, ry: UNIT_M / 2
            },
            x: -UNIT_M / 2, y: -UNIT_M / 2,
            duration: 0.9, ease: 'power3.inOut'
          }, '<');
        });

        // 5. CONVERGENCIA CENTRAL
        const nextLogo = logosToAnimate[(idx + 1) % logosToAnimate.length];
        tl.addLabel(label + '_collapse');
        tl.to('.clock-guides-main', { opacity: 0.1, duration: 0.2 }, '<');

        st.shapes.forEach(shape => {
          const nextShape = nextLogo.shapes.find((s) => s.id === shape.id) || shape;
          tl.to('.g-' + shape.id, {
            x: TARGET_CENTER, y: TARGET_CENTER,
            duration: 0.7, ease: 'power3.inOut'
          }, '<0.01');
          tl.to('.rect-' + shape.id, {
            fill: isWireframe ? 'transparent' : nextShape.color,
            stroke: isWireframe ? nextShape.color : 'none',
            duration: 0.7, ease: 'power3.inOut'
          }, '<');
        });

        tl.to({}, { duration: 0.15 });
      });
    });
  </script>
</body>
</html>`;
}

