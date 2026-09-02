import React from 'react';
import { Sliders, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { HmaPiece } from '../types';
import { PALETTES } from '../constants';

export default function Inspector({
  piece,
  onUpdate,
  palette
}: {
  piece: HmaPiece;
  onUpdate: (id: string, updates: Partial<HmaPiece>) => void;
  palette: 'luz' | 'profundo';
}) {
  const colors = PALETTES[palette];

  return (
    <div className="glass-panel w-72 h-full flex flex-col p-4 z-10 mr-4 mt-4 mb-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-accent-cyan" />
          Inspector ({piece.typeId})
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => onUpdate(piece.id, { visible: !piece.visible })}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
          >
            {piece.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => onUpdate(piece.id, { locked: !piece.locked })}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
          >
            {piece.locked ? <Lock className="w-4 h-4 text-accent-emerald" /> : <Unlock className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Transform Group */}
        <div className="space-y-3">
          <h3 className="text-xs text-white/50 uppercase tracking-widest font-semibold">Transform (M)</h3>
          
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-accent-cyan-light font-mono">X POS</label>
              <input 
                type="number" step="0.25"
                value={piece.x}
                onChange={(e) => onUpdate(piece.id, { x: parseFloat(e.target.value) })}
                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm font-mono focus:border-accent-cyan outline-none transition-colors"
                disabled={piece.locked}
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-accent-cyan-light font-mono">Y POS</label>
              <input 
                type="number" step="0.25"
                value={piece.y}
                onChange={(e) => onUpdate(piece.id, { y: parseFloat(e.target.value) })}
                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm font-mono focus:border-accent-cyan outline-none transition-colors"
                disabled={piece.locked}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-accent-cyan-light font-mono">ROTACIÓN (DEG)</label>
            <div className="flex items-center gap-2">
              <input 
                type="range" min="-180" max="180" step="15"
                value={piece.rotation}
                onChange={(e) => onUpdate(piece.id, { rotation: parseInt(e.target.value) })}
                className="flex-1 accent-accent-cyan"
                disabled={piece.locked}
              />
              <span className="w-12 text-right text-xs font-mono">{piece.rotation}°</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] text-accent-cyan-light font-mono">ESCALA</label>
            <div className="flex items-center gap-2">
              <input 
                type="range" min="0.25" max="3" step="0.25"
                value={piece.scale}
                onChange={(e) => onUpdate(piece.id, { scale: parseFloat(e.target.value) })}
                className="flex-1 accent-accent-cyan"
                disabled={piece.locked}
              />
              <span className="w-12 text-right text-xs font-mono">{piece.scale}x</span>
            </div>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Color Group */}
        <div className="space-y-3">
          <h3 className="text-xs text-white/50 uppercase tracking-widest font-semibold">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => onUpdate(piece.id, { color: c })}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${piece.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                style={{ backgroundColor: c }}
                disabled={piece.locked}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
