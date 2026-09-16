/**
 * INLUMENAI STUDIO (v3.0)
 * Module 3: ANIMATION (Compositor, Físicas Continuas & Grabador de Video)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Monitor,
  Smartphone,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Video,
  StopCircle,
  Download,
  FileCode,
  Sparkles,
  Layers,
  Upload,
  ArrowLeft,
  Settings,
  Sliders,
  Play,
  Grid,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Compass,
  Repeat,
  RotateCw,
  Link2,
  Unlink,
  ClipboardPaste,
  Check
} from 'lucide-react';
import { AnimatedLayer, BlendMode, CanvasAnimationType } from '../../types/hma';
import { APP_VERSION } from '../../data/hmaDefinitions';
import { INITIAL_DATA } from '../../data/canonicalLogos';
import { downloadFile, generateAutonomousAnimatedHtml } from '../../utils/exportUtils';
import { buildSvgPatternMarkup } from '../../utils/patternUtils';
import { ExportModal } from './ExportModal';
import { ExportOptions } from '../../types';
import { InlumenaiCanvasLayer } from './InlumenaiCanvasLayer';
import { ShapeColorPicker } from '../common/ShapeColorPicker';
import { LeftToolRail, LeftRailTab } from './LeftToolRail';
import { LeftToolDrawer } from './LeftToolDrawer';
import { RightInspectorPanel } from './RightInspectorPanel';
import { FloatingCanvasBottomBar } from './FloatingCanvasBottomBar';

interface AnimatedSvgCanvasEditorProps {
  layers: AnimatedLayer[];
  setLayers: React.Dispatch<React.SetStateAction<AnimatedLayer[]>>;
}

export interface CopiedLayerConfig {
  sourceLayerId: string;
  sourceLayerName: string;
  width: number;
  height: number;
  scale?: number;
  rotation: number;
  x: number;
  y: number;
  animationType: CanvasAnimationType;
  animDuration: number;
  animX: number;
  animY: number;
  animDelay: number;
  isPattern?: boolean;
  patternScale?: number;
  patternSpacing?: number;
  patternGapX?: number;
  patternGapY?: number;
  patternItemScale?: number;
  patternItemRotation?: number;
  patternStagger?: boolean;
  patternRotation?: number;
  patternFullCanvas?: boolean;
  opacity: number;
  blur: number;
  blendMode: BlendMode;
  wireframe: boolean;
  color?: string;
  motionSpeed?: number;
  motionShowGuides?: boolean;
  motionWireframe?: boolean;
}

export const AnimatedSvgCanvasEditor: React.FC<AnimatedSvgCanvasEditorProps> = ({
  layers,
  setLayers
}) => {
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '21:9' | '9:16' | '1:1'>('16:9');
  const [activeRailTab, setActiveRailTab] = useState<LeftRailTab>('layers');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(layers[0]?.id || null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [canvasBgColor, setCanvasBgColor] = useState<string>('#060C04');

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [showPasteModal, setShowPasteModal] = useState<boolean>(false);
  const [pastedSvgCode, setPastedSvgCode] = useState<string>('');
  const [pastedLayerName, setPastedLayerName] = useState<string>('Capa SVG Importada');
  const [linkGaps, setLinkGaps] = useState<boolean>(true);

  // Copy & Paste Layer Configuration
  const [copiedConfig, setCopiedConfig] = useState<CopiedLayerConfig | null>(null);
  const [configToast, setConfigToast] = useState<{ message: string; type: 'copy' | 'paste' } | null>(null);
  const toastTimerRef = useRef<any>(null);

  const showToast = (message: string, type: 'copy' | 'paste') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setConfigToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setConfigToast(null);
    }, 2800);
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const isAllPanelsCollapsed = !isDrawerOpen && !isRightPanelOpen;

  const toggleFullscreen = () => {
    if (isAllPanelsCollapsed) {
      setIsDrawerOpen(true);
      setIsRightPanelOpen(true);
    } else {
      setIsDrawerOpen(false);
      setIsRightPanelOpen(false);
    }
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  // Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  // Video Recording with MediaRecorder
  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 60 }
      });

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        downloadFile(blob, `MOTION_HMA_CANVAS_ANIMADO_${Date.now()}_${APP_VERSION}.webm`, 'video/webm');
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error al iniciar grabación:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Drag & drop SVG import handler
  const handleDropSvg = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/svg+xml' || file.name.endsWith('.svg'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          addNewSvgLayer(content, file.name.replace('.svg', ''));
        }
      };
      reader.readAsText(file);
    }
  };

  // Add new SVG layer
  const addNewSvgLayer = (svgCode: string, name = 'Nueva Capa SVG') => {
    const newId = `layer-${Date.now()}`;
    
    let initialW = 380;
    let initialH = 380;
    const svgMatch = svgCode.match(/<svg([^>]*)>/i);
    if (svgMatch) {
      const attrs = svgMatch[1];
      const widthMatch = attrs.match(/\bwidth=(["'])([^"']*)\1/i);
      const heightMatch = attrs.match(/\bheight=(["'])([^"']*)\1/i);
      const viewBoxMatch = attrs.match(/\bviewBox=(["'])([^"']*)\1/i);
      
      if (widthMatch && heightMatch) {
        initialW = parseFloat(widthMatch[2]) || 380;
        initialH = parseFloat(heightMatch[2]) || 380;
      } else if (viewBoxMatch) {
        const parts = viewBoxMatch[2].trim().split(/[\s,]+/);
        if (parts.length >= 4) {
          initialW = parseFloat(parts[2]) || 380;
          initialH = parseFloat(parts[3]) || 380;
        }
      }
    }
    
    // Cap initial size to avoid massive layers
    if (initialW > 1080 || initialH > 1080) {
      const scale = Math.min(1080 / initialW, 1080 / initialH);
      initialW = initialW * scale;
      initialH = initialH * scale;
    }

    const newLayer: AnimatedLayer = {
      id: newId,
      name,
      svgCode,
      x: 0,
      y: 0,
      width: initialW,
      height: initialH,
      rotation: 0,
      opacity: 1,
      blur: 0,
      blendMode: 'normal',
      wireframe: false,
      isPattern: false,
      patternScale: 160,
      patternSpacing: 40,
      patternGapX: 40,
      patternGapY: 40,
      patternItemScale: 1.0,
      patternItemRotation: 0,
      patternStagger: false,
      patternRotation: 0,
      patternFullCanvas: true,
      animationType: 'float',
      animDuration: 4,
      animX: 30,
      animY: -30,
      animDelay: 0,
      visible: true,
      locked: false,
      exportable: true,
      zIndex: layers.length + 1
    };

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newId);
  };

  // Add new Motion Sequence layer
  const addNewMotionLayer = (serviceId = 'all') => {
    const newId = `layer-motion-${Date.now()}`;
    const srv = INITIAL_DATA.find((s) => s.serviceId === serviceId);
    const layerName = serviceId === 'all' ? 'Secuencia Inlumenai (Ciclo 13)' : `Secuencia Inlumenai (${srv?.serviceName || serviceId})`;

    const newLayer: AnimatedLayer = {
      id: newId,
      name: layerName,
      svgCode: '',
      x: 0,
      y: 0,
      width: 480,
      height: 480,
      rotation: 0,
      opacity: 1,
      blur: 0,
      blendMode: 'normal',
      wireframe: false,
      isPattern: false,
      patternScale: 1,
      patternSpacing: 100,
      animationType: 'inlumenai-morph',
      animDuration: 3.5,
      animX: 0,
      animY: 0,
      animDelay: 0,
      visible: true,
      locked: false,
      exportable: true,
      zIndex: layers.length + 1,
      isMotionSequence: true,
      motionServiceId: serviceId,
      motionIsLoop: serviceId === 'all',
      motionSpeed: 1,
      motionShowGuides: false,
      motionWireframe: false
    };

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newId);
  };

  const addNewHtmlLayer = (htmlCode: string, name = 'Capa HTML') => {
    const newId = `layer-html-${Date.now()}`;
    const newLayer: AnimatedLayer = {
      id: newId,
      name,
      svgCode: htmlCode,
      x: 0,
      y: 0,
      width: aspectRatio === '16:9' ? 1920 : 1080,
      height: aspectRatio === '16:9' ? 1080 : 1920,
      rotation: 0,
      opacity: 1,
      blur: 0,
      blendMode: 'normal',
      wireframe: false,
      isPattern: false,
      patternScale: 1,
      patternSpacing: 100,
      animationType: 'html-iframe',
      animDuration: 4,
      animX: 0,
      animY: 0,
      animDelay: 0,
      visible: true,
      locked: false,
      exportable: false,
      zIndex: layers.length + 1
    };

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newId);
  };

  const handleUpdateLayer = (updated: Partial<AnimatedLayer>) => {
    if (!selectedLayerId) return;
    setLayers((prev) =>
      prev.map((l) => (l.id === selectedLayerId ? { ...l, ...updated } : l))
    );
  };

  const handleDuplicateLayer = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    const newId = `layer-${Date.now()}`;
    const duplicate: AnimatedLayer = {
      ...layer,
      id: newId,
      name: `${layer.name} (Copia)`,
      x: layer.x + 30,
      y: layer.y + 30,
      zIndex: layers.length + 1
    };
    setLayers((prev) => [...prev, duplicate]);
    setSelectedLayerId(newId);
  };

  const handleCopyLayerConfig = (layer: AnimatedLayer) => {
    const config: CopiedLayerConfig = {
      sourceLayerId: layer.id,
      sourceLayerName: layer.name,
      width: layer.width,
      height: layer.height,
      scale: layer.scale,
      rotation: layer.rotation,
      x: layer.x,
      y: layer.y,
      animationType: layer.animationType,
      animDuration: layer.animDuration,
      animX: layer.animX,
      animY: layer.animY,
      animDelay: layer.animDelay,
      isPattern: layer.isPattern,
      patternScale: layer.patternScale,
      patternSpacing: layer.patternSpacing,
      patternGapX: layer.patternGapX,
      patternGapY: layer.patternGapY,
      patternItemScale: layer.patternItemScale,
      patternItemRotation: layer.patternItemRotation,
      patternStagger: layer.patternStagger,
      patternRotation: layer.patternRotation,
      patternFullCanvas: layer.patternFullCanvas,
      opacity: layer.opacity,
      blur: layer.blur,
      blendMode: layer.blendMode,
      wireframe: layer.wireframe,
      color: layer.color,
      motionSpeed: layer.motionSpeed,
      motionShowGuides: layer.motionShowGuides,
      motionWireframe: layer.motionWireframe
    };
    setCopiedConfig(config);
    showToast(`Configuración de "${layer.name}" copiada`, 'copy');
  };

  const handlePasteLayerConfig = (targetLayerId: string) => {
    if (!copiedConfig) return;
    const targetLayer = layers.find((l) => l.id === targetLayerId);
    if (!targetLayer) return;

    setLayers((prev) =>
      prev.map((l) => {
        if (l.id !== targetLayerId) return l;
        return {
          ...l,
          width: copiedConfig.width,
          height: copiedConfig.height,
          scale: copiedConfig.scale,
          rotation: copiedConfig.rotation,
          x: copiedConfig.x,
          y: copiedConfig.y,
          animationType: copiedConfig.animationType,
          animDuration: copiedConfig.animDuration,
          animX: copiedConfig.animX,
          animY: copiedConfig.animY,
          animDelay: copiedConfig.animDelay,
          isPattern: copiedConfig.isPattern,
          patternScale: copiedConfig.patternScale,
          patternSpacing: copiedConfig.patternSpacing,
          patternGapX: copiedConfig.patternGapX,
          patternGapY: copiedConfig.patternGapY,
          patternItemScale: copiedConfig.patternItemScale,
          patternItemRotation: copiedConfig.patternItemRotation,
          patternStagger: copiedConfig.patternStagger,
          patternRotation: copiedConfig.patternRotation,
          patternFullCanvas: copiedConfig.patternFullCanvas,
          opacity: copiedConfig.opacity,
          blur: copiedConfig.blur,
          blendMode: copiedConfig.blendMode,
          wireframe: copiedConfig.wireframe,
          color: copiedConfig.color,
          ...(l.isMotionSequence
            ? {
                motionSpeed: copiedConfig.motionSpeed,
                motionShowGuides: copiedConfig.motionShowGuides,
                motionWireframe: copiedConfig.motionWireframe
              }
            : {})
        };
      })
    );
    showToast(`Configuración aplicada a "${targetLayer.name}"`, 'paste');
  };

  const handleDeleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  // Export Autonomous HTML
  const handleExportHtml = () => {
    const htmlCode = generateAutonomousAnimatedHtml(layers, aspectRatio);
    downloadFile(htmlCode, `MOTION_HMA_CANVAS_ANIMADO_${aspectRatio}_${APP_VERSION}.html`, 'text/html');
  };

  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCinemaMode) {
        setIsCinemaMode(false);
        if (isRecording) {
          stopRecording();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCinemaMode, isRecording]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderLayers = () => {
    return layers
      .filter((l) => l.visible)
      .map((layer) => {
        const isMotion = layer.isMotionSequence || layer.animationType === 'inlumenai-morph';
        const animClass =
          !isMotion && layer.animationType !== 'none' ? `anim-${layer.animationType}` : '';
        const isPattern = !!layer.isPattern;
        const isFullCanvas = isPattern && (layer.patternFullCanvas !== false);

        // Calculate style with CSS variables for dynamic keyframe physics
        const layerStyle: React.CSSProperties = isFullCanvas
          ? {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              transform: 'none',
              opacity: layer.opacity,
              filter: `blur(${layer.blur}px)`,
              mixBlendMode: layer.blendMode,
              zIndex: layer.zIndex,
              color: layer.color || 'inherit',
              ['--anim-duration' as any]: `${layer.animDuration}s`,
              ['--anim-x' as any]: `${layer.animX}px`,
              ['--anim-y' as any]: `${layer.animY}px`,
              ['--anim-delay' as any]: `${layer.animDelay}s`,
              ['--base-opacity' as any]: layer.opacity
            }
          : {
              position: 'absolute',
              left: `calc(50% + ${layer.x}px)`,
              top: `calc(50% + ${layer.y}px)`,
              width: `${layer.width}px`,
              height: `${layer.height}px`,
              transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale ?? 1})`,
              opacity: layer.opacity,
              filter: `blur(${layer.blur}px)`,
              mixBlendMode: layer.blendMode,
              zIndex: layer.zIndex,
              color: layer.color || 'inherit',
              ['--anim-duration' as any]: `${layer.animDuration}s`,
              ['--anim-x' as any]: `${layer.animX}px`,
              ['--anim-y' as any]: `${layer.animY}px`,
              ['--anim-delay' as any]: `${layer.animDelay}s`,
              ['--base-opacity' as any]: layer.opacity
            };
        
        // Helper to inject color customization into SVG string
        const getProcessedSvgCode = (code: string, color?: string) => {
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
        };

        return (
          <div
            key={layer.id}
            onClick={() => setSelectedLayerId(layer.id)}
            style={layerStyle}
            className={`cursor-pointer transition-shadow ${
              layer.id === selectedLayerId && !isCinemaMode
                ? isFullCanvas
                  ? 'ring-2 ring-cyan-400 ring-inset ring-offset-0'
                  : 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent'
                : ''
            }`}
          >
            <div className={`w-full h-full ${animClass}`}>
              {layer.animationType === 'html-iframe' ? (
                <iframe
                  srcDoc={layer.svgCode}
                  className={`w-full h-full border-0 pointer-events-none ${layer.wireframe ? 'opacity-50' : ''}`}
                  sandbox="allow-scripts allow-same-origin"
                  title={layer.name}
                />
              ) : isMotion ? (
                <div className={`w-full h-full ${layer.wireframe || layer.motionWireframe ? 'wireframe-layer' : ''}`}>
                  <InlumenaiCanvasLayer layer={layer} />
                </div>
              ) : (
                <div
                  className={`w-full h-full ${layer.wireframe ? 'wireframe-layer' : ''}`}
                  dangerouslySetInnerHTML={{
                    __html: layer.isPattern
                      ? buildSvgPatternMarkup({
                          id: `pat-${layer.id}`,
                          svgCode: layer.svgCode,
                          color: layer.color,
                          baseSize: layer.patternScale || 160,
                          gapX: layer.patternGapX ?? 40,
                          gapY: layer.patternGapY ?? 40,
                          itemScale: layer.patternItemScale ?? 1.0,
                          itemRotation: layer.patternItemRotation ?? 0,
                          stagger: !!layer.patternStagger,
                          patternRotation: layer.patternRotation ?? 0,
                        })
                      : getProcessedSvgCode(layer.svgCode, layer.color)
                  }}
                />
              )}
            </div>
          </div>
        );
      });
  };

  if (isCinemaMode) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
        {/* Full Screen Viewport Stage */}
        <div
          ref={stageRef}
          className="relative overflow-hidden transition-all duration-300 shadow-2xl shadow-cyan-500/20"
          style={{ 
            backgroundColor: canvasBgColor,
            aspectRatio: aspectRatio === '16:9' ? '16/9' : aspectRatio === '21:9' ? '21/9' : '9/16',
            width: aspectRatio === '9:16' ? 'auto' : '100%',
            height: aspectRatio === '9:16' ? '100%' : 'auto',
            maxWidth: '100vw',
            maxHeight: '100vh'
          }}
        >
          {renderLayers()}
        </div>

        {/* Minimal Floating HUD for Cinema Mode - Hidden until hover to allow clean recording */}
        <div className="absolute bottom-0 left-0 w-full h-40 flex items-end justify-center pb-8 z-[10000] opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-[#060C04]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            {isRecording ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-red-400 font-mono text-sm font-bold animate-pulse">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  {formatTimer(recordingSeconds)}
                </div>
                <button
                  onClick={stopRecording}
                  title="Detener grabación"
                  className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/50"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={startRecording}
                  title="Iniciar grabación (Captura de pantalla limpia)"
                  className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors font-mono text-sm font-bold uppercase"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-current" />
                  </div>
                  Rec
                </button>
              </div>
            )}
            <div className="w-[1px] h-6 bg-white/20 mx-2" />
            <button
              onClick={() => setIsCinemaMode(false)}
              title="Salir de Modo Cine (ESC)"
              className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-mono"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Salir (ESC)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-[#040915] select-none relative">
      {/* Mobile Backdrop for Left Drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-20 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Picsart-Style Vertical Left Tool Rail */}
      <LeftToolRail
        activeTab={activeRailTab}
        isDrawerOpen={isDrawerOpen}
        onSelectTab={(tab) => {
          setActiveRailTab(tab);
          setIsDrawerOpen(true);
        }}
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        onQuickAdd={() => {
          setActiveRailTab('layers');
          setIsDrawerOpen(true);
          setShowPasteModal(true);
        }}
        layersCount={layers.length}
      />

      {/* Picsart-Style Collapsible Drawer */}
      <LeftToolDrawer
        activeTab={activeRailTab}
        isOpen={isDrawerOpen}
        onToggleOpen={() => setIsDrawerOpen((prev) => !prev)}
        layers={layers}
        selectedLayerId={selectedLayerId}
        onSelectLayer={setSelectedLayerId}
        onSetLayers={setLayers}
        aspectRatio={aspectRatio}
        onSetAspectRatio={setAspectRatio}
        canvasBgColor={canvasBgColor}
        onSetCanvasBgColor={setCanvasBgColor}
        onAddNewMotionLayer={addNewMotionLayer}
        onAddNewSvgLayer={addNewSvgLayer}
        onAddNewHtmlLayer={addNewHtmlLayer}
        onOpenPasteModal={() => setShowPasteModal(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        copiedConfig={copiedConfig}
        onCopyConfig={handleCopyLayerConfig}
        onPasteConfig={handlePasteLayerConfig}
      />

      {/* Main Center Stage */}
      <main
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropSvg}
        className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#040915]"
      >
        {/* Floating Left Panel Reopen Button (when collapsed) */}
        {!isDrawerOpen && (
          <button
            onClick={() => setIsDrawerOpen(true)}
            title="Mostrar panel lateral de herramientas"
            className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#060C04]/95 border border-[#3D80FD]/40 text-[#3D80FD] hover:text-white hover:bg-blue-950/80 shadow-2xl backdrop-blur-md transition-all text-xs font-mono font-bold group animate-fadeIn"
          >
            <PanelLeftOpen className="w-4 h-4 text-[#3D80FD] group-hover:scale-110 transition-transform" />
            <span>Herramientas</span>
          </button>
        )}

        {/* Floating Stage Controls (Zoom, Fullscreen Toggle) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#060C04]/90 border border-white/10 p-1.5 rounded-xl shadow-xl backdrop-blur-md">
          <button
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            title={isDrawerOpen ? "Ocultar panel lateral" : "Mostrar panel lateral"}
            className={`p-1.5 rounded-lg transition-colors ${
              isDrawerOpen ? 'text-[#3D80FD] bg-white/5' : 'text-slate-400 hover:text-[#3D80FD]'
            }`}
          >
            {isDrawerOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

          <button
            onClick={toggleFullscreen}
            title={isAllPanelsCollapsed ? "Restaurar paneles laterales" : "Maximizar (Ocultar paneles)"}
            className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono font-bold ${
              isAllPanelsCollapsed
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-white/10'
            }`}
          >
            {isAllPanelsCollapsed ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px]">
              {isAllPanelsCollapsed ? 'Restaurar' : 'Maximizar'}
            </span>
          </button>
          
          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
          
          <button
            onClick={() => setIsCinemaMode(true)}
            title="Modo Cine (Grabación Limpia)"
            className="p-1.5 px-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/40 transition-colors flex items-center gap-1.5 text-xs font-mono font-bold shadow-sm"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">Modo Cine</span>
          </button>

          {selectedLayer && (
            <>
              <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
              <button
                onClick={() => setIsRightPanelOpen((prev) => !prev)}
                title={isRightPanelOpen ? "Ocultar inspector de físicas" : "Mostrar inspector de físicas"}
                className={`p-1.5 rounded-lg transition-colors ${
                  isRightPanelOpen ? 'text-[#3D80FD] bg-white/5' : 'text-slate-400 hover:text-[#3D80FD]'
                }`}
              >
                {isRightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>

        {/* Floating Recording HUD */}
        {isRecording && (
          <div className="absolute top-6 z-30 px-4 py-2 rounded-full bg-red-950/90 border border-red-500 text-red-300 font-mono text-xs flex items-center gap-2 shadow-2xl animate-pulse">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span>GRABANDO EN VIVO: {formatTimer(recordingSeconds)}</span>
          </div>
        )}

        {/* Floating Configuration Toast */}
        {configToast && (
          <div className="absolute top-6 z-40 px-4 py-2.5 rounded-xl bg-[#060C04]/95 border border-cyan-400/50 shadow-2xl shadow-cyan-500/20 text-xs font-mono flex items-center gap-2.5 backdrop-blur-md animate-bounce">
            {configToast.type === 'copy' ? (
              <Copy className="w-4 h-4 text-purple-400 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="text-slate-200 font-semibold">{configToast.message}</span>
          </div>
        )}

        {/* Viewport Stage (with zoom transform and Picsart Checkered support) */}
        <div
          ref={stageRef}
          className={`relative rounded-2xl border border-white/15 shadow-2xl shadow-purple-500/10 overflow-hidden transition-all duration-300 ${
            canvasBgColor === 'checkered' ? 'picsart-checkered-bg' : ''
          } ${
            aspectRatio === '16:9'
              ? 'w-full max-w-4xl aspect-[16/9]'
              : aspectRatio === '21:9'
              ? 'w-full max-w-5xl aspect-[21/9]'
              : aspectRatio === '1:1'
              ? 'h-full max-h-[75vh] aspect-[1/1]'
              : 'h-full max-h-[85vh] aspect-[9/16]'
          }`}
          style={{
            backgroundColor: canvasBgColor === 'checkered' ? undefined : canvasBgColor,
            transform: `scale(${zoomScale / 100})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Active SVG Layers with Continuous Physics & Inlumenai Sequences */}
          {renderLayers()}
        </div>

        {/* Picsart-Style Floating Canvas Bottom Bar */}
        <FloatingCanvasBottomBar
          aspectRatio={aspectRatio}
          zoomScale={zoomScale}
          onZoomChange={setZoomScale}
          onFit={() => setZoomScale(100)}
          isCinemaMode={isCinemaMode}
          onToggleCinemaMode={() => setIsCinemaMode((c) => !c)}
          isRecording={isRecording}
          onToggleRecording={() => {
            if (isRecording) stopRecording();
            else startRecording();
          }}
          recordingSeconds={recordingSeconds}
          formatTimer={formatTimer}
          onResetZoom={() => setZoomScale(100)}
        />
      </main>

      <RightInspectorPanel
        selectedLayer={selectedLayer || null}
        isOpen={isRightPanelOpen}
        onToggleOpen={() => setIsRightPanelOpen((prev) => !prev)}
        canvasBgColor={canvasBgColor}
        onSetCanvasBgColor={setCanvasBgColor}
        layers={layers}
        aspectRatio={aspectRatio}
        onUpdateLayer={handleUpdateLayer}
        onCopyLayerConfig={handleCopyLayerConfig}
        onPasteLayerConfig={handlePasteLayerConfig}
        copiedConfig={copiedConfig}
        onSetCopiedConfig={setCopiedConfig}
        linkGaps={linkGaps}
        onSetLinkGaps={setLinkGaps}
        onDuplicateLayer={handleDuplicateLayer}
        onDeleteLayer={handleDeleteLayer}
      />

      {/* Paste SVG Raw Code Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#060C04] border border-white/15 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Pegar Código XML SVG</h3>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Nombre de la Capa:
              </label>
              <input
                type="text"
                value={pastedLayerName}
                onChange={(e) => setPastedLayerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/15 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Código &lt;svg&gt;...&lt;/svg&gt;:
              </label>
              <textarea
                rows={6}
                value={pastedSvgCode}
                onChange={(e) => setPastedSvgCode(e.target.value)}
                placeholder="<svg viewBox='0 0 100 100'>...</svg>"
                className="w-full p-3 rounded-lg bg-slate-900 border border-white/15 text-xs font-mono text-cyan-200"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (pastedSvgCode.trim()) {
                    addNewSvgLayer(pastedSvgCode, pastedLayerName);
                    setPastedSvgCode('');
                    setShowPasteModal(false);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold"
              >
                Insertar Capa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Modal - Move outside of flex/aside containers to prevent layout squishing */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(options) => {
          let targetRatio: '16:9' | '9:16' | '21:9' = '16:9';
          if (options.dimensionMode === 'mobile') {
            targetRatio = '9:16';
          } else if (options.dimensionMode === 'hero') {
            targetRatio = '21:9';
          }

          const docTitle = options.dimensionMode === 'hero'
            ? 'INLUMENAI BRAND - Hero Web Animation'
            : 'MOTION HMA MATRIX - Canvas Animado';

          const htmlCode = generateAutonomousAnimatedHtml(
            layers,
            targetRatio,
            docTitle,
            options.includeBg ? (options.backgroundColor || '#040915') : 'transparent',
            options
          );

          const filePrefix = options.dimensionMode === 'hero'
            ? 'INLUMENAI_HERO_WEB_ANIMATION'
            : `MOTION_HMA_CANVAS_ANIMADO_${options.dimensionMode}`;

          downloadFile(htmlCode, `${filePrefix}_${APP_VERSION}.html`, 'text/html');
        }}
        onRecordVideo={() => {
          setIsExportModalOpen(false);
          startRecording();
        }}
        defaultBgColor="#040915"
      />
    </div>
  );
};

