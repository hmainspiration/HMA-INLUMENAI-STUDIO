/**
 * HMA INLUMENAI STUDIO (v2026.40)
 * Unified Platform: Motion + Animated Canvas SVG
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { Film, Sparkles, HelpCircle } from 'lucide-react';
import { AppToolMode, GridSettings, HMAPiece, PaletteMode, AnimatedLayer } from './types/hma';
import { LogoData } from './types';
import {
  APP_VERSION,
  HMA_PRESETS,
  MODULE_PX
} from './data/hmaDefinitions';
import { mapShapePieceToHMAPiece } from './data/presets';
import { Header } from './components/Header';
import { InlumenaiMotion } from './components/motion/InlumenaiMotion';
import { AnimatedSvgCanvasEditor } from './components/canvas/AnimatedSvgCanvasEditor';
import { MatrixStudio } from './components/matrix/MatrixStudio';
import { OrientationModal } from './components/OrientationModal';
import { HmaDashboard } from './components/dashboard/HmaDashboard';
import {
  downloadFile,
  exportHighResPng,
  exportProjectJson,
  generateCleanSvg
} from './utils/exportUtils';

export default function App() {
  const [activeTool, setActiveTool] = useState<AppToolMode>('matrix');
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const [activePresetId, setActivePresetId] = useState<string>('hma-master');
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('profundo');
  const [showOrientationModal, setShowOrientationModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Active preset object
  const activePreset =
    HMA_PRESETS.find((p) => p.id === activePresetId) || HMA_PRESETS[0];

  // Pieces state (initial clone from active preset for Motion sequences)
  const [pieces, setPieces] = useState<HMAPiece[]>(() => [...activePreset.pieces]);

  const [customLogos, setCustomLogos] = useState<LogoData[]>([]);

  // Transfer Isotype from Matrix to Motion
  const handleSendMatrixToMotion = (logo: LogoData) => {
    setCustomLogos((prev) => [...prev, logo]);
    setActiveTool('motion');
    showNotification(`Isotipo "${logo.serviceName}" transferido a Motion exitosamente.`);
  };

  // Animated Canvas layers state with default initial layers
  const [canvasLayers, setCanvasLayers] = useState<AnimatedLayer[]>([
    {
      id: 'layer-profundo',
      name: 'Profundo',
      svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#11D7B6"/></svg>',
      x: -160,
      y: -100,
      width: 600,
      height: 600,
      scale: 0.7,
      rotation: 0,
      opacity: 0.2,
      blur: 40,
      blendMode: 'screen',
      wireframe: false,
      isPattern: false,
      patternScale: 1,
      patternSpacing: 0,
      animationType: 'float',
      animDuration: 16,
      animX: -240,
      animY: -186,
      animDelay: 0,
      visible: true,
      locked: false,
      exportable: true,
      zIndex: 1
    },
    {
      id: 'layer-luz',
      name: 'Luz',
      svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#3D80FD"/></svg>',
      x: 230,
      y: 100,
      width: 1040,
      height: 1040,
      scale: 0.45,
      rotation: 0,
      opacity: 0.2,
      blur: 40,
      blendMode: 'screen',
      wireframe: false,
      isPattern: false,
      patternScale: 1,
      patternSpacing: 0,
      animationType: 'float',
      animDuration: 19,
      animX: 180,
      animY: 160,
      animDelay: 0,
      visible: true,
      locked: false,
      exportable: true,
      zIndex: 2
    },
    {
      id: 'grid-bg',
      name: 'Grid Pattern',
      svgCode: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.15)"/></svg>',
      x: 11,
      y: 17,
      width: 1920,
      height: 1920,
      scale: 1.1,
      rotation: 0,
      opacity: 0.75,
      blur: 0,
      blendMode: 'color-dodge',
      wireframe: false,
      isPattern: true,
      patternScale: 24,
      patternSpacing: 0,
      animationType: 'pulse',
      animDuration: 7,
      animX: 20,
      animY: 15,
      animDelay: 0,
      visible: true,
      locked: false,
      exportable: true,
      zIndex: 3
    }
  ]);

  // Change preset handler
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const found = HMA_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setPieces([...found.pieces]);
      showNotification(`Plantilla "${found.name}" cargada correctamente con ${found.pieces.length} piezas.`);
    }
  };

  // Toggle Palette (Luz vs Profundo)
  const handleTogglePalette = () => {
    const nextMode: PaletteMode = paletteMode === 'luz' ? 'profundo' : 'luz';
    setPaletteMode(nextMode);

    setPieces((prev) =>
      prev.map((p) => ({
        ...p,
        color:
          nextMode === 'luz'
            ? p.category === 'base'
              ? activePreset.colorProfundo
              : activePreset.colorLuz
            : p.category === 'base'
            ? activePreset.colorLuz
            : activePreset.colorProfundo
      }))
    );
  };

  // Reset Canvas to initial state
  const handleResetCanvas = () => {
    if (activePreset) {
      setPieces([...activePreset.pieces]);
      showNotification(`Lienzo restablecido al estado original de ${activePreset.name}.`, 'info');
    }
  };

  // Export Clean SVG
  const handleExportCleanSvg = () => {
    const svgCode = generateCleanSvg(pieces, 800, false);
    downloadFile(svgCode, `HMA_ISOTYPE_CLEAN_${activePreset.id}_${APP_VERSION}.svg`, 'image/svg+xml');
    showNotification('SVG Vectorial Limpio descargado exitosamente.');
  };

  // Export PNG @2x or @4x
  const handleExportPng = async (scale: 2 | 4) => {
    const svgCode = generateCleanSvg(pieces, 800, false);
    await exportHighResPng(
      svgCode,
      800,
      scale,
      true,
      `HMA_ISOTYPE_${activePreset.id}_@${scale}x_${APP_VERSION}.png`
    );
    showNotification(`PNG @${scale}x exportado en alta resolución.`);
  };

  // Save Project JSON
  const handleSaveJson = () => {
    exportProjectJson(pieces, canvasLayers, activePresetId, paletteMode);
    showNotification('Proyecto guardado en formato JSON.');
  };

  // Load Project JSON
  const handleLoadJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Check if shapes array exists
        if (json.shapes && Array.isArray(json.shapes)) {
          const loadedPieces = json.shapes.map(mapShapePieceToHMAPiece);
          setPieces(loadedPieces);

          if (json.serviceId) {
            setActivePresetId(json.serviceId);
          }
          if (json.paletteMode) {
            setPaletteMode(json.paletteMode);
          }
          showNotification(`Plantilla canónica "${json.serviceName || file.name}" cargada.`);
          return;
        }

        // Direct array of shapes/pieces
        if (Array.isArray(json)) {
          const isShapeFormat = json.length > 0 && ('length' in json[0] || 'roleName' in json[0]);
          if (isShapeFormat) {
            const loadedPieces = json.map(mapShapePieceToHMAPiece);
            setPieces(loadedPieces);
            showNotification(`Secuencia de ${loadedPieces.length} formas cargada.`);
            return;
          } else if (json.length > 0 && 'shapeType' in json[0]) {
            setPieces(json);
            showNotification(`Colección de ${json.length} piezas cargada.`);
            return;
          }
        }

        // Full Project Export format
        if (json.pieces && Array.isArray(json.pieces)) {
          setPieces(json.pieces);
        }
        if (json.activePresetId) {
          setActivePresetId(json.activePresetId);
        }
        if (json.paletteMode) {
          setPaletteMode(json.paletteMode);
        }
        if (json.layers && Array.isArray(json.layers)) {
          setCanvasLayers(json.layers);
        }
        showNotification(`Proyecto "${file.name}" cargado exitosamente.`);
      } catch (err) {
        console.error('Error al cargar archivo JSON:', err);
        showNotification('Error al parsear el archivo JSON.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Load External SVG File
  const handleLoadSvg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const svgContent = event.target?.result as string;
        if (!svgContent.includes('<svg')) {
          showNotification('El archivo seleccionado no es un SVG válido.', 'error');
          return;
        }

        const newId = `layer-imported-${Date.now()}`;
        const newLayer: AnimatedLayer = {
          id: newId,
          name: file.name.replace('.svg', ''),
          svgCode: svgContent,
          x: 960,
          y: 540,
          width: 400,
          height: 400,
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
          zIndex: canvasLayers.length + 1
        };

        setCanvasLayers((prev) => [...prev, newLayer]);
        setActiveTool('canvas');
        showNotification(`SVG "${file.name}" importado a Animation Canvas.`);
      } catch (err) {
        console.error('Error al cargar SVG:', err);
        showNotification('Error al leer el archivo SVG.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Transfer Isotype from Motion to Animated Canvas
  const handleSendMotionToCanvas = (
    svgCode: string,
    name: string,
    motionParams?: Partial<AnimatedLayer>
  ) => {
    const newId = `layer-motion-${Date.now()}`;
    const newLayer: AnimatedLayer = {
      id: newId,
      name,
      svgCode,
      x: 960,
      y: 540,
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
      zIndex: canvasLayers.length + 1,
      isMotionSequence: true,
      motionServiceId: 'all',
      motionIsLoop: true,
      motionSpeed: 1,
      motionShowGuides: false,
      motionWireframe: false,
      ...motionParams
    };

    setCanvasLayers((prev) => [...prev, newLayer]);
    setActiveTool('canvas');
    showNotification(`Secuencia Inlumenai "${name}" transferida a Animation.`);
  };

  return (
    <div 
      className="h-screen w-screen bg-[#000424] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden"
    >
      {/* Universal Studio Header */}
      <Header
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        paletteMode={paletteMode}
        onTogglePalette={handleTogglePalette}
        onExportCleanSvg={handleExportCleanSvg}
        onExportPng={handleExportPng}
        onSaveJson={handleSaveJson}
        onLoadJson={handleLoadJson}
        onLoadSvg={handleLoadSvg}
        onOpenOrientation={() => setShowOrientationModal(true)}
        onResetCanvas={handleResetCanvas}
        onOpenDashboard={() => setShowDashboard(true)}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-fadeIn ${
            notification.type === 'error'
              ? 'bg-red-900/90 border-red-500/50 text-red-200'
              : notification.type === 'info'
              ? 'bg-blue-900/90 border-blue-500/50 text-blue-200'
              : 'bg-emerald-900/90 border-emerald-500/50 text-emerald-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Integrated Views */}
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        {/* Module 1: Matrix Studio */}
        {activeTool === 'matrix' && (
          <MatrixStudio
            paletteMode={paletteMode}
            onSendToMotion={handleSendMatrixToMotion}
            showNotification={showNotification}
          />
        )}

        {/* Module 2: Motion (GSAP Sequencer) */}
        {activeTool === 'motion' && (
          <InlumenaiMotion
            currentPieces={pieces}
            customLogos={customLogos}
            paletteMode={paletteMode}
            onSendToCanvas={handleSendMotionToCanvas}
          />
        )}

        {/* Module 2: Animation (Animated SVG Canvas & Video Recorder) */}
        {activeTool === 'canvas' && (
          <AnimatedSvgCanvasEditor
            layers={canvasLayers}
            setLayers={setCanvasLayers}
          />
        )}
      </main>

      {/* Dedicated Mobile / Smartphone Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060C04]/95 border-t border-white/15 backdrop-blur-xl flex items-center justify-around py-1.5 px-2 shadow-2xl safe-area-pb">
        <button
          onClick={() => setActiveTool('matrix')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-mono transition-all ${
            activeTool === 'matrix'
              ? 'text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-4 h-4" />
            <span className="absolute -top-1 -right-2 w-3 h-3 bg-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">1</span>
          </div>
          <span>Matrix</span>
        </button>

        <button
          onClick={() => setActiveTool('motion')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-mono transition-all ${
            activeTool === 'motion'
              ? 'text-blue-300 font-bold bg-blue-950/60 border border-blue-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Film className="w-4 h-4" />
            <span className="absolute -top-1 -right-2 w-3 h-3 bg-blue-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">2</span>
          </div>
          <span>Motion</span>
        </button>

        <button
          onClick={() => setActiveTool('canvas')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-mono transition-all ${
            activeTool === 'canvas'
              ? 'text-purple-300 font-bold bg-purple-950/60 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-4 h-4" />
            <span className="absolute -top-1 -right-2 w-3 h-3 bg-purple-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">3</span>
          </div>
          <span>Animation</span>
        </button>

        <button
          onClick={() => setShowDashboard(true)}
          className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-mono text-slate-400 hover:text-[#3D80FD] transition-colors"
          title="Ver selector inicial de secciones"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Secciones</span>
        </button>
      </nav>

      {/* Dashboard Inicial para escoger entre las tres secciones (HMA MASTER) */}
      {showDashboard && (
        <HmaDashboard
          currentSection={activeTool}
          canClose={true}
          onClose={() => setShowDashboard(false)}
          onSelectSection={(section) => {
            setActiveTool(section);
            setShowDashboard(false);
            const sectionNames = {
              matrix: 'Matrix Studio (Retícula 11x11)',
              motion: 'Inlumenai Motion (Secuenciador GSAP)',
              canvas: 'Animation Canvas (Compositor Multicapa)'
            };
            showNotification(`Sección activa: ${sectionNames[section] || section.toUpperCase()}`);
          }}
        />
      )}

      {/* Interactive Orientation Guide Modal */}
      <OrientationModal
        isOpen={showOrientationModal}
        onClose={() => setShowOrientationModal(false)}
        onSelectTool={(tool) => setActiveTool(tool)}
      />
    </div>
  );
}
