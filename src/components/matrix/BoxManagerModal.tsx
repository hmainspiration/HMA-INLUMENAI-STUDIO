import React, { useState } from 'react';
import {
  CANVAS_CENTER,
  DEFAULT_TECHNICAL_BOXES,
  MODULE_1M,
  TechnicalBox,
} from '../../types';
import {
  Square,
  X,
  Eye,
  EyeOff,
  Sliders,
  RotateCcw,
  Plus,
  Trash2,
  AlignCenter,
  Sparkles,
  Layers,
} from 'lucide-react';

interface BoxManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  boxes: TechnicalBox[];
  activeBoxId: string;
  onUpdateBoxes: (boxes: TechnicalBox[]) => void;
  onSelectActiveBox: (id: string) => void;
}

export const BoxManagerModal: React.FC<BoxManagerModalProps> = ({
  isOpen,
  onClose,
  boxes,
  activeBoxId,
  onUpdateBoxes,
  onSelectActiveBox,
}) => {
  if (!isOpen) return null;

  const currentBox = boxes.find((b) => b.id === activeBoxId) || boxes[0];

  const updateCurrentBox = (updates: Partial<TechnicalBox>) => {
    if (!currentBox) return;
    const updated = boxes.map((b) => {
      if (b.id === currentBox.id) {
        const next = { ...b, ...updates };
        
        // If widthM or heightM changed, recalculate px (center remains the same!)
        if ('widthM' in updates && updates.widthM !== undefined) {
          next.widthPx = Math.round(updates.widthM * MODULE_1M * 100) / 100;
        }
        if ('heightM' in updates && updates.heightM !== undefined) {
          next.heightPx = Math.round(updates.heightM * MODULE_1M * 100) / 100;
        }
        
        return next;
      }
      return b;
    });
    onUpdateBoxes(updated);
  };

  const handleCenterCurrentBox = () => {
    if (!currentBox) return;
    updateCurrentBox({ x: CANVAS_CENTER, y: CANVAS_CENTER });
  };

  const handleToggleVisibility = (id: string) => {
    const updated = boxes.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b));
    onUpdateBoxes(updated);
  };

  const handleResetToDefaults = () => {
    onUpdateBoxes([...DEFAULT_TECHNICAL_BOXES]);
  };

  const handleAddNewCustomBox = () => {
    const newId = `box-custom-${Date.now()}`;
    const newBox: TechnicalBox = {
      id: newId,
      name: `Caja Personalizada ${boxes.length + 1}`,
      category: 'custom',
      widthM: 6,
      heightM: 6,
      widthPx: 402,
      heightPx: 402,
      x: CANVAS_CENTER,
      y: CANVAS_CENTER,
      visible: true,
      color: '#EC4899',
      strokeDash: 'dashed',
      strokeWidth: 1.5,
      showMarginGuides: true,
      marginTopM: 0.5,
      marginBottomM: 0.5,
      marginLeftM: 0.5,
      marginRightM: 0.5,
      customLabel: `CAJA PERSONALIZADA (6×6 M)`,
    };
    onUpdateBoxes([...boxes, newBox]);
    onSelectActiveBox(newId);
  };

  const handleDeleteBox = (id: string) => {
    if (boxes.length <= 1) return;
    const filtered = boxes.filter((b) => b.id !== id);
    onUpdateBoxes(filtered);
    if (activeBoxId === id) {
      onSelectActiveBox(filtered[0].id);
    }
  };

  const PRESET_QUICK_CONFIGS = [
    {
      label: '11×11 + 7×7 Estándar',
      desc: 'Caja Maestra e Isotipo Canónico',
      action: () => {
        const updated = boxes.map((b) => ({
          ...b,
          visible: b.id === 'box-master-11x11' || b.id === 'box-core-7x7',
        }));
        onUpdateBoxes(updated);
      },
    },
    {
      label: 'Contenedor 6.5×10 M',
      desc: 'Logotipo HMA + Cápsula Inlumenai',
      action: () => {
        const updated = boxes.map((b) => ({
          ...b,
          visible: b.id === 'box-master-11x11' || b.id === 'box-logo-container-10x65',
        }));
        onUpdateBoxes(updated);
        onSelectActiveBox('box-logo-container-10x65');
      },
    },
    {
      label: 'Caja HMA DESIGN',
      desc: 'Márgenes 1.25x y Canal 1x',
      action: () => {
        const updated = boxes.map((b) => ({
          ...b,
          visible: b.id === 'box-master-11x11' || b.id === 'box-hma-design',
        }));
        onUpdateBoxes(updated);
        onSelectActiveBox('box-hma-design');
      },
    },
    {
      label: 'Circular 10×10 (13 Puntos)',
      desc: 'Plantilla Circular de 13 nodos radiales cada 30° (0° a 360°)',
      action: () => {
        const updated = boxes.map((b) => ({
          ...b,
          visible: b.id === 'box-circular-10x10' || b.id === 'box-master-11x11',
        }));
        onUpdateBoxes(updated);
        onSelectActiveBox('box-circular-10x10');
      },
    },
    {
      label: 'Caja 4×30.5 M',
      desc: 'Logotipo Horizontal Extendido',
      action: () => {
        const updated = boxes.map((b) => ({
          ...b,
          visible: b.id === 'box-horizontal-30x4',
        }));
        onUpdateBoxes(updated);
        onSelectActiveBox('box-horizontal-30x4');
      },
    },
    {
      label: 'Ver Todas Activas',
      desc: 'Mostrar todo el ecosistema de cajas',
      action: () => {
        const updated = boxes.map((b) => ({ ...b, visible: true }));
        onUpdateBoxes(updated);
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0E1726] border border-[#1E293B] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#081126]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <Square className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Gestor Paramétrico de Cajas y Contenedores
                <span className="text-xs bg-blue-950 border border-blue-800 text-blue-300 px-2 py-0.5 rounded font-mono">
                  1M = 67px
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configura cajas maestras, núcleos, contenedores de logotipo (6.5×10, 4×30.5) y cotas técnicas editables
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-6 py-2.5 bg-[#0A1324] border-b border-[#1E293B] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Presets:
          </span>
          {PRESET_QUICK_CONFIGS.map((preset, idx) => (
            <button
              key={idx}
              onClick={preset.action}
              className="px-2.5 py-1 bg-[#131E32] hover:bg-[#1E2E4A] border border-[#1E293B] hover:border-cyan-500/50 rounded text-xs text-slate-300 hover:text-white transition-colors shrink-0 font-mono"
              title={preset.desc}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={handleResetToDefaults}
            className="ml-auto px-2.5 py-1 bg-[#1A1828] hover:bg-[#2A233A] border border-purple-900/50 hover:border-purple-500 rounded text-xs text-purple-300 transition-colors shrink-0 font-mono flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Restablecer Cajas
          </button>
        </div>

        {/* Body Content: 2-column layout */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Box List (4 cols) */}
          <div className="md:col-span-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                Cajas Disponibles ({boxes.length})
              </span>
              <button
                onClick={handleAddNewCustomBox}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-mono flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Nueva Caja
              </button>
            </div>

            <div className="space-y-1.5 mt-1 max-h-[460px] overflow-y-auto pr-1">
              {boxes.map((box) => {
                const isSelected = box.id === currentBox?.id;
                return (
                  <div
                    key={box.id}
                    onClick={() => onSelectActiveBox(box.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/50'
                        : 'bg-[#131E32]/60 border-[#1E293B] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-sm border"
                        style={{
                          backgroundColor: box.visible ? box.color : 'transparent',
                          borderColor: box.color,
                        }}
                      />
                      <div>
                        <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                          {box.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {box.widthM}M × {box.heightM}M ({box.widthPx}×{box.heightPx}px)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        title={box.visible ? 'Ocultar Caja en Canvas' : 'Mostrar Caja en Canvas'}
                        onClick={() => handleToggleVisibility(box.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          box.visible
                            ? 'bg-blue-600/20 border-blue-500/40 text-blue-400 hover:bg-blue-600/40'
                            : 'bg-[#0E1726] border-[#1E293B] text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {box.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {box.category === 'custom' && (
                        <button
                          title="Eliminar Caja"
                          onClick={() => handleDeleteBox(box.id)}
                          className="p-1.5 rounded-lg border bg-rose-950/20 border-rose-900/40 text-rose-400 hover:bg-rose-900/40 transition-colors"
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

          {/* Right: Selected Box Parametric Editor (7 cols) */}
          {currentBox && (
            <div className="md:col-span-7 bg-[#081126] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: currentBox.color }}
                  />
                  <span className="text-sm font-bold text-white font-mono">
                    Editar: {currentBox.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCenterCurrentBox}
                    className="px-2 py-1 bg-[#131E32] hover:bg-[#1E2E4A] border border-[#1E293B] hover:border-cyan-500 rounded text-xs text-cyan-300 font-mono flex items-center gap-1 transition-colors"
                    title="Centrar Caja en origen simétrico (413, 413)"
                  >
                    <AlignCenter className="w-3 h-3" />
                    Centrar en Lienzo
                  </button>
                </div>
              </div>

              {/* Editable Name & Custom Label */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">Nombre de Caja</label>
                  <input
                    type="text"
                    value={currentBox.name}
                    onChange={(e) => updateCurrentBox({ name: e.target.value })}
                    className="w-full bg-[#0E1726] border border-[#1E293B] rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">Rótulo en Canvas / SVG</label>
                  <input
                    type="text"
                    value={currentBox.customLabel || ''}
                    onChange={(e) => updateCurrentBox({ customLabel: e.target.value })}
                    className="w-full bg-[#0E1726] border border-[#1E293B] rounded px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    placeholder="Ej: CONTENEDOR 6.5×10"
                  />
                </div>
              </div>

              {/* Dimensions: M Modules and Px */}
              <div className="bg-[#0E1726] p-3 rounded-lg border border-[#1E293B] space-y-3">
                <div className="text-[11px] font-bold text-slate-300 uppercase font-mono tracking-wider flex items-center justify-between">
                  <span>Dimensiones Paramétricas (1M = 67px)</span>
                  <span className="text-cyan-400 lowercase">{currentBox.widthPx} × {currentBox.heightPx} px</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1 block">
                      Ancho (Módulos M)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="50"
                        value={currentBox.widthM}
                        onChange={(e) => updateCurrentBox({ widthM: parseFloat(e.target.value) || 1 })}
                        className="w-full bg-[#131E32] border border-[#1E293B] rounded px-2.5 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                      <span className="text-xs font-mono text-slate-400">M</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1 block">
                      Alto (Módulos M)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="50"
                        value={currentBox.heightM}
                        onChange={(e) => updateCurrentBox({ heightM: parseFloat(e.target.value) || 1 })}
                        className="w-full bg-[#131E32] border border-[#1E293B] rounded px-2.5 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                      <span className="text-xs font-mono text-slate-400">M</span>
                    </div>
                  </div>
                </div>

                {/* Centroides X, Y */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#1E293B]/60">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1 block">
                      Eje X (Centroide)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={currentBox.x}
                      onChange={(e) => updateCurrentBox({ x: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#131E32] border border-[#1E293B] rounded px-2.5 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 mb-1 block">
                      Eje Y (Centroide)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={currentBox.y}
                      onChange={(e) => updateCurrentBox({ y: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#131E32] border border-[#1E293B] rounded px-2.5 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Color & Stroke Style */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">Color del Trazo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentBox.color}
                      onChange={(e) => updateCurrentBox({ color: e.target.value })}
                      className="w-8 h-8 rounded border border-[#1E293B] bg-transparent cursor-pointer"
                    />
                    <div className="flex items-center gap-1">
                      {['#0057FF', '#38BDF8', '#8B5CF6', '#D97706', '#10B981', '#EC4899'].map((c) => (
                        <button
                          key={c}
                          onClick={() => updateCurrentBox({ color: c })}
                          className="w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-transform"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 mb-1 block">Estilo del Trazo</label>
                  <div className="flex items-center gap-1 bg-[#0E1726] p-0.5 rounded border border-[#1E293B]">
                    {(['solid', 'dashed', 'dotted'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateCurrentBox({ strokeDash: style })}
                        className={`flex-1 py-1 rounded text-[11px] font-mono capitalize transition-colors ${
                          currentBox.strokeDash === style
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {style === 'solid' ? 'Sólido' : style === 'dashed' ? 'Discontinuo' : 'Punteado'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Margin Guides */}
              <div className="bg-[#0E1726] p-3 rounded-lg border border-[#1E293B] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Márgenes Técnicos Internos (0.5x, 1.25x, 2.25x)
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-mono text-slate-400">
                    <input
                      type="checkbox"
                      checked={currentBox.showMarginGuides ?? false}
                      onChange={(e) => updateCurrentBox({ showMarginGuides: e.target.checked })}
                      className="rounded accent-blue-600"
                    />
                    Mostrar Cotas
                  </label>
                </div>

                {currentBox.showMarginGuides && (
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block">Sup. (M)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={currentBox.marginTopM ?? 0}
                        onChange={(e) => updateCurrentBox({ marginTopM: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#131E32] border border-[#1E293B] rounded px-1.5 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block">Inf. (M)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={currentBox.marginBottomM ?? 0}
                        onChange={(e) => updateCurrentBox({ marginBottomM: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#131E32] border border-[#1E293B] rounded px-1.5 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block">Izq. (M)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={currentBox.marginLeftM ?? 0}
                        onChange={(e) => updateCurrentBox({ marginLeftM: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#131E32] border border-[#1E293B] rounded px-1.5 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 block">Der. (M)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={currentBox.marginRightM ?? 0}
                        onChange={(e) => updateCurrentBox({ marginRightM: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#131E32] border border-[#1E293B] rounded px-1.5 py-1 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1E293B] bg-[#081126] flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Todas las medidas responden al módulo base <span className="text-blue-400 font-bold">1M = 67px</span> con origen simétrico en <span className="text-cyan-400 font-bold">(413, 413)</span>.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold font-mono shadow-md shadow-blue-900/40 transition-colors"
          >
            Listo / Aplicar al Lienzo
          </button>
        </div>
      </div>
    </div>
  );
};
