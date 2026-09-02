/**
 * HMA INLUMENAI STUDIO (v2026.40)
 * Module 2: INLUMENAI MOTION (GSAP Sequencer & "El Reloj de las 13 Formas")
 * 
 * GUÍA TÉCNICA Y REGLAS ESTRICTAS DE RENDERIZADO: GSAP + SVG (1080x1080 Canónico)
 * 1. Sistema Espacial: viewBox="0 0 1080 1080", Centro (CX, CY) = (540, 540), CLOCK_R = 360px, UNIT_M = 67px.
 * 2. Estructura de Nodos: <g className="g-forma-XX"> controla (x, y, rotation). <rect className="rect-forma-XX"> controla (width=67, height=length, x=-width/2, y=-length/2, rx=width/2, ry=width/2).
 * 3. Detección Dinámica de Pieza-Punto: findPointPiece() coloca el círculo (length === width === 67) en (540, 540) y 12 piezas en horas 1..12.
 * 4. Metamorfosis Vectorial Verificada: Isotipo Madre y los 12 Servicios se despliegan con orientación vertical y rotaciones angulares exactas.
 */

import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Download,
  Eye,
  Sliders,
  Clock,
  ChevronRight,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Compass,
  Repeat,
  Grid,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { AnimatedLayer, HMAPiece, PaletteMode } from '../../types/hma';
import { APP_VERSION } from '../../data/hmaDefinitions';
import { INITIAL_DATA } from '../../data/canonicalLogos';
import { LogoData, Shape } from '../../types';
import { AnimationPreviewModal } from './AnimationPreviewModal';
import { downloadFile, generateCleanSvg } from '../../utils/exportUtils';
import { generateInlumenaiStandaloneHtml } from '../../utils/inlumenaiHtmlExport';
import { cn } from '../../lib/utils';

interface InlumenaiMotionProps {
  currentPieces: HMAPiece[];
  paletteMode: PaletteMode;
  onSendToCanvas: (svgCode: string, name: string, motionParams?: Partial<AnimatedLayer>) => void;
  onBackToMatrix: () => void;
}

const TARGET_CENTER = 540;
const CLOCK_RADIUS = 360;
const UNIT_M = 67;

function findPointPiece(shapes: Shape[]): Shape {
  return shapes.find((s) => Math.abs(s.length - s.width) < 0.01) || shapes[0];
}

