import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  FileCode,
  Sparkles,
  Layers,
  Copy,
  ClipboardPaste,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Unlock,
  Type,
  Palette,
  Crop,
  Library,
  Video,
  Monitor,
  Smartphone,
  Maximize2
} from 'lucide-react';
import { LeftRailTab } from './LeftToolRail';
import { AnimatedLayer } from '../../types/hma';
import { INITIAL_DATA } from '../../data/canonicalLogos';

interface LeftToolDrawerProps {
  activeTab: LeftRailTab;
  isOpen: boolean;
  onToggleOpen: () => void;
  layers: AnimatedLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onSetLayers: React.Dispatch<React.SetStateAction<AnimatedLayer[]>>;
  aspectRatio: '16:9' | '21:9' | '9:16' | '1:1';
  onSetAspectRatio: (ratio: '16:9' | '21:9' | '9:16' | '1:1') => void;
  canvasBgColor: string;
  onSetCanvasBgColor: (color: string) => void;
  onAddNewMotionLayer: (serviceId?: string) => void;
  onAddNewSvgLayer: (code: string, name?: string) => void;
  onAddNewHtmlLayer: (code: string, name?: string) => void;
  onOpenPasteModal: () => void;
  onOpenExportModal: () => void;
  copiedConfig: any;
  onCopyConfig: (layer: AnimatedLayer) => void;
  onPasteConfig: (targetId: string) => void;
}

// 12 Canonical HMA Services
const HMA_SERVICES = [
  { code: 'H', name: 'Heritage', luz: '#315629', profundo: '#1B3315', desc: 'Archivo, legado e historia', srvId: 'hma-madre' },
  { code: 'M', name: 'Melody', luz: '#108591', profundo: '#074349', desc: 'Música y audio con IA', srvId: 'hma-madre' },
  { code: 'A', name: 'Architecture', luz: '#7D77B0', profundo: '#514B7D', desc: 'Diseño y render de templos', srvId: 'hma-madre' },
  { code: 'I', name: 'Imagination', luz: '#3D80FD', profundo: '#2D60C1', desc: 'Identidad y branding', srvId: 'hma-madre' },
  { code: 'N', name: 'Narratives', luz: '#C5A367', profundo: '#82600A', desc: 'Documentos y editorial', srvId: 'hma-madre' },
  { code: 'L', name: 'Lenses', luz: '#052D63', profundo: '#031C3D', desc: 'Fotografía y revelado', srvId: 'hma-madre' },
  { code: 'U', name: 'Underline', luz: '#D96B43', profundo: '#964222', desc: 'Marcos y firmas visuales', srvId: 'hma-madre' },
  { code: 'M', name: 'Merchandise', luz: '#D7BB11', profundo: '#8C7907', desc: 'Sublimación y productos', srvId: 'hma-madre' },
  { code: 'E', name: 'Experiences', luz: '#1D5B8F', profundo: '#1B3F67', desc: 'Video y cinematografía', srvId: 'hma-madre' },
  { code: 'N', name: 'Network', luz: '#11D7B6', profundo: '#0A826E', desc: 'Web & Apps con IA', srvId: 'hma-madre' },
  { code: 'A', name: 'Alphabets', luz: '#AE7176', profundo: '#77454A', desc: 'Tipografías exclusivas', srvId: 'hma-madre' },
  { code: 'I', name: 'Illustrations', luz: '#75C962', profundo: '#4B893C', desc: 'Biblioteca de fondos e ilustración', srvId: 'hma-madre' }
];

