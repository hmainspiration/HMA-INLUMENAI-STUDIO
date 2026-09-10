import React, { useState } from 'react';
import { 
  Plus, Upload, Layers, Grid3x3, MousePointer2, Focus,
  RotateCw, ArrowRightLeft, AppWindow, Eye, Trash2,
  ChevronLeft, Compass, Pencil, Sliders, Check, EyeOff
} from 'lucide-react';
import { CustomGridLine } from '../../types/matrix';

interface MatrixGlobalToolsProps {
  onAddShape: () => void;
  onSelectAll: () => void;
  onImportSvg: () => void;
  onRotateGroup: (angle: number) => void;
  onSnapAll: () => void;
  onDeleteSelected?: () => void;
  selectedCount?: number;
  
  // Canvas / Grid Settings
  showMainGrid: boolean;
  setShowMainGrid: (val: boolean) => void;
  showSubGrid: boolean;
  setShowSubGrid: (val: boolean) => void;
  showDiagonals: boolean;
  setShowDiagonals: (val: boolean) => void;
  showDistances: boolean;
  setShowDistances: (val: boolean) => void;
  
  globalWireframe: boolean;
  setGlobalWireframe: (val: boolean) => void;
  
  bgMode: 'dark' | 'light' | 'blueprint';
  setBgMode: (val: 'dark' | 'light' | 'blueprint') => void;
  
  snapMode: number;
  setSnapMode: (val: number) => void;

  // Malla Paramétrica y Dibujada a partir de 0.25X (Horizontal y Vertical)
  showGridH: boolean;
  setShowGridH: (val: boolean) => void;
  stepH: number; // Unidades X a partir de 0.25 (0.25, 0.5, 0.75, 1, 1.25, 1.5, 2...)
  setStepH: (val: number) => void;
  showGridV: boolean;
  setShowGridV: (val: boolean) => void;
  stepV: number;
  setStepV: (val: number) => void;
  gridColor: string;
  setGridColor: (val: string) => void;

  // Grosor, Estilo de Trazo y Opacidad
  strokeWidth: number;
  setStrokeWidth: (val: number) => void;
  dashStyle: string;
  setDashStyle: (val: string) => void;
  opacity: number;
  setOpacity: (val: number) => void;

  // Ocultar / Mostrar medidas base canónicas (1X, 2X...)
  showBaseMeasures: boolean;
  setShowBaseMeasures: (val: boolean) => void;

  // Dibujar y Gestionar líneas de malla personalizadas
  onAddDrawnLine: (axis: 'x' | 'y', posUnits: number, color: string) => void;
  customDrawnLines: CustomGridLine[];
  selectedDrawnLineId: string | null;
  onSelectDrawnLine: (id: string | null) => void;
  onDeleteSpecificLine: (id: string) => void;
  drawnLinesCount: number;
  onClearDrawnLines: () => void;
  isDrawLineMode: boolean;
  setIsDrawLineMode: (val: boolean) => void;
  drawLineAxis: 'x' | 'y';
  setDrawLineAxis: (val: 'x' | 'y') => void;
  onToggleCollapse?: () => void;
}

