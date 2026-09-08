import React, { useState } from 'react';
import {
  X,
  Sliders,
  Palette,
  Sparkles,
  RotateCcw,
  Check,
  Eye,
  EyeOff,
  Compass,
  Bookmark,
  Lock,
  Unlock
} from 'lucide-react';
import { CustomGridLine } from '../../types/matrix';
import {
  GUIDE_COLOR_PRESETS,
  STROKE_DASH_OPTIONS,
  DEFAULT_MAIN_LINE_COLOR,
  DEFAULT_SUB_LINE_COLOR
} from '../../utils/matrixGridUtils';

interface MatrixGuidesManagerProps {
  lines: Record<string, CustomGridLine>;
  selectedLineId: string | null;
  onSelectLine: (id: string | null) => void;
  onUpdateLine: (id: string, updates: Partial<CustomGridLine>) => void;
  onBatchUpdateLines: (updates: Record<string, Partial<CustomGridLine>>) => void;
  onResetAllLines: () => void;
  onClose: () => void;
  showNotification: (msg: string, type?: 'success' | 'info' | 'error') => void;
  guidesLocked?: boolean;
  onToggleGuidesLocked?: () => void;
}

export const MatrixGuidesManager: React.FC<MatrixGuidesManagerProps> = ({
  lines,
  selectedLineId,
  onSelectLine,
  onUpdateLine,
  onBatchUpdateLines,
  onResetAllLines,
  onClose,
  showNotification,
  guidesLocked = true,
  onToggleGuidesLocked
}) => {
  const [activeTab, setActiveTab] = useState<'line' | 'presets' | 'customList'>('line');
  const [filterAxis, setFilterAxis] = useState<'all' | 'x' | 'y'>('all');
  const [filterType, setFilterType] = useState<'all' | 'main' | 'sub'>('all');

  const selectedLine = selectedLineId ? lines[selectedLineId] : null;

  // Customized lines list
  const allLines = Object.values(lines) as CustomGridLine[];
  const customizedLines = allLines.filter((l) => l.isCustomized);

  // Filtered lines for dropdown
  const lineOptions = allLines.filter((l) => {
    if (filterAxis !== 'all' && l.axis !== filterAxis) return false;
    if (filterType !== 'all' && l.type !== filterType) return false;
    return true;
  });

  // Apply quick presets
  const applyPreset = (presetName: 'center' | 'margins' | 'goldenThirds') => {
    const batch: Record<string, Partial<CustomGridLine>> = {};

    if (presetName === 'center') {
      // 5.5X = index 22 in 0.25X (pos 368.5)
      const vCenterId = 'v-sub-22';
      const hCenterId = 'h-sub-22';
      batch[vCenterId] = {
        color: '#ef4444',
        strokeWidth: 2.5,
        dashArray: 'none',
        opacity: 1,
        isCustomized: true,
        label: 'Eje Central V (5.5X)'
      };
      batch[hCenterId] = {
        color: '#ef4444',
        strokeWidth: 2.5,
        dashArray: 'none',
        opacity: 1,
        isCustomized: true,
        label: 'Eje Central H (5.5X)'
      };
      onBatchUpdateLines(batch);
      onSelectLine(vCenterId);
      showNotification('Preset aplicado: Eje Central Cruzado (5.5X)', 'success');
    } else if (presetName === 'margins') {
      // 1X = index 4, 10X = index 40
      ['v-sub-4', 'v-sub-40', 'h-sub-4', 'h-sub-40'].forEach((id) => {
        batch[id] = {
          color: '#06b6d4',
          strokeWidth: 2,
          dashArray: '4 4',
          opacity: 0.95,
          isCustomized: true,
          label: 'Caja de Margen (1X / 10X)'
        };
      });
      onBatchUpdateLines(batch);
      onSelectLine('v-sub-4');
      showNotification('Preset aplicado: Caja de Seguridad 1X - 10X', 'success');
    } else if (presetName === 'goldenThirds') {
      // Approx 3.75X (index 15) and 7.25X (index 29)
      ['v-sub-15', 'v-sub-29', 'h-sub-15', 'h-sub-29'].forEach((id) => {
        batch[id] = {
          color: '#eab308',
          strokeWidth: 2,
          dashArray: '8 4',
          opacity: 0.9,
          isCustomized: true,
          label: 'Regla de Tercios'
        };
      });
      onBatchUpdateLines(batch);
      onSelectLine('v-sub-15');
      showNotification('Preset aplicado: Regla de Tercios', 'success');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-[#1a2228] border-l border-white/10 shadow-2xl flex flex-col font-mono text-xs text-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#151b20]">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Compass className="w-4 h-4" />
          <span>GUÍAS Y RETÍCULA</span>
        </div>
        <div className="flex items-center gap-2">
          {onToggleGuidesLocked && (
            <button
              onClick={onToggleGuidesLocked}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                guidesLocked
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
              title={
                guidesLocked
                  ? 'Guías bloqueadas: no se activan al pasar el puntero. Clic para desbloquear interacción en lienzo.'
                  : 'Guías desbloqueadas: interactivas al pasar el puntero. Clic para bloquear.'
              }
            >
              {guidesLocked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3 text-emerald-400" />}
              <span>{guidesLocked ? 'Bloqueadas' : 'Editables'}</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-[#171e24] px-3 pt-2 gap-2 text-[11px]">
        <button
          onClick={() => setActiveTab('line')}
          className={`pb-2 px-2 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'line'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Editar Línea</span>
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`pb-2 px-2 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'presets'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>
        <button
          onClick={() => setActiveTab('customList')}
          className={`pb-2 px-2 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'customList'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Activas ({customizedLines.length})</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {activeTab === 'line' && (
          <>
            {/* Line Selection Tool */}
            <div className="space-y-2">
              <label className="text-slate-400 text-[11px] font-bold uppercase block">
                Seleccionar Línea de la Malla:
              </label>

              {/* Quick Filters */}
              <div className="flex gap-2 text-[10px]">
                <div className="flex bg-[#151b20] p-0.5 rounded-lg border border-slate-700">
                  {(['all', 'x', 'y'] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => setFilterAxis(a)}
                      className={`px-2 py-1 rounded transition-colors ${
                        filterAxis === a ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {a === 'all' ? 'Todas' : a === 'x' ? 'Verticales' : 'Horizontales'}
                    </button>
                  ))}
                </div>

                <div className="flex bg-[#151b20] p-0.5 rounded-lg border border-slate-700">
                  {(['all', 'main', 'sub'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-2 py-1 rounded transition-colors ${
                        filterType === t ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t === 'all' ? '1X+0.25X' : t === 'main' ? 'Solo 1X' : 'Solo 0.25X'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector Dropdown */}
              <select
                value={selectedLineId || ''}
                onChange={(e) => onSelectLine(e.target.value || null)}
                className="w-full bg-[#151b20] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">-- Elige una línea o haz clic directo en el lienzo --</option>
                {lineOptions.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.axis === 'x' ? '│ Vertical' : '─ Horizontal'}: {l.posUnits}X ({l.pos.toFixed(1)}px){' '}
                    {l.type === 'main' ? '[Malla 1X]' : '[Malla 0.25X]'}{' '}
                    {l.isCustomized ? '★' : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedLine ? (
              <div className="bg-[#151b20] p-4 rounded-xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                  <div>
                    <span className="text-emerald-400 font-bold text-xs">
                      {selectedLine.axis === 'x' ? 'Línea Vertical' : 'Línea Horizontal'} ({selectedLine.posUnits}X)
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Posición: {selectedLine.pos.toFixed(1)}px • Tipo:{' '}
                      {selectedLine.type === 'main' ? 'Malla Primaria (1X)' : 'Subdivisión (0.25X)'}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onUpdateLine(selectedLine.id, {
                        visible: !selectedLine.visible,
                        isCustomized: true
                      })
                    }
                    className={`p-1.5 rounded-lg border transition-colors ${
                      selectedLine.visible
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/10 text-red-400 border-red-500/40'
                    }`}
                    title={selectedLine.visible ? 'Ocultar línea' : 'Mostrar línea'}
                  >
                    {selectedLine.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                {/* Color de Línea */}
                <div className="space-y-2">
                  <label className="text-slate-400 text-[11px] font-bold uppercase flex justify-between items-center">
                    <span>Color de Guía:</span>
                    <span className="font-mono text-emerald-400">{selectedLine.color}</span>
                  </label>

                  {/* Quick Color Swatches */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {GUIDE_COLOR_PRESETS.map((p) => (
                      <button
                        key={p.color}
                        onClick={() =>
                          onUpdateLine(selectedLine.id, {
                            color: p.color,
                            isCustomized: true,
                            opacity: 1
                          })
                        }
                        style={{ backgroundColor: p.color }}
                        className={`h-7 rounded-md border flex items-center justify-center transition-transform hover:scale-105 ${
                          selectedLine.color.toLowerCase() === p.color.toLowerCase()
                            ? 'border-white scale-110 shadow-lg'
                            : 'border-black/30'
                        }`}
                        title={p.name}
                      >
                        {selectedLine.color.toLowerCase() === p.color.toLowerCase() && (
                          <Check className="w-3.5 h-3.5 text-black drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Hex Color Picker */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      value={selectedLine.color}
                      onChange={(e) =>
                        onUpdateLine(selectedLine.id, {
                          color: e.target.value,
                          isCustomized: true
                        })
                      }
                      className="w-8 h-8 rounded p-0 border-none bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedLine.color}
                      onChange={(e) =>
                        onUpdateLine(selectedLine.id, {
                          color: e.target.value,
                          isCustomized: true
                        })
                      }
                      className="flex-1 bg-[#171e24] border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      placeholder="#00e676"
                    />
                  </div>
                </div>

                {/* Grosor de Trazo */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400 font-bold uppercase">
                    <span>Grosor:</span>
                    <span className="text-white">{selectedLine.strokeWidth}px</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0.75, 1.5, 2.5, 3.5, 5].map((w) => (
                      <button
                        key={w}
                        onClick={() =>
                          onUpdateLine(selectedLine.id, {
                            strokeWidth: w,
                            isCustomized: true
                          })
                        }
                        className={`flex-1 py-1 rounded text-[11px] border transition-all ${
                          selectedLine.strokeWidth === w
                            ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                            : 'bg-[#171e24] text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {w}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estilo de Trazo */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 text-[11px] font-bold uppercase block">Estilo de Trazo:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {STROKE_DASH_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() =>
                          onUpdateLine(selectedLine.id, {
                            dashArray: opt.id,
                            isCustomized: true
                          })
                        }
                        className={`py-1.5 px-2 rounded text-[11px] border transition-all ${
                          selectedLine.dashArray === opt.id
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                            : 'bg-[#171e24] text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacidad */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400 font-bold uppercase">
                    <span>Opacidad:</span>
                    <span className="text-white">{Math.round(selectedLine.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={selectedLine.opacity}
                    onChange={(e) =>
                      onUpdateLine(selectedLine.id, {
                        opacity: parseFloat(e.target.value),
                        isCustomized: true
                      })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Restablecer Línea Individual */}
                <button
                  onClick={() => {
                    const isMain = selectedLine.type === 'main';
                    onUpdateLine(selectedLine.id, {
                      color: isMain ? DEFAULT_MAIN_LINE_COLOR : DEFAULT_SUB_LINE_COLOR,
                      strokeWidth: isMain ? 1.5 : 0.75,
                      dashArray: isMain ? 'none' : '2 2',
                      opacity: isMain ? 1 : 0.8,
                      visible: true,
                      isCustomized: false,
                      label: undefined
                    });
                    showNotification('Línea restablecida a su valor estándar.');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-white/5 text-[11px] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer esta línea al estándar</span>
                </button>
              </div>
            ) : (
              <div className="bg-[#151b20] border border-dashed border-slate-700 rounded-xl p-6 text-center text-slate-400 space-y-2">
                <Compass className="w-8 h-8 mx-auto text-slate-500" />
                <p className="text-xs">No hay ninguna línea seleccionada.</p>
                <p className="text-[11px] text-slate-500">
                  Haz clic en cualquier línea de la retícula directamente sobre el lienzo para editar su color y estilo.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-emerald-400 uppercase">Presets Arquitectónicos de Logotipo</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Aplica configuraciones automáticas de guías de diseño para estructurar y construir tus isotipos.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => applyPreset('center')}
                className="w-full text-left bg-[#151b20] hover:bg-[#192229] border border-slate-700 hover:border-emerald-500/50 p-3 rounded-xl transition-all flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  ┼
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400">
                    Eje Central Cruzado (5.5X / 368.5px)
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Destaca el centro geométrico de la retícula en rojo sólido para composiciones simétricas y radiales.
                  </p>
                </div>
              </button>

              <button
                onClick={() => applyPreset('margins')}
                className="w-full text-left bg-[#151b20] hover:bg-[#192229] border border-slate-700 hover:border-cyan-500/50 p-3 rounded-xl transition-all flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  □
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400">
                    Caja de Seguridad / Márgenes (1X y 10X)
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Marca el área de contención perimetral de 1 módulo exterior en cian discontinuo.
                  </p>
                </div>
              </button>

              <button
                onClick={() => applyPreset('goldenThirds')}
                className="w-full text-left bg-[#151b20] hover:bg-[#192229] border border-slate-700 hover:border-yellow-500/50 p-3 rounded-xl transition-all flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  #
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-yellow-400">
                    Regla de Tercios y Puntos Focales
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Genera las 4 líneas de tensión áurea en amarillo para logotipos con pesos asimétricos dinámicos.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'customList' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-400 uppercase">
                Guías Personalizadas Activas ({customizedLines.length})
              </span>
              {customizedLines.length > 0 && (
                <button
                  onClick={onResetAllLines}
                  className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resetear Todo</span>
                </button>
              )}
            </div>

            {customizedLines.length === 0 ? (
              <div className="bg-[#151b20] border border-slate-700 rounded-xl p-6 text-center text-slate-400 text-xs">
                No has personalizado ninguna línea todavía. Haz clic en las líneas de la retícula o aplica un preset
                para crear tus guías.
              </div>
            ) : (
              <div className="space-y-1.5">
                {customizedLines.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onSelectLine(l.id);
                      setActiveTab('line');
                    }}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      selectedLineId === l.id
                        ? 'bg-[#1e2a32] border-emerald-500'
                        : 'bg-[#151b20] border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/30 flex-shrink-0"
                        style={{ backgroundColor: l.color }}
                      />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {l.axis === 'x' ? 'Vertical' : 'Horizontal'} {l.posUnits}X ({l.pos.toFixed(1)}px)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {l.strokeWidth}px • {l.dashArray === 'none' ? 'Sólida' : 'Discontinua'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const isMain = l.type === 'main';
                        onUpdateLine(l.id, {
                          color: isMain ? DEFAULT_MAIN_LINE_COLOR : DEFAULT_SUB_LINE_COLOR,
                          strokeWidth: isMain ? 1.5 : 0.75,
                          dashArray: isMain ? 'none' : '2 2',
                          opacity: isMain ? 1 : 0.8,
                          visible: true,
                          isCustomized: false
                        });
                      }}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Quitar personalización"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-[#151b20] border-t border-white/10 flex justify-between items-center text-[11px]">
        <button
          onClick={onResetAllLines}
          className="text-slate-400 hover:text-white flex items-center gap-1.5 py-1 px-2 rounded hover:bg-white/5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Resetear Retícula</span>
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors"
        >
          Listo
        </button>
      </div>
    </div>
  );
};
