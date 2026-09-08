/**
 * HMA INLUMENAI STUDIO (v2026.40)
 * Module 3: CANVAS ANIMADO SVG EDITOR (Compositor, Físicas Continuas & Grabador de Video)
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
  RotateCw
} from 'lucide-react';
import { AnimatedLayer, BlendMode, CanvasAnimationType } from '../../types/hma';
import { APP_VERSION } from '../../data/hmaDefinitions';
import { INITIAL_DATA } from '../../data/canonicalLogos';
import { downloadFile, generateAutonomousAnimatedHtml } from '../../utils/exportUtils';
import { ExportModal } from './ExportModal';
import { ExportOptions } from '../../types';
import { InlumenaiCanvasLayer } from './InlumenaiCanvasLayer';
import { ShapeColorPicker } from '../common/ShapeColorPicker';

interface AnimatedSvgCanvasEditorProps {
  layers: AnimatedLayer[];
  setLayers: React.Dispatch<React.SetStateAction<AnimatedLayer[]>>;
}

export const AnimatedSvgCanvasEditor: React.FC<AnimatedSvgCanvasEditorProps> = ({
  layers,
  setLayers
}) => {
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '21:9'>('16:9');
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(layers[0]?.id || null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [canvasBgColor, setCanvasBgColor] = useState<string>('#060C04');

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [showPasteModal, setShowPasteModal] = useState<boolean>(false);
  const [pastedSvgCode, setPastedSvgCode] = useState<string>('');
  const [pastedLayerName, setPastedLayerName] = useState<string>('Capa SVG Importada');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const isAllPanelsCollapsed = !isLeftPanelOpen && !isRightPanelOpen;

  const toggleFullscreen = () => {
    if (isAllPanelsCollapsed) {
      setIsLeftPanelOpen(true);
      setIsRightPanelOpen(true);
    } else {
      setIsLeftPanelOpen(false);
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
    const newLayer: AnimatedLayer = {
      id: newId,
      name,
      svgCode,
      x: aspectRatio === '16:9' ? 960 : 540,
      y: aspectRatio === '16:9' ? 540 : 960,
      width: 380,
      height: 380,
      rotation: 0,
      opacity: 1,
      blur: 0,
      blendMode: 'normal',
      wireframe: false,
      isPattern: false,
      patternScale: 1,
      patternSpacing: 100,
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
      x: aspectRatio === '16:9' ? 960 : 540,
      y: aspectRatio === '16:9' ? 540 : 960,
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
      x: aspectRatio === '16:9' ? 960 : 540,
      y: aspectRatio === '16:9' ? 540 : 960,
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

        // Calculate style with CSS variables for dynamic keyframe physics
        const layerStyle: React.CSSProperties = {
          position: 'absolute',
          left: isPattern ? '50%' : `calc(50% + ${layer.x}px)`,
          top: isPattern ? '50%' : `calc(50% + ${layer.y}px)`,
          width: isPattern ? '100%' : `${layer.width}px`,
          height: isPattern ? '100%' : `${layer.height}px`,
          transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale ?? 1})`,
          opacity: layer.opacity,
          filter: `blur(${layer.blur}px)`,
          mixBlendMode: layer.blendMode,
          zIndex: layer.zIndex,
          color: layer.color || 'inherit', // Inject color for SVG manipulation
          ['--anim-duration' as any]: `${layer.animDuration}s`,
          ['--anim-x' as any]: `${layer.animX}px`,
          ['--anim-y' as any]: `${layer.animY}px`,
          ['--anim-delay' as any]: `${layer.animDelay}s`,
          ['--base-opacity' as any]: layer.opacity
        };
        
        // Helper to inject color customization into SVG string
        const getProcessedSvgCode = (code: string, color?: string) => {
          if (!color) return code;
          return code.replace(/fill="[^"]*"/g, `fill="${color}"`).replace(/stroke="[^"]*"/g, `stroke="${color}"`);
        };

        return (
          <div
            key={layer.id}
            onClick={() => setSelectedLayerId(layer.id)}
            style={layerStyle}
            className={`cursor-pointer transition-shadow ${
              layer.id === selectedLayerId && !isCinemaMode ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent' : ''
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
                      ? `<svg width="100%" height="100%" style="overflow:visible;"><defs><pattern id="pat-${layer.id}" width="${layer.patternScale || 24}" height="${layer.patternScale || 24}" patternUnits="userSpaceOnUse">${getProcessedSvgCode(layer.svgCode, layer.color)}</pattern></defs><rect width="100%" height="100%" fill="url(#pat-${layer.id})"/></svg>`
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
      {/* Mobile Backdrop for Left Panel */}
      {isLeftPanelOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsLeftPanelOpen(false)}
        />
      )}

      {/* Left Layer Manager Panel */}
      {isLeftPanelOpen && (
        <aside className="fixed md:relative inset-y-0 left-0 z-40 md:z-auto w-80 max-w-[88vw] sm:max-w-xs border-r border-white/10 bg-[#060C04]/95 backdrop-blur-md flex flex-col justify-between overflow-hidden shrink-0 shadow-2xl md:shadow-none">
          {/* Top Viewport & Add Controls */}
          <div className="p-3 border-b border-white/10 space-y-3 bg-slate-900/60">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Canvas Animado ({APP_VERSION})
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsLeftPanelOpen(false)}
                  title="Ocultar panel de capas (Lienzo amplio)"
                  className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Aspect Ratio Mode Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAspectRatio('16:9')}
                className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  aspectRatio === '16:9'
                    ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold shadow-md shadow-purple-500/20'
                    : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>16:9</span>
              </button>

              <button
                onClick={() => setAspectRatio('21:9')}
                className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  aspectRatio === '21:9'
                    ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold shadow-md shadow-purple-500/20'
                    : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                <Maximize2 className="w-4 h-4 text-orange-400" />
                <span>Cine 21:9</span>
              </button>

              <button
                onClick={() => setAspectRatio('9:16')}
                className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold shadow-md shadow-purple-500/20'
                    : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-4 h-4 text-purple-400" />
                <span>9:16</span>
              </button>
            </div>

            {/* Add Layer Actions */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => addNewMotionLayer('all')}
                className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 active:scale-98 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>+ Añadir Secuencia Inlumenai</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowPasteModal(true)}
                  className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pegar SVG</span>
                </button>

                <label className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cargar SVG</span>
                  <input
                    type="file"
                    accept=".svg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const code = ev.target?.result as string;
                          if (code) addNewSvgLayer(code, file.name.replace('.svg', ''));
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                
                <label className="col-span-2 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer">
                  <FileCode className="w-3.5 h-3.5 text-orange-400" />
                  <span>Cargar HTML para Convertir a Video</span>
                  <input
                    type="file"
                    accept=".html"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const code = ev.target?.result as string;
                          if (code) addNewHtmlLayer(code, file.name.replace('.html', ''));
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Layers List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-2 flex items-center justify-between">
              <span>Capas en Composición ({layers.length})</span>
              <span className="text-[9px] text-cyan-400">Activas / Visibles</span>
            </div>

            {layers.map((layer) => {
              const isMotion = layer.isMotionSequence || layer.animationType === 'inlumenai-morph';
              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    layer.id === selectedLayerId
                      ? 'bg-purple-600/20 border-purple-500/60 text-purple-200 font-semibold shadow-md'
                      : 'bg-slate-900/60 hover:bg-slate-800 border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`p-1 rounded border text-[9px] font-mono ${
                        isMotion
                          ? 'bg-purple-900/60 border-purple-400/50 text-cyan-300 font-bold'
                          : 'bg-black/40 border-white/10 text-cyan-400'
                      }`}
                    >
                      {isMotion ? 'GSAP' : layer.animationType.substring(0, 4)}
                    </span>
                    <span className="truncate text-xs">{layer.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex flex-col gap-0.5 mr-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const idx = layers.findIndex(l => l.id === layer.id);
                          if (idx < layers.length - 1) {
                            const newLayers = [...layers];
                            const temp = newLayers[idx];
                            newLayers[idx] = newLayers[idx + 1];
                            newLayers[idx + 1] = temp;
                            // Update zIndex based on new order
                            newLayers.forEach((l, i) => l.zIndex = i + 1);
                            setLayers(newLayers);
                          }
                        }}
                        className="text-slate-500 hover:text-cyan-400 p-0.5"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7-7 7" /></svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const idx = layers.findIndex(l => l.id === layer.id);
                          if (idx > 0) {
                            const newLayers = [...layers];
                            const temp = newLayers[idx];
                            newLayers[idx] = newLayers[idx - 1];
                            newLayers[idx - 1] = temp;
                            // Update zIndex based on new order
                            newLayers.forEach((l, i) => l.zIndex = i + 1);
                            setLayers(newLayers);
                          }
                        }}
                        className="text-slate-500 hover:text-cyan-400 p-0.5"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7 7 7-7" /></svg>
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLayers((prev) =>
                          prev.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l))
                        );
                      }}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      {layer.visible ? (
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Export & Video Actions */}
          <div className="p-3 border-t border-white/10 bg-slate-900/60 space-y-2">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 animate-pulse transition-all"
              >
                <StopCircle className="w-4 h-4" />
                <span>Detener y Guardar Video ({formatTimer(recordingSeconds)})</span>
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 active:scale-98 transition-all"
              >
                <Video className="w-4 h-4" />
                <span>Grabar Video (.webm)</span>
              </button>
            )}

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Opciones de Exportación</span>
            </button>
            
            <ExportModal
              isOpen={isExportModalOpen}
              onClose={() => setIsExportModalOpen(false)}
              onExport={(options) => {
                const htmlCode = generateAutonomousAnimatedHtml(layers, options.dimensionMode === 'mobile' ? '9:16' : '16:9');
                downloadFile(htmlCode, `MOTION_HMA_CANVAS_ANIMADO_${aspectRatio}_${APP_VERSION}.html`, 'text/html');
              }}
              onRecordVideo={() => {
                setIsExportModalOpen(false);
                startRecording();
              }}
              defaultBgColor="#040915"
            />
          </div>
        </aside>
      )}

      {/* Main Center Stage */}
      <main
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropSvg}
        className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#040915]"
      >
        {/* Floating Left Panel Reopen Button (when collapsed) */}
        {!isLeftPanelOpen && (
          <button
            onClick={() => setIsLeftPanelOpen(true)}
            title="Mostrar panel de capas y exportación"
            className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#060C04]/95 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-950/80 shadow-2xl backdrop-blur-md transition-all text-xs font-mono font-bold group animate-fadeIn"
          >
            <PanelLeftOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Capas ({layers.length})</span>
          </button>
        )}

        {/* Floating Stage Controls (Zoom, Fullscreen Toggle) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#060C04]/90 border border-white/10 p-1.5 rounded-xl shadow-xl backdrop-blur-md">
          <button
            onClick={() => setIsLeftPanelOpen((prev) => !prev)}
            title={isLeftPanelOpen ? "Ocultar panel de capas" : "Mostrar panel de capas"}
            className={`p-1.5 rounded-lg transition-colors ${
              isLeftPanelOpen ? 'text-cyan-400 bg-white/5' : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            {isLeftPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
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
                  isRightPanelOpen ? 'text-purple-400 bg-white/5' : 'text-slate-400 hover:text-purple-300'
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

        {/* Viewport Stage */}
        <div
          ref={stageRef}
          className={`relative rounded-2xl border border-white/15 shadow-2xl shadow-purple-500/10 overflow-hidden transition-all duration-300 ${
            aspectRatio === '16:9'
              ? 'w-full max-w-4xl aspect-[16/9]'
              : aspectRatio === '21:9'
              ? 'w-full max-w-5xl aspect-[21/9]'
              : 'h-full max-h-[85vh] aspect-[9/16]'
          }`}
          style={{ backgroundColor: canvasBgColor }}
        >
          {/* Active SVG Layers with Continuous Physics & Inlumenai Sequences */}
          {layers
            .filter((l) => l.visible)
            .map((layer) => {
              const isMotion = layer.isMotionSequence || layer.animationType === 'inlumenai-morph';
              const animClass =
                !isMotion && layer.animationType !== 'none' ? `anim-${layer.animationType}` : '';
              const isPattern = !!layer.isPattern;

              // Calculate style with CSS variables for dynamic keyframe physics
              const layerStyle: React.CSSProperties = {
                position: 'absolute',
                left: isPattern ? '50%' : `calc(50% + ${layer.x}px)`,
                top: isPattern ? '50%' : `calc(50% + ${layer.y}px)`,
                width: isPattern ? '100%' : `${layer.width}px`,
                height: isPattern ? '100%' : `${layer.height}px`,
                transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale ?? 1})`,
                opacity: layer.opacity,
                filter: `blur(${layer.blur}px)`,
                mixBlendMode: layer.blendMode,
                zIndex: layer.zIndex,
                color: layer.color || 'inherit', // Inject color for SVG manipulation
                ['--anim-duration' as any]: `${layer.animDuration}s`,
                ['--anim-x' as any]: `${layer.animX}px`,
                ['--anim-y' as any]: `${layer.animY}px`,
                ['--anim-delay' as any]: `${layer.animDelay}s`,
                ['--base-opacity' as any]: layer.opacity
              };
              
              // Helper to inject color customization into SVG string
              const getProcessedSvgCode = (code: string, color?: string) => {
                if (!color) return code;
                return code.replace(/fill="[^"]*"/g, `fill="${color}"`).replace(/stroke="[^"]*"/g, `stroke="${color}"`);
              };

              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  style={layerStyle}
                  className={`cursor-pointer transition-shadow ${
                    layer.id === selectedLayerId ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent' : ''
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
                            ? `<svg width="100%" height="100%" style="overflow:visible;"><defs><pattern id="pat-${layer.id}" width="${layer.patternScale || 24}" height="${layer.patternScale || 24}" patternUnits="userSpaceOnUse">${getProcessedSvgCode(layer.svgCode, layer.color)}</pattern></defs><rect width="100%" height="100%" fill="url(#pat-${layer.id})"/></svg>`
                            : getProcessedSvgCode(layer.svgCode, layer.color)
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      {/* Mobile Backdrop for Right Panel */}
      {selectedLayer && isRightPanelOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setIsRightPanelOpen(false)}
        />
      )}

      {/* Right Physics & Layer Inspector */}
      {selectedLayer && isRightPanelOpen && (
        <aside className="fixed md:relative inset-y-0 right-0 z-40 md:z-auto w-84 max-w-[88vw] sm:max-w-xs border-l border-white/10 bg-[#060C04]/95 backdrop-blur-md p-4 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto select-none space-y-4 shrink-0 shadow-2xl md:shadow-none">
          <div className="pb-3 border-b border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                Motor de Físicas & Capa
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRightPanelOpen(false)}
                  title="Ocultar panel inspector"
                  className="p-1 rounded text-slate-400 hover:text-purple-300 hover:bg-white/10 transition-colors"
                >
                  <PanelRightClose className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-black/40 border border-white/5 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">Fondo:</span>
                <input
                  type="color"
                  value={canvasBgColor}
                  onChange={(e) => setCanvasBgColor(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                />
              </div>
              <button
                onClick={() => {
                  const htmlCode = generateAutonomousAnimatedHtml(
                    layers,
                    aspectRatio,
                    'HMA Matrix Export',
                    canvasBgColor
                  );
                  downloadFile(htmlCode, `MOTION_HMA_EXPORT_${Date.now()}_${APP_VERSION}.html`, 'text/html');
                }}
                className="bg-green-500 hover:bg-green-400 text-black text-[10px] font-bold px-3 py-1 rounded shadow cursor-pointer transition-colors"
              >
                EXPORT HTML
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={selectedLayer.name}
                onChange={(e) => handleUpdateLayer({ name: e.target.value })}
                className="text-sm font-bold text-white truncate w-full bg-transparent border-b border-transparent focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* If Motion Layer, Display Motion Controls */}
          {(selectedLayer.isMotionSequence || selectedLayer.animationType === 'inlumenai-morph') ? (
            <div className="space-y-3 bg-gradient-to-br from-purple-950/40 to-blue-950/40 p-3.5 rounded-xl border border-purple-500/30">
              <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Secuencia Motion (GSAP)
              </span>

              {/* Loop mode vs Specific Isotype */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-300 block">Modo de Secuencia:</label>
                <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() =>
                      handleUpdateLayer({
                        motionServiceId: 'all',
                        motionIsLoop: true,
                        name: 'Secuencia Inlumenai (Ciclo 13)'
                      })
                    }
                    className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-all ${
                      selectedLayer.motionServiceId === 'all'
                        ? 'bg-purple-600 text-white font-bold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ciclo 13 en Loop
                  </button>
                  <button
                    onClick={() => {
                      const firstId = INITIAL_DATA[0].serviceId;
                      handleUpdateLayer({
                        motionServiceId: firstId,
                        motionIsLoop: false,
                        name: `Secuencia Inlumenai (${INITIAL_DATA[0].serviceName})`
                      });
                    }}
                    className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-all ${
                      selectedLayer.motionServiceId !== 'all'
                        ? 'bg-purple-600 text-white font-bold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Isotipo Fijo
                  </button>
                </div>
              </div>

              {/* Isotype Selector (when specific) */}
              {selectedLayer.motionServiceId !== 'all' && (
                <div>
                  <label className="text-[11px] font-mono text-slate-300 block mb-1">
                    Seleccionar Isotipo:
                  </label>
                  <select
                    value={selectedLayer.motionServiceId || INITIAL_DATA[0].serviceId}
                    onChange={(e) => {
                      const srv = INITIAL_DATA.find((s) => s.serviceId === e.target.value);
                      handleUpdateLayer({
                        motionServiceId: e.target.value,
                        name: `Secuencia Inlumenai (${srv?.serviceName || e.target.value})`
                      });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-cyan-200 font-mono"
                  >
                    {INITIAL_DATA.map((s, idx) => (
                      <option key={s.serviceId} value={s.serviceId}>
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}. {s.serviceName} ({s.clusterName})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Speed multiplier */}
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  Velocidad de Animación:
                </label>
                <div className="flex items-center gap-1">
                  {[0.5, 1, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleUpdateLayer({ motionSpeed: spd })}
                      className={`flex-1 py-1 text-xs rounded font-mono font-bold transition-colors ${
                        (selectedLayer.motionSpeed || 1) === spd
                          ? 'bg-cyan-500 text-black'
                          : 'bg-black/30 text-slate-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Clock Guides & Wireframe toggles */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs text-slate-300">Guías Reloj (R=360px)</span>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateLayer({ motionShowGuides: !selectedLayer.motionShowGuides })
                    }
                    className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold transition-colors ${
                      selectedLayer.motionShowGuides
                        ? 'bg-cyan-500 text-black'
                        : 'bg-slate-800 text-slate-400 border border-white/10'
                    }`}
                  >
                    {selectedLayer.motionShowGuides ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/10">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs text-slate-300">Modo Wireframe Técnico</span>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateLayer({
                        motionWireframe: !selectedLayer.motionWireframe,
                        wireframe: !selectedLayer.motionWireframe
                      })
                    }
                    className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold transition-colors ${
                      selectedLayer.motionWireframe
                        ? 'bg-purple-500 text-black'
                        : 'bg-slate-800 text-slate-400 border border-white/10'
                    }`}
                  >
                    {selectedLayer.motionWireframe ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Standard CSS Physics Selector for Static SVG layers */
            <div className="space-y-2 bg-black/20 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Física / Animación CSS
              </span>

              <select
                value={selectedLayer.animationType}
                onChange={(e) =>
                  handleUpdateLayer({ animationType: e.target.value as CanvasAnimationType })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-200 font-mono"
              >
                <option value="none">Sin Animación (Estático)</option>
                <option value="float">Float (Flotación Suave)</option>
                <option value="bounce">Bounce (Rebote Elástico)</option>
                <option value="pulse">Pulse (Latido & Escala)</option>
                <option value="spin">Spin (Rotación Continua 360°)</option>
                <option value="custom-path">Custom Path (Órbita Dinámica)</option>
                <option value="particle-dispersion">Particle Dispersion (Dispersión)</option>
                <option value="explosion">Explosion (Expansión Cinética)</option>
                <option value="mesh">Mesh (Deformación de Malla)</option>
                <option value="fluid">Fluid (Morfología Fluida)</option>
              </select>

              {/* Dynamic CSS Param Sliders */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span>Duración ({selectedLayer.animDuration}s):</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={60}
                  step={0.5}
                  value={selectedLayer.animDuration}
                  onChange={(e) =>
                    handleUpdateLayer({ animDuration: parseFloat(e.target.value) })
                  }
                  className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Offset X (px)</span>
                    <input
                      type="number"
                      value={selectedLayer.animX}
                      onChange={(e) => handleUpdateLayer({ animX: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Offset Y (px)</span>
                    <input
                      type="number"
                      value={selectedLayer.animY}
                      onChange={(e) => handleUpdateLayer({ animY: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Size, Dimensions & Transformation controls */}
          <div className="space-y-3 bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1 mb-2">
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              Dimensiones & Transformación
            </span>

            {/* Position and Scale Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">POS X</span>
                <input
                  type="number"
                  value={selectedLayer.x}
                  onChange={(e) => handleUpdateLayer({ x: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">POS Y</span>
                <input
                  type="number"
                  value={selectedLayer.y}
                  onChange={(e) => handleUpdateLayer({ y: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">ROTACIÓN (°)</span>
                <input
                  type="number"
                  value={selectedLayer.rotation}
                  onChange={(e) => handleUpdateLayer({ rotation: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 block mb-1">ESCALA</span>
                <input
                  type="number"
                  step="0.05"
                  value={selectedLayer.scale ?? 1}
                  onChange={(e) => handleUpdateLayer({ scale: parseFloat(e.target.value) || 1 })}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Rotation Buttons */}
            <div className="flex justify-between items-center pt-1 border-t border-white/5">
              <button
                onClick={() => handleUpdateLayer({ rotation: (selectedLayer.rotation + 90) % 360 })}
                className="text-[10px] text-cyan-300 bg-black/40 px-2 py-1 rounded border border-white/5 hover:bg-white/10 transition-colors"
              >
                Rotar +90°
              </button>
              <button
                onClick={() => handleUpdateLayer({ rotation: 0 })}
                className="text-[10px] text-slate-400 bg-black/40 px-2 py-1 rounded border border-white/5 hover:bg-white/10 transition-colors"
              >
                Reset (0°)
              </button>
            </div>

            {/* Width / Dimension Slider & Input */}
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Ancho Base:</span>
                <span className="text-cyan-300 font-bold">{selectedLayer.width}px</span>
              </div>
              <input
                type="range"
                min={50}
                max={1500}
                step={10}
                value={selectedLayer.width}
                onChange={(e) => {
                  const w = parseInt(e.target.value, 10);
                  handleUpdateLayer({ width: w, height: w });
                }}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
          </div>

          {/* Visual Effects & Blend Modes */}
          <div className="space-y-3 bg-black/20 p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Filtros & Modo de Fusión
            </span>

            {/* Blend Mode */}
            <div>
              <span className="text-[11px] font-mono text-slate-300 mb-1 block">Modo de Fusión:</span>
              <select
                value={selectedLayer.blendMode}
                onChange={(e) => handleUpdateLayer({ blendMode: e.target.value as BlendMode })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-slate-200 font-mono"
              >
                <option value="normal">Normal</option>
                <option value="screen">Screen (Trama Luminosa)</option>
                <option value="multiply">Multiply (Multiplicar)</option>
                <option value="overlay">Overlay (Superponer)</option>
                <option value="color-dodge">Color Dodge (Sobreexposición)</option>
                <option value="luminosity">Luminosity (Luminosidad)</option>
                <option value="difference">Difference (Diferencia)</option>
              </select>
            </div>

            {/* Opacity */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Opacidad:</span>
                <span className="text-cyan-300">{Math.round(selectedLayer.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={selectedLayer.opacity}
                onChange={(e) => handleUpdateLayer({ opacity: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>

            {/* Blur */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Desenfoque (Blur):</span>
                <span className="text-purple-300">{selectedLayer.blur}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={150}
                step={1}
                value={selectedLayer.blur}
                onChange={(e) => handleUpdateLayer({ blur: parseInt(e.target.value, 10) })}
                className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>

            {/* Color Customization */}
            {selectedLayer.animationType !== 'html-iframe' && !selectedLayer.isMotionSequence && selectedLayer.animationType !== 'inlumenai-morph' && (
              <div className="pt-2 border-t border-white/5">
                <ShapeColorPicker
                  currentColor={selectedLayer.color || '#FFFFFF'}
                  onChangeColor={(color) => handleUpdateLayer({ color })}
                  wireframe={selectedLayer.wireframe}
                  onToggleWireframe={(wireframe) => handleUpdateLayer({ wireframe })}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleDuplicateLayer(selectedLayer.id)}
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Duplicar</span>
            </button>

            <button
              onClick={() => handleDeleteLayer(selectedLayer.id)}
              className="py-2 px-3 rounded-lg bg-red-900/30 hover:bg-red-900/60 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-red-500/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Eliminar</span>
            </button>
          </div>
        </aside>
      )}

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
    </div>
  );
};

