import { LogoData } from '../types';
import { MotionFinishMode } from '../types/hma';

export function generateInlumenaiStandaloneHtml(
  logosToAnimate: LogoData[],
  isLoopMode: boolean,
  showTechnicalGuides: boolean,
  isWireframe: boolean,
  bgColor: 'black' | 'transparent' | 'white',
  playbackSpeed: number = 1,
  isHeroMode: boolean = false,
  finishMode: MotionFinishMode = 'flat'
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

  const heroHeaderComment = isHeroMode
    ? `  <!--
    ===================================================================
    INLUMENAI BRAND - HERO WEB ANIMATION COMPONENT
    Optimizado para Hero Header, Cabecera Web y Landing Pages de la Marca.
    - Ancho completo 100% responsivo y fluido
    - Sin margenes ni scrollbars indeseados
    - Fondo ${bgColor === 'transparent' ? 'transparente (listo para superponer sobre disenos web)' : bgColorHex}
    - Render vectorial SVG ultra-nitido para pantallas Retina y 4K
    
    INTEGRACION EN TU SITIO WEB:
    1. Como iFrame:
       <iframe src="INLUMENAI_HERO_ANIMATION.html" style="width:100%; height:80vh; min-height:500px; border:none; overflow:hidden;" allowtransparency="true"></iframe>
       
    2. En tu archivo HTML/React/WordPress:
       Inserta el contenedor <div class="svg-container"> en tu cabecera principal <header class="hero">.
    ===================================================================
  -->\n`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isHeroMode ? 'Inlumenai Brand - Hero Web Animation' : 'Motion - Standalone Render'}</title>
