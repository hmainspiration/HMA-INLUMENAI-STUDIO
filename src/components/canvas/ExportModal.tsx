import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ExportOptions } from '../../types';
import {
  Download,
  Monitor,
  Smartphone,
  Layout,
  Minimize,
  Maximize2,
  Settings,
  X,
  Check,
  Video,
  Globe,
  Copy,
  CheckCheck,
  Sparkles
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  onRecordVideo: () => void;
  defaultBgColor: string;
}

export function ExportModal({ isOpen, onClose, onExport, onRecordVideo, defaultBgColor }: ExportModalProps) {
  const [dimensionMode, setDimensionMode] = useState<ExportOptions['dimensionMode']>('hero');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(800);
  const [globalScale, setGlobalScale] = useState(1.0);
  const [includeBg, setIncludeBg] = useState(false); // default transparent for hero
  const [responsive, setResponsive] = useState(true);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [heroBgType, setHeroBgType] = useState<'transparent' | 'dark' | 'custom'>('transparent');

  if (!isOpen) return null;

  const handleExport = () => {
    onExport({
      dimensionMode,
      width,
      height,
      globalScale,
      includeBg: heroBgType === 'transparent' ? false : includeBg,
      responsive,
      backgroundColor: heroBgType === 'transparent' ? 'transparent' : defaultBgColor,
      heroOptions: {
        fullBleed: true,
        transparentBg: heroBgType === 'transparent',
        minHeightVh: 75,
        seamlessEmbed: true
      }
    });
    onClose();
  };

  const setPreset = (mode: ExportOptions['dimensionMode'], w: number, h: number) => {
    setDimensionMode(mode);
    setWidth(w);
    setHeight(h);
    if (mode === 'hero') {
      setHeroBgType('transparent');
      setIncludeBg(false);
    } else {
      setIncludeBg(true);
      setHeroBgType('dark');
    }
  };

  const handleCopyEmbedCode = () => {
    const embedSnippet = `<iframe src="INLUMENAI_HERO_ANIMATION.html" style="width:100%; height:80vh; min-height:500px; border:none; overflow:hidden; background:transparent;" allowtransparency="true" loading="lazy"></iframe>`;
    navigator.clipboard.writeText(embedSnippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900/95 border border-white/15 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col my-auto text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Exportación y Video</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  v3.0 Web-Ready
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Exporta tu animación autónoma o graba video para redes y web</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(92vh-140px)] pr-3 sm:pr-4">
          
          {/* Dimension Mode (Presets) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layout className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tamaño del Lienzo & Formato de Uso</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Resolución: {width} × {height}px</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* 1. HERO WEB (NUEVA OPCIÓN OPTIMIZADA) */}
              <button
                onClick={() => setPreset('hero', 1920, 800)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center relative overflow-hidden group ${
                  dimensionMode === 'hero'
                    ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-cyan-500/40 hover:text-slate-200'
                }`}
              >
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-cyan-500 to-teal-400 text-black">
                  Hero Web
                </div>
                <Globe className={`w-5 h-5 mt-1 transition-transform group-hover:scale-110 ${dimensionMode === 'hero' ? 'text-cyan-400' : 'text-slate-400'}`} />
                <div className="text-xs font-bold leading-tight">Hero Web (Cabecera)</div>
                <div className="text-[10px] opacity-75 font-mono">1920 × 800 (Full-Bleed)</div>
              </button>

              {/* 2. Pantalla Completa */}
              <button 
                onClick={() => setPreset('fullscreen', 1920, 1080)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  dimensionMode === 'fullscreen'
                    ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30 hover:text-slate-200'
                }`}
              >
                <Maximize2 className="w-5 h-5 text-blue-400" />
                <div className="text-xs font-semibold">Pantalla Completa</div>
                <div className="text-[10px] opacity-70 font-mono">100vw × 100vh</div>
              </button>
              
              {/* 3. 1080p FHD */}
              <button 
                onClick={() => setPreset('1080p', 1920, 1080)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  dimensionMode === '1080p'
                    ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-5 h-5 text-blue-400" />
                <div className="text-xs font-semibold">1080p (FHD 16:9)</div>
                <div className="text-[10px] opacity-70 font-mono">1920 × 1080</div>
              </button>

              {/* 4. Cuadrado RRSS */}
              <button 
                onClick={() => setPreset('square', 1080, 1080)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  dimensionMode === 'square'
                    ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30 hover:text-slate-200'
                }`}
              >
                <Layout className="w-5 h-5 text-indigo-400" />
                <div className="text-xs font-semibold">Cuadrado (RRSS 1:1)</div>
                <div className="text-[10px] opacity-70 font-mono">1080 × 1080</div>
              </button>

              {/* 5. Movil Portrait */}
              <button 
                onClick={() => setPreset('mobile', 375, 812)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  dimensionMode === 'mobile'
                    ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-5 h-5 text-pink-400" />
                <div className="text-xs font-semibold">Móvil (Portrait 9:16)</div>
                <div className="text-[10px] opacity-70 font-mono">375 × 812</div>
              </button>

              {/* 6. Custom dimensions */}
              <button 
                onClick={() => setDimensionMode('custom')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  dimensionMode === 'custom'
                    ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30 hover:text-slate-200'
                }`}
              >
                <Settings className="w-5 h-5 text-amber-400" />
                <div className="text-xs font-semibold">Personalizado</div>
                <div className="text-[10px] opacity-70 font-mono">Ajuste Libre</div>
              </button>
            </div>
            
            {/* Custom dimension inputs */}
            {dimensionMode === 'custom' && (
              <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-xl animate-in fade-in slide-in-from-top-2">
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 mb-1 font-mono">Ancho (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Math.max(100, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-white/20 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="text-slate-500 font-bold mt-4">×</div>
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 mb-1 font-mono">Alto (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Math.max(100, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-white/20 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* DEDICATED HERO WEB CONFIGURATION (When Hero Web mode is active) */}
          {dimensionMode === 'hero' && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-teal-950/30 border border-cyan-500/30 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-300">Ajustes Especiales para Hero Web</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Sin bordes • 100% Fluido</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setHeroBgType('transparent');
                    setIncludeBg(false);
                  }}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    heroBgType === 'transparent'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-semibold'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div>Fondo Transparente</div>
                    <div className="text-[10px] text-slate-400 font-normal">Superponer sobre tu web o video</div>
                  </div>
                  {heroBgType === 'transparent' && <Check className="w-4 h-4 text-cyan-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHeroBgType('dark');
                    setIncludeBg(true);
                  }}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                    heroBgType === 'dark'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-semibold'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div>Fondo Oscuro Marca</div>
                    <div className="text-[10px] text-slate-400 font-normal">Tono Inlumenai (#040915)</div>
                  </div>
                  {heroBgType === 'dark' && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              </div>

              {/* Copy Embed Helper */}
              <div className="pt-1 flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-white/5">
                <div className="text-[11px] text-slate-300 truncate mr-2">
                  <span className="text-cyan-400 font-semibold">Integración Web: </span>
                  <span>Código iFrame / Webflow / WordPress</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmbedCode}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  {copiedEmbed ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmbed ? '¡Copiado!' : 'Copiar iFrame'}</span>
                </button>
              </div>
            </div>
          )}

          <hr className="border-white/10" />

          {/* Scale & Zoom Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Minimize className="w-3.5 h-3.5 text-cyan-400" />
                <span>Escala Global de la Animación</span>
              </label>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {(globalScale * 100).toFixed(0)}%
              </span>
            </div>

            <div className="bg-black/30 rounded-xl p-3.5 border border-white/5 space-y-2">
              <input 
                type="range"
                min="0.2"
                max="2.5"
                step="0.05" 
                value={globalScale}
                onChange={(e) => setGlobalScale(Number(e.target.value))} 
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg" 
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Más compacto (ej. 50% para héroes con títulos)</span>
                <button
                  type="button"
                  onClick={() => setGlobalScale(1.0)}
                  className="hover:text-cyan-300 underline font-mono"
                >
                  Restablecer 100%
                </button>
                <span>Tamaño completo</span>
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Output Settings */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ajustes Finales</span>
            </label>
            
            <div className="space-y-2">
              {dimensionMode !== 'hero' && (
                <label className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 ${includeBg ? 'bg-[#3D80FD]' : 'bg-black/50 border border-white/20'}`}>
                    {includeBg && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" checked={includeBg} onChange={(e) => setIncludeBg(e.target.checked)} className="sr-only" />
                  <div>
                    <div className="text-xs font-semibold text-white">Incluir Fondo</div>
                    <div className="text-[10px] text-slate-400">Exportar con el color de fondo actual ({defaultBgColor})</div>
                  </div>
                </label>
              )}

              <label className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 ${responsive ? 'bg-cyan-500' : 'bg-black/50 border border-white/20'}`}>
                  {responsive && <Check className="w-3 h-3 text-black font-bold" />}
                </div>
                <input type="checkbox" checked={responsive} onChange={(e) => setResponsive(e.target.checked)} className="sr-only" />
                <div>
                  <div className="text-xs font-semibold text-white">Auto-Escalado Responsivo Vectorial</div>
                  <div className="text-[10px] text-slate-400">Garantiza adaptación automática sin deformación en móviles, tablets y monitores 4K</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Footer (Optimized: No clipping on small screens, wrap-friendly and clear hierarchy) */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-black/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-medium text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-center order-2 sm:order-1"
          >
            Cancelar
          </button>
          
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 order-1 sm:order-2">
            <button 
              onClick={onRecordVideo} 
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 whitespace-nowrap"
              title="Grabar pantalla capturando la animación en video .webm"
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>Grabar Video (.webm)</span>
            </button>

            <button
              onClick={handleExport}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg whitespace-nowrap ${
                dimensionMode === 'hero'
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-black shadow-cyan-500/25 font-extrabold'
                  : 'bg-[#75C962] hover:bg-[#62b450] text-black shadow-green-500/20'
              }`}
              title={dimensionMode === 'hero' ? 'Descargar archivo HTML preparado para hero web' : 'Descargar archivo HTML autónomo'}
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>{dimensionMode === 'hero' ? 'Descargar HTML Hero Web' : 'Exportar HTML'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
