import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Pipette, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  RotateCcw,
  Sliders,
  Layers,
  HelpCircle
} from 'lucide-react';
import { PALETTES } from '../../constants';

// Paletas Oficiales HMA
export const HMA_MASTER_COLORS = {
  luz: '#3D80FD',
  profundo: '#2D60C1'
};

export const CANONICAL_PALETTES = {
  luz: [
    { hex: '#3D80FD', name: 'Azul Luz HMA' },
    { hex: '#AE7176', name: 'Rosa Terracota' },
    { hex: '#D96B43', name: 'Naranja Óxido' },
    { hex: '#052D63', name: 'Azul Marino' },
    { hex: '#0E8490', name: 'Petróleo' },
    { hex: '#1D5B8F', name: 'Cobalto' },
    { hex: '#7D77B0', name: 'Lavanda' },
    { hex: '#C5A367', name: 'Oro Suave' },
    { hex: '#315629', name: 'Verde Olivo' },
    { hex: '#75C962', name: 'Verde Lima' },
    { hex: '#11D7B6', name: 'Menta / Cian' },
    { hex: '#D7BB11', name: 'Oro Mostaza' },
    { hex: '#FEFAE8', name: 'Blanco Marfil' },
  ],
  profundo: [
    { hex: '#2D60C1', name: 'Azul Profundo HMA' },
    { hex: '#77454A', name: 'Caoba' },
    { hex: '#964222', name: 'Terracota Oscuro' },
    { hex: '#031C3D', name: 'Medianoche' },
    { hex: '#074349', name: 'Verde Bosque' },
    { hex: '#1B3F67', name: 'Índigo' },
    { hex: '#514B7D', name: 'Púrpura' },
    { hex: '#82600A', name: 'Ocre' },
    { hex: '#1B3315', name: 'Pino' },
    { hex: '#4B893C', name: 'Verde Musgo' },
    { hex: '#0A8570', name: 'Esmeralda' },
    { hex: '#8C7907', name: 'Dorado Oscuro' },
    { hex: '#060C04', name: 'Obsidiana' },
  ]
};

export const EXTENDED_THEMES = {
  accent: [
    { hex: '#10B981', name: 'Esmeralda' },
    { hex: '#06B6D4', name: 'Cian' },
    { hex: '#3B82F6', name: 'Azul Eléctrico' },
    { hex: '#8B5CF6', name: 'Violeta' },
    { hex: '#EC4899', name: 'Rosa Neón' },
    { hex: '#F59E0B', name: 'Ámbar' },
    { hex: '#EF4444', name: 'Rojo Coral' },
    { hex: '#FFFFFF', name: 'Blanco Puro' },
    { hex: '#94A3B8', name: 'Pizarra' },
    { hex: '#334155', name: 'Gris Grafito' },
    { hex: '#000000', name: 'Negro Puro' }
  ],
  neonCyber: [
    { hex: '#00FF9D', name: 'Cyber Mint' },
    { hex: '#00E5FF', name: 'Electric Cyan' },
    { hex: '#FF007F', name: 'Cyber Magenta' },
    { hex: '#FFE600', name: 'Cyber Yellow' },
    { hex: '#7928CA', name: 'Ultra Violet' },
    { hex: '#FF3366', name: 'Neon Coral' },
    { hex: '#00F5D4', name: 'Turquoise Glow' }
  ],
  pastel: [
    { hex: '#A7F3D0', name: 'Menta Pastel' },
    { hex: '#BAE6FD', name: 'Cielo Pastel' },
    { hex: '#DDD6FE', name: 'Lavanda Suave' },
    { hex: '#FBCFE8', name: 'Rosa Pastel' },
    { hex: '#FED7AA', name: 'Melocotón' },
    { hex: '#FEF08A', name: 'Limón Suave' },
    { hex: '#F1F5F9', name: 'Gris Nube' }
  ]
};

interface ShapeColorPickerProps {
  currentColor: string;
  onChangeColor: (color: string) => void;
  wireframe?: boolean;
  onToggleWireframe?: (wireframe: boolean) => void;
  isMultiSelection?: boolean;
  shapeCount?: number;
}

