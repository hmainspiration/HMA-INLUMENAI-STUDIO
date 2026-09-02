import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { INITIAL_DATA } from '../../data/canonicalLogos';
import { Shape } from '../../types';
import { AnimatedLayer } from '../../types/hma';

const TARGET_CENTER = 540;
const CLOCK_RADIUS = 360;
const UNIT_M = 67;

function calculateClockPositions(shapes: Shape[]) {
  const sorted = [...shapes].sort((a, b) => a.id.localeCompare(b.id));
  const mapping: Record<string, { x: number; y: number }> = {};

  sorted.forEach((shape, index) => {
    if (index === 12) {
      mapping[shape.id] = { x: TARGET_CENTER, y: TARGET_CENTER };
    } else {
      const hour = index + 1;
      const angleRad = ((hour * 30 - 90) * Math.PI) / 180;
      mapping[shape.id] = {
        x: TARGET_CENTER + CLOCK_RADIUS * Math.cos(angleRad),
        y: TARGET_CENTER + CLOCK_RADIUS * Math.sin(angleRad)
      };
    }
  });

  return mapping;
}

interface InlumenaiCanvasLayerProps {
  layer: AnimatedLayer;
}

export const InlumenaiCanvasLayer: React.FC<InlumenaiCanvasLayerProps> = ({ layer }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const selectedServiceId = layer.motionServiceId || 'all';
  const isLoop = selectedServiceId === 'all' || layer.motionIsLoop !== false;
  const showGuides = !!layer.motionShowGuides;
  const isWireframe = !!layer.wireframe || !!layer.motionWireframe;
  const speed = layer.motionSpeed || 1;

  useLayoutEffect(() => {
    if (!svgRef.current) return;

    const ctx = gsap.context(() => {
      // Determinar conjunto de logos a animar
      let logosToAnimate = INITIAL_DATA;
      if (!isLoop && selectedServiceId !== 'all') {
        const found = INITIAL_DATA.find((s) => s.serviceId === selectedServiceId);
        logosToAnimate = found ? [found] : [INITIAL_DATA[0]];
      }

      const lId = layer.id;

      // Estado inicial (Centro)
      const baseShapes = logosToAnimate[0].shapes;
      baseShapes.forEach((shape) => {
        gsap.set(`.c-g-${lId}-${shape.id}`, {
          x: TARGET_CENTER,
          y: TARGET_CENTER,
          rotation: 0
        });
        gsap.set(`.c-rect-${lId}-${shape.id}`, {
          attr: {
            width: UNIT_M,
            height: UNIT_M,
            x: -UNIT_M / 2,
            y: -UNIT_M / 2,
            rx: UNIT_M / 2,
            ry: UNIT_M / 2
          },
          fill: isWireframe ? 'transparent' : shape.color,
          stroke: isWireframe ? shape.color : 'none',
          strokeWidth: isWireframe ? 2 : 0,
          opacity: 1
        });
      });

      const tl = gsap.timeline({
        repeat: -1
      });
      tl.timeScale(speed);

      logosToAnimate.forEach((st, idx) => {
        const label = `c_state_${st.serviceId}_${idx}`;
        const clockPos = calculateClockPositions(st.shapes);
        const sortedShapes = [...st.shapes].sort((a, b) => a.id.localeCompare(b.id));

        // 1. RELOJ ANÁLOGO
        tl.addLabel(`${label}_clock`);
        tl.call(() => {
          const parent = svgRef.current?.querySelector('.canvas-motion-group');
          if (parent) {
            st.shapes.forEach((shape) => {
              const el = parent.querySelector(`.c-g-${lId}-${shape.id}`);
              if (el) parent.appendChild(el);
            });
          }
        });

        sortedShapes.forEach((shape) => {
          const target = clockPos[shape.id];
          tl.to(
            `.c-rect-${lId}-${shape.id}`,
            {
              fill: isWireframe ? 'transparent' : shape.color,
              stroke: isWireframe ? shape.color : 'none',
              strokeWidth: isWireframe ? 2 : 0,
              attr: {
                width: UNIT_M,
                height: UNIT_M,
                x: -UNIT_M / 2,
                y: -UNIT_M / 2,
                rx: UNIT_M / 2,
                ry: UNIT_M / 2
              },
              duration: 0.35,
              ease: 'power2.out'
            },
            '<'
          );
          tl.to(
            `.c-g-${lId}-${shape.id}`,
            {
              x: target.x,
              y: target.y,
              rotation: 0,
              duration: 1.0,
              ease: 'power3.inOut'
            },
            '<0.015'
          );
        });

        tl.to({}, { duration: 0.3 });

        // 2. METAMORFOSIS HACIA ISOTIPO
        tl.addLabel(`${label}_morph`);
        st.shapes.forEach((shape) => {
          tl.to(
            `.c-g-${lId}-${shape.id}`,
            {
              x: shape.x,
              y: shape.y,
              rotation: shape.rotation,
              duration: 1.3,
              ease: 'power3.inOut'
            },
            `${label}_morph`
          );
          tl.to(
            `.c-rect-${lId}-${shape.id}`,
            {
              attr: {
                width: shape.width,
                height: shape.length,
                x: -shape.width / 2,
                y: -shape.length / 2,
                rx: shape.width / 2,
                ry: shape.width / 2
              },
              duration: 1.3,
              ease: 'power3.inOut'
            },
            `${label}_morph`
          );
        });

        // 3. ISOTIPO CONSOLIDADO (HOLD)
        tl.addLabel(`${label}_complete`);
        tl.to({}, { duration: 2.0 });

        // 4. RETORNO AL RELOJ
        tl.addLabel(`${label}_return`);
        sortedShapes.forEach((shape) => {
          const target = clockPos[shape.id];
          tl.to(
            `.c-g-${lId}-${shape.id}`,
            {
              x: target.x,
              y: target.y,
              rotation: 0,
              duration: 0.9,
              ease: 'power3.inOut'
            },
            '<0.01'
          );
          tl.to(
            `.c-rect-${lId}-${shape.id}`,
            {
              attr: {
                width: UNIT_M,
                height: UNIT_M,
                x: -UNIT_M / 2,
                y: -UNIT_M / 2,
                rx: UNIT_M / 2,
                ry: UNIT_M / 2
              },
              duration: 0.9,
              ease: 'power3.inOut'
            },
            '<'
          );
        });

        // 5. CONVERGENCIA CENTRAL
        const nextLogo = logosToAnimate[(idx + 1) % logosToAnimate.length];
        tl.addLabel(`${label}_collapse`);
        st.shapes.forEach((shape) => {
          const nextShape = nextLogo.shapes.find((s) => s.id === shape.id) || shape;
          tl.to(
            `.c-g-${lId}-${shape.id}`,
            {
              x: TARGET_CENTER,
              y: TARGET_CENTER,
              duration: 0.7,
              ease: 'power3.inOut'
            },
            '<0.01'
          );
          tl.to(
            `.c-rect-${lId}-${shape.id}`,
            {
              fill: isWireframe ? 'transparent' : nextShape.color,
              stroke: isWireframe ? nextShape.color : 'none',
              duration: 0.7,
              ease: 'power3.inOut'
            },
            '<'
          );
        });

        tl.to({}, { duration: 0.15 });
      });
    }, svgRef);

    return () => ctx.revert();
  }, [selectedServiceId, isLoop, showGuides, isWireframe, speed]);

  const defaultShapes = INITIAL_DATA[0].shapes;

  // Generar marcas de reloj si las guías están activas
  const clockTicks = Array.from({ length: 12 }).map((_, i) => {
    const hour = i + 1;
    const angleRad = ((hour * 30 - 90) * Math.PI) / 180;
    const xOuter = TARGET_CENTER + (CLOCK_RADIUS + 12) * Math.cos(angleRad);
    const yOuter = TARGET_CENTER + (CLOCK_RADIUS + 12) * Math.sin(angleRad);
    const xInner = TARGET_CENTER + (CLOCK_RADIUS - 12) * Math.cos(angleRad);
    const yInner = TARGET_CENTER + (CLOCK_RADIUS - 12) * Math.sin(angleRad);

    return (
      <line
        key={`tick-${hour}`}
        x1={xInner}
        y1={yInner}
        x2={xOuter}
        y2={yOuter}
        stroke="#14E5C3"
        strokeWidth={hour % 3 === 0 ? '3' : '1.5'}
        strokeLinecap="round"
        opacity="0.5"
      />
    );
  });

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1080 1080"
      className="w-full h-full block"
      style={{ overflow: 'visible' }}
    >
      {/* Guías de Reloj opcionales */}
      {showGuides && (
        <g className="canvas-clock-guides" opacity="0.6">
          <circle
            cx={TARGET_CENTER}
            cy={TARGET_CENTER}
            r={CLOCK_RADIUS}
            fill="none"
            stroke="#14E5C3"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {clockTicks}
        </g>
      )}

      {/* Grupo de Formas Paramétricas */}
      <g className="canvas-motion-group">
        {defaultShapes.map((shape) => (
          <g key={shape.id} className={`c-g-${layer.id}-${shape.id}`}>
            <rect
              className={`c-rect-${layer.id}-${shape.id}`}
              width={UNIT_M}
              height={UNIT_M}
              x={-UNIT_M / 2}
              y={-UNIT_M / 2}
              rx={UNIT_M / 2}
              ry={UNIT_M / 2}
              fill={isWireframe ? 'transparent' : shape.color}
              stroke={isWireframe ? shape.color : 'none'}
              strokeWidth={isWireframe ? 2 : 0}
            />
          </g>
        ))}
      </g>
    </svg>
  );
};
