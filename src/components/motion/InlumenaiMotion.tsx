/**
 * INLUMENAI STUDIO (v3.0)
 * Module 2: MOTION (GSAP Sequencer & "El Reloj de las 13 Formas")
 * 
 * GUÍA TÉCNICA Y REGLAS ESTRICTAS DE RENDERIZADO: GSAP + SVG (1080x1080 Canónico)
 * 1. Sistema Espacial: viewBox="0 0 1080 1080", Centro (CX, CY) = (540, 540), CLOCK_R = 360px, UNIT_M = 67px.
 * 2. Estructura de Nodos: <g className="g-forma-XX"> controla (x, y, rotation). <rect className="rect-forma-XX"> controla (width=67, height=length, x=-width/2, y=-length/2, rx=width/2, ry=width/2).
 * 3. Detección Dinámica de Pieza-Punto: findPointPiece() coloca el círculo (length === width === 67) en (540, 540) y 12 piezas en horas 1..12.
 * 4. Metamorfosis Vectorial Verificada: Isotipo Madre y los 12 Servicios se despliegan con orientación vertical y rotaciones angulares exactas.
 */

import React, { useEffect, useRef, useState, useLayoutEffect, useMemo } from 'react';
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
  SkipForward,
  Plus,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Palette,
  Check,
  CheckSquare,
  Square,
  RefreshCw,
  Globe,
  Droplets,
  Layers,
  Gem
} from 'lucide-react';
import { AnimatedLayer, HMAPiece, PaletteMode, MotionFinishMode } from '../../types/hma';
import { APP_VERSION } from '../../data/hmaDefinitions';
import { INITIAL_DATA } from '../../data/canonicalLogos';
import { LogoData, Shape } from '../../types';
import { AnimationPreviewModal } from './AnimationPreviewModal';
import { MotionIsotypeEditorModal } from './MotionIsotypeEditorModal';
import { MotionAddPresetModal } from './MotionAddPresetModal';
import { downloadFile, generateCleanSvg } from '../../utils/exportUtils';
import { generateInlumenaiStandaloneHtml } from '../../utils/inlumenaiHtmlExport';
import { cn } from '../../lib/utils';

interface InlumenaiMotionProps {
  currentPieces: HMAPiece[];
  customLogos?: LogoData[];
  paletteMode: PaletteMode;
  onSendToCanvas: (svgCode: string, name: string, motionParams?: Partial<AnimatedLayer>) => void;
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
  customLogos = [],
  paletteMode,
  onSendToCanvas
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

  // Optical Finish Mode (Flat vs Frosted Glass vs Prismatic Dispersion vs 3D Caustic Crystal)
  const [finishMode, setFinishMode] = useState<MotionFinishMode>('flat');
  const [chromaIntensity, setChromaIntensity] = useState<'subtle' | 'vibrant'>('vibrant');
  const [causticIntensity, setCausticIntensity] = useState<'subtle' | 'vibrant'>('vibrant');
  const [specularRim, setSpecularRim] = useState<boolean>(true);

  // Custom Sequence State for Loop & Editing
  const [sequenceLogos, setSequenceLogos] = useState<LogoData[]>(() => {
    return [...INITIAL_DATA, ...customLogos];
  });

  // Track enabled status for each logo in loop mode
  const [enabledLogoIds, setEnabledLogoIds] = useState<Set<string>>(() => {
    return new Set(INITIAL_DATA.map((d) => d.serviceId));
  });

  // Modal editors state
  const [editingLogoIndex, setEditingLogoIndex] = useState<number | null>(null);
  const [showAddPresetModal, setShowAddPresetModal] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Filter active logos for the Loop
  const activeLoopLogos = useMemo(() => {
    const active = sequenceLogos.filter((l) => enabledLogoIds.has(l.serviceId));
    return active.length > 0 ? active : sequenceLogos;
  }, [sequenceLogos, enabledLogoIds]);

  const currentLogo = sequenceLogos[activeLogoIndex % sequenceLogos.length] || sequenceLogos[0];
  const logosToAnimate = isLoopMode ? activeLoopLogos : [currentLogo];

  // Get all unique shape IDs across all sequenceLogos to ensure DOM nodes exist for GSAP
  const allUniqueShapes = useMemo(() => {
    const shapeMap = new Map<string, Shape>();
    sequenceLogos.forEach((logo) => {
      logo.shapes.forEach((shape) => {
        if (!shapeMap.has(shape.id)) {
          shapeMap.set(shape.id, shape);
        }
      });
    });
    return Array.from(shapeMap.values());
  }, [sequenceLogos]);

