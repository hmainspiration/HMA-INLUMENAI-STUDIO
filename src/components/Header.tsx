/**
 * HMA INLUMENAI STUDIO (v2026.28)
 * Main Navigation, Template Selector, Dropdown Menus & Project/SVG Import
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Layers,
  Film,
  Download,
  Anchor,
  Sun,
  Moon,
  HelpCircle,
  ChevronDown,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  Save,
  Upload,
  ExternalLink,
  RotateCcw,
  Search,
  CheckCircle,
  FilePlus,
  FolderOpen
} from 'lucide-react';
import { AppToolMode, PaletteMode } from '../types/hma';
import { APP_VERSION, HMA_PRESETS, MASTER_VARIANTS } from '../data/hmaDefinitions';

interface HeaderProps {
  activeTool: AppToolMode;
  setActiveTool: (tool: AppToolMode) => void;
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  paletteMode: PaletteMode;
  onTogglePalette: () => void;
  onAnchorBase: () => void;
  onExportCleanSvg: () => void;
  onExportBlueprint: () => void;
  onExportPng: (scale: 2 | 4) => void;
  onSaveJson: () => void;
  onLoadJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSvg?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenOrientation: () => void;
  onResetCanvas: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTool,
  setActiveTool,
  activePresetId,
  onSelectPreset,
  paletteMode,
  onTogglePalette,
  onAnchorBase,
  onExportCleanSvg,
  onExportBlueprint,
  onExportPng,
  onSaveJson,
  onLoadJson,
  onLoadSvg,
  onOpenOrientation,
  onResetCanvas
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [importMenuOpen, setImportMenuOpen] = useState(false);
  const [presetSearch, setPresetSearch] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('todos');

  const presetDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const importDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (presetDropdownRef.current && !presetDropdownRef.current.contains(event.target as Node)) {
        setPresetDropdownOpen(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
      if (importDropdownRef.current && !importDropdownRef.current.contains(event.target as Node)) {
        setImportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentPreset =
    HMA_PRESETS.find((p) => p.id === activePresetId) || HMA_PRESETS[0];

  // Clusters list
  const clusters = [
    { id: 'todos', name: 'Todos los Isotipos' },
    { id: 'Ecosistema Matriz', name: 'Ecosistema Matriz' },
    { id: 'Clúster 01 — Creación & Forma', name: '01 Creación & Forma' },
    { id: 'Clúster 02 — Óptica & Sonido', name: '02 Óptica & Sonido' },
    { id: 'Clúster 03 — Estructura & Pensamiento', name: '03 Estructura & Legado' },
    { id: 'Clúster 04 — Tecnología & Materia', name: '04 Tecnología & Materia' },
    { id: 'Variantes Master', name: 'Variantes Master' }
  ];

  // Filter presets
  const filteredPresets = HMA_PRESETS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.cluster.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(presetSearch.toLowerCase());
    const matchesCluster =
      selectedClusterFilter === 'todos' || p.cluster === selectedClusterFilter;
    return matchesSearch && matchesCluster;
  });

  return (
    <header className="h-16 border-b border-white/10 bg-[#081126]/90 backdrop-blur-md sticky top-0 z-50 px-4 flex items-center justify-between gap-3 select-none">
      {/* Brand & Version Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="font-mono font-black text-white text-xs tracking-tighter">HMA</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-white text-sm tracking-tight hidden sm:inline-block">
                HMA INLUMENAI STUDIO
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm">
                {APP_VERSION}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              1M = 67px • Sistema Paramétrico de 13 Formas
            </p>
          </div>
        </div>

        {/* Quick Anchor Base Button */}
        <button
          id="btn-anchor-base-header"
          onClick={onAnchorBase}
          title="Restaura la alineación canónica de las 7 piezas base inferiores"
          className="ml-1 hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 transition-all active:scale-95 shadow-sm"
        >
          <Anchor className="w-3.5 h-3.5 text-cyan-400" />

        </button>
      </div>

      {/* Center: Template Selector & Palette */}
      <div className="flex items-center gap-2">
        {/* Preset Selector Dropdown */}
        <div className="relative" ref={presetDropdownRef}>
          <button
            onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-white/10 hover:border-cyan-500/50 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[130px] sm:max-w-[180px] truncate font-semibold">
              {currentPreset.name}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${presetDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
          </button>

          {presetDropdownOpen && (
            <div className="absolute left-0 mt-2 w-84 max-h-[480px] overflow-hidden rounded-xl bg-[#081126] border border-white/15 shadow-2xl z-50 backdrop-blur-xl flex flex-col animate-fadeIn">
              {/* Header & Search */}
              <div className="p-3 border-b border-white/10 bg-slate-900/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 font-bold uppercase">
                  <span>Catálogo de 13 Isotipos & Variantes</span>
                  <span className="text-[9px] text-slate-400">{HMA_PRESETS.length} Plantillas</span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Buscar plantilla o clúster..."
                    value={presetSearch}
                    onChange={(e) => setPresetSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                  {clusters.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClusterFilter(c.id)}
                      className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                        selectedClusterFilter === c.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 max-h-72">
                {filteredPresets.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 text-center">
                    No se encontraron plantillas con ese criterio.
                  </p>
                ) : (
                  filteredPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset.id);
                        setPresetDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        preset.id === activePresetId
                          ? 'bg-cyan-500/20 text-cyan-200 font-semibold border border-cyan-500/40 shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-1.5">
                          <span>{preset.name}</span>
                          {preset.id === activePresetId && (
                            <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {preset.description}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2 shrink-0">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: preset.colorLuz }}
                          title={`Color Luz: ${preset.colorLuz}`}
                        />
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: preset.colorProfundo }}
                          title={`Color Profundo: ${preset.colorProfundo}`}
                        />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chromatic Palette Toggle (Luz / Profundo) */}
        <button
          id="btn-palette-toggle"
          onClick={onTogglePalette}
          title={`Cambiar a paleta ${paletteMode === 'luz' ? 'Profunda' : 'Luz'}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-white/10 transition-colors shadow-sm"
        >
          {paletteMode === 'luz' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-cyan-300 font-semibold">Luz</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline text-indigo-300 font-semibold">Profundo</span>
            </>
          )}
        </button>
      </div>

      {/* Tool Navigation Switcher Tabs */}
      <nav className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 shadow-inner">
        <button
          id="tab-tool-matrix"
          onClick={() => setActiveTool('matrix')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTool === 'matrix'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden md:inline">1. Matrix</span>
          <span className="md:hidden">Matrix</span>
        </button>

        <button
          id="tab-tool-motion"
          onClick={() => setActiveTool('motion')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTool === 'motion'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span className="hidden md:inline">2. Motion</span>
          <span className="md:hidden">Motion</span>
        </button>

        <button
          id="tab-tool-canvas"
          onClick={() => setActiveTool('canvas')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTool === 'canvas'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">3. Animation</span>
          <span className="md:hidden">Canvas</span>
        </button>
      </nav>

      {/* Export & Utility Actions */}
      <div className="flex items-center gap-2">
        {/* Import SVG & JSON Menu Dropdown */}
        <div className="relative" ref={importDropdownRef}>
          <button
            onClick={() => setImportMenuOpen(!importMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition-colors shadow-sm"
            title="Cargar archivo SVG o JSON"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Cargar Archivo</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {importMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#081126] border border-white/15 shadow-2xl p-2 z-50 backdrop-blur-xl animate-fadeIn">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400">
                Importación de Archivos
              </div>

              {/* Cargar SVG */}
              <label className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold">Cargar Archivo SVG (.svg)</div>
                  <div className="text-[10px] text-slate-400">Importa vectores como capas editables</div>
                </div>
                <input
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={(e) => {
                    if (onLoadSvg) onLoadSvg(e);
                    setImportMenuOpen(false);
                  }}
                  className="hidden"
                />
              </label>

              {/* Cargar JSON */}
              <label className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer">
                <FolderOpen className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold">Cargar Proyecto JSON (.json)</div>
                  <div className="text-[10px] text-slate-400">Restaura sesión completa guardada</div>
                </div>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => {
                    onLoadJson(e);
                    setImportMenuOpen(false);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Export Suite Dropdown */}
        <div className="relative" ref={exportDropdownRef}>
          <button
            id="btn-export-dropdown"
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-bold transition-all shadow-md shadow-cyan-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {exportOpen && (
            <div className="absolute right-0 mt-2 w-68 rounded-xl bg-[#081126] border border-white/15 shadow-2xl p-2 z-50 backdrop-blur-xl animate-fadeIn">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400">
                Formatos de Producción
              </div>

              <button
                onClick={() => {
                  onExportCleanSvg();
                  setExportOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
              >
                <FileCode className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-semibold">SVG Vectorial Limpio</div>
                  <div className="text-[10px] text-slate-400">Sin clases CSS ni basura DOM</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onExportBlueprint();
                  setExportOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold">Blueprint Técnico (Cotas M)</div>
                  <div className="text-[10px] text-slate-400">Con retícula milimétrica y metadatos</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onExportPng(2);
                  setExportOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-semibold">PNG Alta Resolución (@2x)</div>
                  <div className="text-[10px] text-slate-400">Fondo transparente nítido</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onExportPng(4);
                  setExportOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="font-semibold">PNG Ultra Retina (@4x)</div>
                  <div className="text-[10px] text-slate-400">Para impresión y gigantografías</div>
                </div>
              </button>

              <div className="border-t border-white/10 my-1 pt-1 px-2 text-[10px] font-mono uppercase text-slate-400">
                Gestión de Proyecto
              </div>

              <button
                onClick={() => {
                  onSaveJson();
                  setExportOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-semibold">Guardar Proyecto (.JSON)</div>
                  <div className="text-[10px] text-slate-400">Descarga archivo de sesión completo</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Orientation Modal Trigger (Guía para no programadores) */}
        <button
          onClick={onOpenOrientation}
          title="Guía interactiva para usuarios y directores de arte"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Reset Canvas Button */}
        <button
          onClick={onResetCanvas}
          title="Restablecer lienzo a la plantilla original"
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-slate-400 hover:text-white" />
        </button>
      </div>
    </header>
  );
};