function calculateClockPositions(shapes: Shape[]) {
  const pointShape = findPointPiece(shapes);
  const otherShapes = shapes
    .filter((s) => s.id !== pointShape.id)
    .sort((a, b) => a.id.localeCompare(b.id));

  const map: Record<string, { x: number; y: number; hour: number }> = {};
  otherShapes.forEach((shape, i) => {
    const hour = i + 1; // 1 to 12
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

export const InlumenaiMotion: React.FC<InlumenaiMotionProps> = ({
  currentPieces,
  paletteMode,
  onSendToCanvas,
  onBackToMatrix
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [timelineProgress, setTimelineProgress] = useState<number>(0);
  const [currentPhaseName, setCurrentPhaseName] = useState<string>('1. Origen Central');
  const [activeLogoIndex, setActiveLogoIndex] = useState<number>(0);
  const [isLoopMode, setIsLoopMode] = useState<boolean>(true);
  const [showTechnicalGuides, setShowTechnicalGuides] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<'black' | 'transparent' | 'white'>('black');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [showModalPreview, setShowModalPreview] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const currentLogo = INITIAL_DATA[activeLogoIndex % INITIAL_DATA.length];

  // Helper to convert canonical Shape into HMAPiece for export or canvas transfer
  const getHMAPiecesFromShape = (shapes: Shape[]): HMAPiece[] => {
    return shapes.map((sh, idx) => ({
      id: sh.id,
      shapeType: 'P3_rect2x1',
      name: sh.displayName || sh.id,
      category: idx < 7 ? 'base' : 'upper',
      x: sh.x - TARGET_CENTER,
      y: sh.y - TARGET_CENTER,
      rotation: sh.rotation,
      widthM: sh.width / UNIT_M,
      heightM: sh.length / UNIT_M,
      scaleX: 1,
      scaleY: 1,
      color: sh.color,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: idx + 1
    }));
  };

  useLayoutEffect(() => {
    if (!svgRef.current) return;

    let ctx = gsap.context(() => {
      // Setup initial styles
      gsap.set('.master-rotation-group', { svgOrigin: '540 540' });
      gsap.set('.clock-guides-main', { opacity: showTechnicalGuides ? 0.6 : 0 });

      // Identify shapes of first logo
      const baseShapes = INITIAL_DATA[0].shapes;
      baseShapes.forEach((shape) => {
        gsap.set(`.g-${shape.id}`, {
          x: TARGET_CENTER,
          y: TARGET_CENTER,
          rotation: 0
        });
        gsap.set(`.rect-${shape.id}`, {
          attr: {
            width: UNIT_M,
            height: UNIT_M,
            rx: UNIT_M / 2,
            ry: UNIT_M / 2
          },
          x: -UNIT_M / 2,
          y: -UNIT_M / 2,
          fill: isWireframe ? 'transparent' : shape.color,
          stroke: isWireframe ? shape.color : 'none',
          strokeWidth: isWireframe ? 2 : 0,
          opacity: 1,
          scale: 1
        });
      });

      const tl = gsap.timeline({
        repeat: -1,
        paused: !isPlaying,
        onUpdate: function () {
          setTimelineProgress(this.progress());
        }
      });
      timelineRef.current = tl;
      tl.timeScale(playbackSpeed);

      const logosToAnimate = isLoopMode ? INITIAL_DATA : [currentLogo];

      logosToAnimate.forEach((st, idx) => {
        const label = `state_${st.serviceId}_${idx}`;
        const clockPos = calculateClockPositions(st.shapes);
        const sortedShapes = [...st.shapes].sort((a, b) => a.id.localeCompare(b.id));

        // 1. FORMAR RELOJ
        tl.addLabel(`${label}_clock`);
        tl.call(() => {
          const globalIdx = INITIAL_DATA.findIndex((s) => s.serviceId === st.serviceId);
          if (globalIdx !== -1) setActiveLogoIndex(globalIdx);
          setCurrentPhaseName(`1. Reloj Análogo: Dispersión 12 Horas + Centro [${st.serviceName}]`);

          // Reordenar nodos DOM para respetar el z-index de este logo específico
          const parent = svgRef.current?.querySelector('.master-rotation-group');
          if (parent) {
            st.shapes.forEach((shape) => {
              const el = parent.querySelector(`.g-${shape.id}`);
              if (el) parent.appendChild(el);
            });
          }
        });

        tl.set('.master-rotation-group', {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          svgOrigin: '540 540'
        });

        tl.to(
          '.clock-guides-main',
          { opacity: showTechnicalGuides ? 0.7 : 0, duration: 0.35 },
          '<'
        );

        sortedShapes.forEach((shape) => {
          const target = clockPos[shape.id];
          tl.to(
            `.rect-${shape.id}`,
            {
              fill: isWireframe ? 'transparent' : shape.color,
              stroke: isWireframe ? shape.color : 'none',
              strokeWidth: isWireframe ? 2 : 0,
              attr: {
                width: UNIT_M,
                height: UNIT_M,
                rx: UNIT_M / 2,
                ry: UNIT_M / 2
              },
              x: -UNIT_M / 2,
              y: -UNIT_M / 2,
              duration: 0.35,
              ease: 'power2.out'
            },
            '<'
          );
          tl.to(
            `.g-${shape.id}`,
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
        tl.call(() => setCurrentPhaseName(`2. Metamorfosis Vectorial → ${st.serviceName} (${st.clusterName})`));
        tl.to('.clock-guides-main', { opacity: 0.15, duration: 0.4 }, '<');

        st.shapes.forEach((shape) => {
          tl.to(
            `.g-${shape.id}`,
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
            `.rect-${shape.id}`,
            {
              attr: {
                width: shape.width,
                height: shape.length,
                rx: shape.width / 2,
                ry: shape.width / 2
              },
              x: -shape.width / 2,
              y: -shape.length / 2,
              duration: 1.3,
              ease: 'power3.inOut'
            },
            `${label}_morph`
          );
        });

        // 3. ISOTIPO CONSOLIDADO (HOLD)
        tl.addLabel(`${label}_complete`);
        tl.call(() => setCurrentPhaseName(`3. Isotipo Consolidado: ${st.serviceName} (Hold)`));
        tl.to({}, { duration: 2.0 });

        // 4. RETORNO AL RELOJ
        tl.addLabel(`${label}_return`);
        tl.call(() => setCurrentPhaseName(`4. Retorno al Reloj Análogo [${st.serviceName}]`));
        tl.to('.clock-guides-main', {
          opacity: showTechnicalGuides ? 0.7 : 0,
          duration: 0.3
        });

        sortedShapes.forEach((shape) => {
          const target = clockPos[shape.id];
          tl.to(
            `.g-${shape.id}`,
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
            `.rect-${shape.id}`,
            {
              attr: {
                width: UNIT_M,
                height: UNIT_M,
                rx: UNIT_M / 2,
                ry: UNIT_M / 2
              },
              x: -UNIT_M / 2,
              y: -UNIT_M / 2,
              duration: 0.9,
              ease: 'power3.inOut'
            },
            '<'
          );
        });

        // 5. CONVERGENCIA CENTRAL Y MUTACIÓN CROMÁTICA
        const nextLogo = logosToAnimate[(idx + 1) % logosToAnimate.length];
        tl.addLabel(`${label}_collapse`);
        tl.call(() => setCurrentPhaseName(`5. Convergencia Central → Próximo: ${nextLogo.serviceName}`));
        tl.to('.clock-guides-main', { opacity: 0.1, duration: 0.2 }, '<');

        st.shapes.forEach((shape) => {
          const nextShape = nextLogo.shapes.find((s) => s.id === shape.id) || shape;
          tl.to(
            `.g-${shape.id}`,
            {
              x: TARGET_CENTER,
              y: TARGET_CENTER,
              duration: 0.7,
              ease: 'power3.inOut'
            },
            '<0.01'
          );
          tl.to(
            `.rect-${shape.id}`,
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
  }, [!isLoopMode ? activeLogoIndex : null, isLoopMode, showTechnicalGuides, isWireframe, bgColor]);

  const togglePlay = () => {
    if (timelineRef.current) {
      if (isPlaying) {
        timelineRef.current.pause();
        setIsPlaying(false);
      } else {
        timelineRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSelectLogo = (idx: number) => {
    setActiveLogoIndex(idx);
    if (timelineRef.current) {
      if (isLoopMode) {
        const targetLabel = `state_${INITIAL_DATA[idx].serviceId}_${idx}_clock`;
        timelineRef.current.seek(targetLabel);
        if (!isPlaying) {
          timelineRef.current.play();
          setIsPlaying(true);
        }
      } else {
        timelineRef.current.restart();
      }
    }
  };

  const nextLogo = () => {
    const nextIdx = (activeLogoIndex + 1) % INITIAL_DATA.length;
    setActiveLogoIndex(nextIdx);
    if (timelineRef.current) {
      if (isLoopMode) {
        const targetLabel = `state_${INITIAL_DATA[nextIdx].serviceId}_${nextIdx}_clock`;
        timelineRef.current.seek(targetLabel);
        if (!isPlaying) {
          timelineRef.current.play();
          setIsPlaying(true);
        }
      } else {
        timelineRef.current.restart();
      }
    }
  };

  const prevLogo = () => {
    const prevIdx = (activeLogoIndex - 1 + INITIAL_DATA.length) % INITIAL_DATA.length;
    setActiveLogoIndex(prevIdx);
    if (timelineRef.current) {
      if (isLoopMode) {
        const targetLabel = `state_${INITIAL_DATA[prevIdx].serviceId}_${prevIdx}_clock`;
        timelineRef.current.seek(targetLabel);
        if (!isPlaying) {
          timelineRef.current.play();
          setIsPlaying(true);
        }
      } else {
        timelineRef.current.restart();
      }
    }
  };

  const handleSpeedChange = (spd: number) => {
    setPlaybackSpeed(spd);
    if (timelineRef.current) {
      timelineRef.current.timeScale(spd);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTimelineProgress(val);
    if (timelineRef.current) {
      timelineRef.current.progress(val);
    }
  };

  // Export current frame as clean SVG
  const handleExportCurrentSvg = () => {
    const pieces = getHMAPiecesFromShape(currentLogo.shapes);
    const svgCode = generateCleanSvg(pieces, 1080, true, bgColor === 'white' ? '#ffffff' : '#081126');
    downloadFile(svgCode, `INLUMENAI_MOTION_${currentLogo.serviceId}_frame.svg`, 'image/svg+xml');
  };

  // Export Standalone HTML
  const handleExportHtml = () => {
    const logosToAnimate = isLoopMode ? INITIAL_DATA : [currentLogo];
    const htmlCode = generateInlumenaiStandaloneHtml(
      logosToAnimate,
      isLoopMode,
      showTechnicalGuides,
      isWireframe,
      bgColor,
      playbackSpeed
    );
    const suffix = isLoopMode ? 'CICLO_13' : currentLogo.serviceName.replace(/\s+/g, '_').toUpperCase();
    downloadFile(htmlCode, `INLUMENAI_MOTION_${suffix}_${APP_VERSION}.html`, 'text/html');
  };

  // Send to Animated Canvas
  const handleSendToCanvas = () => {
    const logosToAnimate = isLoopMode ? INITIAL_DATA : [currentLogo];
    const htmlCode = generateInlumenaiStandaloneHtml(
      logosToAnimate,
      isLoopMode,
      showTechnicalGuides,
      isWireframe,
      bgColor,
      playbackSpeed
    );
    const isAll = isLoopMode;
    onSendToCanvas(
      htmlCode,
      isAll ? 'Secuencia Inlumenai (Ciclo 13)' : `Secuencia Inlumenai (${currentLogo.serviceName})`,
      {
        isMotionSequence: false,
        animationType: 'html-iframe',
        blendMode: 'normal',
        width: 1080,
        height: 1080,
        x: 960,
        y: 540
      }
    );
  };

  const pointShape = findPointPiece(currentLogo.shapes);

  // Generate 12 Clock Hour Ticks for 1080x1080 SVG
  const clockTicks = Array.from({ length: 12 }).map((_, i) => {
    const hour = i + 1;
    const angleRad = ((hour * 30 - 90) * Math.PI) / 180;
    const xOuter = TARGET_CENTER + (CLOCK_RADIUS + 14) * Math.cos(angleRad);
    const yOuter = TARGET_CENTER + (CLOCK_RADIUS + 14) * Math.sin(angleRad);
    const xInner = TARGET_CENTER + (CLOCK_RADIUS - 14) * Math.cos(angleRad);
    const yInner = TARGET_CENTER + (CLOCK_RADIUS - 14) * Math.sin(angleRad);
    const xText = TARGET_CENTER + (CLOCK_RADIUS + 36) * Math.cos(angleRad);
    const yText = TARGET_CENTER + (CLOCK_RADIUS + 36) * Math.sin(angleRad);

    return (
      <g key={`tick-${hour}`}>
        <line
          x1={xInner}
          y1={yInner}
          x2={xOuter}
          y2={yOuter}
          stroke="#14E5C3"
          strokeWidth={hour % 3 === 0 ? '3' : '1.5'}
          strokeLinecap="round"
          opacity="0.6"
        />
        <text
          x={xText}
          y={yText + 5}
          fill="#38BDF8"
          fontSize="15"
          fontFamily="monospace"
          textAnchor="middle"
          opacity="0.85"
        >
          {hour}
        </text>
      </g>
    );
  });

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-[#040915] select-none relative">
      {/* Left Control Panel */}
      {isSidebarOpen && (
        <aside className="w-88 border-r border-white/10 bg-[#081126]/95 backdrop-blur-md p-4 flex flex-col justify-between overflow-y-auto space-y-4 shrink-0 z-20">
          <div className="space-y-4">
            {/* Header */}
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <h2 className="text-sm font-extrabold text-white">
                    INLUMENAI MOTION ({APP_VERSION})
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Secuenciador GSAP • Reloj Canónico 1080p
                </p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                title="Ocultar panel lateral"
                className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Current Phase Badge */}
            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-3 shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                  Fase Activa en Secuencia
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  {isLoopMode ? 'Loop 13 Estados' : 'Modo Foco'}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{currentPhaseName}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Punto Central: <strong className="text-cyan-300">{pointShape.id}</strong></span>
                <span>Centro: <strong className="text-slate-200">540, 540</strong></span>
              </div>
            </div>

            {/* Loop Mode Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-blue-400" />
                Modo de Reproducción
              </label>
              <div className="grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setIsLoopMode(true)}
                  className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 font-bold ${
                    isLoopMode
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Ciclo 13 en Loop</span>
                </button>
                <button
                  onClick={() => setIsLoopMode(false)}
                  className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 font-bold ${
                    !isLoopMode
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Isotipo Fijo</span>
                </button>
              </div>
            </div>

            {/* Service Isotype Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                {isLoopMode ? 'Punto de Salida / Enfoque' : 'Seleccionar Isotipo'}
              </label>
              <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1">
                {INITIAL_DATA.map((srv, idx) => (
                  <button
                    key={srv.serviceId}
                    onClick={() => handleSelectLogo(idx)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      activeLogoIndex === idx
                        ? 'bg-blue-600/30 border border-blue-500 text-cyan-200 font-bold'
                        : 'bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 border border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] text-slate-500">{(idx + 1).toString().padStart(2, '0')}</span>
                      <span className="truncate text-[11px]">{srv.serviceName}</span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <span
                        className="w-2 h-2 rounded-full border border-black/40"
                        style={{ backgroundColor: srv.luzColor || '#3D80FD' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full border border-black/40"
                        style={{ backgroundColor: srv.profundoColor || '#2D60C1' }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Background & Render Controls */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                Fondo del Canvas
              </label>
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 justify-around">
                <button
                  onClick={() => setBgColor('transparent')}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded-lg transition-all',
                    bgColor === 'transparent' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  )}
                >
                  Transparente
                </button>
                <button
                  onClick={() => setBgColor('black')}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded-lg transition-all',
                    bgColor === 'black' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  )}
                >
                  Negro
                </button>
                <button
                  onClick={() => setBgColor('white')}
                  className={cn(
                    'px-2.5 py-1 text-xs rounded-lg transition-all',
                    bgColor === 'white' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  )}
                >
                  Blanco
                </button>
              </div>
            </div>

            {/* Toggles (Technical Guides & Wireframe) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/10">
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs text-slate-300">Guías Reloj (R=360px)</span>
                </div>
                <button
                  onClick={() => setShowTechnicalGuides(!showTechnicalGuides)}
                  className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold transition-colors ${
                    showTechnicalGuides
                      ? 'bg-cyan-500 text-black'
                      : 'bg-slate-800 text-slate-400 border border-white/10'
                  }`}
                >
                  {showTechnicalGuides ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/10">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs text-slate-300">Modo Wireframe Técnico</span>
                </div>
                <button
                  onClick={() => setIsWireframe(!isWireframe)}
                  className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold transition-colors ${
                    isWireframe
                      ? 'bg-purple-500 text-black'
                      : 'bg-slate-800 text-slate-400 border border-white/10'
                  }`}
                >
                  {isWireframe ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-white/10">
            <button
              onClick={() => setShowModalPreview(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-98 transition-all"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Abrir Modo Cine / Editor Modal</span>
            </button>

            <button
              onClick={handleSendToCanvas}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-98 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Transferir a Canvas Animado</span>
            </button>

            <button
              onClick={handleExportHtml}
              className="w-full py-2 px-3 rounded-xl bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 text-xs font-semibold flex items-center justify-center gap-2 border border-orange-500/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Motion HTML</span>
            </button>

            <button
              onClick={handleExportCurrentSvg}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Exportar SVG del Frame</span>
            </button>

            <button
              onClick={onBackToMatrix}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-white transition-colors text-center block"
            >
              ← Volver a Matrix
            </button>
          </div>
        </aside>
      )}

      {/* Main 1080x1080 Viewport */}
      <main className="flex-1 flex flex-col items-center justify-between p-6 overflow-hidden relative">
        {/* Floating Open Sidebar Button (when collapsed) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            title="Mostrar panel de control y presets"
            className="absolute top-6 left-6 z-30 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#081126]/95 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-950/80 shadow-2xl backdrop-blur-md transition-all text-xs font-mono font-bold group animate-fadeIn"
          >
            <PanelLeftOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Controles & Isotipos</span>
          </button>
        )}

        {/* Top Info Banner */}
        <div className="w-full max-w-4xl flex items-center justify-between px-4 py-2 bg-[#081126]/80 rounded-xl border border-white/10 shadow-lg text-xs font-mono">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              title={isSidebarOpen ? 'Ocultar panel lateral' : 'Mostrar panel lateral'}
              className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
            <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Retícula Canónica 1080×1080 (viewBox="0 0 1080 1080")
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden sm:inline">
              Centro: <strong>540, 540</strong> | Radio Reloj: <strong>360px</strong> | Módulo: <strong>67px</strong>
            </span>
            <button
              onClick={() => setShowModalPreview(true)}
              className="p-1 px-2.5 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30 text-xs font-mono hover:bg-teal-500/30 transition-colors flex items-center gap-1.5 font-bold"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Modo Cine</span>
            </button>
          </div>
        </div>

        {/* 1080x1080 Stage Viewport */}
        <div
          ref={containerRef}
          className="w-full max-w-[620px] aspect-square rounded-2xl border border-white/15 shadow-2xl shadow-cyan-500/10 flex items-center justify-center relative overflow-hidden my-auto transition-colors duration-300"
          style={{
            backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor,
            backgroundImage:
              bgColor === 'transparent'
                ? 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3neF/wX5GBEVM4oZcAIYjYThYCwMhkYDE8wH0WhgMBr4AQDX5RE+w9G8wAAAAABJRU5ErkJggg==")'
                : 'none'
          }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 1080 1080"
            className="w-full h-full block overflow-visible"
          >
            <defs>
              <pattern id="grid-pattern-main" width={UNIT_M} height={UNIT_M} patternUnits="userSpaceOnUse">
                <path
                  d={`M ${UNIT_M} 0 L 0 0 0 ${UNIT_M}`}
                  fill="none"
                  className={cn('stroke-cyan-500/30', bgColor === 'white' ? 'opacity-20 stroke-slate-400' : 'opacity-30')}
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            {/* Technical Box & Grid */}
            {showTechnicalGuides && (
              <g className="master-box-group pointer-events-none">
                <rect x="0" y="0" width="1080" height="1080" rx="48" fill="url(#grid-pattern-main)" />
                <rect
                  x="0"
                  y="0"
                  width="1080"
                  height="1080"
                  rx="48"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="8 8"
                  opacity="0.3"
                />
              </g>
            )}

            {/* Clock Guides (R=360px) */}
            <g className="clock-guides-main pointer-events-none">
              <circle
                cx={TARGET_CENTER}
                cy={TARGET_CENTER}
                r={CLOCK_RADIUS}
                fill="none"
                stroke="#14E5C3"
                strokeWidth="2"
                opacity="0.4"
                strokeDasharray="4 8"
              />
              <circle
                cx={TARGET_CENTER}
                cy={TARGET_CENTER}
                r={CLOCK_RADIUS + 33.5}
                fill="none"
                stroke="#14E5C3"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <circle
                cx={TARGET_CENTER}
                cy={TARGET_CENTER}
                r={CLOCK_RADIUS - 33.5}
                fill="none"
                stroke="#14E5C3"
                strokeWidth="0.5"
                opacity="0.2"
              />
              {clockTicks}
              <circle cx={TARGET_CENTER} cy={TARGET_CENTER} r="5" fill="#14E5C3" opacity="0.85" />
            </g>

            {/* Master Rotation Group & 13 Nodes */}
            <g className="master-rotation-group">
              {INITIAL_DATA[0].shapes.map((shape) => (
                <g key={shape.id} className={`g-${shape.id}`}>
                  <rect className={`rect-${shape.id}`} />
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Interactive Timeline Bar */}
        <div className="w-full max-w-4xl bg-[#081126]/95 border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3">
          {/* Scrubber Progress Slider */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-cyan-400 font-bold w-12 text-right">
              {Math.round(timelineProgress * 100)}%
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={timelineProgress}
              onChange={handleSeek}
              className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] font-mono text-slate-400 w-16 text-right">
              {timelineRef.current ? `${(timelineProgress * timelineRef.current.duration()).toFixed(1)}s` : '0.0s'}
            </span>
          </div>

          {/* Timeline Playback Controls */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={prevLogo}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Isotipo anterior"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                onClick={nextLogo}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Siguiente isotipo"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (timelineRef.current) timelineRef.current.restart();
                  setIsPlaying(true);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reiniciar secuencia"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Multipliers */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <span className="px-2 text-slate-400 text-[10px]">Velocidad:</span>
              {[0.5, 1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    playbackSpeed === spd
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Step to Next Isotype */}
            <button
              onClick={nextLogo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-white/10 transition-colors"
            >
              <span>{currentLogo.serviceName}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Animation Preview Modal (Modo Cine / Editor) */}
      {showModalPreview && (
        <AnimationPreviewModal
          logos={INITIAL_DATA}
          initialIndex={activeLogoIndex}
          onClose={() => setShowModalPreview(false)}
        />
      )}
    </div>
  );
};
