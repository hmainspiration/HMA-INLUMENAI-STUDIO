import React, { useState } from 'react';
import { Sparkles, Save, X, Layers, Download, Check, Palette } from 'lucide-react';
import { AnimatedLayer, HMAPiece, PaletteMode } from '../../types/hma';
import { saveCustomTemplate, extractPreviewColors, exportTemplateToJson, CustomTemplate } from '../../utils/templateStorage';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: AnimatedLayer[];
  pieces?: HMAPiece[];
  canvasBgColor?: string;
  aspectRatio?: '16:9' | '21:9' | '9:16' | '1:1';
  paletteMode?: PaletteMode;
  defaultName?: string;
  onTemplateSaved?: (savedTemplate: CustomTemplate) => void;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  layers,
  pieces = [],
  canvasBgColor = '#060C04',
  aspectRatio = '16:9',
  paletteMode = 'profundo',
  defaultName = '',
  onTemplateSaved
}) => {
  const [templateName, setTemplateName] = useState(
    defaultName || `Plantilla Personalizada ${new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`
  );
  const [description, setDescription] = useState('');
  const [alsoExportJson, setAlsoExportJson] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const previewColors = extractPreviewColors(layers, pieces);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;

    const saved = saveCustomTemplate({
      name: templateName.trim(),
      description: description.trim() || undefined,
      canvasBgColor,
      aspectRatio: (aspectRatio || '16:9') as '16:9' | '21:9' | '9:16' | '1:1',
      layers,
      pieces,
      paletteMode: (paletteMode || 'profundo') as PaletteMode
    });

    if (alsoExportJson) {
      exportTemplateToJson(saved);
    }

    setSavedSuccess(true);
    if (onTemplateSaved) {
      onTemplateSaved(saved);
    }

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#060C04] border border-[#3D80FD]/30 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#3D80FD]/20 text-[#3D80FD] border border-[#3D80FD]/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Guardar Nueva Plantilla
              </h2>
              <p className="text-[11px] text-slate-400">
                Guarda tus colores, formas y animaciones en la base de datos local
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center animate-bounce">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-emerald-300">
              ¡Plantilla guardada con éxito!
            </h3>
            <p className="text-xs text-slate-400">
              Disponible permanentemente en &quot;Mis Plantillas&quot; incluso si cierras la app.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Input Name */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-300 font-semibold mb-1.5">
                Nombre de la Plantilla
              </label>
              <input
                type="text"
                required
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ej. Mi Secuencia Neón 2026"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#3D80FD] focus:ring-1 focus:ring-[#3D80FD] transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-300 font-semibold mb-1.5">
                Descripción / Notas (Opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Breve nota sobre las físicas o paleta usada..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#3D80FD] focus:ring-1 focus:ring-[#3D80FD] transition-all resize-none"
              />
            </div>

            {/* Summary preview */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
                <span>Resumen de Elementos</span>
                <span className="text-[#3D80FD]">{aspectRatio}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  {layers.length} Capas activas con físicas
                </span>
                {pieces.length > 0 && (
                  <span className="text-slate-400">
                    {pieces.length} Piezas cinéticas
                  </span>
                )}
              </div>

              {/* Color swatches */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  Paleta detectada:
                </span>
                <div className="flex items-center gap-1">
                  {previewColors.map((c, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Also Export JSON checkbox */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
              <input
                type="checkbox"
                checked={alsoExportJson}
                onChange={(e) => setAlsoExportJson(e.target.checked)}
                className="rounded bg-slate-900 border-white/20 text-[#3D80FD] focus:ring-[#3D80FD]"
              />
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-slate-400" />
                Descargar copia de respaldo en JSON (.json)
              </span>
            </label>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#3D80FD] to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-98 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Plantilla</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