export const LeftToolDrawer: React.FC<LeftToolDrawerProps> = ({
  activeTab,
  isOpen,
  onToggleOpen,
  layers,
  selectedLayerId,
  onSelectLayer,
  onSetLayers,
  aspectRatio,
  onSetAspectRatio,
  canvasBgColor,
  onSetCanvasBgColor,
  onAddNewMotionLayer,
  onAddNewSvgLayer,
  onAddNewHtmlLayer,
  onOpenPasteModal,
  onOpenExportModal,
  copiedConfig,
  onCopyConfig,
  onPasteConfig
}) => {
  // Text Tool State
  const [textContent, setTextContent] = useState('HMA INLUMENAI');
  const [selectedFont, setSelectedFont] = useState<'Aeonik' | 'Dosis' | 'General Sans' | 'Newsreader'>('Aeonik');
  const [textRole, setTextRole] = useState<'display' | 'title' | 'body'>('display');
  const [textColor, setTextColor] = useState('#FEFAE8');

  // Insert Canonical Shape
  const handleInsertShape = (type: 'circle' | 'rect-6m' | 'rect-4m' | 'rect-2m', rotation = 0) => {
    let svg = '';
    let name = '';
    const color = '#3D80FD';

    if (type === 'circle') {
      name = 'Forma #13 (Círculo Central)';
      svg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="48" fill="${color}" />
      </svg>`;
    } else if (type === 'rect-6m') {
      name = `Rectángulo Canónico 1M×6M (${rotation}°)`;
      svg = `<svg viewBox="0 0 200 500" xmlns="http://www.w3.org/2000/svg">
        <rect x="66" y="49" width="67" height="402" rx="33.5" ry="33.5" fill="${color}" transform="rotate(${rotation} 100 250)" />
      </svg>`;
    } else if (type === 'rect-4m') {
      name = `Rectángulo Canónico 1M×4M (${rotation}°)`;
      svg = `<svg viewBox="0 0 200 360" xmlns="http://www.w3.org/2000/svg">
        <rect x="66" y="46" width="67" height="268" rx="33.5" ry="33.5" fill="${color}" transform="rotate(${rotation} 100 180)" />
      </svg>`;
    } else {
      name = `Rectángulo Canónico 1M×2M (${rotation}°)`;
      svg = `<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
        <rect x="66" y="43" width="67" height="134" rx="33.5" ry="33.5" fill="${color}" transform="rotate(${rotation} 100 110)" />
      </svg>`;
    }

    onAddNewSvgLayer(svg, name);
  };

  // Insert Brand Text SVG Layer
  const handleInsertText = () => {
    const fontSize = textRole === 'display' ? 56 : textRole === 'title' ? 36 : 20;
    const tracking = selectedFont === 'Aeonik' ? 'letter-spacing="0.05em"' : '';
    const fontWeight = selectedFont === 'Aeonik' ? 700 : selectedFont === 'Dosis' ? 600 : 500;
    const width = Math.max(380, textContent.length * 28);
    const height = fontSize * 2.2;

    const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="'${selectedFont}', sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" fill="${textColor}" ${tracking}>
        ${textContent}
      </text>
    </svg>`;

    onAddNewSvgLayer(svg, `Texto (${selectedFont})`);
  };

  // Insert Service Preset
  const handleInsertService = (srv: typeof HMA_SERVICES[0]) => {
    onAddNewMotionLayer(srv.srvId);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        title="Expandir panel lateral"
        className="absolute top-1/2 -translate-y-1/2 left-16 z-30 w-5 h-12 bg-[#060C04] hover:bg-[#3D80FD] border-y border-r border-white/20 rounded-r-lg flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    );
  }

  const tabTitles: Record<LeftRailTab, { title: string; subtitle: string }> = {
    library: { title: 'Biblioteca de Servicios', subtitle: '12 Disciplinas Canónicas HMA' },
    layers: { title: 'Composición de Capas', subtitle: 'Pila de elementos y físicas' },
    elements: { title: 'Formas Canónicas', subtitle: '13 Geometrías de la Luz' },
    text: { title: 'Tipografía de Marca', subtitle: 'Aeonik, Dosis, General Sans' },
    background: { title: 'Fondo del Lienzo', subtitle: 'Luz, Profundo y Malla Picsart' },
    canvas: { title: 'Formato y Lienzo', subtitle: 'Proporciones de visualización' }
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.layers;

  return (
    <aside className="relative w-80 max-w-[85vw] sm:w-80 shrink-0 bg-[#060C04]/98 border-r border-white/10 flex flex-col h-full z-20 shadow-2xl select-none">
      {/* Collapse Handle Tab (Picsart Web Edge Tab) */}
      <button
        onClick={onToggleOpen}
        title="Colapsar panel lateral"
        className="absolute top-1/2 -translate-y-1/2 -right-3.5 z-30 w-4 h-12 bg-[#060C04] hover:bg-[#3D80FD] border border-white/20 rounded-r-md flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Drawer Header */}
      <div className="p-3.5 border-b border-white/10 bg-black/40 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5 font-mono uppercase">
            {currentTabInfo.title}
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {currentTabInfo.subtitle}
          </p>
        </div>
        <button
          onClick={onToggleOpen}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Ocultar cajón"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content Views */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* VIEW 1: BIBLIOTECA (12 Servicios HMA) */}
        {activeTab === 'library' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-200">
              Selecciona una de las 12 disciplinas para inyectar su isotipo o secuencia en el lienzo de trabajo.
            </div>

            <div className="grid grid-cols-1 gap-2">
              {HMA_SERVICES.map((srv) => (
                <div
                  key={srv.name}
                  className="p-2.5 rounded-xl border border-white/10 bg-slate-900/40 hover:bg-slate-800/60 hover:border-white/20 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm font-mono"
                      style={{ backgroundColor: srv.profundo, border: `2px solid ${srv.luz}` }}
                    >
                      {srv.code}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#3D80FD] transition-colors">
                        {srv.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {srv.desc}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInsertService(srv)}
                    className="p-1.5 px-2 rounded-lg bg-white/5 hover:bg-[#3D80FD] text-slate-300 hover:text-white text-[10px] font-semibold transition-colors flex items-center gap-1"
                    title={`Añadir secuencia ${srv.name} al lienzo`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: CAPAS (Layers Manager & Import Actions) */}
        {activeTab === 'layers' && (
          <div className="space-y-3">
            {/* Quick Layer Adders */}
            <div className="space-y-2">
              <button
                onClick={() => onAddNewMotionLayer('all')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#3D80FD] to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-98 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>+ Secuencia Inlumenai (Ciclo)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onOpenPasteModal}
                  className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pegar SVG</span>
                </button>

                <label className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cargar SVG</span>
                  <input
                    type="file"
                    accept=".svg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const code = ev.target?.result as string;
                          if (code) onAddNewSvgLayer(code, file.name.replace('.svg', ''));
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                <label className="col-span-2 py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer">
                  <FileCode className="w-3.5 h-3.5 text-orange-400" />
                  <span>Cargar HTML para Convertir a Video</span>
                  <input
                    type="file"
                    accept=".html"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const code = ev.target?.result as string;
                          if (code) onAddNewHtmlLayer(code, file.name.replace('.html', ''));
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Layer Stack */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-2 flex items-center justify-between">
                <span>Capas ({layers.length})</span>
                <span className="text-[9px] text-cyan-400">Clic para editar</span>
              </div>

              {layers.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-white/15 text-center text-slate-400 text-xs">
                  Lienzo vacío. Añade una capa SVG o secuencia arriba.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {layers.map((layer) => {
                    const isMotion = layer.isMotionSequence || layer.animationType === 'inlumenai-morph';
                    const isSelected = layer.id === selectedLayerId;

                    return (
                      <div
                        key={layer.id}
                        onClick={() => onSelectLayer(layer.id)}
                        className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#3D80FD]/20 border-[#3D80FD]/60 text-white font-semibold shadow-md'
                            : 'bg-slate-900/60 hover:bg-slate-800/80 border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`p-1 rounded text-[9px] font-mono ${
                              isMotion
                                ? 'bg-purple-900/60 text-cyan-300 font-bold border border-purple-400/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isMotion ? 'M' : 'SVG'}
                          </span>
                          <span className="truncate max-w-[130px]">{layer.name}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Copy config */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCopyConfig(layer);
                            }}
                            title={`Copiar físicas de "${layer.name}"`}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Copy className="w-3 h-3" />
                          </button>

                          {/* Paste config */}
                          {copiedConfig && copiedConfig.sourceLayerId !== layer.id && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPasteConfig(layer.id);
                              }}
                              title="Pegar físicas"
                              className="p-1 text-cyan-400 hover:text-cyan-200"
                            >
                              <ClipboardPaste className="w-3 h-3" />
                            </button>
                          )}

                          {/* Visibility */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetLayers((prev) =>
                                prev.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l))
                              );
                            }}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            {layer.visible ? (
                              <Eye className="w-3 h-3 text-cyan-400" />
                            ) : (
                              <EyeOff className="w-3 h-3 text-slate-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: FORMAS (13 Formas Canónicas) */}
        {activeTab === 'elements' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-200">
              Formas de "La Arquitectura de la Luz": 12 rectángulos en posiciones horarias (ángulos -45°, 45°, 15°, -105°) y 1 círculo central.
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleInsertShape('circle')}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#3D80FD] shadow-sm shadow-[#3D80FD]/50" />
                  <span>Forma #13 (Círculo Central)</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={() => handleInsertShape('rect-6m', 45)}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-6 rounded-full bg-[#3D80FD] rotate-45 shadow-sm shadow-[#3D80FD]/50" />
                  <span>Rectángulo 1M×6M (45°)</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={() => handleInsertShape('rect-6m', -45)}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-6 rounded-full bg-[#3D80FD] -rotate-45 shadow-sm shadow-[#3D80FD]/50" />
                  <span>Rectángulo 1M×6M (-45°)</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={() => handleInsertShape('rect-4m', 15)}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-5 rounded-full bg-[#3D80FD] rotate-15 shadow-sm shadow-[#3D80FD]/50" />
                  <span>Rectángulo 1M×4M (15°)</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={() => handleInsertShape('rect-2m', -105)}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-4 rounded-full bg-[#3D80FD] rotate-45 shadow-sm shadow-[#3D80FD]/50" />
                  <span>Rectángulo 1M×2M (-105°)</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: TEXTO (Tipografías Canónicas) */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Contenido del Texto
              </label>
              <input
                type="text"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Escribe el texto aquí..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-hidden focus:border-[#3D80FD]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Tipografía Oficial
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Aeonik', 'Dosis', 'General Sans', 'Newsreader'] as const).map((font) => (
                  <button
                    key={font}
                    onClick={() => setSelectedFont(font)}
                    className={`p-2 rounded-xl border text-xs text-left transition-all ${
                      selectedFont === font
                        ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white font-bold'
                        : 'border-white/10 bg-slate-900/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="block">{font}</span>
                    <span className="text-[9px] text-slate-500 font-normal">
                      {font === 'Aeonik'
                        ? 'Wordmark / Display'
                        : font === 'Dosis'
                        ? 'Títulos Servicios'
                        : font === 'General Sans'
                        ? 'Cuerpo / UI'
                        : 'Editorial'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Jerarquía
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setTextRole('display')}
                  className={`py-1.5 rounded-lg border text-xs ${
                    textRole === 'display'
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold'
                      : 'border-white/10 text-slate-400'
                  }`}
                >
                  Display (56px)
                </button>
                <button
                  onClick={() => setTextRole('title')}
                  className={`py-1.5 rounded-lg border text-xs ${
                    textRole === 'title'
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold'
                      : 'border-white/10 text-slate-400'
                  }`}
                >
                  Título (36px)
                </button>
                <button
                  onClick={() => setTextRole('body')}
                  className={`py-1.5 rounded-lg border text-xs ${
                    textRole === 'body'
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold'
                      : 'border-white/10 text-slate-400'
                  }`}
                >
                  Cuerpo (20px)
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                Color de Texto
              </label>
              <div className="flex items-center gap-2">
                {['#FEFAE8', '#060C04', '#3D80FD', '#11D7B6', '#D7BB11', '#D96B43'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      textColor === c ? 'scale-110 border-white shadow-md' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleInsertText}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#3D80FD] to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 active:scale-98 transition-all pt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insertar Texto en Lienzo</span>
            </button>
          </div>
        )}

        {/* VIEW 5: FONDO (Colores y Picsart Checkered) */}
        {activeTab === 'background' && (
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              Fondo del Lienzo de Renderizado
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSetCanvasBgColor('#060C04')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  canvasBgColor === '#060C04'
                    ? 'bg-slate-900 border-[#3D80FD] text-white shadow-md'
                    : 'border-white/10 bg-slate-950 text-slate-400'
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-[#060C04] border border-white/20" />
                <div>
                  <div className="text-xs font-bold">Modo Profundo</div>
                  <div className="text-[10px] text-slate-500 font-mono">#060C04</div>
                </div>
              </button>

              <button
                onClick={() => onSetCanvasBgColor('#FEFAE8')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  canvasBgColor === '#FEFAE8'
                    ? 'bg-slate-900 border-[#3D80FD] text-white shadow-md'
                    : 'border-white/10 bg-slate-950 text-slate-400'
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-[#FEFAE8] border border-black/20" />
                <div>
                  <div className="text-xs font-bold">Modo Luz</div>
                  <div className="text-[10px] text-slate-500 font-mono">#FEFAE8</div>
                </div>
              </button>

              <button
                onClick={() => onSetCanvasBgColor('checkered')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  canvasBgColor === 'checkered'
                    ? 'bg-slate-900 border-[#3D80FD] text-white shadow-md'
                    : 'border-white/10 bg-slate-950 text-slate-400'
                }`}
              >
                <div className="w-5 h-5 rounded-md picsart-checkered-bg border border-white/20" />
                <div>
                  <div className="text-xs font-bold">Transparente</div>
                  <div className="text-[10px] text-slate-500 font-mono">Picsart Grid</div>
                </div>
              </button>

              <button
                onClick={() => onSetCanvasBgColor('#3D80FD')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  canvasBgColor === '#3D80FD'
                    ? 'bg-slate-900 border-[#3D80FD] text-white shadow-md'
                    : 'border-white/10 bg-slate-950 text-slate-400'
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-[#3D80FD] border border-white/20" />
                <div>
                  <div className="text-xs font-bold">Brand Luz</div>
                  <div className="text-[10px] text-slate-500 font-mono">#3D80FD</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 6: LIENZO (Proporciones y Aspect Ratio) */}
        {activeTab === 'canvas' && (
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              Relación de Aspecto
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSetAspectRatio('16:9')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === '16:9'
                    ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white font-bold shadow-md'
                    : 'border-white/10 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Monitor className="w-5 h-5 text-cyan-400" />
                <span className="text-xs">16:9 HD</span>
                <span className="text-[10px] font-mono text-slate-500">1920 × 1080</span>
              </button>

              <button
                onClick={() => onSetAspectRatio('21:9')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === '21:9'
                    ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white font-bold shadow-md'
                    : 'border-white/10 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Maximize2 className="w-5 h-5 text-orange-400" />
                <span className="text-xs">21:9 Cine</span>
                <span className="text-[10px] font-mono text-slate-500">2560 × 1080</span>
              </button>

              <button
                onClick={() => onSetAspectRatio('9:16')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === '9:16'
                    ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white font-bold shadow-md'
                    : 'border-white/10 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-5 h-5 text-purple-400" />
                <span className="text-xs">9:16 Móvil</span>
                <span className="text-[10px] font-mono text-slate-500">1080 × 1920</span>
              </button>

              <button
                onClick={() => onSetAspectRatio('1:1')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  aspectRatio === '1:1'
                    ? 'bg-[#3D80FD]/20 border-[#3D80FD] text-white font-bold shadow-md'
                    : 'border-white/10 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Crop className="w-5 h-5 text-emerald-400" />
                <span className="text-xs">1:1 Canónico</span>
                <span className="text-[10px] font-mono text-slate-500">1080 × 1080</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-3 border-t border-white/10 bg-black/50">
        <button
          onClick={onOpenExportModal}
          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
        >
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Opciones de Exportación</span>
        </button>
      </div>
    </aside>
  );
};
