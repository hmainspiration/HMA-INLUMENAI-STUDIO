import React, { useState } from 'react';
import { LogoData } from '../../types';
import { INITIAL_DATA } from '../../data/canonicalLogos';
import { X, Plus, Sparkles, Check, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MotionAddPresetModalProps {
  onAdd: (logo: LogoData) => void;
  onClose: () => void;
}

export const MotionAddPresetModal: React.FC<MotionAddPresetModalProps> = ({
  onAdd,
  onClose
}) => {
  const [selectedCluster, setSelectedCluster] = useState<string>('all');

  const clusters = ['all', 'Marca Master', 'Clúster 1: Alpha', 'Clúster 2: Retail', 'Clúster 3: Tech', 'Clúster 4: Media'];

  const filteredPresets = selectedCluster === 'all'
    ? INITIAL_DATA
    : INITIAL_DATA.filter((p) => p.clusterName.toLowerCase().includes(selectedCluster.toLowerCase().replace('clúster ', '').replace(':', '')));

  const handleSelect = (preset: LogoData) => {
    // Clone with a fresh unique serviceId so it operates independently
    const cloned: LogoData = {
      ...preset,
      serviceId: `${preset.serviceId}_add_${Date.now().toString(36)}`,
      serviceName: `${preset.serviceName} (Añadido)`,
      shapes: JSON.parse(JSON.stringify(preset.shapes))
    };
    onAdd(cloned);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0A101D] border border-white/15 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Añadir Isotipo a la Secuencia</span>
              </h3>
              <p className="text-xs text-slate-400">Elige un isotipo canónico para insertarlo en el Loop</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cluster Filter Pills */}
        <div className="px-6 py-2 border-b border-white/5 bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          {clusters.map((cl) => (
            <button
              key={cl}
              onClick={() => setSelectedCluster(cl)}
              className={cn(
                'px-2.5 py-1 rounded-lg transition-all whitespace-nowrap',
                selectedCluster === cl
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              {cl === 'all' ? 'Todos los Isotipos' : cl}
            </button>
          ))}
        </div>

        {/* Presets List */}
        <div className="p-6 overflow-y-auto space-y-2 flex-1 max-h-96">
          {filteredPresets.map((preset, idx) => (
            <div
              key={preset.serviceId}
              className="p-3 rounded-xl bg-slate-900/70 border border-white/5 hover:border-blue-500/40 hover:bg-slate-800/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500 text-xs w-6">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-bold text-slate-200 text-xs group-hover:text-blue-300 transition-colors">
                    {preset.serviceName}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {preset.clusterName} • {preset.shapes.length} Formas
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/40"
                    style={{ backgroundColor: preset.luzColor || '#3D80FD' }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/40"
                    style={{ backgroundColor: preset.profundoColor || '#2D60C1' }}
                  />
                </div>

                <button
                  onClick={() => handleSelect(preset)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insertar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
