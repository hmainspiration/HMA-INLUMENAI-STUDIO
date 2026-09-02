/**
 * HMA INLUMENAI STUDIO (v2026.40)
 * Unified Platform: Matrix + Motion + Animated Canvas SVG
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { AppToolMode, GridSettings, HMAPiece, PaletteMode, AnimatedLayer } from './types/hma';
import {
  APP_VERSION,
  HMA_PRESETS,
  MODULE_PX,
  getCanonicalBasePieces
} from './data/hmaDefinitions';
import { mapShapePieceToHMAPiece } from './data/presets';
import { Header } from './components/Header';
import { HmaMatrixStudio } from './components/matrix/HmaMatrixStudio';
import { InlumenaiMotion } from './components/motion/InlumenaiMotion';
import { AnimatedSvgCanvasEditor } from './components/canvas/AnimatedSvgCanvasEditor';
import { OrientationModal } from './components/OrientationModal';
import {
  downloadFile,
  exportHighResPng,
  exportProjectJson,
  generateCleanSvg,
  generateTechnicalBlueprintSvg
} from './utils/exportUtils';

export default function App() {
  const [activeTool, setActiveTool] = useState<AppToolMode>('matrix');
  const [activePresetId, setActivePresetId] = useState<string>('hma-master');
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('luz');
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
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

  // Pieces state (initial clone from active preset)
  const [pieces, setPieces] = useState<HMAPiece[]>(() => [...activePreset.pieces]);

  // Grid Settings state
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    moduleSize: MODULE_PX,
    showGrid: true,
    showSubgrid05: false,
    showSubgrid025: false,
    showOrigin: true,
    showDimensions: false,
    showBoundingBox: '11x11',
    showTechnicalGuides: false,
    moveStepMode: '1.0M',
    snapToGrid: true,
    snapStep: MODULE_PX,
    wireframeMode: false,
    zoom: 1,
    panX: 0,
    panY: 0
  });

  // Animated Canvas layers state with 4 default initial layers matching reference images
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

  // Active colors based on palette mode
  const colorLuz = activePreset.colorLuz;
  const colorProfundo = activePreset.colorProfundo;

  // Change preset handler (Lectura real de plantillas)
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const found = HMA_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setPieces([...found.pieces]);
      setSelectedPieceId(null);
      showNotification(`Plantilla "${found.name}" cargada correctamente con ${found.pieces.length} piezas.`);
    }
  };

  // Toggle Palette (Luz vs Profundo)
  const handleTogglePalette = () => {
    const nextMode: PaletteMode = paletteMode === 'luz' ? 'profundo' : 'luz';
    setPaletteMode(nextMode);

    // Apply color logic
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


  const handleAnchorBase = () => {
    const canonicalBase = getCanonicalBasePieces(colorLuz, colorProfundo);
    setPieces((prev) => {
      const upperPieces = prev.filter((p) => p.category === 'upper');
      return [...canonicalBase, ...upperPieces];
    });
    showNotification('Base canónica H-M-A anclada en sus 7 posiciones oficiales.', 'info');
  };

  // Reset Canvas to initial state
  const handleResetCanvas = () => {
    if (activePreset) {
      setPieces([...activePreset.pieces]);
      setSelectedPieceId(null);
      setGridSettings((s) => ({ ...s, zoom: 1, panX: 0, panY: 0 }));
      showNotification(`Lienzo restablecido al estado original de ${activePreset.name}.`, 'info');
    }
  };

  // Export Clean SVG
  const handleExportCleanSvg = () => {
    const svgCode = generateCleanSvg(pieces, 800, false);
    downloadFile(svgCode, `HMA_MATRIX_CLEAN_${activePreset.id}_${APP_VERSION}.svg`, 'image/svg+xml');
    showNotification('SVG Vectorial Limpio descargado exitosamente.');
  };

  // Export Technical Blueprint
  const handleExportBlueprint = () => {
    const blueprintSvg = generateTechnicalBlueprintSvg(
      pieces,
      activePreset.name,
      gridSettings.showBoundingBox,
      1000
    );
    downloadFile(
      blueprintSvg,
      `HMA_MATRIX_BLUEPRINT_${activePreset.id}_${APP_VERSION}.svg`,
      'image/svg+xml'
    );
    showNotification('Blueprint Técnico descargado exitosamente.');
  };

  // Export PNG @2x or @4x
  const handleExportPng = async (scale: 2 | 4) => {
    const svgCode = generateCleanSvg(pieces, 800, false);
    await exportHighResPng(
      svgCode,
      800,
      scale,
      true,
      `HMA_MATRIX_${activePreset.id}_@${scale}x_${APP_VERSION}.png`
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
        
        // Check if shapes array exists (Canonical format from user JSON)
        if (json.shapes && Array.isArray(json.shapes)) {
          const loadedPieces = json.shapes.map(mapShapePieceToHMAPiece);
          setPieces(loadedPieces);

          if (json.serviceId) {
            setActivePresetId(json.serviceId);
          }
          if (json.paletteMode) {
            setPaletteMode(json.paletteMode);
          }
          showNotification(`Plantilla canónica "${json.serviceName || file.name}" cargada con ${loadedPieces.length} formas.`);
          return;
        }

        // Direct array of shapes/pieces
        if (Array.isArray(json)) {
          const isShapeFormat = json.length > 0 && ('length' in json[0] || 'roleName' in json[0]);
          if (isShapeFormat) {
            const loadedPieces = json.map(mapShapePieceToHMAPiece);
            setPieces(loadedPieces);
            showNotification(`Matriz de ${loadedPieces.length} formas cargada.`);
            return;
          } else if (json.length > 0 && 'shapeType' in json[0]) {
            setPieces(json);
            showNotification(`Matriz de ${json.length} piezas cargada.`);
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
        showNotification(`SVG "${file.name}" importado a Canvas Animado.`);
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
    showNotification(`Secuencia Inlumenai "${name}" transferida y activa en Canvas Animado.`);
  };

  return (
    <div className="min-h-screen bg-[#081126] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Universal Studio Header */}
      <Header
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        paletteMode={paletteMode}
        onTogglePalette={handleTogglePalette}
        onAnchorBase={handleAnchorBase}
        onExportCleanSvg={handleExportCleanSvg}
        onExportBlueprint={handleExportBlueprint}
        onExportPng={handleExportPng}
        onSaveJson={handleSaveJson}
        onLoadJson={handleLoadJson}
        onLoadSvg={handleLoadSvg}
        onOpenOrientation={() => setShowOrientationModal(true)}
        onResetCanvas={handleResetCanvas}
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
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Module 1: HMA Matrix */}
        {activeTool === 'matrix' && (
          <HmaMatrixStudio
            pieces={pieces}
            setPieces={setPieces}
            selectedPieceId={selectedPieceId}
            setSelectedPieceId={setSelectedPieceId}
            gridSettings={gridSettings}
            setGridSettings={setGridSettings}
            onAnchorBase={handleAnchorBase}
            colorLuz={colorLuz}
            colorProfundo={colorProfundo}
            activePresetName={activePreset.name}
            onLoadJson={handleLoadJson}
            onLoadSvg={handleLoadSvg}
          />
        )}

        {/* Module 2: Motion (GSAP) */}
        {activeTool === 'motion' && (
          <InlumenaiMotion
            currentPieces={pieces}
            paletteMode={paletteMode}
            onSendToCanvas={handleSendMotionToCanvas}
            onBackToMatrix={() => setActiveTool('matrix')}
          />
        )}

        {/* Module 3: Animated SVG Canvas & Video Recorder */}
        {activeTool === 'canvas' && (
          <AnimatedSvgCanvasEditor
            layers={canvasLayers}
            setLayers={setCanvasLayers}
            onBackToMatrix={() => setActiveTool('matrix')}
          />
        )}
      </main>

      {/* Interactive Orientation Guide Modal */}
      <OrientationModal
        isOpen={showOrientationModal}
        onClose={() => setShowOrientationModal(false)}
        onSelectTool={(tool) => setActiveTool(tool)}
      />
    </div>
  );
}
