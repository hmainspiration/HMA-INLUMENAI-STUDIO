import React, { useState } from 'react';
import { LogoData, Shape } from '../../types';
import { X, Check, Palette, Sparkles, RotateCcw, Sliders, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MotionIsotypeEditorModalProps {
  logo: LogoData;
  index: number;
  onSave: (updatedLogo: LogoData) => void;
  onClose: () => void;
}

// Predefined Harmonic Palettes for Fast Customization
const COLOR_PRESET_PACKS = [
  {
    name: 'Canónico Inlumenai',
    luz: '#3D80FD',
    profundo: '#1D4ED8',
    description: 'Azul cobalto y azul eléctrico'
  },
  {
    name: 'Cyber Cyan & Teal',
    luz: '#06B6D4',
    profundo: '#0D9488',
    description: 'Cian neón y verde esmeralda digital'
  },
  {
    name: 'Oro Solar & Ámbar',
    luz: '#F59E0B',
    profundo: '#D97706',
    description: 'Dorado brillante y ámbar profundo'
  },
  {
    name: 'Crimson Pulse & Fuego',
    luz: '#EF4444',
    profundo: '#B91C1C',
    description: 'Rojo vivo y carmesí de alto contraste'
  },
  {
    name: 'Violeta Neon & Púrpura',
    luz: '#A855F7',
    profundo: '#7E22CE',
    description: 'Púrpura cibernético y orquídea profunda'
  },
  {
    name: 'Emerald Matrix',
    luz: '#10B981',
    profundo: '#047857',
    description: 'Verde esmeralda y menta tecno'
  },
  {
    name: 'Sunset Magenta & Coral',
    luz: '#EC4899',
    profundo: '#BE185D',
    description: 'Rosa magenta y coral cálido'
  },
  {
    name: 'Monocromo Alto Contraste',
    luz: '#FEFAE8',
    profundo: '#1E293B',
    description: 'Marfil claro y carbón pizarra'
  }
];

export const MotionIsotypeEditorModal: React.FC<MotionIsotypeEditorModalProps> = ({
  logo,
  index,
  onSave,
  onClose
}) => {
  const [serviceName, setServiceName] = useState(logo.serviceName);
  const [luzColor, setLuzColor] = useState(logo.luzColor || '#3D80FD');
  const [profundoColor, setProfundoColor] = useState(logo.profundoColor || '#2D60C1');
  const [shapes, setShapes] = useState<Shape[]>(JSON.parse(JSON.stringify(logo.shapes)));
  const [activeTab, setActiveTab] = useState<'palette' | 'shapes'>('palette');

  // Apply a preset pack to this logo
  const applyPresetPack = (pack: typeof COLOR_PRESET_PACKS[0]) => {
    setLuzColor(pack.luz);
    setProfundoColor(pack.profundo);

    const updated = shapes.map((sh, idx) => {
      // Alternate or assign by index
      const color = idx % 2 === 0 ? pack.luz : pack.profundo;
      return { ...sh, color };
    });
    setShapes(updated);
  };

  // Apply custom dual colors to all shapes
  const applyDualColorsToShapes = (primary: string, secondary: string) => {
    const updated = shapes.map((sh, idx) => {
      const color = idx % 2 === 0 ? primary : secondary;
      return { ...sh, color };
    });
    setShapes(updated);
  };

  // Change individual shape color
  const handleShapeColorChange = (shapeId: string, newColor: string) => {
    setShapes((prev) =>
      prev.map((sh) => (sh.id === shapeId ? { ...sh, color: newColor } : sh))
    );
  };

  // Save changes
  const handleSave = () => {
    const updatedLogo: LogoData = {
      ...logo,
      serviceName: serviceName.trim() || logo.serviceName,
      luzColor,
      profundoColor,
      shapes
    };
    onSave(updatedLogo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0A101D] border border-white/15 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Personalizar Isotipo #{String(index + 1).padStart(2, '0')}</span>
              </h3>
              <p className="text-xs text-slate-400">Modifica nombres, paletas cromáticas y colores por pieza</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Logo Name Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-300 uppercase font-bold flex items-center gap-1.5">
              <span>Nombre en la Secuencia</span>
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Nombre del isotipo..."
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 font-mono text-xs">
            <button
              onClick={() => setActiveTab('palette')}
              className={cn(
                'flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-2 font-bold',
                activeTab === 'palette'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Palette className="w-4 h-4" />
              <span>Paletas & Colores Globales</span>
            </button>
            <button
              onClick={() => setActiveTab('shapes')}
              className={cn(
                'flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-2 font-bold',
                activeTab === 'shapes'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Sliders className="w-4 h-4" />
              <span>Detalle de las 13 Formas</span>
            </button>
          </div>

          {/* TAB 1: Palette and Quick Themes */}
          {activeTab === 'palette' && (
            <div className="space-y-5">
              {/* Dual Color Controls */}
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-4 space-y-3">
                <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Colores Principales (Bicolor)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <div className="space-y-0.5">
                      <span className="text-slate-300 font-medium block">Tono Luz (Primario)</span>
                      <span className="font-mono text-[10px] text-slate-500">{luzColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={luzColor}
                        onChange={(e) => {
                          setLuzColor(e.target.value);
                          applyDualColorsToShapes(e.target.value, profundoColor);
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-white/20 shadow-inner"
                        style={{ backgroundColor: luzColor }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <div className="space-y-0.5">
                      <span className="text-slate-300 font-medium block">Tono Profundo (Secundario)</span>
                      <span className="font-mono text-[10px] text-slate-500">{profundoColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={profundoColor}
                        onChange={(e) => {
                          setProfundoColor(e.target.value);
                          applyDualColorsToShapes(luzColor, e.target.value);
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <div
                        className="w-6 h-6 rounded-md border border-white/20 shadow-inner"
                        style={{ backgroundColor: profundoColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preset Palette Packs */}
              <div className="space-y-2.5">
                <label className="text-[11px] font-mono text-slate-300 uppercase font-bold flex items-center justify-between">
                  <span>Temas Cromáticos Rápidos</span>
                  <span className="text-[10px] text-slate-500 font-normal">Haz clic para aplicar</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COLOR_PRESET_PACKS.map((pack) => (
                    <button
                      key={pack.name}
                      onClick={() => applyPresetPack(pack)}
                      className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/50 flex items-center justify-between transition-all group text-left"
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors block">
                          {pack.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block line-clamp-1">
                          {pack.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: pack.luz }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: pack.profundo }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Individual Shapes Detail */}
          {activeTab === 'shapes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                  Colores por Pieza Canónica (13 Formas)
                </span>
                <button
                  onClick={() => applyDualColorsToShapes(luzColor, profundoColor)}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restablecer patrón bicolor</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {shapes.map((shape, idx) => (
                  <div
                    key={shape.id}
                    className="p-2.5 rounded-lg bg-slate-900/70 border border-white/5 flex items-center justify-between hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500 w-5">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <div>
                        <span className="font-mono text-slate-300 font-bold block text-[11px]">
                          {shape.id}
                        </span>
                        <span className="text-[9px] text-slate-500">
                          {Math.round(shape.length / 67)}M ({shape.length}px)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={shape.color}
                        onChange={(e) => handleShapeColorChange(shape.id, e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <span
                        className="w-4 h-4 rounded border border-white/20"
                        style={{ backgroundColor: shape.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Aplicar y Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