  // Sequence Management Functions
  const toggleLogoInLoop = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEnabledLogoIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size <= 1) return prev; // Keep at least one enabled
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const moveLogoUp = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (index <= 0) return;
    setSequenceLogos((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    if (activeLogoIndex === index) {
      setActiveLogoIndex(index - 1);
    } else if (activeLogoIndex === index - 1) {
      setActiveLogoIndex(index);
    }
  };

  const moveLogoDown = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (index >= sequenceLogos.length - 1) return;
    setSequenceLogos((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    if (activeLogoIndex === index) {
      setActiveLogoIndex(index + 1);
    } else if (activeLogoIndex === index + 1) {
      setActiveLogoIndex(index);
    }
  };

  const duplicateLogo = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const source = sequenceLogos[index];
    if (!source) return;
    const newId = `${source.serviceId}_copy_${Date.now().toString(36)}`;
    const cloned: LogoData = {
      ...source,
      serviceId: newId,
      serviceName: `${source.serviceName} (Copia)`,
      shapes: JSON.parse(JSON.stringify(source.shapes))
    };

    setSequenceLogos((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, cloned);
      return copy;
    });

    setEnabledLogoIds((prev) => {
      const next = new Set(prev);
      next.add(newId);
      return next;
    });

    setActiveLogoIndex(index + 1);
  };

  const deleteLogo = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (sequenceLogos.length <= 1) return;
    const targetId = sequenceLogos[index].serviceId;

    setSequenceLogos((prev) => prev.filter((_, i) => i !== index));
    setEnabledLogoIds((prev) => {
      const next = new Set(prev);
      next.delete(targetId);
      return next;
    });

    setActiveLogoIndex((prev) => Math.max(0, Math.min(prev, sequenceLogos.length - 2)));
  };

  const resetSequence = () => {
    const defaults = [...INITIAL_DATA];
    setSequenceLogos(defaults);
    setEnabledLogoIds(new Set(defaults.map((d) => d.serviceId)));
    setActiveLogoIndex(0);
  };

  const handleUpdateLogo = (updated: LogoData) => {
    if (editingLogoIndex === null) return;
    setSequenceLogos((prev) => {
      const copy = [...prev];
      copy[editingLogoIndex] = updated;
      return copy;
    });
  };

  const handleAddPreset = (newLogo: LogoData) => {
    setSequenceLogos((prev) => [...prev, newLogo]);
    setEnabledLogoIds((prev) => {
      const next = new Set(prev);
      next.add(newLogo.serviceId);
      return next;
    });
    setActiveLogoIndex(sequenceLogos.length);
  };

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

    const prevProgress = timelineRef.current ? timelineRef.current.progress() : timelineProgress;

    let ctx = gsap.context(() => {
      // Setup initial styles
      gsap.set('.master-rotation-group', { svgOrigin: '540 540' });
      if (showTechnicalGuides) {
        gsap.set('.clock-guides-main', { opacity: 0.6, display: 'inline', visibility: 'visible' });
      } else {
        gsap.set('.clock-guides-main', { opacity: 0, display: 'none', visibility: 'hidden' });
      }

      // Identify base shapes and optical finish styles
      const strokeVal = isWireframe
        ? null
        : finishMode === 'prism'
        ? (specularRim ? 'url(#hma-prism-border)' : 'none')
        : finishMode === 'frosted'
        ? (specularRim ? 'url(#hma-frosted-border)' : 'none')
        : finishMode === 'caustic'
        ? (specularRim ? 'url(#hma-caustic-border)' : 'none')
        : 'none';
      const strokeW = isWireframe
        ? 2
        : finishMode === 'prism'
        ? (specularRim ? 2 : 0)
        : finishMode === 'frosted'
        ? (specularRim ? 1.5 : 0)
        : finishMode === 'caustic'
        ? (specularRim ? 2.2 : 0)
        : 0;
      const fillOpacity = isWireframe
        ? 0
        : finishMode === 'frosted'
        ? 0.84
        : finishMode === 'prism'
        ? 0.88
        : finishMode === 'caustic'
        ? 0.76
        : 1;

      allUniqueShapes.forEach((shape) => {
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
          fillOpacity: fillOpacity,
          stroke: isWireframe ? shape.color : strokeVal,
          strokeWidth: strokeW,
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
      if (prevProgress > 0) {
        tl.progress(prevProgress);
      }

      logosToAnimate.forEach((st, idx) => {
        const label = `state_${st.serviceId}_${idx}`;
        const clockPos = calculateClockPositions(st.shapes);
        const sortedShapes = [...st.shapes].sort((a, b) => a.id.localeCompare(b.id));

        // 1. FORMAR RELOJ
        tl.addLabel(`${label}_clock`);
        tl.call(() => {
          const globalIdx = sequenceLogos.findIndex((s) => s.serviceId === st.serviceId);
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

        if (showTechnicalGuides) {
          tl.to(
            '.clock-guides-main',
            { opacity: 0.7, duration: 0.35 },
            `${label}_clock`
          );
        }

        sortedShapes.forEach((shape) => {
          const target = clockPos[shape.id] || { x: TARGET_CENTER, y: TARGET_CENTER };
          tl.to(
            `.rect-${shape.id}`,
            {
              fill: isWireframe ? 'transparent' : shape.color,
              fillOpacity: fillOpacity,
              stroke: isWireframe ? shape.color : strokeVal,
              strokeWidth: strokeW,
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
            `${label}_clock`
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
            `${label}_clock+=0.015`
          );
        });

        tl.to({}, { duration: 0.3 });

        // 2. METAMORFOSIS HACIA ISOTIPO
        tl.addLabel(`${label}_morph`);
        tl.call(() => setCurrentPhaseName(`2. Metamorfosis Vectorial → ${st.serviceName} (${st.clusterName})`));
        if (showTechnicalGuides) {
          tl.to('.clock-guides-main', { opacity: 0.15, duration: 0.4 }, `${label}_morph`);
        }

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
        if (showTechnicalGuides) {
          tl.to('.clock-guides-main', {
            opacity: 0.7,
            duration: 0.3
          }, `${label}_return`);
        }

        sortedShapes.forEach((shape) => {
          const target = clockPos[shape.id] || { x: TARGET_CENTER, y: TARGET_CENTER };
          tl.to(
            `.g-${shape.id}`,
            {
              x: target.x,
              y: target.y,
              rotation: 0,
              duration: 0.9,
              ease: 'power3.inOut'
            },
            `${label}_return+=0.01`
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
            `${label}_return`
          );
        });

        // 5. CONVERGENCIA CENTRAL Y MUTACIÓN CROMÁTICA
        const nextLogo = logosToAnimate[(idx + 1) % logosToAnimate.length];
        tl.addLabel(`${label}_collapse`);
        tl.call(() => setCurrentPhaseName(`5. Convergencia Central → Próximo: ${nextLogo.serviceName}`));
        if (showTechnicalGuides) {
          tl.to('.clock-guides-main', { opacity: 0.1, duration: 0.2 }, `${label}_collapse`);
        }

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
            `${label}_collapse+=0.01`
          );
          tl.to(
            `.rect-${shape.id}`,
            {
              fill: isWireframe ? 'transparent' : nextShape.color,
              fillOpacity: fillOpacity,
              stroke: isWireframe ? nextShape.color : strokeVal,
              strokeWidth: strokeW,
              duration: 0.7,
              ease: 'power3.inOut'
            },
            `${label}_collapse`
          );
        });

        tl.to({}, { duration: 0.15 });
      });
    }, svgRef);

    return () => ctx.revert();
  }, [logosToAnimate, isLoopMode, showTechnicalGuides, isWireframe, bgColor, sequenceLogos, enabledLogoIds, finishMode, chromaIntensity, causticIntensity, specularRim]);

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
    const targetLogo = sequenceLogos[idx];
    if (!targetLogo) return;

    if (timelineRef.current) {
      if (isLoopMode) {
        const subIdx = logosToAnimate.findIndex((l) => l.serviceId === targetLogo.serviceId);
        if (subIdx !== -1) {
          const targetLabel = `state_${targetLogo.serviceId}_${subIdx}_clock`;
          timelineRef.current.seek(targetLabel);
          if (!isPlaying) {
            timelineRef.current.play();
            setIsPlaying(true);
          }
        }
      } else {
        timelineRef.current.restart();
      }
    }
  };

  const nextLogo = () => {
    const nextIdx = (activeLogoIndex + 1) % sequenceLogos.length;
    handleSelectLogo(nextIdx);
  };

  const prevLogo = () => {
    const prevIdx = (activeLogoIndex - 1 + sequenceLogos.length) % sequenceLogos.length;
    handleSelectLogo(prevIdx);
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
    const svgCode = generateCleanSvg(pieces, 1080, true, bgColor === 'white' ? '#FEFAE8' : '#060C04');
    downloadFile(svgCode, `INLUMENAI_MOTION_${currentLogo.serviceId}_frame.svg`, 'image/svg+xml');
  };

  // Export Standalone HTML (Customized sequence with all user modifications)
  const handleExportHtml = () => {
    const targetLogos = isLoopMode ? activeLoopLogos : [currentLogo];
    const htmlCode = generateInlumenaiStandaloneHtml(
      targetLogos,
      isLoopMode,
      showTechnicalGuides,
      isWireframe,
      bgColor,
      playbackSpeed,
      false,
      finishMode
    );
    const finishTag = finishMode === 'prism' ? '_PRISMA' : finishMode === 'frosted' ? '_VIDRIO' : finishMode === 'caustic' ? '_CRISTAL_CAUSTICO' : '';
    const suffix = isLoopMode
      ? `LOOP_${targetLogos.length}_ESTADOS${finishTag}`
      : `${currentLogo.serviceName.replace(/\s+/g, '_').toUpperCase()}${finishTag}`;
    downloadFile(htmlCode, `INLUMENAI_MOTION_${suffix}_${APP_VERSION}.html`, 'text/html');
  };

  // Export HTML specifically optimized for Website Hero Sections
  const handleExportHeroWebHtml = () => {
    const targetLogos = isLoopMode ? activeLoopLogos : [currentLogo];
    const htmlCode = generateInlumenaiStandaloneHtml(
      targetLogos,
      isLoopMode,
      false, // hide technical guides for clean production hero
      isWireframe,
      'transparent', // clean transparent background to seamlessly overlay web headers
      playbackSpeed,
      true, // isHeroMode
      finishMode
    );
    const finishTag = finishMode === 'prism' ? '_PRISMA' : finishMode === 'frosted' ? '_VIDRIO' : finishMode === 'caustic' ? '_CRISTAL_CAUSTICO' : '';
    const suffix = isLoopMode
      ? `LOOP_HERO_WEB_${targetLogos.length}_ESTADOS${finishTag}`
      : `${currentLogo.serviceName.replace(/\s+/g, '_').toUpperCase()}_HERO_WEB${finishTag}`;
    downloadFile(htmlCode, `INLUMENAI_${suffix}_${APP_VERSION}.html`, 'text/html');
  };

  // Send to Animated Canvas
  const handleSendToCanvas = () => {
    const targetLogos = isLoopMode ? activeLoopLogos : [currentLogo];
    const htmlCode = generateInlumenaiStandaloneHtml(
      targetLogos,
      isLoopMode,
      showTechnicalGuides,
      isWireframe,
      bgColor,
      playbackSpeed,
      false,
      finishMode
    );
    const isAll = isLoopMode;
    onSendToCanvas(
      htmlCode,
      isAll
        ? `Secuencia Inlumenai (Loop ${targetLogos.length} Estados)`
        : `Secuencia Inlumenai (${currentLogo.serviceName})`,
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
      {/* Mobile Backdrop for Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Control Panel */}
      {isSidebarOpen && (
        <aside className="fixed md:relative inset-y-0 left-0 z-40 md:z-auto w-96 max-w-[92vw] sm:max-w-sm border-r border-white/10 bg-[#060C04]/95 backdrop-blur-md p-4 flex flex-col justify-between overflow-y-auto space-y-4 shrink-0 shadow-2xl md:shadow-none">
          <div className="space-y-4">
            {/* Header */}
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <h2 className="text-sm font-extrabold text-white">
                    MOTION ({APP_VERSION})
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Secuenciador GSAP • Loop Personalizable 1080p
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
                  {isLoopMode ? `Loop ${activeLoopLogos.length} Estados` : 'Modo Foco'}
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
                  <span>Loop ({activeLoopLogos.length})</span>
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

            {/* SEQUENCE MANAGER (Ciclo en Loop Personalizado) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-slate-300 uppercase font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Secuencia del Loop ({sequenceLogos.length})</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowAddPresetModal(true)}
                    title="Añadir isotipo a la secuencia"
                    className="p-1 px-2 rounded-md bg-blue-600/30 hover:bg-blue-600 text-blue-200 border border-blue-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir</span>
                  </button>
                  <button
                    onClick={resetSequence}
                    title="Restablecer secuencia original de 13 isotipos"
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Sequence Items */}
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {sequenceLogos.map((srv, idx) => {
                  const isEnabled = enabledLogoIds.has(srv.serviceId);
                  const isSelected = activeLogoIndex === idx;

                  return (
                    <div
                      key={srv.serviceId}
                      className={cn(
                        'p-2 rounded-xl text-xs flex items-center justify-between transition-all group border',
                        isSelected
                          ? 'bg-blue-950/60 border-blue-500 text-cyan-100 shadow-sm'
                          : isEnabled
                          ? 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-850'
                          : 'bg-slate-950/40 border-white/5 text-slate-500 opacity-60'
                      )}
                    >
                      {/* Left: Toggle Checkbox, Index & Name */}
                      <div
                        onClick={() => handleSelectLogo(idx)}
                        className="flex items-center gap-2 truncate cursor-pointer flex-1 mr-1"
                      >
                        <button
                          onClick={(e) => toggleLogoInLoop(srv.serviceId, e)}
                          title={isEnabled ? 'Excluir del Loop' : 'Incluir en el Loop'}
                          className="text-slate-400 hover:text-cyan-300 transition-colors"
                        >
                          {isEnabled ? (
                            <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </button>

                        <span className="font-mono text-[10px] text-slate-500 w-4">
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        <span className="truncate text-[11px] font-semibold">
                          {srv.serviceName}
                        </span>
                      </div>

                      {/* Right: Color Dots & Quick Action Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Color Indicators */}
                        <div className="flex gap-0.5 mr-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs"
                            style={{ backgroundColor: srv.luzColor || '#3D80FD' }}
                          />
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs"
                            style={{ backgroundColor: srv.profundoColor || '#2D60C1' }}
                          />
                        </div>

                        {/* Edit Colors & Shapes */}
                        <button
                          onClick={() => setEditingLogoIndex(idx)}
                          title="Personalizar colores y formas"
                          className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                        >
                          <Palette className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Up */}
                        <button
                          onClick={(e) => moveLogoUp(idx, e)}
                          disabled={idx === 0}
                          title="Subir posición"
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>

                        {/* Move Down */}
                        <button
                          onClick={(e) => moveLogoDown(idx, e)}
                          disabled={idx === sequenceLogos.length - 1}
                          title="Bajar posición"
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={(e) => duplicateLogo(idx, e)}
                          title="Duplicar isotipo"
                          className="p-1 rounded text-slate-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        {sequenceLogos.length > 1 && (
                          <button
                            onClick={(e) => deleteLogo(idx, e)}
                            title="Eliminar de la secuencia"
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Finish Mode Switcher: "La Arquitectura de la Luz" */}
            <div className="space-y-2 p-3 rounded-xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 shadow-lg">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-cyan-300 uppercase font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Acabado Óptico (13 Formas)</span>
                </label>
                <span className={cn(
                  "text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold",
                  finishMode === 'caustic'
                    ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                    : finishMode === 'prism'
                    ? 'bg-pink-500/15 text-pink-300 border-pink-500/30'
                    : finishMode === 'frosted'
                    ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                )}>
                  {finishMode === 'flat' ? 'Vectorial' : finishMode === 'frosted' ? 'Esmerilado' : finishMode === 'prism' ? 'Prisma RGB' : 'Cristal 3D'}
                </span>
              </div>

              {/* 4 Finish Options */}
              <div className="grid grid-cols-4 gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setFinishMode('flat')}
                  title="Acabado vectorial plano canónico y limpio"
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 rounded-lg text-[9px] font-medium transition-all text-center',
                    finishMode === 'flat'
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="leading-tight">Plano</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFinishMode('frosted')}
                  title="Vidrio esmerilado con textura rugosa, specular highlight y refracción óptica"
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 rounded-lg text-[9px] font-medium transition-all text-center',
                    finishMode === 'frosted'
                      ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-bold shadow-md shadow-teal-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span className="leading-tight">Vidrio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFinishMode('prism')}
                  title="Prisma óptico con dispersión cromática RGB, bisel espectral y destello vítreo"
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 rounded-lg text-[9px] font-medium transition-all text-center',
                    finishMode === 'prism'
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-md shadow-purple-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                  <span className="leading-tight">Prisma</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFinishMode('caustic')}
                  title="Cristal óptico 3D translúcido con refracción y dispersión cáustica"
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 rounded-lg text-[9px] font-medium transition-all text-center',
                    finishMode === 'caustic'
                      ? 'bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-300 text-black font-bold shadow-md shadow-cyan-400/30 ring-1 ring-white/50'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Gem className="w-3.5 h-3.5" />
                  <span className="leading-tight">Cristal 3D</span>
                </button>
              </div>

              {/* Sub-parameters when glass/prism/caustic is active */}
              {finishMode !== 'flat' && (
                <div className="pt-1.5 space-y-2 border-t border-white/10 animate-fadeIn">
                  {/* Chromatic Intensity for Prism */}
                  {finishMode === 'prism' && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Dispersión Cromática</span>
                      <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setChromaIntensity('subtle')}
                          className={cn(
                            'px-2 py-0.5 rounded transition-colors',
                            chromaIntensity === 'subtle' ? 'bg-purple-500/40 text-purple-200 font-bold' : 'text-slate-500 hover:text-slate-300'
                          )}
                        >
                          Sutil
                        </button>
                        <button
                          type="button"
                          onClick={() => setChromaIntensity('vibrant')}
                          className={cn(
                            'px-2 py-0.5 rounded transition-colors',
                            chromaIntensity === 'vibrant' ? 'bg-pink-500/40 text-pink-200 font-bold' : 'text-slate-500 hover:text-slate-300'
                          )}
                        >
                          Vibrante
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Caustic Intensity for 3D Crystal */}
                  {finishMode === 'caustic' && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Dispersión Cáustica</span>
                      <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setCausticIntensity('subtle')}
                          className={cn(
                            'px-2 py-0.5 rounded transition-colors',
                            causticIntensity === 'subtle' ? 'bg-sky-500/40 text-sky-200 font-bold' : 'text-slate-500 hover:text-slate-300'
                          )}
                        >
                          Sutil
                        </button>
                        <button
                          type="button"
                          onClick={() => setCausticIntensity('vibrant')}
                          className={cn(
                            'px-2 py-0.5 rounded transition-colors',
                            causticIntensity === 'vibrant' ? 'bg-cyan-400/40 text-cyan-200 font-bold' : 'text-slate-500 hover:text-slate-300'
                          )}
                        >
                          Intensa
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Specular Rim / Bevel Toggle */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Bisel Especular 3D</span>
                    <button
                      type="button"
                      onClick={() => setSpecularRim(!specularRim)}
                      className={cn(
                        'px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all border',
                        specularRim
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-black/40 text-slate-500 border-white/10'
                      )}
                    >
                      {specularRim ? 'Activo' : 'Inactivo'}
                    </button>
                  </div>
                </div>
              )}
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
              id="btn-motion-to-canvas"
              onClick={handleSendToCanvas}
              title="Transferir la secuencia animada a Animation (Paso 2 del ecosistema)"
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold flex items-center justify-between shadow-lg shadow-purple-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-purple-200" />
                <span>Continuar a Animation</span>
              </div>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-mono font-black">
                Paso 2 ➔
              </span>
            </button>

            <button
              onClick={handleExportHeroWebHtml}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 hover:to-teal-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 border border-cyan-500/40 shadow-md shadow-cyan-500/10 transition-all active:scale-98 group"
              title="Descargar HTML autónomo optimizado para cabeceras y hero de la página web (100% responsivo, sin bordes, fondo transparente)"
            >
              <Globe className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Exportar para Hero Web (HTML)</span>
            </button>

            <button
              onClick={handleExportHtml}
              className="w-full py-2 px-3 rounded-xl bg-orange-600/20 hover:bg-orange-600/40 text-orange-400 text-xs font-semibold flex items-center justify-center gap-2 border border-orange-500/30 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar HTML Personalizado</span>
            </button>

            <button
              onClick={handleExportCurrentSvg}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Exportar SVG del Frame</span>
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
            className="absolute top-6 left-6 z-30 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#060C04]/95 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-950/80 shadow-2xl backdrop-blur-md transition-all text-xs font-mono font-bold group animate-fadeIn"
          >
            <PanelLeftOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Controles & Secuencia</span>
          </button>
        )}

        {/* Top Info Banner */}
        <div className="w-full max-w-4xl flex items-center justify-between px-4 py-2 bg-[#060C04]/80 rounded-xl border border-white/10 shadow-lg text-xs font-mono">
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
              Centro: <strong>540, 540</strong> | Secuencia: <strong>{activeLoopLogos.length} Estados</strong>
            </span>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
              <span className="text-slate-400">Acabado:</span>
              <span className={cn(
                "font-bold font-mono text-[11px]",
                finishMode === 'caustic'
                  ? 'text-sky-300'
                  : finishMode === 'prism'
                  ? 'text-pink-400'
                  : finishMode === 'frosted'
                  ? 'text-teal-300'
                  : 'text-cyan-400'
              )}>
                {finishMode === 'caustic' ? 'Cristal 3D Cáustico' : finishMode === 'prism' ? 'Prisma Óptico' : finishMode === 'frosted' ? 'Vidrio Esmerilado' : 'Vectorial Plano'}
              </span>
            </div>
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
            backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor === 'black' ? '#060C04' : '#FEFAE8',
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

              {/* Gradients for Specular Rim */}
              <linearGradient id="hma-prism-border" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="20%" stopColor="#818CF8" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#C084FC" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#F472B6" stopOpacity="0.9" />
                <stop offset="80%" stopColor="#FBBF24" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#34D399" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="hma-frosted-border" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.25" />
                <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
              </linearGradient>

              {/* 3D Crystal Caustic Perimeter Gradient */}
              <linearGradient id="hma-caustic-border" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="25%" stopColor="#7DD3FC" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#C084FC" stopOpacity="0.65" />
                <stop offset="75%" stopColor="#38BDF8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
              </linearGradient>

              {/* Frosted Glass SVG Filter */}
              <filter id="hma-frosted-glass" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={3} result="roughness" />
                <feDisplacementMap in="SourceGraphic" in2="roughness" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred" />
                <feSpecularLighting in="blurred" surfaceScale="4.5" specularConstant="1.6" specularExponent="22" lightingColor="#ffffff" result="specular">
                  <feDistantLight azimuth={220} elevation={55} />
                </feSpecularLighting>
                <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularBevel" />
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.4" result="shadow" />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="displaced" />
                  <feMergeNode in="specularBevel" />
                </feMerge>
              </filter>

              {/* Prismatic Dispersion SVG Filter */}
              <filter id="hma-prism-chromatic" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
                <feOffset in="SourceGraphic" dx={chromaIntensity === 'vibrant' ? -3.5 : -2} dy={chromaIntensity === 'vibrant' ? -2.2 : -1.2} result="redShift" />
                <feColorMatrix in="redShift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" result="redChannel" />
                
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} result="prismNoise" />
                <feDisplacementMap in="SourceGraphic" in2="prismNoise" scale={chromaIntensity === 'vibrant' ? 3.8 : 2.5} xChannelSelector="R" yChannelSelector="B" result="greenDisplaced" />
                <feColorMatrix in="greenDisplaced" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0.95 0" result="greenChannel" />
                
                <feOffset in="SourceGraphic" dx={chromaIntensity === 'vibrant' ? 3.5 : 2} dy={chromaIntensity === 'vibrant' ? 2.2 : 1.2} result="blueShift" />
                <feColorMatrix in="blueShift" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 0.9 0" result="blueChannel" />
                
                <feBlend in="redChannel" in2="greenChannel" mode="screen" result="rgBlend" />
                <feBlend in="rgBlend" in2="blueChannel" mode="screen" result="chromaticBody" />
                
                <feGaussianBlur in="chromaticBody" stdDeviation="1.5" result="glintBlur" />
                <feSpecularLighting in="glintBlur" surfaceScale="5.5" specularConstant="2.2" specularExponent="32" lightingColor="#ffffff" result="specularLight">
                  <feDistantLight azimuth={225} elevation={65} />
                </feSpecularLighting>
                <feComposite in="specularLight" in2="SourceAlpha" operator="in" result="glintHighlight" />
                
                <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#020617" floodOpacity="0.5" result="prismShadow" />
                <feMerge>
                  <feMergeNode in="prismShadow" />
                  <feMergeNode in="chromaticBody" />
                  <feMergeNode in="glintHighlight" />
                </feMerge>
              </filter>

              {/* 3D Translucent Optical Glass with Refraction & Caustic Dispersion */}
              <filter id="hma-crystal-caustic" x="-45%" y="-45%" width="190%" height="190%" colorInterpolationFilters="sRGB">
                {/* 1. Internal Optical Refraction Warp */}
                <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves={2} result="lensNoise" />
                <feDisplacementMap in="SourceGraphic" in2="lensNoise" scale={causticIntensity === 'vibrant' ? 4.5 : 2.8} xChannelSelector="R" yChannelSelector="G" result="refractedBody" />

                {/* 2. High-Frequency Caustic Light Web (Envelopes of concentrated photons) */}
                <feTurbulence type="turbulence" baseFrequency="0.065 0.08" numOctaves={3} result="causticTurbulence" />
                <feColorMatrix
                  in="causticTurbulence"
                  type="matrix"
                  values={
                    causticIntensity === 'vibrant'
                      ? "0 0 0 0 0.25   0 0 0 0 0.85   0 0 0 0 1   3.8 3.8 3.8 0 -2.4"
                      : "0 0 0 0 0.2    0 0 0 0 0.75   0 0 0 0 0.95 2.8 2.8 2.8 0 -1.9"
                  }
                  result="causticWebRaw"
                />
                <feComposite in="causticWebRaw" in2="SourceAlpha" operator="in" result="causticWebClipped" />
                <feGaussianBlur in="causticWebClipped" stdDeviation="0.8" result="causticWebGlow" />

                {/* 3. Caustic Spectral Dispersion (Chromatic fringing on caustic peaks) */}
                <feOffset in="causticWebGlow" dx={causticIntensity === 'vibrant' ? -2.6 : -1.6} dy={causticIntensity === 'vibrant' ? -1.6 : -1.0} result="cRedShift" />
                <feColorMatrix in="cRedShift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0" result="cRed" />
                <feOffset in="causticWebGlow" dx={causticIntensity === 'vibrant' ? 2.6 : 1.6} dy={causticIntensity === 'vibrant' ? 1.6 : 1.0} result="cBlueShift" />
                <feColorMatrix in="cBlueShift" type="matrix" values="0 0 0 0 0  0 0.7 0 0 0  0 0 1 0 0  0 0 0 0.85 0" result="cBlue" />
                <feBlend in="cRed" in2="cBlue" mode="screen" result="causticDispersed" />
                <feBlend in="causticDispersed" in2="causticWebGlow" mode="screen" result="causticFinal" />

                {/* 4. 3D Volumetric Specular Glint (Front Key Light) */}
                <feGaussianBlur in="SourceAlpha" stdDeviation="1.8" result="alphaGlint" />
                <feSpecularLighting in="alphaGlint" surfaceScale="6.5" specularConstant="2.4" specularExponent="36" lightingColor="#ffffff" result="specularKey">
                  <feDistantLight azimuth={215} elevation={66} />
                </feSpecularLighting>
                <feComposite in="specularKey" in2="SourceAlpha" operator="in" result="specularKeyClipped" />

                {/* 5. Secondary 3D Rim Highlight (Fresnel edge) */}
                <feSpecularLighting in="alphaGlint" surfaceScale="3.8" specularConstant="1.4" specularExponent="24" lightingColor="#e0f2fe" result="specularRim">
                  <feDistantLight azimuth={45} elevation={38} />
                </feSpecularLighting>
                <feComposite in="specularRim" in2="SourceAlpha" operator="in" result="specularRimClipped" />

                {/* 6. Caustic Dispersion Ground Projection & Contact Shadow */}
                <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#0284c7" floodOpacity="0.42" result="causticGroundPool" />
                <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#020617" floodOpacity="0.55" result="contactShadow" />

                {/* 7. Composite All Volumetric Layers */}
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
            {showTechnicalGuides && (
              <g
                className="clock-guides-main pointer-events-none"
                style={{
                  display: showTechnicalGuides ? 'inline' : 'none',
                  visibility: showTechnicalGuides ? 'visible' : 'hidden'
                }}
              >
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
            )}

            {/* Master Rotation Group & Nodes */}
            <g className="master-rotation-group">
              {allUniqueShapes.map((shape) => (
                <g key={shape.id} className={`g-${shape.id}`}>
                  <rect
                    className={`rect-${shape.id}`}
                    x="0"
                    y="0"
                    filter={
                      finishMode === 'caustic'
                        ? 'url(#hma-crystal-caustic)'
                        : finishMode === 'prism'
                        ? 'url(#hma-prism-chromatic)'
                        : finishMode === 'frosted'
                        ? 'url(#hma-frosted-glass)'
                        : undefined
                    }
                  />
                </g>
              ))}
            </g>
          </svg>
        </div>

        {/* Interactive Timeline Bar */}
        <div className="w-full max-w-4xl bg-[#060C04]/95 border border-white/15 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3">
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
          logos={logosToAnimate}
          initialIndex={Math.min(activeLogoIndex, logosToAnimate.length - 1)}
          onClose={() => setShowModalPreview(false)}
          finishMode={finishMode}
        />
      )}

      {/* Isotype Colors & Shapes Editor Modal */}
      {editingLogoIndex !== null && sequenceLogos[editingLogoIndex] && (
        <MotionIsotypeEditorModal
          logo={sequenceLogos[editingLogoIndex]}
          index={editingLogoIndex}
          onSave={handleUpdateLogo}
          onClose={() => setEditingLogoIndex(null)}
        />
      )}

      {/* Add Isotype from Catalog / Presets Modal */}
      {showAddPresetModal && (
        <MotionAddPresetModal
          onAdd={handleAddPreset}
          onClose={() => setShowAddPresetModal(false)}
        />
      )}
    </div>
  );
};

