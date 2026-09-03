/**
 * HMA INLUMENAI STUDIO (v2026.40)
 * Left Toolbar: Collapsible / Dropdown Panels for 13 Shapes, Parametric Grid, Technical Boxes & Layer Management
 */

import React, { useState } from 'react';
import {
  Grid,
  Maximize2,
  Plus,
  Lock,
  Eye,
  EyeOff,
  Move,
  RotateCw,
  Compass,
  Square,
  Hash,
  Ruler,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  Upload,
  Layers,
  Sparkles,
  CheckSquare,
  Square as SquareIcon
} from 'lucide-react';
import { BoundingBoxSize, GridSettings, HMAPiece, MoveStepMode, ShapeType } from '../../types/hma';
import { MODULE_PX, PIECE_GEOMETRIES, getShapeSvgPath } from '../../data/hmaDefinitions';

interface PieceToolbarProps {
  gridSettings: GridSettings;
  setGridSettings: React.Dispatch<React.SetStateAction<GridSettings>>;
  pieces: HMAPiece[];
  selectedPieceId: string | null;
  onSelectPiece: (id: string | null) => void;
  onSelectAllPieces?: () => void;
  onRotateGroup?: (deltaDeg: number) => void;
  onAddPiece: (shapeType: ShapeType) => void;
  onTogglePieceVisibility: (id: string) => void;
  onOpenBoxManager?: () => void;
  onImportSvgOrJson?: () => void;
  onClose?: () => void;
}

