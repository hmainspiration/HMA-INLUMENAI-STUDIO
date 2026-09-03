import React, { useState } from 'react';
import {
  RotateCw,
  Layers,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  PanelRightClose,
  ChevronDown,
  ChevronRight,
  Magnet,
  ArrowUp,
  ArrowDown,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  Link,
  Settings,
  Link2,
  Palette,
  Sparkles,
  Sliders,
  CheckSquare,
  Square as SquareIcon,
  Move,
  Hash,
  Ruler,
  Maximize2,
  RefreshCw,
  Compass
} from 'lucide-react';
import { HMAPiece, MoveStepMode } from '../../types/hma';
import { MODULE_PX } from '../../data/hmaDefinitions';

interface InspectorPanelProps {
  selectedPiece: HMAPiece | null;
  pieces: HMAPiece[];
  selectedPieceId: string | null;
  onSelectPiece: (id: string | null) => void;
  onSelectAllPieces?: () => void;
  onUpdatePiece: (updated: Partial<HMAPiece>) => void;
  onUpdateAllPieces?: (updated: Partial<HMAPiece>) => void;
  onRotateGroup: (deltaDeg: number) => void;
  onMoveGroup?: (dx: number, dy: number) => void;
  onDuplicatePiece: (id: string) => void;
  onDeletePiece: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  colorLuz: string;
  colorProfundo: string;
  onClose?: () => void;
  moveStepMode?: MoveStepMode;
  onChangeMoveStepMode?: (mode: MoveStepMode) => void;
  showTechnicalGuides?: boolean;
  onToggleTechnicalGuides?: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedPiece,
  pieces = [],
  selectedPieceId,
  onSelectPiece,
  onSelectAllPieces,
  onUpdatePiece,
  onUpdateAllPieces,
  onRotateGroup,
  onMoveGroup,
  onDuplicatePiece,
  onDeletePiece,
  onMoveLayer,
  colorLuz,
  colorProfundo,
  onClose,
  moveStepMode = '1.0M',
  onChangeMoveStepMode,
  showTechnicalGuides = true,
  onToggleTechnicalGuides
}) => {
  // Collapsible dropdown states for each section
  const [openSections, setOpenSections] = useState({
    rotateGroup: true,
    identification: true,
    moveModes: true,
    dimensions: true,
    rotation: true,
    centroid: true,
    layers: false,
    coupling: false,
    tones: true,
    rules: false
  });

  const [snapEnabled, setSnapEnabled] = useState(true);
  const [targetPieceId, setTargetPieceId] = useState<string>(
    pieces.find((p) => p.id !== selectedPieceId)?.id || ''
  );

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAll = (open: boolean) => {
    setOpenSections({
      rotateGroup: open,
      identification: open,
      moveModes: open,
      dimensions: open,
      rotation: open,
      centroid: open,
      layers: open,
      coupling: open,
      tones: open,
      rules: open
    });
  };

  const isAllSelected = selectedPieceId === 'ALL_PIECES';

  // Metrics for selected piece
  const pieceWidth = selectedPiece
    ? Math.round(selectedPiece.widthM * MODULE_PX * selectedPiece.scaleX)
    : 0;
  const pieceHeight = selectedPiece
    ? Math.round(selectedPiece.heightM * MODULE_PX * selectedPiece.scaleY)
    : 0;

  const adjustX = (val: number) => {
    if (isAllSelected && onMoveGroup) {
      onMoveGroup(val, 0);
    } else if (selectedPiece) {
      onUpdatePiece({ x: Math.round((selectedPiece.x + val) * 100) / 100 });
    }
  };

  const adjustY = (val: number) => {
    if (isAllSelected && onMoveGroup) {
      onMoveGroup(0, val);
    } else if (selectedPiece) {
      onUpdatePiece({ y: Math.round((selectedPiece.y + val) * 100) / 100 });
    }
  };

  const setRot = (val: number) => {
    if (selectedPiece) {
      onUpdatePiece({ rotation: ((val % 360) + 360) % 360 });
    }
  };

  const adjustRot = (val: number) => {
    if (selectedPiece) {
      onUpdatePiece({ rotation: (((selectedPiece.rotation + val) % 360) + 360) % 360 });
    }
  };

  // Step movement helper based on active mode
  const currentStepPx =
    moveStepMode === 'free'
      ? 1
      : moveStepMode === '0.25M'
      ? MODULE_PX / 4
      : moveStepMode === '0.5M'
      ? MODULE_PX / 2
      : MODULE_PX;

  return (
    <aside className="w-[380px] border-l border-white/10 bg-[#0c162d]/95 backdrop-blur-md flex flex-col h-full overflow-hidden shrink-0 select-none">
      {/* HEADER */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#060C04]">
        <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Inspector de Formas</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Quick Select All Toggle */}
          <button
            onClick={() => {
              if (onSelectAllPieces) {
                if (isAllSelected) {
                  onSelectPiece(null);
                } else {
                  onSelectAllPieces();
                }
              }
            }}
            title={isAllSelected ? 'Deseleccionar grupo' : 'Seleccionar todas las formas'}
            className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded transition-colors ${
              isAllSelected
                ? 'bg-cyan-500 text-black font-bold shadow-sm'
                : 'bg-[#1e2943] text-slate-300 hover:text-cyan-300 border border-white/10'
            }`}
          >
            {isAllSelected ? <CheckSquare className="w-3.5 h-3.5" /> : <SquareIcon className="w-3.5 h-3.5" />}
            <span>{isAllSelected ? 'Todas (ON)' : 'Todas'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Subheader: Expand/Collapse All and Global Snap Status */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#060C04]/60 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span>Menús Desplegables:</span>
          <button
            onClick={() => toggleAll(true)}
            className="hover:text-cyan-300 underline transition-colors"
          >
            Expandir
          </button>
          <span>•</span>
          <button
            onClick={() => toggleAll(false)}
            className="hover:text-cyan-300 underline transition-colors"
          >
            Colapsar
          </button>
        </div>
        {onToggleTechnicalGuides && (
          <button
            onClick={onToggleTechnicalGuides}
            className={`flex items-center gap-1 transition-colors ${
              showTechnicalGuides ? 'text-emerald-400 font-bold' : 'text-slate-500'
            }`}
            title="Mostrar/Ocultar guías técnicas GAP y cotas de fondo"
          >
            <Ruler className="w-3 h-3" />
            <span>Guías GAP</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {/* ========================================================================= */}
        {/* SECCIÓN 1: ROTAR GRUPO COMPLETO (DESPLEGABLE & 100% FUNCIONAL) */}
        {/* ========================================================================= */}
        <div className="bg-[#111c38] rounded-xl border border-white/5 overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection('rotateGroup')}
            className="w-full p-3 bg-[#162244]/80 flex items-center justify-between text-xs font-mono text-slate-200 font-bold hover:text-cyan-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rotar Grupo Completo (Isotipo Matriz)</span>
            </div>
            {openSections.rotateGroup ? (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.rotateGroup && (
            <div className="p-4 space-y-3 pt-3 animate-fadeIn">
              <p className="text-[10px] text-slate-400 leading-tight">
                Gira todas las {pieces.length} formas al unísono alrededor del centroide canónico (0,0 / 413,413px).
              </p>
              {/* Quick Rotation Buttons (Fully Functional) */}
              <div className="grid grid-cols-5 gap-1.5">
                {[-90, -45, -15, -5, 5, 15, 45, 90, 180].map((val) => (
                  <button
                    key={val}
                    onClick={() => onRotateGroup(val)}
                    className="py-1.5 rounded bg-[#1e2943] hover:bg-cyan-600 hover:text-white border border-white/5 text-xs font-mono text-slate-200 transition-colors active:scale-95 text-center font-semibold"
                    title={`Rotar todo el grupo ${val > 0 ? '+' : ''}${val}°`}
                  >
                    {val > 0 ? `+${val}` : val}°
                  </button>
                ))}
                <button
                  onClick={() => onRotateGroup(-selectedPiece?.rotation || -45)}
                  className="py-1.5 rounded bg-[#2a1b38] hover:bg-purple-600 text-purple-200 border border-purple-500/20 text-[10px] font-mono font-bold"
                  title="Alinear al eje horizontal 0°"
                >
                  0° Flat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECCIÓN 2: MODOS DE MOVIMIENTO (LIBRE, 1.0M, 0.5M, 0.25M) */}
        {/* ========================================================================= */}
        <div className="bg-[#111c38] rounded-xl border border-white/5 overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection('moveModes')}
            className="w-full p-3 bg-[#162244]/80 flex items-center justify-between text-xs font-mono text-slate-200 font-bold hover:text-cyan-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-emerald-400" />
              <span>Modo de Movimiento & Snapping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                {moveStepMode}
              </span>
              {openSections.moveModes ? (
                <ChevronDown className="w-4 h-4 text-emerald-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </button>

          {openSections.moveModes && (
            <div className="p-4 space-y-3 pt-3 animate-fadeIn">
              <p className="text-[10px] text-slate-400 leading-tight">
                Controla la precisión de acoplamiento al arrastrar y desplazar sobre la plantilla:
              </p>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
                {(
                  [
                    { mode: 'free', label: 'Libre', desc: '1px continuo' },
                    { mode: '1.0M', label: '1.0M', desc: '67px (Std)' },
                    { mode: '0.5M', label: '0.5M', desc: '33.5px' },
                    { mode: '0.25M', label: '0.25M', desc: '16.75px' }
                  ] as const
                ).map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => onChangeMoveStepMode && onChangeMoveStepMode(item.mode)}
                    className={`py-2 px-1 rounded-lg border flex flex-col items-center justify-center transition-all ${
                      moveStepMode === item.mode
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold shadow-sm'
                        : 'bg-[#1e2943] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#283554]'
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
        {/* SECCIÓN 3: PIEZA SELECCIONADA / ESTADO GRUPAL */}
        {/* ========================================================================= */}
        <div className="bg-[#111c38] rounded-xl border border-white/5 overflow-hidden shadow-lg">
          <div className="p-3.5 bg-[#162244]/80 flex items-center justify-between">
            {isAllSelected ? (
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded bg-cyan-400 flex items-center justify-center text-black font-bold text-[9px]">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-mono">
                    TODAS LAS FORMAS ({pieces.length})
                  </div>
                  <div className="text-[9px] text-cyan-300 font-mono">Modo de Edición Global</div>
                </div>
              </div>
            ) : selectedPiece ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-sm"
                  style={{ backgroundColor: selectedPiece.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">{selectedPiece.name}</span>
                    <span
                      className={`text-[8px] uppercase px-1.5 py-0.5 rounded font-bold ${
                        selectedPiece.category === 'base'
                          ? 'bg-blue-600/30 text-blue-300'
                          : 'bg-cyan-600/30 text-cyan-300'
                      }`}
                    >
                      {selectedPiece.category === 'base' ? 'HEMISFERIO PROFUNDO' : 'HEMISFERIO LUZ'}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {selectedPiece.shapeType} ({selectedPiece.scaleY}x)
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs font-mono text-slate-400">
                Ninguna pieza individual seleccionada
              </div>
            )}

            {selectedPiece && !isAllSelected && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdatePiece({ visible: !selectedPiece.visible })}
                  title={selectedPiece.visible ? 'Ocultar pieza' : 'Mostrar pieza'}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10"
                >
                  {selectedPiece.visible ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-slate-600" />}
                </button>
                <button
                  onClick={() => onUpdatePiece({ locked: !selectedPiece.locked })}
                  title={selectedPiece.locked ? 'Desbloquear' : 'Bloquear posición'}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10"
                >
                  {selectedPiece.locked ? <Lock className="w-4 h-4 text-red-400" /> : <Unlock className="w-4 h-4 text-slate-400" />}
                </button>
                <button
                  onClick={() => onDuplicatePiece(selectedPiece.id)}
                  title="Duplicar pieza"
                  className="text-slate-400 hover:text-cyan-300 p-1 rounded hover:bg-white/10"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeletePiece(selectedPiece.id)}
                  title="Eliminar pieza"
                  className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-white/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECCIÓN 4: DIMENSIONES DE PIEZA (DESPLEGABLE) */}
        {/* ========================================================================= */}
        {selectedPiece && (
          <div className="bg-[#111c38] rounded-xl border border-white/5 overflow-hidden shadow-lg transition-all">
            <button
              onClick={() => toggleSection('dimensions')}
              className="w-full p-3 bg-[#162244]/80 flex items-center justify-between text-xs font-mono text-slate-200 font-bold hover:text-cyan-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span>Dimensiones de Pieza (Ancho x Alto)</span>
              </div>
              {openSections.dimensions ? (
                <ChevronDown className="w-4 h-4 text-cyan-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {openSections.dimensions && (
              <div className="p-4 space-y-4 pt-3 animate-fadeIn">
                {/* Ancho */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">
                      Ancho (W){' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({selectedPiece.widthM}M)
                      </span>
                    </span>
                    <div className="bg-[#1e2943] border border-white/10 rounded px-2 py-0.5 text-xs text-cyan-300 font-mono">
                      {pieceWidth} <span className="text-cyan-600">px</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {[0.5, 1.0, 1.5, 2.0].map((val) => (
                      <button
                        key={val}
                        onClick={() => onUpdatePiece({ widthM: val, scaleX: 1 })}
                        className={`flex-1 py-1.5 rounded border text-xs font-mono transition-colors ${
                          selectedPiece.widthM === val
                            ? 'bg-cyan-600 border-cyan-500 text-white font-bold'
                            : 'bg-[#1e2943] border-white/5 text-slate-400 hover:bg-[#283554]'
                        }`}
                      >
                        {val.toFixed(1)}M {val === 1.0 ? '(Std)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alto */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">
                      Alto / Longitud (H){' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({(selectedPiece.heightM * selectedPiece.scaleY).toFixed(1)}M)
                      </span>
                    </span>
                    <div className="bg-[#1e2943] border border-white/10 rounded px-2 py-0.5 text-xs text-cyan-300 font-mono">
                      {pieceHeight} <span className="text-cyan-600">px</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 2.5, 3, 3.2, 4, 6].map((val) => (
                      <button
                        key={val}
                        onClick={() => onUpdatePiece({ scaleY: val / selectedPiece.heightM })}
                        className={`py-1.5 rounded border text-xs font-mono transition-colors ${
                          Math.abs(selectedPiece.heightM * selectedPiece.scaleY - val) < 0.05
                            ? 'bg-blue-600 border-blue-500 text-white font-bold'
                            : 'bg-[#1e2943] border-white/5 text-slate-400 hover:bg-[#283554]'
                        }`}
                      >
                        {val}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECCIÓN 5: ANGULO DE ROTACION (DESPLEGABLE) */}
        {/* ========================================================================= */}
        {selectedPiece && (
          <div className="bg-[#111c38] rounded-xl border border-white/5 overflow-hidden shadow-lg transition-all">
            <button
              onClick={() => toggleSection('rotation')}
              className="w-full p-3 bg-[#162244]/80 flex items-center justify-between text-xs font-mono text-slate-200 font-bold hover:text-cyan-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Ángulo de Rotación (Editable)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {Math.round(selectedPiece.rotation)}°
                </span>
                {openSections.rotation ? (
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {openSections.rotation && (
              <div className="p-4 space-y-3 pt-3 animate-fadeIn">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 font-mono">Valor Angular:</span>
                  <div className="bg-[#1e2943] border border-white/10 rounded px-2 py-1 text-xs text-white font-mono flex items-center gap-1">
                    <input
                      type="number"
                      value={Math.round(selectedPiece.rotation)}
                      onChange={(e) => setRot(parseFloat(e.target.value) || 0)}
                      className="bg-transparent w-14 text-right focus:outline-none text-cyan-300 font-bold"
                    />
                    <span className="text-slate-500">°</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[-45, -15, -5, -1, 1, 5, 15, 45].map((val) => (
                    <button
                      key={val}
                      onClick={() => adjustRot(val)}
                      className="py-1.5 rounded bg-[#1e2943] hover:bg-[#283554] border border-white/5 text-xs font-mono text-slate-300 active:scale-95 transition-transform"
                    >
                      {val > 0 ? `+${val}` : val}°
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedPiece.rotation}
                  onChange={(e) => setRot(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 mt-2"
                />

                <div className="pt-2">
                  <div className="text-[10px] text-slate-500 mb-1.5 font-mono">
                    Ángulos Canónicos HMA:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[-90, -45, -20, 0, 20, 35, 45, 90, 135, 180, 315].map((val) => {
                      const canonicalVal = ((val % 360) + 360) % 360;
                      const isCurrent =
                        Math.abs((((selectedPiece.rotation % 360) + 360) % 360) - canonicalVal) < 1;
                      return (
                        <button
                          key={val}
                          onClick={() => setRot(val)}
                          className={`px-2 py-1 rounded border text-[10px] font-mono transition-colors ${
                            isCurrent
                              ? 'bg-blue-600 border-blue-500 text-white font-bold'
                              : 'bg-[#1e2943] border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {val > 0 ? `+${val}` : val}°
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECCIÓN 6: POSICIÓN CENTROIDE & MOVIMIENTOS EXACTOS (DESPLEGABLE) */}
        {/* ========================================================================= */}
        <div className="bg-[#111c38] rounded-xl border border-white/5 overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection('centroid')}
            className="w-full p-3 bg-[#162244]/80 flex items-center justify-between text-xs font-mono text-slate-200 font-bold hover:text-cyan-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Posición Centroide (X / Y Editables)</span>
            </div>
            {openSections.centroid ? (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.centroid && (
            <div className="p-4 space-y-4 pt-3 animate-fadeIn">
              <div className="grid grid-cols-2 gap-3">
                {/* EJE X */}
                <div className="bg-[#1a233a] p-3 rounded-lg border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">Eje X</span>
                    <span className="text-[10px] bg-[#0c162d] px-1.5 py-0.5 rounded font-mono font-bold text-cyan-300 border border-white/5">
                      {selectedPiece ? selectedPiece.x.toFixed(1) : '0.0'} px
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[-1, -0.5, -0.25, 0.25, 0.5, 1].map((m) => (
                      <button
                        key={m}
                        onClick={() => adjustX(m * MODULE_PX)}
                        className="py-1 bg-[#23314f] hover:bg-[#2c3d63] rounded text-[9px] text-cyan-300 font-mono active:scale-95"
                      >
                        {m > 0 ? '+' : ''}
                        {m}M
                      </button>
                    ))}
                    <button
                      onClick={() => adjustX(-1)}
                      className="py-1 bg-[#1e2943] hover:bg-[#283554] rounded text-[9px] text-slate-400"
                    >
                      -1px
                    </button>
                    <button
                      onClick={() => adjustX(selectedPiece ? -selectedPiece.x : 0)}
                      className="py-1 bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 rounded text-[9px] font-bold"
                    >
                      X=0
                    </button>
                    <button
                      onClick={() => adjustX(1)}
                      className="py-1 bg-[#1e2943] hover:bg-[#283554] rounded text-[9px] text-slate-400"
                    >
                      +1px
                    </button>
                  </div>
                </div>

                {/* EJE Y */}
                <div className="bg-[#1a233a] p-3 rounded-lg border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">Eje Y</span>
                    <span className="text-[10px] bg-[#0c162d] px-1.5 py-0.5 rounded font-mono font-bold text-cyan-300 border border-white/5">
                      {selectedPiece ? selectedPiece.y.toFixed(1) : '0.0'} px
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[-1, -0.5, -0.25, 0.25, 0.5, 1].map((m) => (
                      <button
                        key={m}
                        onClick={() => adjustY(m * MODULE_PX)}
                        className="py-1 bg-[#23314f] hover:bg-[#2c3d63] rounded text-[9px] text-cyan-300 font-mono active:scale-95"
                      >
                        {m > 0 ? '+' : ''}
                        {m}M
                      </button>
                    ))}
                    <button
                      onClick={() => adjustY(-1)}
                      className="py-1 bg-[#1e2943] hover:bg-[#283554] rounded text-[9px] text-slate-400"
                    >
                      -1px
                    </button>
                    <button
                      onClick={() => adjustY(selectedPiece ? -selectedPiece.y : 0)}
                      className="py-1 bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 rounded text-[9px] font-bold"
                    >
                      Y=0
                    </button>
                    <button
                      onClick={() => adjustY(1)}
                      className="py-1 bg-[#1e2943] hover:bg-[#283554] rounded text-[9px] text-slate-400"
                    >
                      +1px
                    </button>
                  </div>
                </div>
              </div>

              {selectedPiece && (
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => onUpdatePiece({ x: 0 })}
                    className="py-1.5 bg-[#1e2943] hover:bg-[#283554] rounded border border-white/5 text-[10px] font-mono text-slate-300 hover:text-white"
                  >
                    Centrar X (0)
                  </button>
                  <button
                    onClick={() => onUpdatePiece({ y: 0 })}
                    className="py-1.5 bg-[#1e2943] hover:bg-[#283554] rounded border border-white/5 text-[10px] font-mono text-slate-300 hover:text-white"
                  >
                    Centrar Y (0)
                  </button>
                  <button
                    onClick={() => onUpdatePiece({ scaleX: selectedPiece.scaleX * -1 })}
                    className="py-1.5 bg-[#1e2943] hover:bg-[#283554] rounded border border-white/5 text-[10px] font-mono text-slate-300 hover:text-white"
                  >
                    Flip X
                  </button>
                  <button
                    onClick={() => onUpdatePiece({ scaleY: selectedPiece.scaleY * -1 })}
                    className="py-1.5 bg-[#1e2943] hover:bg-[#283554] rounded border border-white/5 text-[10px] font-mono text-slate-300 hover:text-white"
                  >
                    Flip Y
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECCIÓN 7: ORDEN DE CAPAS (DESPLEGABLE) */}
        {/* ========================================================================= */}
        {selectedPiece && (
          <div className="bg-[#111c38] rounded-xl border border-white/5 overflow-hidden shadow-lg transition-all">
            <button
              onClick={() => toggleSection('layers')}
              className="w-full p-3 bg-[#162244]/80 flex items-center justify-between text-xs font-mono text-slate-200 font-bold hover:text-cyan-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Orden de Capas (Z-Index / Profundidad)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono">
                  Capa {selectedPiece.zIndex} de {pieces.length}
                </span>
                {openSections.layers ? (
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {openSections.layers && (
              <div className="p-4 space-y-3 pt-3 animate-fadeIn">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onMoveLayer(selectedPiece.id, 'top')}
                    className="py-2 rounded bg-[#162138] hover:bg-[#202f50] border border-white/5 text-cyan-400 text-xs font-bold flex justify-center items-center gap-2"
                  >
                    <ArrowUp className="w-3.5 h-3.5" /> Traer al Frente
                  </button>
                  <button
                    onClick={() => onMoveLayer(selectedPiece.id, 'bottom')}
                    className="py-2 rounded bg-[#162138] hover:bg-[#202f50] border border-white/5 text-slate-300 text-xs font-bold flex justify-center items-center gap-2"
                  >
                    <ArrowDown className="w-3.5 h-3.5" /> Enviar al Fondo
                  </button>
                  <button
                    onClick={() => onMoveLayer(selectedPiece.id, 'up')}
                    className="py-2 rounded bg-[#162138] hover:bg-[#202f50] border border-white/5 text-blue-400 text-xs flex justify-center items-center gap-2"
                  >
                    <ArrowUp className="w-3.5 h-3.5" /> Subir 1 Capa
                  </button>
                  <button
                    onClick={() => onMoveLayer(selectedPiece.id, 'down')}
                    className="py-2 rounded bg-[#162138] hover:bg-[#202f50] border border-white/5 text-blue-400 text-xs flex justify-center items-center gap-2"
                  >
                    <ArrowDown className="w-3.5 h-3.5" /> Bajar 1 Capa
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECCIÓN 8: ACOPLAMIENTO & UNIÓN DE FORMAS (DESPLEGABLE) */}
        {/* ========================================================================= */}
        {selectedPiece && (
          <div className="bg-[#111c38] rounded-xl border border-white/5 overflow-hidden shadow-lg transition-all">
            <button
              onClick={() => toggleSection('coupling')}
              className="w-full p-3 bg-[#162244]/80 flex items-center justify-between text-xs font-mono text-slate-200 font-bold hover:text-cyan-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Magnet className="w-3.5 h-3.5 text-cyan-400" />
                <span>Acoplamiento & Unión de Formas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-green-400 bg-green-500/10 border border-green-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                  Smart Snap
                </span>
                {openSections.coupling ? (
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </button>

            {openSections.coupling && (
              <div className="p-4 space-y-3 pt-3 animate-fadeIn">
                <div className="space-y-1.5">
                  <div className="text-xs text-slate-400 font-mono">Unir con Forma de Referencia:</div>
                  <select
                    value={targetPieceId}
                    onChange={(e) => setTargetPieceId(e.target.value)}
                    className="w-full bg-[#162138] border border-white/10 text-xs text-white p-2 rounded font-mono outline-none focus:border-cyan-500"
                  >
                    {pieces
                      .filter((p) => p.id !== selectedPiece.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (x: {p.x.toFixed(0)}, y: {p.y.toFixed(0)})
                        </option>
                      ))}
                  </select>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        const target = pieces.find((p) => p.id === targetPieceId);
                        if (target) onUpdatePiece({ x: target.x - MODULE_PX, y: target.y });
                      }}
                      className="py-1.5 bg-[#162138] hover:bg-cyan-900/40 border border-white/5 rounded text-[10px] text-slate-300 hover:text-cyan-300 font-mono"
                    >
                      |← Acoplar Izq.
                    </button>
                    <button
                      onClick={() => {
                        const target = pieces.find((p) => p.id === targetPieceId);
                        if (target) onUpdatePiece({ x: target.x + MODULE_PX, y: target.y });
                      }}
                      className="py-1.5 bg-[#162138] hover:bg-cyan-900/40 border border-white/5 rounded text-[10px] text-slate-300 hover:text-cyan-300 font-mono"
                    >
                      →| Acoplar Der.
                    </button>
                    <button
                      onClick={() => {
                        const target = pieces.find((p) => p.id === targetPieceId);
                        if (target) onUpdatePiece({ x: target.x, y: target.y - MODULE_PX });
                      }}
                      className="py-1.5 bg-[#162138] hover:bg-cyan-900/40 border border-white/5 rounded text-[10px] text-slate-300 hover:text-cyan-300 font-mono"
                    >
                      ↑ Tangente Arriba
                    </button>
                    <button
                      onClick={() => {
                        const target = pieces.find((p) => p.id === targetPieceId);
                        if (target) onUpdatePiece({ x: target.x, y: target.y + MODULE_PX });
                      }}
                      className="py-1.5 bg-[#162138] hover:bg-cyan-900/40 border border-white/5 rounded text-[10px] text-slate-300 hover:text-cyan-300 font-mono"
                    >
                      ↓ Tangente Abajo
                    </button>
                    <button
                      onClick={() => {
                        const target = pieces.find((p) => p.id === targetPieceId);
                        if (target) onUpdatePiece({ x: target.x });
                      }}
                      className="py-1.5 bg-[#162138] border border-white/5 rounded text-[10px] text-blue-400 flex items-center justify-center gap-1 hover:text-blue-300 font-mono"
                    >
                      <AlignHorizontalDistributeCenter className="w-3.5 h-3.5" /> Alinear Centro X
                    </button>
                    <button
                      onClick={() => {
                        const target = pieces.find((p) => p.id === targetPieceId);
                        if (target) onUpdatePiece({ y: target.y });
                      }}
                      className="py-1.5 bg-[#162138] border border-white/5 rounded text-[10px] text-blue-400 flex items-center justify-center gap-1 hover:text-blue-300 font-mono"
                    >
                      <AlignVerticalDistributeCenter className="w-3.5 h-3.5" /> Alinear Centro Y
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECCIÓN 9: ASIGNACION TONAL OFICIAL & WIREFRAME (DESPLEGABLE) */}
        {/* ========================================================================= */}
        <div className="bg-[#111c38] rounded-xl border border-white/5 overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection('tones')}
            className="w-full p-3 bg-[#162244]/80 flex items-center justify-between text-xs font-mono text-slate-200 font-bold hover:text-cyan-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Asignación Tonal Oficial & Estilos</span>
            </div>
            {openSections.tones ? (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.tones && (
            <div className="p-4 space-y-3 pt-3 animate-fadeIn">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (isAllSelected && onUpdateAllPieces) {
                      onUpdateAllPieces({ color: colorLuz });
                    } else if (selectedPiece) {
                      onUpdatePiece({ color: colorLuz });
                    }
                  }}
                  className={`p-2.5 rounded-lg border ${
                    selectedPiece?.color === colorLuz
                      ? 'border-cyan-500 bg-cyan-900/30 shadow-sm'
                      : 'border-white/5 bg-[#162138] hover:bg-[#202f50]'
                  } flex items-center gap-2.5 transition-colors`}
                >
                  <div
                    className="w-5 h-5 rounded-full shrink-0 border border-white/20"
                    style={{ backgroundColor: colorLuz }}
                  />
                  <div className="text-left font-mono">
                    <div className="text-[11px] text-white font-bold">Tono Luz</div>
                    <div className="text-[9px] text-slate-400 uppercase">{colorLuz}</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (isAllSelected && onUpdateAllPieces) {
                      onUpdateAllPieces({ color: colorProfundo });
                    } else if (selectedPiece) {
                      onUpdatePiece({ color: colorProfundo });
                    }
                  }}
                  className={`p-2.5 rounded-lg border ${
                    selectedPiece?.color === colorProfundo
                      ? 'border-blue-500 bg-blue-900/30 shadow-sm'
                      : 'border-white/5 bg-[#162138] hover:bg-[#202f50]'
                  } flex items-center gap-2.5 transition-colors`}
                >
                  <div
                    className="w-5 h-5 rounded-full shrink-0 border border-white/20"
                    style={{ backgroundColor: colorProfundo }}
                  />
                  <div className="text-left font-mono">
                    <div className="text-[11px] text-white font-bold">Tono Profundo</div>
                    <div className="text-[9px] text-slate-400 uppercase">{colorProfundo}</div>
                  </div>
                </button>
              </div>

              {/* Color Libre & Wireframe Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-400 font-mono">Color:</span>
                <input
                  type="color"
                  value={selectedPiece?.color || colorLuz}
                  onChange={(e) => {
                    if (isAllSelected && onUpdateAllPieces) {
                      onUpdateAllPieces({ color: e.target.value });
                    } else if (selectedPiece) {
                      onUpdatePiece({ color: e.target.value });
                    }
                  }}
                  className="w-7 h-7 rounded border-none bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedPiece?.color || colorLuz}
                  onChange={(e) => {
                    if (isAllSelected && onUpdateAllPieces) {
                      onUpdateAllPieces({ color: e.target.value });
                    } else if (selectedPiece) {
                      onUpdatePiece({ color: e.target.value });
                    }
                  }}
                  className="flex-1 bg-[#0c162d] border border-white/10 rounded px-2 py-1 text-[10px] text-white uppercase font-mono"
                />
                <button
                  onClick={() => {
                    if (isAllSelected && onUpdateAllPieces) {
                      const allWire = pieces.every((p) => p.wireframe);
                      onUpdateAllPieces({ wireframe: !allWire });
                    } else if (selectedPiece) {
                      onUpdatePiece({ wireframe: !selectedPiece.wireframe });
                    }
                  }}
                  className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold transition-colors ${
                    selectedPiece?.wireframe
                      ? 'bg-cyan-500 text-black shadow-sm'
                      : 'bg-[#162138] text-slate-300 border border-white/10 hover:bg-[#202f50]'
                  }`}
                  title="Modo Wireframe Vectorial"
                >
                  {selectedPiece?.wireframe ? 'WIRE (ON)' : 'WIRE'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECCIÓN 10: REGLAS AUTOMÁTICAS DE COLOR (DESPLEGABLE) */}
        {/* ========================================================================= */}
        <div className="bg-[#111c38] rounded-xl border border-white/5 overflow-hidden shadow-lg transition-all">
          <button
            onClick={() => toggleSection('rules')}
            className="w-full p-3 bg-[#162244]/80 flex items-center justify-between text-xs font-mono text-slate-200 font-bold hover:text-cyan-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reglas Automáticas & Bipedismo</span>
            </div>
            {openSections.rules ? (
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {openSections.rules && (
            <div className="p-4 space-y-3 pt-3 animate-fadeIn">
              <button
                onClick={() => {
                  if (onUpdateAllPieces) {
                    pieces.forEach((p) => {
                      const isUpper = p.category === 'upper' || parseInt(p.id.replace(/\D/g, '') || '0') <= 6;
                      onUpdatePiece({
                        color: isUpper ? colorLuz : colorProfundo
                      });
                    });
                  }
                }}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Palette className="w-3.5 h-3.5" /> Aplicar Regla Bípeda Canónica
              </button>
              <p className="text-[10px] text-slate-400 leading-tight">
                Asigna automáticamente Tono Luz a las formas superiores (F-01..06) y Tono Profundo a las formas inferiores (F-07..13) del sistema canónico.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER INVENTARIO */}
      <div className="p-3 border-t border-white/10 bg-[#060C04] flex items-center justify-between">
        <div className="text-xs font-bold text-slate-300 flex flex-col font-mono">
          INVENTARIO DE FORMAS
          <span className="text-cyan-400">({pieces.length} PIEZAS ACTIVAS)</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSelectAllPieces && onSelectAllPieces()}
            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-mono font-bold rounded shadow-sm"
          >
            Seleccionar Todo
          </button>
          <button
            onClick={() => onSelectPiece(null)}
            className="px-2 py-1 bg-[#162138] border border-white/10 text-slate-300 hover:text-white text-[10px] font-mono rounded flex items-center justify-center"
          >
            Limpiar
          </button>
        </div>
      </div>
    </aside>
  );
};