export const ShapeColorPicker: React.FC<ShapeColorPickerProps> = ({
  currentColor,
  onChangeColor,
  wireframe = false,
  onToggleWireframe,
  isMultiSelection = false,
  shapeCount = 1
}) => {
  const [activeTab, setActiveTab] = useState<'luz' | 'profundo' | 'acentos'>('luz');
  const [showMoreColors, setShowMoreColors] = useState<boolean>(false);
  const [hexInput, setHexInput] = useState<string>(currentColor || '#3D80FD');
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hma_recent_colors');
      return saved ? JSON.parse(saved) : ['#3D80FD', '#2D60C1', '#11D7B6', '#10B981', '#060C04', '#FEFAE8'];
    } catch {
      return ['#3D80FD', '#2D60C1', '#11D7B6', '#10B981', '#060C04', '#FEFAE8'];
    }
  });

  useEffect(() => {
    if (currentColor) {
      setHexInput(currentColor.toUpperCase());
    }
  }, [currentColor]);

  const handleSelectColor = (hex: string) => {
    const formatted = hex.startsWith('#') ? hex : `#${hex}`;
    onChangeColor(formatted);
    setHexInput(formatted.toUpperCase());

    // Actualizar recientes
    setRecentColors(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== formatted.toLowerCase());
      const next = [formatted, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('hma_recent_colors', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleHexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let cleaned = hexInput.trim();
    if (!cleaned.startsWith('#')) cleaned = `#${cleaned}`;
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleaned)) {
      handleSelectColor(cleaned);
    }
  };

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          handleSelectColor(result.sRGBHex);
        }
      } catch (e) {
        // Cancelado por el usuario
      }
    }
  };

  const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;

  return (
    <div className="flex flex-col gap-3 bg-[#13191f] border border-slate-700/60 rounded-xl p-3 shadow-inner">
      {/* Encabezado con color actual e indicación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette size={14} className="text-[#3D80FD]" />
          <span className="font-bold text-slate-300 text-[11px] tracking-wide uppercase">
            Color de Forma {isMultiSelection ? `(${shapeCount})` : ''}
          </span>
        </div>

        {onToggleWireframe && (
          <button
            type="button"
            onClick={() => onToggleWireframe(!wireframe)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors border ${
              wireframe 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Alternar entre Relleno Sólido y Contorno Wireframe"
          >
            {wireframe ? 'Modo Trazo' : 'Relleno'}
          </button>
        )}
      </div>

      {/* Visualizador de Color Activo + Selector Rápido */}
      <div className="flex items-center gap-2.5 bg-[#1a2228] p-2 rounded-lg border border-slate-700/80">
        {/* Muestra grande con selector nativo invisible superpuesto */}
        <div className="relative group shrink-0">
          <div 
            className="w-8 h-8 rounded-lg border-2 border-white/20 shadow-md flex items-center justify-center transition-transform group-hover:scale-105 cursor-pointer overflow-hidden"
            style={{ 
              backgroundColor: currentColor || '#3D80FD',
              backgroundImage: wireframe ? 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 6px)' : 'none'
            }}
          >
            <input 
              type="color"
              value={currentColor && currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#3D80FD'}
              onChange={(e) => handleSelectColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              title="Abrir selector de color nativo del sistema"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-600 rounded-full p-0.5 pointer-events-none">
            <Sliders size={8} className="text-slate-300" />
          </div>
        </div>

        {/* Input HEX Directo */}
        <form onSubmit={handleHexSubmit} className="flex-1 flex items-center gap-1.5">
          <div className="flex-1 flex items-center bg-[#13191f] border border-slate-600 focus-within:border-[#3D80FD] rounded px-2 py-1 transition-colors">
            <span className="text-slate-500 font-bold mr-1">#</span>
            <input 
              type="text"
              value={hexInput.replace('#', '')}
              onChange={(e) => {
                const val = e.target.value;
                setHexInput(val);
                if (/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
                  onChangeColor(`#${val}`);
                }
              }}
              onBlur={() => {
                let cleaned = hexInput.trim();
                if (!cleaned.startsWith('#')) cleaned = `#${cleaned}`;
                if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleaned)) {
                  handleSelectColor(cleaned);
                } else {
                  setHexInput(currentColor || '#3D80FD');
                }
              }}
              maxLength={6}
              placeholder="3D80FD"
              className="bg-transparent w-full outline-none font-mono font-bold text-xs text-slate-100 uppercase"
            />
          </div>

          {/* Botón Gotero (EyeDropper) */}
          {hasEyeDropper && (
            <button
              type="button"
              onClick={handleEyeDropper}
              className="p-1.5 bg-slate-800 hover:bg-[#3D80FD]/20 border border-slate-700 hover:border-[#3D80FD]/50 text-slate-300 hover:text-[#3D80FD] rounded transition-colors"
              title="Tomar muestra de color de la pantalla (Gotero)"
            >
              <Pipette size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Pestañas de Paleta Predeterminada */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Paleta Predeterminada
          </span>
          <div className="flex bg-[#1a2228] p-0.5 rounded-md border border-slate-700/70 text-[9px] font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('luz')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'luz' 
                  ? 'bg-[#3D80FD] text-white font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Luz (13)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profundo')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'profundo' 
                  ? 'bg-[#2D60C1] text-white font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Profundo (13)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('acentos')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeTab === 'acentos' 
                  ? 'bg-emerald-600 text-white font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Acentos
            </button>
          </div>
        </div>

        {/* Swatches de la Paleta Predeterminada */}
        <div className="grid grid-cols-7 gap-1.5 p-1 bg-[#1a2228]/60 rounded-lg border border-slate-700/40">
          {(activeTab === 'luz' ? CANONICAL_PALETTES.luz : activeTab === 'profundo' ? CANONICAL_PALETTES.profundo : EXTENDED_THEMES.accent).map((c, idx) => {
            const isSelected = currentColor?.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectColor(c.hex)}
                className={`group relative h-6 rounded-md border transition-all flex items-center justify-center ${
                  isSelected 
                    ? 'border-white scale-110 shadow-lg z-10 ring-2 ring-[#3D80FD]' 
                    : 'border-white/10 hover:border-white/60 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={`${c.name} (${c.hex})`}
              >
                {isSelected && (
                  <Check 
                    size={11} 
                    className={c.hex.toLowerCase() === '#fefae8' || c.hex.toLowerCase() === '#ffffff' || c.hex.toLowerCase() === '#11d7b6' ? 'text-black' : 'text-white'} 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sección Expandible: MÁS COLORES */}
      <div className="border-t border-slate-700/60 pt-2 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setShowMoreColors(!showMoreColors)}
          className="flex items-center justify-between text-[10px] font-bold text-slate-400 hover:text-[#3D80FD] transition-colors py-1 px-1"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles size={12} className={showMoreColors ? 'text-[#3D80FD]' : 'text-slate-500'} />
            MÁS COLORES Y ESPECTRO
          </span>
          {showMoreColors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showMoreColors && (
          <div className="flex flex-col gap-3 p-2 bg-[#171e25] rounded-lg border border-slate-700/70 animate-fadeIn">
            {/* Selector Nativo de Rueda / Espectro Completo */}
            <div className="flex items-center justify-between gap-2 p-2 bg-[#12171c] rounded-md border border-slate-700/60">
              <span className="text-[10px] text-slate-300 font-semibold">Selector de Espectro RGB:</span>
              <label className="relative flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white rounded cursor-pointer text-[10px] font-bold shadow transition-all">
                <span>Elegir Color Libre</span>
                <input 
                  type="color"
                  value={currentColor && currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#3D80FD'}
                  onChange={(e) => handleSelectColor(e.target.value)}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>

            {/* Paleta Neón / Cyber */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Colores Cyber / Neón</span>
              <div className="grid grid-cols-7 gap-1">
                {EXTENDED_THEMES.neonCyber.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectColor(c.hex)}
                    className="h-5 rounded border border-white/10 hover:border-white hover:scale-105 transition-transform"
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.hex})`}
                  />
                ))}
              </div>
            </div>

            {/* Paleta Pasteles */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Colores Pastel / Suaves</span>
              <div className="grid grid-cols-7 gap-1">
                {EXTENDED_THEMES.pastel.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectColor(c.hex)}
                    className="h-5 rounded border border-white/10 hover:border-white hover:scale-105 transition-transform"
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.hex})`}
                  />
                ))}
              </div>
            </div>

            {/* Recientes */}
            {recentColors.length > 0 && (
              <div className="flex flex-col gap-1 pt-1 border-t border-slate-700/40">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Recientes en Sesión</span>
                <div className="flex gap-1.5 flex-wrap">
                  {recentColors.map((hex, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectColor(hex)}
                      className="w-5 h-5 rounded border border-white/10 hover:border-white hover:scale-110 transition-transform"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
