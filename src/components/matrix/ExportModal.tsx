import React, { useState } from 'react';
import { ExportOptions } from '../../types';
import { Download, Monitor, Smartphone, Layout, Minimize, Maximize2, Settings, X, Check, Video } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
  onRecordVideo: () => void;
  defaultBgColor: string;
}

export function ExportModal({ isOpen, onClose, onExport, onRecordVideo, defaultBgColor }: ExportModalProps) {
  const [dimensionMode, setDimensionMode] = useState<ExportOptions['dimensionMode']>('fullscreen');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [globalScale, setGlobalScale] = useState(1.0);
  const [includeBg, setIncludeBg] = useState(true);
  const [responsive, setResponsive] = useState(true);

  if (!isOpen) return null;

  const handleExport = () => {
    onExport({
      dimensionMode,
      width,
      height,
      globalScale,
      includeBg,
      responsive,
      backgroundColor: defaultBgColor
    });
    onClose();
  };

  const setPreset = (mode: ExportOptions['dimensionMode'], w: number, h: number) => {
    setDimensionMode(mode);
    setWidth(w);
    setHeight(h);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-[#3D80FD]" />
            Exportación y Video
          </h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          
          {/* Dimension Mode */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layout className="w-3.5 h-3.5" /> Tamaño del Lienzo (Viewport)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setDimensionMode('fullscreen')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${dimensionMode === 'fullscreen' ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white' : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30'}`}
              >
                <Maximize2 className="w-5 h-5" />
                <div className="text-xs font-semibold">Pantalla Completa</div>
                <div className="text-[10px] opacity-70">100vw x 100vh</div>
              </button>
              
              <button 
                onClick={() => setPreset('1080p', 1920, 1080)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${dimensionMode === '1080p' ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white' : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30'}`}
              >
                <Monitor className="w-5 h-5" />
                <div className="text-xs font-semibold">1080p (FHD)</div>
                <div className="text-[10px] opacity-70">1920 x 1080</div>
              </button>

              <button 
                onClick={() => setPreset('square', 1080, 1080)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${dimensionMode === 'square' ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white' : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30'}`}
              >
                <Layout className="w-5 h-5" />
                <div className="text-xs font-semibold">Cuadrado (RRSS)</div>
                <div className="text-[10px] opacity-70">1080 x 1080</div>
              </button>

              <button 
                onClick={() => setPreset('mobile', 375, 812)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${dimensionMode === 'mobile' ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white' : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30'}`}
              >
                <Smartphone className="w-5 h-5" />
                <div className="text-xs font-semibold">Móvil (Portrait)</div>
                <div className="text-[10px] opacity-70">375 x 812</div>
              </button>
            </div>
            
            {/* Custom dimensions if not fullscreen */}
            {dimensionMode !== 'fullscreen' && (
              <div className="flex items-center gap-3 mt-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 mb-1">Ancho (px)</label>
                  <input type="number" value={width} onChange={e => { setWidth(Number(e.target.value)); setDimensionMode('custom'); }} className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#3D80FD]" />
                </div>
                <div className="text-slate-500 font-bold mt-4">×</div>
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 mb-1">Alto (px)</label>
                  <input type="number" value={height} onChange={e => { setHeight(Number(e.target.value)); setDimensionMode('custom'); }} className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#3D80FD]" />
                </div>
              </div>
            )}
          </div>

          <hr className="border-white/10" />

          {/* Scale & Zoom */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Minimize className="w-3.5 h-3.5" /> Escala Global (Zoom)
            </label>
            <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Ajuste de tamaño general</span>
                <span className="text-xs font-mono font-bold text-[#3D80FD]">{(globalScale * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="3" step="0.05" 
                value={globalScale} onChange={e => setGlobalScale(Number(e.target.value))} 
                className="w-full accent-[#3D80FD]" 
              />
              <div className="text-[10px] text-slate-500 leading-relaxed">
                Si tu animación se ve demasiado grande o fuera de centro en el navegador, reduce este valor (ej. 25%).
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Output Settings */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Ajustes Finales
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${includeBg ? 'bg-[#3D80FD]' : 'bg-black/50 border border-white/20'}`}>
                  {includeBg && <Check className="w-3 h-3 text-white" />}
                </div>
                <input type="checkbox" checked={includeBg} onChange={e => setIncludeBg(e.target.checked)} className="sr-only" />
                <div>
                  <div className="text-sm font-medium text-white">Incluir Fondo</div>
                  <div className="text-[10px] text-slate-400">Exportar con el color de fondo actual ({defaultBgColor})</div>
                </div>
              </label>

              {dimensionMode !== 'fullscreen' && (
                <label className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors animate-in fade-in">
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${responsive ? 'bg-[#3D80FD]' : 'bg-black/50 border border-white/20'}`}>
                    {responsive && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" checked={responsive} onChange={e => setResponsive(e.target.checked)} className="sr-only" />
                  <div>
                    <div className="text-sm font-medium text-white">Auto-Escalado Responsivo</div>
                    <div className="text-[10px] text-slate-400">Ajustar automáticamente al tamaño de la ventana del navegador</div>
                  </div>
                </label>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg font-medium text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
            Cancelar
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onRecordVideo} 
              className="px-5 py-2 rounded-lg font-bold text-xs bg-red-600 hover:bg-red-500 text-white transition-all active:scale-95 flex items-center gap-2"
              title="Grabar pantalla capturando la animación"
            >
              <Video className="w-4 h-4" />
              Grabar Video (.webm)
            </button>

            <button onClick={handleExport} className="px-5 py-2 rounded-lg font-bold text-xs bg-[#75C962] hover:bg-[#62b450] text-black transition-all active:scale-95 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
