import React, { useState, useRef } from 'react';
import { X, Upload, FileCode, CheckCircle2, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { MatrixShape } from '../../types/matrix';
import { parseSvgToMatrixShapes, SvgImportResult } from '../../utils/svgImportParser';

interface MatrixSvgImportModalProps {
  onClose: () => void;
  onImport: (shapes: MatrixShape[], mode: 'replace' | 'append') => void;
  showNotification: (msg: string, type?: 'success' | 'info' | 'error') => void;
  defaultColor: string;
}

export const MatrixSvgImportModal: React.FC<MatrixSvgImportModalProps> = ({
  onClose,
  onImport,
  showNotification,
  defaultColor
}) => {
  const [svgContent, setSvgContent] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [autoCenter, setAutoCenter] = useState(true);
  const [parseResult, setParseResult] = useState<SvgImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessSvg = (rawSvg: string) => {
    try {
      setParseError(null);
      if (!rawSvg.trim()) {
        setParseResult(null);
        return;
      }
      const result = parseSvgToMatrixShapes(rawSvg, { autoCenter, defaultColor });
      setParseResult(result);
      if (result.shapes.length === 0) {
        setParseError('No se encontraron formas vectoriales compatibles en el SVG.');
      }
    } catch (err: any) {
      setParseError(err?.message || 'Error al analizar el código SVG.');
      setParseResult(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      showNotification('Por favor selecciona un archivo SVG válido (.svg)', 'error');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSvgContent(content);
      handleProcessSvg(content);
    };
    reader.onerror = () => {
      showNotification('Error al leer el archivo SVG.', 'error');
    };
    reader.readAsText(file);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSvgContent(val);
    setFileName(null);
    handleProcessSvg(val);
  };

  const handleExecuteImport = () => {
    if (!parseResult || parseResult.shapes.length === 0) {
      showNotification('No hay formas válidas para importar.', 'error');
      return;
    }

    onImport(parseResult.shapes, importMode);
    showNotification(
      `Se importaron ${parseResult.shapes.length} formas a la retícula Matrix exitosamente.`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-mono">
      <div className="bg-[#1e262c] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#171d22]">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Upload className="w-5 h-5 text-emerald-400" />
            <span>CARGAR SVG A LA RETÍCULA MATRIX</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* File Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-600 hover:border-emerald-500/70 bg-[#171d22]/80 hover:bg-[#171d22] rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-slate-200">
              {fileName ? (
                <span className="text-emerald-400 font-bold">Archivo: {fileName}</span>
              ) : (
                'Haz clic aquí para seleccionar un archivo .SVG'
              )}
            </div>
            <p className="text-xs text-slate-400">
              Compatible con SVGs exportados de Hipergrid, Illustrator, Figma o Motion
            </p>
          </div>

          {/* Direct SVG Code Paste Area */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <label className="flex items-center gap-1.5 font-bold uppercase">
                <FileCode className="w-3.5 h-3.5" /> O pega el código SVG directamente:
              </label>
              {svgContent && (
                <button
                  onClick={() => {
                    setSvgContent('');
                    setFileName(null);
                    setParseResult(null);
                    setParseError(null);
                  }}
                  className="text-red-400 hover:text-red-300 text-[11px]"
                >
                  Limpiar
                </button>
              )}
            </div>
            <textarea
              value={svgContent}
              onChange={handleTextareaChange}
              placeholder="<svg xmlns=...><rect x=...></svg>"
              rows={4}
              className="w-full bg-[#171d22] border border-slate-700 rounded-lg p-3 text-xs text-slate-300 font-mono focus:border-emerald-500 focus:outline-none placeholder-slate-600 resize-none"
            />
          </div>

          {/* Import Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#171d22] p-4 rounded-xl border border-slate-700/60">
            <div>
              <label className="text-xs text-slate-400 font-bold block mb-2 uppercase">Modo de Inserción</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                    importMode === 'replace'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-[#263238] text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  Reemplazar Lienzo
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('append')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                    importMode === 'append'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-[#263238] text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  Añadir a Actuales
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-bold block mb-2 uppercase">Alineación</label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={autoCenter}
                  onChange={(e) => {
                    setAutoCenter(e.target.checked);
                    if (svgContent) handleProcessSvg(svgContent);
                  }}
                  className="rounded border-slate-600 bg-[#263238] text-emerald-500 focus:ring-0"
                />
                <span>Centrar automáticamente en la retícula 11X</span>
              </label>
            </div>
          </div>

          {/* Parse Status / Feedback */}
          {parseError && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-xl text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-bold">Error al procesar SVG:</p>
                <p className="text-slate-300 text-[11px] mt-0.5">{parseError}</p>
              </div>
            </div>
          )}

          {parseResult && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {parseResult.detectedCount} formas detectadas con éxito
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {parseResult.sourceType === 'matrix_native'
                    ? 'Origen: Nativo Hipergrid'
                    : parseResult.sourceType === 'inlumenai_motion'
                    ? 'Origen: Motion'
                    : 'Origen: SVG Estándar'}
                </span>
              </div>

              {parseResult.warnings.length > 0 && (
                <div className="text-[11px] text-amber-300/90 space-y-1 pt-1 border-t border-emerald-500/20">
                  {parseResult.warnings.map((w, idx) => (
                    <p key={idx}>⚠️ {w}</p>
                  ))}
                </div>
              )}

              {/* Formas Preview Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto">
                {parseResult.shapes.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#171d22] border border-white/10 text-[10px] text-slate-300"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: s.wireframe ? 'transparent' : s.color, border: s.wireframe ? `1px solid ${s.color}` : 'none' }}
                    />
                    {s.widthX}X × {s.heightX}X ({s.rot}°)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#171d22] border-t border-white/10 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleExecuteImport}
            disabled={!parseResult || parseResult.shapes.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:pointer-events-none text-black font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            <span>Cargar en Retícula</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