export const MatrixGlobalTools: React.FC<MatrixGlobalToolsProps> = ({
  onAddShape, onSelectAll, onImportSvg,
  onRotateGroup, onSnapAll, onDeleteSelected, selectedCount = 0,
  showMainGrid, setShowMainGrid,
  showSubGrid, setShowSubGrid,
  showDiagonals, setShowDiagonals, showDistances, setShowDistances,
  globalWireframe, setGlobalWireframe,
  bgMode, setBgMode,
  snapMode, setSnapMode,
  showGridH, setShowGridH, stepH, setStepH,
  showGridV, setShowGridV, stepV, setStepV,
  gridColor, setGridColor,
  strokeWidth, setStrokeWidth,
  dashStyle, setDashStyle,
  opacity, setOpacity,
  showBaseMeasures, setShowBaseMeasures,
  onAddDrawnLine, customDrawnLines, selectedDrawnLineId, onSelectDrawnLine, onDeleteSpecificLine,
  drawnLinesCount, onClearDrawnLines,
  isDrawLineMode, setIsDrawLineMode,
  drawLineAxis, setDrawLineAxis,
  onToggleCollapse
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'grid'>('grid');
  const [manualAxis, setManualAxis] = useState<'x' | 'y'>('y');
  const [manualPosUnits, setManualPosUnits] = useState<number>(0.25);
  const [manualColor, setManualColor] = useState<string>('#06B6D4');

  const STEP_OPTIONS = [
    { value: 0.25, label: '0.25X (16.75px)' },
    { value: 0.5, label: '0.50X (33.5px)' },
    { value: 0.75, label: '0.75X (50.25px)' },
    { value: 1.0, label: '1.00X (67px) Oficial' },
    { value: 1.25, label: '1.25X (83.75px)' },
    { value: 1.5, label: '1.50X (100.5px)' },
    { value: 2.0, label: '2.00X (134px)' },
    { value: 2.75, label: '2.75X (184.25px)' },
    { value: 5.5, label: '5.50X (Centro)' }
  ];

  const COLOR_OPTIONS = [
    { name: 'Cian', hex: '#06B6D4' },
    { name: 'Azul HMA', hex: '#3D80FD' },
    { name: 'Rojo Guía', hex: '#EF4444' },
    { name: 'Esmeralda', hex: '#10B981' },
    { name: 'Ámbar', hex: '#F59E0B' },
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Gris', hex: '#64748B' }
  ];

  const STROKE_WIDTH_OPTIONS = [0.75, 1.5, 2.5, 3.5, 5];

  const DASH_STYLE_OPTIONS_ROW1 = [
    { label: 'Sólida', dash: 'none' },
    { label: 'Discontinua', dash: '6 4' },
    { label: 'Punteada', dash: '2 3' }
  ];

  const DASH_STYLE_OPTIONS_ROW2 = [
    { label: 'Raya Larga', dash: '12 4' },
    { label: 'Cadena', dash: '10 3 2 3' }
  ];

  const handleCreateManualLine = () => {
    onAddDrawnLine(manualAxis, manualPosUnits, manualColor);
  };

  return (
    <div className="w-[280px] shrink-0 flex-shrink-0 bg-[#171d22] border-r border-slate-700/50 flex flex-col h-full overflow-y-auto font-mono text-[11px] text-slate-300 select-none custom-scrollbar z-20 shadow-[5px_0_15px_rgba(0,0,0,0.2)]">
      {/* Header del Panel con Tabs y Botón Colapsar */}
      <div className="p-2.5 border-b border-slate-700/50 bg-[#1e262c] flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex bg-[#12171a] p-0.5 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider transition-all ${
              activeTab === 'tools' 
                ? 'bg-[#3D80FD] text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            HERRAMIENTAS
          </button>
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider transition-all flex items-center gap-1 ${
              activeTab === 'grid' 
                ? 'bg-emerald-500 text-black shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3x3 size={12} />
            MALLA 0.25X+
          </button>
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded transition-colors"
            title="Ocultar Panel Lateral Izquierdo"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      <div className="p-3.5 flex flex-col gap-5">
        {activeTab === 'tools' ? (
          <>
            {/* Acciones de Formas */}
            <div className="flex flex-col gap-2">
              <span className="text-slate-500 font-bold tracking-wider text-[10px]">ACCIONES PRINCIPALES</span>
              <button onClick={onAddShape} className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors shadow-md shadow-emerald-500/10">
                <Plus size={16} /> AÑADIR FORMA
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={onSelectAll} className="flex items-center justify-center gap-1.5 w-full px-2.5 py-2 bg-[#263238] hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600/60 text-[10px] font-semibold">
                  <Layers size={13} /> TODAS
                </button>
                <button onClick={onImportSvg} className="flex items-center justify-center gap-1.5 w-full px-2.5 py-2 bg-[#263238] hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600/60 text-[10px] font-semibold">
                  <Upload size={13} /> CARGAR SVG
                </button>
              </div>

              {/* Botón Eliminar Selección si hay formas activas */}
              {selectedCount > 0 && onDeleteSelected && (
                <button 
                  onClick={onDeleteSelected} 
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 rounded-lg transition-all text-[11px] font-bold mt-0.5 animate-fadeIn"
                  title="Eliminar formas seleccionadas (Supr)"
                >
                  <Trash2 size={14} /> ELIMINAR SELECCIÓN ({selectedCount})
                </button>
              )}
            </div>

            {/* Acciones Globales */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/50">
              <span className="text-slate-500 font-bold tracking-wider text-[10px]">ACCIONES GLOBALES</span>
              <button onClick={onSnapAll} className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors border border-amber-500/30 font-semibold">
                <Focus size={15} /> SNAP GLOBAL
              </button>
              
              <div className="bg-[#212a30] p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-[10px] text-slate-400 mb-1.5 block flex items-center gap-1.5 font-semibold">
                  <RotateCw size={12} className="text-[#3D80FD]"/> Rotar Grupo Entero
                </span>
                <div className="grid grid-cols-5 gap-1">
                  {[-90, -15, -5, 5, 15].map(deg => (
                    <button 
                      key={deg}
                      onClick={() => onRotateGroup(deg)} 
                      className="bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-300 rounded py-1 font-semibold transition-colors"
                    >
                      {deg > 0 ? `+${deg}` : deg}°
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Entorno y Canvas */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-700/50">
              <span className="text-slate-500 font-bold tracking-wider text-[10px]">ENTORNO Y VISUALIZACIÓN</span>
              
              <div className="space-y-1.5 bg-[#212a30] p-2.5 rounded-lg border border-slate-700/60">
                <label className="flex items-center justify-between cursor-pointer hover:text-white py-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Malla Canónica 1X (67px)
                  </span>
                  <input type="checkbox" checked={showMainGrid} onChange={e => setShowMainGrid(e.target.checked)} className="accent-emerald-500 w-3.5 h-3.5" />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white py-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Sub-malla 0.25X (16.75px)
                  </span>
                  <input type="checkbox" checked={showSubGrid} onChange={e => setShowSubGrid(e.target.checked)} className="accent-cyan-500 w-3.5 h-3.5" />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white py-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Diagonales Maestras (45°)
                  </span>
                  <input type="checkbox" checked={showDiagonals} onChange={e => setShowDiagonals(e.target.checked)} className="accent-blue-500 w-3.5 h-3.5" />
                </label>
                <label className="flex items-center justify-between cursor-pointer hover:text-white py-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Modo Wireframe Global
                  </span>
                  <input type="checkbox" checked={globalWireframe} onChange={e => setGlobalWireframe(e.target.checked)} className="accent-amber-500 w-3.5 h-3.5" />
                </label>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-[10px]">Fondo de Presentación:</span>
                <select 
                  value={bgMode} 
                  onChange={e => setBgMode(e.target.value as any)}
                  className="bg-[#212a30] border border-slate-700 text-white p-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="light">Claro (Estándar)</option>
                  <option value="dark">Oscuro (Oficial HMA)</option>
                  <option value="blueprint">Blueprint Técnico (Azul)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-[10px]">Magnetismo (Snap):</span>
                <select 
                  value={snapMode} 
                  onChange={e => setSnapMode(Number(e.target.value))}
                  className="bg-[#212a30] border border-slate-700 text-white p-1.5 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value={67}>1.00X (67.00px - Canónico)</option>
                  <option value={33.5}>0.50X (33.50px - Medio)</option>
                  <option value={16.75}>0.25X (16.75px - Submódulo)</option>
                  <option value={1}>Libre (1.00px)</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          /* PESTAÑA: MALLA A PARTIR DE 0.25X (HORIZONTAL Y VERTICAL) */
          <div className="flex flex-col gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg text-emerald-300 text-[10px] leading-relaxed">
              <span className="font-bold block mb-0.5 text-emerald-400">⚡ CONTROL DE MALLA A PARTIR DE 0.25X</span>
              Configura o dibuja mallas paramétricas en horizontal y vertical en pasos de 0.25X (16.75px).
            </div>

            {/* 1. Malla Horizontal */}
            <div className="bg-[#212a30] p-3 rounded-lg border border-slate-700/70 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3D80FD]" />
                  Malla Horizontal (Eje Y)
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showGridH} 
                    onChange={e => setShowGridH(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#3D80FD]"></div>
                </label>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] text-slate-400">Paso Horizontal (a partir de 0.25X):</span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={stepH}
                    onChange={e => setStepH(Number(e.target.value))}
                    disabled={!showGridH}
                    className="flex-1 bg-[#171d22] border border-slate-700 text-white p-1.5 rounded text-[11px] disabled:opacity-40"
                  >
                    {STEP_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Malla Vertical */}
            <div className="bg-[#212a30] p-3 rounded-lg border border-slate-700/70 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Malla Vertical (Eje X)
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showGridV} 
                    onChange={e => setShowGridV(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] text-slate-400">Paso Vertical (a partir de 0.25X):</span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={stepV}
                    onChange={e => setStepV(Number(e.target.value))}
                    disabled={!showGridV}
                    className="flex-1 bg-[#171d22] border border-slate-700 text-white p-1.5 rounded text-[11px] disabled:opacity-40"
                  >
                    {STEP_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Ocultar Medidas Base Canónicas (1X, 2X...) */}
            <div className="bg-[#212a30] p-2.5 rounded-lg border border-slate-700/70 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-200 font-bold flex items-center gap-1">
                  {showBaseMeasures ? <Eye size={12} className="text-emerald-400" /> : <EyeOff size={12} className="text-amber-400" />}
                  Medidas Base (1X, 2X...)
                </span>
                <span className="text-[9px] text-slate-400">Oculta 1X, 2X para evitar solapamiento</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showBaseMeasures} 
                  onChange={e => setShowBaseMeasures(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* 4. Color de la Malla Paramétrica */}
            <div className="bg-[#212a30] p-2.5 rounded-lg border border-slate-700/70 flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-400 font-semibold">Color de Líneas de Malla:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setGridColor(c.hex)}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      gridColor.toLowerCase() === c.hex.toLowerCase() 
                        ? 'border-white scale-110 shadow-sm' 
                        : 'border-white/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* 5. CONTROLES DE TRAZO Y OPACIDAD (EXACTO A REFERENCIA) */}
            <div className="bg-[#212a30] p-3 rounded-lg border border-slate-700/70 flex flex-col gap-3">
              {/* GROSOR */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] text-slate-300 font-bold tracking-wider">
                  <span>GROSOR:</span>
                  <span className="font-mono text-emerald-400 font-bold">{strokeWidth}PX</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {STROKE_WIDTH_OPTIONS.map(w => (
                    <button
                      key={w}
                      onClick={() => setStrokeWidth(w)}
                      className={`py-1.5 text-[10px] font-bold rounded border transition-all text-center ${
                        strokeWidth === w 
                          ? 'bg-[#10b981] text-black border-[#10b981] shadow-sm font-black' 
                          : 'bg-[#171d22] text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
              </div>

              {/* ESTILO DE TRAZO */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-300 font-bold tracking-wider">ESTILO DE TRAZO:</span>
                <div className="grid grid-cols-3 gap-1">
                  {DASH_STYLE_OPTIONS_ROW1.map(st => (
                    <button
                      key={st.label}
                      onClick={() => setDashStyle(st.dash)}
                      className={`py-2 px-1 text-[10px] font-bold rounded border transition-all text-center ${
                        dashStyle === st.dash
                          ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981] shadow-sm'
                          : 'bg-[#171d22] text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {DASH_STYLE_OPTIONS_ROW2.map(st => (
                    <button
                      key={st.label}
                      onClick={() => setDashStyle(st.dash)}
                      className={`py-2 px-1 text-[10px] font-bold rounded border transition-all text-center ${
                        dashStyle === st.dash
                          ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981] shadow-sm'
                          : 'bg-[#171d22] text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* OPACIDAD */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] text-slate-300 font-bold tracking-wider">
                  <span>OPACIDAD:</span>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={Math.round(opacity * 100)}
                  onChange={e => setOpacity(Number(e.target.value) / 100)}
                  className="w-full accent-[#10b981] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* 6. Herramienta DIBUJAR LÍNEA DE MALLA A PARTIR DE 0.25X */}
            <div className="bg-[#212a30] p-3 rounded-lg border border-emerald-500/30 flex flex-col gap-2.5">
              <span className="font-bold text-emerald-400 text-[10px] flex items-center gap-1">
                <Pencil size={13} /> DIBUJAR LÍNEA DE MALLA (0.25X)
              </span>

              {/* Selector de Orientación */}
              <div className="grid grid-cols-2 gap-1 bg-[#171d22] p-1 rounded-md border border-slate-700">
                <button
                  onClick={() => setManualAxis('y')}
                  className={`py-1 text-[10px] font-bold rounded transition-colors ${
                    manualAxis === 'y' ? 'bg-[#3D80FD] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  HORIZONTAL (Y)
                </button>
                <button
                  onClick={() => setManualAxis('x')}
                  className={`py-1 text-[10px] font-bold rounded transition-colors ${
                    manualAxis === 'x' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  VERTICAL (X)
                </button>
              </div>

              {/* Coordenada a partir de 0.25X */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Posición a partir de 0.25X:</span>
                  <span className="font-bold text-emerald-400 font-mono">{(manualPosUnits).toFixed(2)}X ({(manualPosUnits * 67).toFixed(1)}px)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setManualPosUnits(p => Math.max(0.25, Number((p - 0.25).toFixed(2))))}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold"
                  >
                    -0.25X
                  </button>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    max="11"
                    value={manualPosUnits}
                    onChange={e => setManualPosUnits(Math.max(0.25, Math.min(11, Number(e.target.value))))}
                    className="flex-1 bg-[#171d22] border border-slate-700 rounded py-1 px-2 text-center text-white font-bold"
                  />
                  <button
                    onClick={() => setManualPosUnits(p => Math.min(11, Number((p + 0.25).toFixed(2))))}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-bold"
                  >
                    +0.25X
                  </button>
                </div>
              </div>

              {/* Selector de Color de Línea Dibujada */}
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Color Trazo:</span>
                <div className="flex gap-1">
                  {['#06B6D4', '#EF4444', '#10B981', '#F59E0B', '#3D80FD', '#FFFFFF'].map(c => (
                    <button
                      key={c}
                      onClick={() => setManualColor(c)}
                      className={`w-4 h-4 rounded-full border ${manualColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Botón Trazar */}
              <button
                onClick={handleCreateManualLine}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus size={14} /> TRAZAR LÍNEA EN {manualPosUnits}X
              </button>

              {/* Modo Interactivo de Clic en Lienzo con Snap 0.25X */}
              <button
                onClick={() => {
                  setIsDrawLineMode(!isDrawLineMode);
                  setDrawLineAxis(manualAxis);
                }}
                className={`w-full py-2 border rounded-lg transition-all font-bold flex items-center justify-center gap-1.5 text-[10px] ${
                  isDrawLineMode 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 animate-pulse' 
                    : 'bg-[#171d22] text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                <Pencil size={13} /> {isDrawLineMode ? 'MODO DIBUJO ACTIVO (CLIC EN CANVAS)' : 'TRAZAR CON CLIC EN CANVAS (0.25X)'}
              </button>
            </div>

            {/* 7. GESTIÓN Y ELIMINACIÓN DE LÍNEAS INDIVIDUALES */}
            {customDrawnLines.length > 0 && (
              <div className="flex flex-col gap-2 bg-[#212a30] p-2.5 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 border-b border-slate-700/60 pb-1.5">
                  <span>LÍNEAS DIBUJADAS ({customDrawnLines.length})</span>
                  <button
                    onClick={onClearDrawnLines}
                    className="text-[9px] text-red-400 hover:text-red-300 font-normal px-1.5 py-0.5 rounded hover:bg-red-500/10 transition-colors"
                  >
                    Borrar todas
                  </button>
                </div>

                <div className="max-h-44 overflow-y-auto flex flex-col gap-1 custom-scrollbar pr-0.5">
                  {customDrawnLines.map(line => {
                    const isSel = selectedDrawnLineId === line.id;
                    return (
                      <div
                        key={line.id}
                        onClick={() => onSelectDrawnLine(isSel ? null : line.id)}
                        className={`flex items-center justify-between p-1.5 rounded cursor-pointer border transition-all ${
                          isSel
                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm'
                            : 'bg-[#171d22] border-slate-700/60 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20"
                            style={{ backgroundColor: line.color }}
                          />
                          <span className="font-bold text-[10px]">
                            {line.axis === 'x' ? 'VERT (X)' : 'HORIZ (Y)'}
                          </span>
                          <span className="font-mono text-emerald-400 font-bold text-[10px]">
                            {line.posUnits.toFixed(2)}X
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {isSel && (
                            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/20 px-1 py-0.5 rounded">
                              Activa
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSpecificLine(line.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                            title="Eliminar esta línea específica"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
