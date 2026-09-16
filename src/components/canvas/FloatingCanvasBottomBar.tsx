import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  ChevronDown,
  Video,
  StopCircle,
  RotateCcw
} from 'lucide-react';

interface FloatingCanvasBottomBarProps {
  aspectRatio: '16:9' | '21:9' | '9:16' | '1:1';
  zoomScale: number;
  onZoomChange: (zoom: number) => void;
  onFit: () => void;
  isCinemaMode: boolean;
  onToggleCinemaMode: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  recordingSeconds: number;
  formatTimer: (seconds: number) => string;
  onResetZoom: () => void;
}

const ASPECT_RATIO_RESOLUTIONS = {
  '16:9': { width: 1920, height: 1080, name: '16:9 HD' },
  '21:9': { width: 2560, height: 1080, name: '21:9 Cine' },
  '9:16': { width: 1080, height: 1920, name: '9:16 Móvil' },
  '1:1': { width: 1080, height: 1080, name: '1:1 Canónico' }
};

export const FloatingCanvasBottomBar: React.FC<FloatingCanvasBottomBarProps> = ({
  aspectRatio,
  zoomScale,
  onZoomChange,
  onFit,
  isCinemaMode,
  onToggleCinemaMode,
  isRecording,
  onToggleRecording,
  recordingSeconds,
  formatTimer,
  onResetZoom
}) => {
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const res = ASPECT_RATIO_RESOLUTIONS[aspectRatio] || ASPECT_RATIO_RESOLUTIONS['16:9'];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowZoomMenu(false);
      }
    };
    if (showZoomMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showZoomMenu]);

  const zoomPresets = [25, 50, 75, 100, 125, 150, 200];

  return (
    <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2.5 bg-[#060C04]/95 border border-white/15 px-2.5 sm:px-4 py-1.5 rounded-full shadow-2xl backdrop-blur-2xl text-xs font-mono select-none">
      {/* Dimensions Indicator (Picsart Web Style W 1920 x H 1080) */}
      <div 
        className="flex items-center gap-1 sm:gap-2 px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[10px] sm:text-[11px] text-slate-300"
        title="Dimensiones de exportación del lienzo"
      >
        <div className="flex items-center gap-0.5">
          <span className="text-slate-500 font-bold">W</span>
          <span className="text-white font-semibold">{res.width}</span>
        </div>

        <button
          onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
          className="p-0.5 hover:text-white text-slate-400 transition-colors"
          title={aspectRatioLocked ? "Proporción bloqueada" : "Proporción libre"}
        >
          {aspectRatioLocked ? (
            <Lock className="w-2.5 h-2.5 text-cyan-400" />
          ) : (
            <Unlock className="w-2.5 h-2.5 text-slate-500" />
          )}
        </button>

        <div className="flex items-center gap-0.5">
          <span className="text-slate-500 font-bold">H</span>
          <span className="text-white font-semibold">{res.height}</span>
        </div>
      </div>

      <div className="w-[1px] h-4 bg-white/10" />

      {/* Interactive Zoom Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onZoomChange(Math.max(25, zoomScale - 15))}
          className="p-1 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors active:scale-95"
          title="Alejar (Zoom -)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowZoomMenu(!showZoomMenu)}
            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
            title="Seleccionar nivel de zoom"
          >
            <span>{zoomScale}%</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showZoomMenu && (
            <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-[#060C04] border border-white/20 rounded-xl p-1 shadow-2xl z-50 flex flex-col gap-0.5 w-24 backdrop-blur-xl">
              <div className="px-2 py-1 text-[9px] uppercase text-slate-500 font-bold border-b border-white/10">
                Zoom
              </div>
              {zoomPresets.map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    onZoomChange(pct);
                    setShowZoomMenu(false);
                  }}
                  className={`px-2 py-1 rounded text-left text-[11px] transition-colors ${
                    zoomScale === pct
                      ? 'bg-[#3D80FD]/20 text-[#3D80FD] font-bold'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <div className="border-t border-white/10 pt-1 mt-0.5">
                <button
                  onClick={() => {
                    onFit();
                    setShowZoomMenu(false);
                  }}
                  className="w-full px-2 py-1 rounded text-left text-[11px] text-cyan-400 hover:bg-cyan-500/10 font-bold"
                >
                  Encajar (Fit)
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => onZoomChange(Math.min(250, zoomScale + 15))}
          className="p-1 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors active:scale-95"
          title="Acercar (Zoom +)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Fit to screen */}
        <button
          onClick={onFit}
          className="px-2 py-0.5 rounded-md hover:bg-white/10 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
          title="Restablecer tamaño y centrar (Fit)"
        >
          Fit
        </button>
      </div>

      <div className="w-[1px] h-4 bg-white/10" />

      {/* Cinema Mode Toggle */}
      <button
        onClick={onToggleCinemaMode}
        className={`p-1.5 rounded-md flex items-center gap-1 transition-all ${
          isCinemaMode
            ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
            : 'text-slate-400 hover:text-orange-400 hover:bg-white/10'
        }`}
        title="Modo Cine (Lienzo sin distracciones)"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>

      {/* Video Recorder Quick Action */}
      <button
        onClick={onToggleRecording}
        className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-md ${
          isRecording
            ? 'bg-red-600 text-white animate-pulse'
            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
        }`}
        title={isRecording ? "Detener grabación" : "Grabar lienzo en video (.webm)"}
      >
        {isRecording ? (
          <>
            <StopCircle className="w-3 h-3" />
            <span>{formatTimer(recordingSeconds)}</span>
          </>
        ) : (
          <>
            <Video className="w-3 h-3" />
            <span className="hidden sm:inline">REC</span>
          </>
        )}
      </button>
    </div>
  );
};