${heroHeaderComment}  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, html {
      width: 100%;
      height: 100%;
      min-height: 100vh;
      background: ${bgColorHex};
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }
    .svg-container {
      width: 100%;
      height: 100%;
      ${
        isHeroMode
          ? `max-width: 100%;
      max-height: 100vh;`
          : `max-width: 100vmin;
      max-height: 100vmin;`
      }
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    svg {
      width: 100%;
      height: 100%;
      ${isHeroMode ? 'max-height: 85vh;' : ''}
      display: block;
      overflow: visible;
    }
  </style>
</head>
<body>
  <div class="svg-container">
    <svg viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid meet">
      <defs>
        <!-- Prismatic Spectral Border Gradient -->
        <linearGradient id="hma-prism-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.9" />
          <stop offset="20%" stop-color="#818CF8" stop-opacity="0.9" />
          <stop offset="40%" stop-color="#C084FC" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#F472B6" stop-opacity="0.9" />
          <stop offset="80%" stop-color="#FBBF24" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#34D399" stop-opacity="0.9" />
        </linearGradient>

        <!-- Frosted Glass Rim / Crystal Highlight -->
        <linearGradient id="hma-frosted-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
          <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.25" />
          <stop offset="70%" stop-color="#000000" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.5" />
        </linearGradient>

        <!-- 3D Crystal Caustic Facet Gradient -->
        <linearGradient id="hma-caustic-border" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
          <stop offset="25%" stop-color="#7DD3FC" stop-opacity="0.8" />
          <stop offset="50%" stop-color="#C084FC" stop-opacity="0.65" />
          <stop offset="75%" stop-color="#38BDF8" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95" />
        </linearGradient>

        <!-- Frosted Glass Filter with Optical Turbulence & Specular Lighting -->
        <filter id="hma-frosted-glass" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" result="roughness" />
          <feDisplacementMap in="SourceGraphic" in2="roughness" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred" />
          <feSpecularLighting in="blurred" surfaceScale="4.5" specularConstant="1.6" specularExponent="22" lightingColor="#ffffff" result="specular">
            <feDistantLight azimuth="220" elevation="55" />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularBevel" />
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.4" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="displaced" />
            <feMergeNode in="specularBevel" />
          </feMerge>
        </filter>

        <!-- Chromatic Dispersion & Refractive Prism Filter -->
        <filter id="hma-prism-chromatic" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
          <!-- RGB Chromatic Split (Aberration) -->
          <feOffset in="SourceGraphic" dx="-2.8" dy="-1.8" result="redShift" />
          <feColorMatrix in="redShift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" result="redChannel" />
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="prismNoise" />
          <feDisplacementMap in="SourceGraphic" in2="prismNoise" scale="3" xChannelSelector="R" yChannelSelector="B" result="greenDisplaced" />
          <feColorMatrix in="greenDisplaced" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0.95 0" result="greenChannel" />
          <feOffset in="SourceGraphic" dx="2.8" dy="1.8" result="blueShift" />
          <feColorMatrix in="blueShift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0.9 0" result="blueChannel" />
          <feBlend in="redChannel" in2="greenChannel" mode="screen" result="rgBlend" />
          <feBlend in="rgBlend" in2="blueChannel" mode="screen" result="chromaticBody" />
          
          <!-- Prismatic Crystal Glint & Surface Specular Highlight -->
          <feGaussianBlur in="chromaticBody" stdDeviation="1.5" result="glintBlur" />
          <feSpecularLighting in="glintBlur" surfaceScale="5.5" specularConstant="2.2" specularExponent="32" lightingColor="#ffffff" result="specularLight">
            <feDistantLight azimuth="225" elevation="65" />
          </feSpecularLighting>
          <feComposite in="specularLight" in2="SourceAlpha" operator="in" result="glintHighlight" />
          
          <!-- Soft Ambient Drop Shadow -->
          <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#020617" flood-opacity="0.5" result="prismShadow" />
          <feMerge>
            <feMergeNode in="prismShadow" />
            <feMergeNode in="chromaticBody" />
            <feMergeNode in="glintHighlight" />
          </feMerge>
        </filter>

        <!-- 3D Translucent Optical Glass with Refraction & Caustic Dispersion -->
        <filter id="hma-crystal-caustic" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" result="lensNoise" />
          <feDisplacementMap in="SourceGraphic" in2="lensNoise" scale="3.8" xChannelSelector="R" yChannelSelector="G" result="refractedBody" />
          <feTurbulence type="turbulence" baseFrequency="0.065 0.08" numOctaves="3" result="causticTurbulence" />
          <feColorMatrix in="causticTurbulence" type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.85  0 0 0 0 1  3.8 3.8 3.8 0 -2.4" result="causticWebRaw" />
          <feComposite in="causticWebRaw" in2="SourceAlpha" operator="in" result="causticWebClipped" />
          <feGaussianBlur in="causticWebClipped" stdDeviation="0.8" result="causticWebGlow" />
          <feOffset in="causticWebGlow" dx="-2.4" dy="-1.5" result="cRedShift" />
          <feColorMatrix in="cRedShift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0" result="cRed" />
          <feOffset in="causticWebGlow" dx="2.4" dy="1.5" result="cBlueShift" />
          <feColorMatrix in="cBlueShift" type="matrix" values="0 0 0 0 0  0 0.7 0 0 0  0 0 1 0 0  0 0 0 0.85 0" result="cBlue" />
          <feBlend in="cRed" in2="cBlue" mode="screen" result="causticDispersed" />
          <feBlend in="causticDispersed" in2="causticWebGlow" mode="screen" result="causticFinal" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.8" result="alphaGlint" />
          <feSpecularLighting in="alphaGlint" surfaceScale="6.5" specularConstant="2.4" specularExponent="36" lightingColor="#ffffff" result="specularKey">
            <feDistantLight azimuth={215} elevation={66} />
          </feSpecularLighting>
          <feComposite in="specularKey" in2="SourceAlpha" operator="in" result="specularKeyClipped" />
          <feSpecularLighting in="alphaGlint" surfaceScale="3.8" specularConstant="1.4" specularExponent="24" lightingColor="#e0f2fe" result="specularRim">
            <feDistantLight azimuth={45} elevation={38} />
          </feSpecularLighting>
          <feComposite in="specularRim" in2="SourceAlpha" operator="in" result="specularRimClipped" />
          <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#0284c7" flood-opacity="0.42" result="causticGroundPool" />
          <feDropShadow dx="0" dy="5" stdDeviation="8" flood-color="#020617" flood-opacity="0.55" result="contactShadow" />
          <feMerge>
            <feMergeNode in="causticGroundPool" />
            <feMergeNode in="contactShadow" />
            <feMergeNode in="refractedBody" />
            <feMergeNode in="causticFinal" />
            <feMergeNode in="specularRimClipped" />
            <feMergeNode in="specularKeyClipped" />
          </feMerge>
        </filter>
      </defs>

      <!-- Technical Guides -->
      ${showTechnicalGuides ? `
      <g class="clock-guides-main" style="opacity: 0.6; display: block;">
        <circle cx="540" cy="540" r="360" fill="none" stroke="#1E293B" stroke-width="1" stroke-dasharray="4 4" />
        <circle cx="540" cy="540" r="134" fill="none" stroke="#1E293B" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" />
        <line x1="180" y1="540" x2="900" y2="540" stroke="#1E293B" stroke-width="1" stroke-dasharray="2 6" />
        <line x1="540" y1="180" x2="540" y2="900" stroke="#1E293B" stroke-width="1" stroke-dasharray="2 6" />
        <circle cx="540" cy="540" r="4" fill="#0EA5E9" />
        ${clockTicks}
      </g>` : ''}
      <!-- Shapes -->
      <g id="master-rotation-group">
        <g id="shapes-layer"></g>
      </g>
    </svg>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const TARGET_CENTER = 540;
      const CLOCK_RADIUS = 360;
      const UNIT_M = 67;
      
      const RAW_DATA = ${JSON.stringify(logosToAnimate)};
      const isLoopMode = ${isLoopMode};
      const showTechnicalGuides = ${showTechnicalGuides};
      const IS_WIREFRAME = ${isWireframe};
      const SPEED_SCALE = ${playbackSpeed};
      const FINISH_MODE = '${finishMode}';

      const shapesLayer = document.getElementById('shapes-layer');
      const ALL_IDS = Array.from({ length: 13 }, (_, i) => \`forma-\${(i + 1).toString().padStart(2, '0')}\`);
      
      ALL_IDS.forEach(id => {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('id', \`g-\${id}\`);
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('id', \`rect-\${id}\`);
          rect.setAttribute('x', '0');
          rect.setAttribute('y', '0');
          if (FINISH_MODE === 'caustic') {
            rect.setAttribute('filter', 'url(#hma-crystal-caustic)');
          } else if (FINISH_MODE === 'prism') {
            rect.setAttribute('filter', 'url(#hma-prism-chromatic)');
          } else if (FINISH_MODE === 'frosted') {
            rect.setAttribute('filter', 'url(#hma-frosted-glass)');
          }
          g.appendChild(rect);
          shapesLayer.appendChild(g);
      });

      const STROKE_VAL = IS_WIREFRAME
        ? null
        : (FINISH_MODE === 'caustic' ? 'url(#hma-caustic-border)' : (FINISH_MODE === 'prism' ? 'url(#hma-prism-border)' : (FINISH_MODE === 'frosted' ? 'url(#hma-frosted-border)' : 'none')));
      const STROKE_W = IS_WIREFRAME ? 2 : (FINISH_MODE === 'caustic' ? 2.2 : (FINISH_MODE === 'prism' ? 2 : (FINISH_MODE === 'frosted' ? 1.5 : 0)));
      const FILL_OPACITY = IS_WIREFRAME ? 0 : (FINISH_MODE === 'frosted' ? 0.84 : (FINISH_MODE === 'prism' ? 0.88 : (FINISH_MODE === 'caustic' ? 0.76 : 1)));

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

      gsap.set('#master-rotation-group', { svgOrigin: '540 540' });
      if (showTechnicalGuides) {
        gsap.set('.clock-guides-main', { opacity: 0.6, display: 'block' });
      } else {
        gsap.set('.clock-guides-main', { opacity: 0, display: 'none' });
      }

      // Initialize base shapes
      ALL_IDS.forEach(id => {
          gsap.set('#g-' + id, { x: TARGET_CENTER, y: TARGET_CENTER, rotation: 0 });
          gsap.set('#rect-' + id, {
              attr: { width: 67, height: 67, rx: 33.5, ry: 33.5 },
              x: -33.5,
              y: -33.5,
              fill: IS_WIREFRAME ? 'transparent' : '#3D80FD',
              fillOpacity: FILL_OPACITY,
              stroke: STROKE_VAL,
              strokeWidth: STROKE_W,
              scale: 0,
              opacity: 0
          });
      });

      const tl = gsap.timeline({ repeat: isLoopMode ? -1 : 0 });
      tl.timeScale(SPEED_SCALE);
      
      // Nacimiento
      ALL_IDS.forEach((id, i) => {
          tl.to('#rect-' + id, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }, i * 0.02);
      });
      tl.to({}, { duration: 0.5 });

      RAW_DATA.forEach((st, idx) => {
        const label = 'state_' + st.serviceId + '_' + idx;
        const clockPos = calculateClockPositions(st.shapes);
        const sortedShapes = [...st.shapes].sort((a, b) => a.id.localeCompare(b.id));

        // 1. FORMAR RELOJ
        tl.addLabel(label + '_clock');
        
        tl.call(() => {
             const parent = document.getElementById('shapes-layer');
             if (parent) {
                st.shapes.forEach(shape => {
                    const el = document.getElementById('g-' + shape.id);
                    if (el) parent.appendChild(el);
                });
             }
        });
        
        tl.set('#master-rotation-group', {
          x: 0, y: 0, scale: 1, rotation: 0, svgOrigin: '540 540'
        });

        if (showTechnicalGuides) {
          tl.to('.clock-guides-main', { opacity: 0.7, duration: 0.35 }, label + '_clock');
        }

        sortedShapes.forEach(shape => {
          const target = clockPos[shape.id];
          tl.to('#rect-' + shape.id, {
            fill: IS_WIREFRAME ? 'transparent' : shape.color,
            fillOpacity: FILL_OPACITY,
            stroke: IS_WIREFRAME ? shape.color : STROKE_VAL,
            strokeWidth: STROKE_W,
            attr: {
              width: UNIT_M, height: UNIT_M,
              rx: UNIT_M / 2, ry: UNIT_M / 2
            },
            x: -UNIT_M / 2, y: -UNIT_M / 2,
            duration: 0.4, ease: 'power2.out'
          }, label + '_clock');
          tl.to('#g-' + shape.id, {
            x: target.x, y: target.y, rotation: 0,
            duration: 1.1, ease: 'power3.inOut'
          }, label + '_clock+=0.015');
        });

        tl.to({}, { duration: 0.3 });

        // 2. METAMORFOSIS HACIA ISOTIPO
        tl.addLabel(label + '_morph');
        if (showTechnicalGuides) {
          tl.to('.clock-guides-main', { opacity: 0.15, duration: 0.4 }, label + '_morph');
        }

        st.shapes.forEach(shape => {
          tl.to(\`#g-\${shape.id}\`, {
            x: shape.x, y: shape.y, rotation: shape.rotation,
            duration: 1.3, ease: 'power3.inOut'
          }, label + '_morph');
          tl.to(\`#rect-\${shape.id}\`, {
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
        if (showTechnicalGuides) {
          tl.to('.clock-guides-main', {
            opacity: 0.7, duration: 0.3
          }, label + '_return');
        }

        sortedShapes.forEach(shape => {
          const target = clockPos[shape.id];
          tl.to(\`#g-\${shape.id}\`, {
            x: target.x, y: target.y, rotation: 0,
            duration: 0.9, ease: 'power3.inOut'
          }, label + '_return+=0.01');
          tl.to(\`#rect-\${shape.id}\`, {
            attr: {
              width: UNIT_M, height: UNIT_M,
              rx: UNIT_M / 2, ry: UNIT_M / 2
            },
            x: -UNIT_M / 2, y: -UNIT_M / 2,
            duration: 0.9, ease: 'power3.inOut'
          }, label + '_return');
        });

        // 5. CONVERGENCIA CENTRAL
        const nextLogo = RAW_DATA[(idx + 1) % RAW_DATA.length];
        tl.addLabel(label + '_collapse');
        if (showTechnicalGuides) {
          tl.to('.clock-guides-main', { opacity: 0.1, duration: 0.2 }, label + '_collapse');
        }

        st.shapes.forEach(shape => {
          const nextShape = nextLogo.shapes.find((s) => s.id === shape.id) || shape;
          tl.to('#g-' + shape.id, {
            x: TARGET_CENTER, y: TARGET_CENTER,
            duration: 0.7, ease: 'power3.inOut'
          }, label + '_collapse+=0.01');
          tl.to('#rect-' + shape.id, {
            fill: IS_WIREFRAME ? 'transparent' : nextShape.color,
            fillOpacity: FILL_OPACITY,
            stroke: IS_WIREFRAME ? nextShape.color : STROKE_VAL,
            strokeWidth: STROKE_W,
            duration: 0.7, ease: 'power3.inOut'
          }, label + '_collapse');
        });

        tl.to({}, { duration: 0.15 });
      });
    });
  </script>
</body>
</html>`;
}

