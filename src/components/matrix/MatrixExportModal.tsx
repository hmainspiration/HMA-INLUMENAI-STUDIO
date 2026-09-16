import React, { useState } from 'react';
import { X, Download, FileCode, FileJson, CheckSquare, Square } from 'lucide-react';
import { MatrixShape, CustomGridLine, MatrixProjectData } from '../../types/matrix';
import { downloadFile } from '../../utils/exportUtils';
import { createLogoDataFromMatrix } from '../../utils/matrixExportUtils';

interface MatrixExportModalProps {
  shapes: MatrixShape[];
  gridLines: Record<string, CustomGridLine>;
  showMainGrid: boolean;
  showSubGrid: boolean;
  onClose: () => void;
  showNotification: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const MatrixExportModal: React.FC<MatrixExportModalProps> = ({
  shapes,
  gridLines,
  showMainGrid,
  showSubGrid,
  onClose,
  showNotification
}) => {
  const [bgType, setBgType] = useState<'transparent' | 'white' | 'black' | 'custom'>('transparent');
  const [customBgColor, setCustomBgColor] = useState('#ffffff');
  const [gridMode, setGridMode] = useState<'none' | 'custom_only' | 'main' | 'full'>('none');
  const [includeLabels, setIncludeLabels] = useState(false);
  const [exportWireframe, setExportWireframe] = useState(false);
  const [onlyShapes, setOnlyShapes] = useState(true);

  const handleExportSvg = () => {
    let bgColorStr = 'transparent';
    if (bgType === 'white') bgColorStr = '#ffffff';
    if (bgType === 'black') bgColorStr = '#1e262c';
    if (bgType === 'custom') bgColorStr = customBgColor;

    // Build grid SVG elements based on custom lines
    let gridSvg = '';
    const lineArray = Object.values(gridLines) as CustomGridLine[];

    if (gridMode !== 'none') {
      const activeLines = lineArray.filter((line) => {
        if (!line.visible) return false;
        if (gridMode === 'custom_only') return line.isCustomized;
        if (gridMode === 'main') return line.type === 'main' || line.isCustomized;
        return true; // full
      });

      const linesSvg = activeLines
        .map((line) => {
          const dashAttr = line.dashArray !== 'none' ? `stroke-dasharray="${line.dashArray}"` : '';
          const opacityAttr = line.opacity < 1 ? `opacity="${line.opacity}"` : '';

          if (line.axis === 'x') {
            return `  <line x1="${line.pos}" y1="0" x2="${line.pos}" y2="737" stroke="${line.color}" stroke-width="${line.strokeWidth}" ${dashAttr} ${opacityAttr} />`;
          } else {
            return `  <line x1="0" y1="${line.pos}" x2="737" y2="${line.pos}" stroke="${line.color}" stroke-width="${line.strokeWidth}" ${dashAttr} ${opacityAttr} />`;
          }
        })
        .join('\n');

      gridSvg = `<g id="matrix-grid-guides">\n${linesSvg}\n</g>`;
    }

    // Build Shapes SVG
    const shapesSvg = shapes
      .map((shape) => {
        const w = shape.widthX * 67;
        const h = shape.heightX * 67;
        const rx = Math.min(w, h) / 2;
        const isWire = exportWireframe || shape.wireframe;
        const fill = isWire ? 'none' : shape.color;
        const stroke = isWire ? shape.color : 'none';
        const strokeWidth = isWire ? 2 : 0;

        return `    <rect class="draggable-shape" id="${shape.id}" x="${shape.x}" y="${shape.y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" transform="rotate(${shape.rot} ${shape.x + w / 2} ${shape.y + h / 2})" />`;
      })
      .join('\n');

    // Optional coordinate labels
    let labelsSvg = '';
    if (includeLabels && gridMode !== 'none') {
      const xLabels = Array.from({ length: 12 })
        .map((_, i) => `<text x="${i * 67}" y="-12" text-anchor="middle" fill="#546e7a" font-family="monospace" font-size="12px">${i === 0 ? '0' : `${i}X`}</text>`)
        .join('\n    ');
      const yLabels = Array.from({ length: 12 })
        .map((_, i) => `<text x="-12" y="${i * 67 + 4}" text-anchor="end" fill="#546e7a" font-family="monospace" font-size="12px">${i === 0 ? '0' : `${i}X`}</text>`)
        .join('\n    ');
      labelsSvg = `<g id="matrix-labels">\n    ${xLabels}\n    ${yLabels}\n  </g>`;
    }

    const viewBoxAttr = gridMode === 'none' && !includeLabels
      ? 'viewBox="0 0 737 737"'
      : 'viewBox="-140 -80 957 897"';

    const bgRectWidth = gridMode === 'none' && !includeLabels ? 737 : 957;
    const bgRectHeight = gridMode === 'none' && !includeLabels ? 737 : 897;
    const bgRectX = gridMode === 'none' && !includeLabels ? 0 : -140;
    const bgRectY = gridMode === 'none' && !includeLabels ? 0 : -80;

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" ${viewBoxAttr} width="${bgRectWidth}" height="${bgRectHeight}">
  <!-- Inlumenai Matrix Studio Export -->
  ${bgColorStr !== 'transparent' ? `<rect x="${bgRectX}" y="${bgRectY}" width="${bgRectWidth}" height="${bgRectHeight}" fill="${bgColorStr}" />` : ''}
  ${gridSvg}
  ${labelsSvg}
  <g id="shapes-layer">
${shapesSvg}
  </g>
</svg>`;

    downloadFile(svgString, `Matrix_Logotipo_${Date.now()}.svg`, 'image/svg+xml');
    showNotification('SVG con formas descargado exitosamente.', 'success');
    onClose();
  };

  const handleExportJson = () => {
    const projectData: MatrixProjectData = {
      version: '3.0',
      appName: 'INLUMENAI HIPERGRID',
      timestamp: Date.now(),
      shapes,
      gridSettings: {
        showMain: showMainGrid,
        showSub: showSubGrid,
        customLines: (Object.values(gridLines) as CustomGridLine[]).filter((l) => l.isCustomized)
      }
    };

    const jsonStr = JSON.stringify(projectData, null, 2);
    downloadFile(jsonStr, `Matrix_Formas_Proyecto_${Date.now()}.json`, 'application/json');
    showNotification('Archivo JSON del proyecto descargado exitosamente.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-mono text-xs">
      <div className="bg-[#1e262c] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#171d22]">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Download className="w-5 h-5" />
            <span>DESCARGAR FORMAS Y GUÍAS (SVG / JSON)</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-slate-300">
          {/* Fondo */}
          <div className="space-y-2">
            <label className="text-slate-400 font-bold uppercase block text-[11px]">Color de Fondo del SVG</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'transparent', label: 'Transparente' },
                { id: 'white', label: 'Blanco' },
                { id: 'black', label: 'Oscuro' },
                { id: 'custom', label: 'Personalizado' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBgType(opt.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                    bgType === opt.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                      : 'bg-[#263238] text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              {bgType === 'custom' && (
                <div className="flex items-center gap-2 bg-[#263238] px-2 py-1 rounded-lg border border-slate-700">
                  <input
                    type="color"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="w-6 h-6 rounded p-0 border-none bg-transparent cursor-pointer"
                  />
                  <span className="text-[11px] font-mono">{customBgColor}</span>
                </div>
              )}
            </div>
          </div>

          {/* Malla y Guías en la exportación */}
          <div className="space-y-2">
            <label className="text-slate-400 font-bold uppercase block text-[11px]">
              Retícula y Guías Personalizadas en SVG
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'Solo Formas (Limpio)' },
                { id: 'custom_only', label: 'Solo Guías Personalizadas' },
                { id: 'main', label: 'Malla 1X + Guías' },
                { id: 'full', label: 'Malla Completa (1X + 0.25X)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setGridMode(opt.id as any)}
                  className={`py-2 px-3 rounded-lg text-xs text-left transition-all border ${
                    gridMode === opt.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-[#263238] text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-2 bg-[#171d22] p-3.5 rounded-xl border border-slate-700/60">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exportWireframe}
                onChange={(e) => setExportWireframe(e.target.checked)}
                className="rounded border-slate-600 bg-[#263238] text-emerald-500 focus:ring-0"
              />
              <span>Exportar formas en modo Wireframe (Solo Contornos)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLabels}
                onChange={(e) => setIncludeLabels(e.target.checked)}
                disabled={gridMode === 'none'}
                className="rounded border-slate-600 bg-[#263238] text-emerald-500 focus:ring-0 disabled:opacity-40"
              />
              <span className={gridMode === 'none' ? 'opacity-40' : ''}>
                Incluir cotas y etiquetas de ejes (0..11X)
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#171d22] border-t border-white/10 flex gap-3">
          <button
            onClick={handleExportSvg}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
          >
            <FileCode className="w-4 h-4" />
            <span>Descargar SVG</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-600/20"
          >
            <FileJson className="w-4 h-4" />
            <span>Descargar JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};

