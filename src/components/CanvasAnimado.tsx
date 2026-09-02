import React, { useState } from 'react';
import { useAppState } from '../useAppState';
import { Monitor, Smartphone, Video as VideoIcon, UploadCloud, Layers as LayersIcon } from 'lucide-react';

export default function CanvasAnimado({ state }: { state: ReturnType<typeof useAppState> }) {
  const [aspect, setAspect] = useState<'16:9' | '9:16'>('16:9');
  const [recording, setRecording] = useState(false);

  // Note: Due to iframe constraints and sandboxing, actual MediaRecorder via getDisplayMedia
  // might be blocked in the preview, but we implement the UI/UX as requested.
  const handleRecord = () => {
    if (recording) {
      setRecording(false);
      alert("Video guardado (Simulación debido a restricciones de iframe).");
    } else {
      setRecording(true);
    }
  };

  return (
    <div className="absolute inset-0 flex">
      {/* Left Toolbar (Layer Manager) */}
      <div className="w-64 h-full glass-panel ml-4 mt-4 mb-4 flex flex-col z-10">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
            <LayersIcon className="w-4 h-4 text-accent-cyan" />
            Gestor de Capas
          </h2>
        </div>
        
        <div className="flex-1 p-4 flex flex-col items-center justify-center text-center text-white/40 space-y-4">
          <UploadCloud className="w-8 h-8 opacity-50" />
          <p className="text-xs">Drag & Drop o pega tu código SVG XML aquí</p>
          <button className="px-4 py-2 border border-white/20 rounded-md hover:bg-white/5 transition-colors text-xs font-medium">
            Importar Vector
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8">
        
        {/* Workspace Mode Switcher */}
        <div className="absolute top-4 flex p-1 bg-black/40 rounded-lg border border-white/10 z-10">
          <button 
            onClick={() => setAspect('16:9')}
            className={`px-4 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition-colors ${aspect === '16:9' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
          >
            <Monitor className="w-4 h-4" /> Computadora (16:9)
          </button>
          <button 
            onClick={() => setAspect('9:16')}
            className={`px-4 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition-colors ${aspect === '9:16' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
          >
            <Smartphone className="w-4 h-4" /> Móvil (9:16)
          </button>
        </div>

        {/* The Canvas */}
        <div 
          className={`bg-black/50 border border-white/10 rounded-xl shadow-2xl overflow-hidden relative flex items-center justify-center
            ${aspect === '16:9' ? 'w-full max-w-4xl aspect-video' : 'h-full max-h-[80vh] aspect-[9/16]'}`}
        >
          <div className="text-white/20 font-mono text-sm absolute inset-0 flex items-center justify-center flex-col gap-4">
            <div className="w-24 h-24 border-2 border-dashed border-white/20 rounded-full anim-float" style={{ '--anim-y': '-30px', '--anim-duration': '4s' } as React.CSSProperties}></div>
            Compositor Vectorial y Físicas
          </div>
        </div>

        {/* Recording Widget */}
        <button 
          onClick={handleRecord}
          className={`absolute bottom-8 flex items-center gap-3 px-6 py-3 rounded-full font-bold shadow-2xl transition-all
            ${recording 
              ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse' 
              : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
        >
          <div className={`w-3 h-3 rounded-full ${recording ? 'bg-red-500' : 'bg-white'}`} />
          {recording ? 'Detener y Guardar' : 'Grabar Lienzo (.webm)'}
        </button>

      </div>
    </div>
  );
}