export const PieceToolbar: React.FC<PieceToolbarProps> = ({
  gridSettings,
  setGridSettings,
  pieces,
  selectedPieceId,
  onSelectPiece,
  onSelectAllPieces,
  onRotateGroup,
  onAddPiece,
  onTogglePieceVisibility,
  onOpenBoxManager,
  onImportSvgOrJson,
  onClose
}) => {
  // Collapsible sections state
  const [openSections, setOpenSections] = useState<{
    grid: boolean;
    movement: boolean;
    boxes: boolean;
    addShapes: boolean;
    layers: boolean;
  }>({
    grid: true,
    movement: false,
    boxes: false,
    addShapes: true,
    layers: true
  });

  const [shapeCategoryFilter, setShapeCategoryFilter] = useState<'all' | 'base' | 'upper'>('all');

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAll = (open: boolean) => {
    setOpenSections({
      grid: open,
      movement: open,
      boxes: open,
      addShapes: open,
      layers: open
    });
  };

  const isAllSelected = selectedPieceId === 'ALL_PIECES';

  const baseGeometries = PIECE_GEOMETRIES.filter((g) => g.category === 'base');
  const upperGeometries = PIECE_GEOMETRIES.filter((g) => g.category === 'upper');

  const filteredGeometries = PIECE_GEOMETRIES.filter((g) => {
    if (shapeCategoryFilter === 'base') return g.category === 'base';
    if (shapeCategoryFilter === 'upper') return g.category === 'upper';
    return true;
  });

  const moveMode = gridSettings.moveStepMode || '1.0M';

  const setMoveMode = (mode: MoveStepMode) => {
    const snapPx =
      mode === 'free'
        ? 1
        : mode === '0.25M'
        ? MODULE_PX / 4
        : mode === '0.5M'
        ? MODULE_PX / 2
        : MODULE_PX;

    setGridSettings((s) => ({
      ...s,
      moveStepMode: mode,
      snapStep: snapPx,
      snapToGrid: mode !== 'free'
    }));
  };

  return (
    <aside className="w-80 border-r border-white/10 bg-[#060C04]/95 backdrop-blur-md flex flex-col h-[calc(100vh-4rem)] overflow-hidden select-none transition-all duration-300 relative shrink-0">
      {/* Top Header with Expand/Collapse All */}
      <div className="p-3 border-b border-white/10 bg-slate-900/70 space-y-2">
        <div className="flex items-center justify-between gap-1.5">
          {onClose && (
            <button
              onClick={onClose}
              title="Ocultar barra de herramientas (Lienzo en pantalla completa)"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-white/10 transition-colors shrink-0 flex items-center justify-center w-full text-xs font-mono font-bold"
            >
              <PanelLeftClose className="w-4 h-4 mr-2" /> Ocultar Panel Izquierdo
            </button>
          )}
        </div>

        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-slate-400">
          <span>Menús Desplegables</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleAll(true)}
              className="hover:text-cyan-300 transition-colors underline"
            >
              Expandir
            </button>
            <span>•</span>
            <button
              onClick={() => toggleAll(false)}
              className="hover:text-cyan-300 transition-colors underline"
            >
              Colapsar
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Tool Sections Scroll Container */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/10 custom-scrollbar">
        {/* ========================================================================= */}
        {/* SECTION 1: Retícula & Guías Paramétricas (Desplegable) */}
        {/* ========================================================================= */}
        <div className="p-3 bg-black/20">
          <button
            onClick={() => toggleSection('grid')}
            className="w-full flex items-center justify-between text-xs font-mono uppercase text-slate-300 hover:text-cyan-300 font-bold transition-colors pb-1"
          >
            <span className="flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-cyan-400" />
              Retícula Paramétrica
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-cyan-400 font-normal">{gridSettings.moduleSize}px</span>
              {openSections.grid ? (
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
          </button>

          {openSections.grid && (
            <div className="mt-2.5 space-y-2.5 pt-1 text-xs animate-fadeIn">
              {/* Grid switches */}
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                <button
                  onClick={() =>
                    setGridSettings((s) => ({ ...s, showGrid: !s.showGrid }))
                  }
                  className={`py-1.5 px-2 rounded-md border text-center transition-colors ${
                    gridSettings.showGrid
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  1.0M (67px)
                </button>

                <button
                  onClick={() =>
                    setGridSettings((s) => ({ ...s, showSubgrid05: !s.showSubgrid05 }))
                  }
                  className={`py-1.5 px-2 rounded-md border text-center transition-colors ${
                    gridSettings.showSubgrid05
                      ? 'bg-blue-500/20 border-blue-500/60 text-blue-300 font-bold'
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  0.5M (33.5px)
                </button>

                <button
                  onClick={() =>
                    setGridSettings((s) => ({ ...s, showSubgrid025: !s.showSubgrid025 }))
                  }
                  className={`py-1.5 px-2 rounded-md border text-center transition-colors ${
                    gridSettings.showSubgrid025
                      ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300 font-bold'
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  0.25M (16.75px)
                </button>
              </div>

              {/* Toggles: Guías Técnicas, Cotas M, Wireframe */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    setGridSettings((s) => ({
                      ...s,
                      showTechnicalGuides: !s.showTechnicalGuides
                    }))
                  }
                  className={`py-1.5 px-2 rounded border text-[11px] font-mono flex items-center justify-center gap-1 transition-colors ${
                    gridSettings.showTechnicalGuides
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold'
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <Ruler className="w-3 h-3" />
                  <span>Guías GAP ({gridSettings.showTechnicalGuides ? 'ON' : 'OFF'})</span>
                </button>

                <button
                  onClick={() =>
                    setGridSettings((s) => ({ ...s, showDimensions: !s.showDimensions }))
                  }
                  className={`py-1.5 px-2 rounded border text-[11px] font-mono flex items-center justify-center gap-1 transition-colors ${
                    gridSettings.showDimensions
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <Hash className="w-3 h-3" />
                  <span>Cotas M ({gridSettings.showDimensions ? 'ON' : 'OFF'})</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: 4 Modos de Movimiento (Libre, 1.0M, 0.5M, 0.25M) (Desplegable) */}
        {/* ========================================================================= */}
        <div className="p-3 bg-black/20">
          <button
            onClick={() => toggleSection('movement')}
            className="w-full flex items-center justify-between text-xs font-mono uppercase text-slate-300 hover:text-emerald-300 font-bold transition-colors pb-1"
          >
            <span className="flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-emerald-400" />
              Modos de Movimiento Exacto
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40">
                {moveMode}
              </span>
              {openSections.movement ? (
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
          </button>

          {openSections.movement && (
            <div className="mt-2.5 space-y-2 pt-1 animate-fadeIn">
              <p className="text-[10px] text-slate-400 leading-tight">
                Garantiza uniones y acoplamientos exactos sobre la caja o plantilla:
              </p>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
                {(
                  [
                    { mode: 'free', label: 'Libre', desc: '1px continuo' },
                    { mode: '1.0M', label: '1.0M', desc: '67px' },
                    { mode: '0.5M', label: '0.5M', desc: '33.5px' },
                    { mode: '0.25M', label: '0.25M', desc: '16.75px' }
                  ] as const
                ).map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setMoveMode(item.mode)}
                    className={`py-2 px-1 rounded-md border flex flex-col items-center justify-center transition-all ${
                      moveMode === item.mode
                        ? 'bg-emerald-500/25 border-emerald-500 text-emerald-200 font-bold shadow-sm'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs">{item.label}</span>
                    <span className="text-[8px] opacity-75">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: Cajas Técnicas / Plantillas de Fondo (Desplegable) */}
        {/* ========================================================================= */}
        <div className="p-3 bg-black/20">
          <button
            onClick={() => toggleSection('boxes')}
            className="w-full flex items-center justify-between text-xs font-mono uppercase text-slate-300 hover:text-emerald-300 font-bold transition-colors pb-1"
          >
            <span className="flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-emerald-400" />
              Caja Técnica / Plantilla
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-cyan-400 font-mono font-bold">
                {gridSettings.showBoundingBox || 'OFF'}
              </span>
              {openSections.boxes ? (
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
          </button>

          {openSections.boxes && (
            <div className="mt-2.5 space-y-2 pt-1 animate-fadeIn">
              <p className="text-[10px] text-slate-400 leading-tight">
                Dibuja las plantillas con sus líneas guía y cotas de protección en el fondo del lienzo:
              </p>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
                {(['11x11', '7x7', '5x5', '3x3'] as BoundingBoxSize[]).map((boxSize) => (
                  <button
                    key={boxSize}
                    onClick={() =>
                      setGridSettings((s) => ({
                        ...s,
                        showBoundingBox: s.showBoundingBox === boxSize ? false : boxSize
                      }))
                    }
                    className={`py-1.5 px-2 rounded-md border text-center transition-colors ${
                      gridSettings.showBoundingBox === boxSize
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold'
                        : 'border-white/10 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    {boxSize}
                  </button>
                ))}
              </div>

              {onOpenBoxManager && (
                <button
                  onClick={onOpenBoxManager}
                  className="w-full py-1.5 px-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-sm mt-1"
                >
                  <Ruler className="w-3 h-3" />
                  <span>Configurar Cajas & Offset</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: Opción Unificada: Añadir Formas (13 Formas Paramétricas)       */}
        {/* ========================================================================= */}
        <div className="p-3 bg-slate-900/30">
          <button
            onClick={() => toggleSection('addShapes')}
            className="w-full flex items-center justify-between text-xs font-mono uppercase text-slate-200 hover:text-cyan-300 font-bold transition-colors pb-1"
          >
            <span className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              Añadir Formas
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-cyan-300 font-mono font-bold bg-cyan-500/15 px-1.5 py-0.5 rounded border border-cyan-500/30">
                13 Formas
              </span>
              {openSections.addShapes ? (
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
          </button>

          {openSections.addShapes && (
            <div className="mt-2.5 space-y-2 pt-1 animate-fadeIn">
              {/* Filtro por Categoría: Todas (13) | Base (7) | Superiores (6) */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 text-[10px] font-mono">
                {(
                  [
                    { id: 'all', label: 'Todas', count: PIECE_GEOMETRIES.length },
                    { id: 'base', label: 'Base', count: baseGeometries.length },
                    { id: 'upper', label: 'Superiores', count: upperGeometries.length }
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setShapeCategoryFilter(cat.id)}
                    className={`flex-1 py-1 px-1 rounded transition-colors text-center ${
                      shapeCategoryFilter === cat.id
                        ? 'bg-cyan-500 text-black font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>

              {/* Grid compacto de Formas */}
              <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {filteredGeometries.map((geom) => {
                  const isBase = geom.category === 'base';
                  const index = PIECE_GEOMETRIES.findIndex((g) => g.type === geom.type);
                  const shapeCode = `F-${(index + 1).toString().padStart(2, '0')}`;
                  return (
                    <button
                      key={geom.type}
                      onClick={() => onAddPiece(geom.type)}
                      title={`Añadir ${geom.name} (${geom.defaultWidthM}x{geom.defaultHeightM}M)`}
                      className={`p-1.5 rounded-lg border text-left transition-all group flex items-center gap-2 ${
                        isBase
                          ? 'bg-slate-900/60 hover:bg-blue-900/30 border-white/5 hover:border-blue-500/40'
                          : 'bg-slate-900/60 hover:bg-cyan-900/30 border-white/5 hover:border-cyan-500/40'
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 shrink-0 ${isBase ? 'text-blue-400' : 'text-cyan-400'} group-hover:scale-110 transition-transform`}
                        viewBox="-35 -35 70 70"
                      >
                        <path
                          d={getShapeSvgPath(
                            geom.type,
                            geom.defaultWidthM * 24,
                            geom.defaultHeightM * 24
                          )}
                          fill="currentColor"
                          opacity="0.85"
                        />
                      </svg>
                      <div className="truncate min-w-0">
                        <div className="text-[10px] font-mono text-slate-200 group-hover:text-cyan-300 truncate font-semibold">
                          {geom.name.split(':')[0]}
                        </div>
                        <div className="text-[8px] font-mono text-slate-400 flex items-center gap-1">
                          <span className={isBase ? 'text-blue-400' : 'text-cyan-400'}>{shapeCode}</span>
                          <span>•</span>
                          <span>{geom.defaultWidthM}x{geom.defaultHeightM}M</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 6: Capas Activas en Lienzo & Seleccionar Todo (Desplegable) */}
        {/* ========================================================================= */}
        <div className="p-3">
          <div className="flex items-center justify-between pb-1">
            <button
              onClick={() => toggleSection('layers')}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-300 font-bold hover:text-white transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Capas en Lienzo ({pieces.length})</span>
              {openSections.layers ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {onSelectAllPieces && (
              <button
                onClick={onSelectAllPieces}
                className={`text-[9px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  isAllSelected
                    ? 'bg-cyan-500 text-black font-bold border-cyan-400'
                    : 'bg-slate-800 text-cyan-400 border-white/10 hover:bg-slate-700'
                }`}
                title="Seleccionar todas las formas para cambios globales"
              >
                {isAllSelected ? 'Todas (✓)' : 'Seleccionar Todo'}
              </button>
            )}
          </div>

          {openSections.layers && (
            <div className="space-y-1 mt-2.5 pt-1 animate-fadeIn max-h-56 overflow-y-auto custom-scrollbar">
              {pieces.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-2">
                  No hay piezas en el lienzo.
                </p>
              ) : (
                pieces.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectPiece(p.id)}
                    className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      p.id === selectedPieceId || isAllSelected
                        ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-200 font-semibold shadow-sm'
                        : 'bg-slate-900/60 hover:bg-slate-800 border border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/30"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="truncate text-[11px] font-mono">
                        {p.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-mono text-slate-400">
                        {Math.round(p.rotation)}°
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePieceVisibility(p.id);
                        }}
                        title={p.visible ? 'Ocultar pieza' : 'Mostrar pieza'}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        {p.visible ? (
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
