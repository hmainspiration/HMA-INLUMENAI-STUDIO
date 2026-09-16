/**
 * HMA INLUMENAI STUDIO (v2026.28)
 * Picsart-Inspired Studio Header & Context Toolbar
 * Designed for Desktop and Mobile with HMA Brand Standards
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Film,
  Download,
  Sun,
  Moon,
  HelpCircle,
  ChevronDown,
  FileCode,
  Image as ImageIcon,
  Save,
  Upload,
  RotateCcw,
  RotateCw,
  Search,
  CheckCircle,
  FolderOpen,
  LayoutGrid,
  Home,
  User,
  Plus,
  Sliders,
  Maximize2,
  SlidersHorizontal,
  Layers,
  Palette,
  Check,
  X,
  Edit2
} from 'lucide-react';
import { AppToolMode, PaletteMode } from '../types/hma';
import { APP_VERSION, HMA_PRESETS } from '../data/hmaDefinitions';
import { HmaMasterIcon } from './HmaMasterIcon';

interface HeaderProps {
  activeTool: AppToolMode;
  setActiveTool: (tool: AppToolMode) => void;
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  paletteMode: PaletteMode;
  onTogglePalette: () => void;
  onExportCleanSvg: () => void;
  onExportPng: (scale: 2 | 4) => void;
  onSaveJson: () => void;
  onLoadJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSvg?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenOrientation: () => void;
  onResetCanvas: () => void;
  onOpenDashboard?: () => void;
  projectName?: string;
  onUpdateProjectName?: (name: string) => void;
  onNewProject?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTool,
  setActiveTool,
  activePresetId,
  onSelectPreset,
  paletteMode,
  onTogglePalette,
  onExportCleanSvg,
  onExportPng,
  onSaveJson,
  onLoadJson,
  onLoadSvg,
  onOpenOrientation,
  onResetCanvas,
  onOpenDashboard,
  projectName = 'Proyecto Inlumenai 01',
  onUpdateProjectName,
  onNewProject,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = false
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [importMenuOpen, setImportMenuOpen] = useState(false);
  const [presetSearch, setPresetSearch] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('todos');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(projectName);

  const presetDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const importDropdownRef = useRef<HTMLDivElement>(null);

  // Sync tempTitle when projectName prop changes
  useEffect(() => {
    setTempTitle(projectName);
  }, [projectName]);

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

  const clusters = [
    { id: 'todos', name: 'Todos los Isotipos' },
    { id: 'Ecosistema Matriz', name: 'Ecosistema Matriz' },
    { id: 'Clúster 01 — Creación & Forma', name: '01 Creación & Forma' },
    { id: 'Clúster 02 — Óptica & Sonido', name: '02 Óptica & Sonido' },
    { id: 'Clúster 03 — Estructura & Pensamiento', name: '03 Estructura & Legado' },
    { id: 'Clúster 04 — Tecnología & Materia', name: '04 Tecnología & Materia' },
    { id: 'Variantes Master', name: 'Variantes Master' }
  ];

  const filteredPresets = HMA_PRESETS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.cluster.toLowerCase().includes(presetSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(presetSearch.toLowerCase());
    const matchesCluster =
      selectedClusterFilter === 'todos' || p.cluster === selectedClusterFilter;
    return matchesSearch && matchesCluster;
  });

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim() && onUpdateProjectName) {
      onUpdateProjectName(tempTitle.trim());
    }
  };

  return (
    <div className="flex flex-col z-50 select-none">
      {/* 1. MASTER TOP HEADER (Picsart Desktop + Mobile Bar) */}
      <header className="h-14 border-b border-white/10 bg-[#060C04]/95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-2 safe-area-pt">
        
        {/* === MOBILE TOP BAR (Picsart Mobile Style: < Back, Undo, Redo, Save, Export) === */}
        <div className="flex sm:hidden w-full items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenDashboard}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 active:scale-95 transition-all"
              title="Volver a secciones"
            >
              <Home className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onUndo}
              className={`p-2 rounded-xl bg-white/5 text-slate-300 active:scale-95 transition-all ${!canUndo ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10'}`}
              title="Deshacer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              className={`p-2 rounded-xl bg-white/5 text-slate-300 active:scale-95 transition-all ${!canRedo ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10'}`}
              title="Rehacer"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Center Isotype Preset Quick Dropdown (Mobile) */}
          <div className="relative" ref={presetDropdownRef}>
            <button
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 text-xs font-semibold text-slate-200 border border-white/15 max-w-[130px]"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: currentPreset.colorLuz }}
              />
              <span className="truncate text-[11px]">{currentPreset.name.replace('HMA ', '')}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onSaveJson}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 active:scale-95 transition-all"
              title="Guardar archivo de proyecto"
            >
              <Save className="w-4 h-4 text-amber-400" />
            </button>

            {/* Mobile Pill Export Button */}
            <button
              onClick={() => setExportOpen(true)}
              className="px-3 py-1.5 rounded-full bg-[#3D80FD] text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-[#3D80FD]/30 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* === DESKTOP TOP BAR (Picsart Web Style: Home, Workspace, Project Tab, Studio Tabs, Actions, Primary Pill) === */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Home / Sections Dashboard Button */}
          <button
            onClick={onOpenDashboard}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-[#3D80FD]/20 border border-white/10 hover:border-[#3D80FD]/50 flex items-center justify-center text-slate-300 hover:text-white transition-all group"
            title="Inicio / Selector de Secciones HMA"
          >
            <Home className="w-4 h-4 text-slate-300 group-hover:text-[#3D80FD] transition-colors" />
          </button>

          {/* Account / Studio Brand Workspace Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-black/40 border border-white/10">
            <div className="w-5 h-5 rounded-lg bg-[#0e1722] flex items-center justify-center p-0.5 border border-white/15">
              <HmaMasterIcon size={16} />
            </div>
            <span className="text-xs font-bold text-white tracking-tight">INLUMENAI</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#3D80FD]/20 text-[#3D80FD] border border-[#3D80FD]/30">
              {APP_VERSION}
            </span>
          </div>

          <div className="h-5 w-[1px] bg-white/10" />

          {/* Project Tab (Picsart Web browser-tab style) */}
          <div className="flex items-center gap-1 bg-[#101622] px-3 py-1 rounded-t-lg border-t-2 border-[#3D80FD] border-x border-white/10 max-w-[220px] group shadow-inner">
            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') setIsEditingTitle(false);
                  }}
                  autoFocus
                  className="bg-black/80 text-xs text-white px-1.5 py-0.5 rounded border border-[#3D80FD] w-32 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveTitle}
                  className="p-0.5 text-emerald-400 hover:text-emerald-300"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white font-medium truncate cursor-pointer"
                title="Haga clic para renombrar proyecto"
              >
                <span className="truncate">{projectName}</span>
                <Edit2 className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            
            {onResetCanvas && (
              <button
                type="button"
                onClick={onResetCanvas}
                className="text-slate-500 hover:text-slate-300 p-0.5 rounded hover:bg-white/10 ml-1"
                title="Restablecer proyecto a su estado inicial"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Add New Project (+) button */}
          {onNewProject && (
            <button
              onClick={onNewProject}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Nuevo proyecto en blanco"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Center: Studio Module Tabs (1 Hipergrid ➔ 2 Motion ➔ 3 Animation) */}
        <nav className="hidden lg:flex items-center bg-black/50 p-1 rounded-full border border-white/10 shadow-inner">
          <button
            id="tab-tool-matrix"
            onClick={() => setActiveTool('matrix')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTool === 'matrix'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
              activeTool === 'matrix' ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              1
            </span>
            <FileCode className="w-3.5 h-3.5" />
            <span>Hipergrid</span>
          </button>

          <span className="text-slate-600 px-1 font-mono text-xs select-none">➔</span>

          <button
            id="tab-tool-motion"
            onClick={() => setActiveTool('motion')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTool === 'motion'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
              activeTool === 'motion' ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              2
            </span>
            <Film className="w-3.5 h-3.5" />
            <span>Motion</span>
          </button>

          <span className="text-slate-600 px-1 font-mono text-xs select-none">➔</span>

          <button
            id="tab-tool-canvas"
            onClick={() => setActiveTool('canvas')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTool === 'canvas'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
              activeTool === 'canvas' ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </span>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Animation</span>
          </button>
        </nav>

        {/* Right Toolbar & Picsart Primary Pill Action */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Undo / Redo controls */}
          <div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-white/10">
            <button
              onClick={onUndo}
              className={`p-1.5 rounded-lg text-slate-300 transition-colors ${!canUndo ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10 hover:text-white'}`}
              title="Deshacer (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              className={`p-1.5 rounded-lg text-slate-300 transition-colors ${!canRedo ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10 hover:text-white'}`}
              title="Rehacer (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Import SVG & JSON Dropdown */}
          <div className="relative" ref={importDropdownRef}>
            <button
              onClick={() => setImportMenuOpen(!importMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition-colors shadow-sm cursor-pointer"
              title="Cargar archivo SVG o JSON"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">Cargar</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {importMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#060C04] border border-white/15 shadow-2xl p-2 z-50 backdrop-blur-xl animate-fadeIn">
                <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400">
                  Importación de Archivos
                </div>

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

          {/* Orientation & Help */}
          <button
            onClick={onOpenOrientation}
            title="Guía interactiva de HMA INLUMENAI"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Picsart-Style Primary Action Button (Brand Blue Pill) */}
          <div className="relative" ref={exportDropdownRef}>
            <button
              id="btn-export-dropdown"
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3D80FD] hover:bg-[#2D60C1] text-white text-xs font-bold transition-all shadow-lg shadow-[#3D80FD]/30 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
              <ChevronDown className="w-3 h-3 text-white/80" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#060C04] border border-white/15 shadow-2xl p-2.5 z-50 backdrop-blur-2xl animate-fadeIn">
                <div className="px-2 py-1 text-[10px] font-mono uppercase text-[#3D80FD] font-bold">
                  Formatos de Producción
                </div>

                <button
                  onClick={() => {
                    onExportCleanSvg();
                    setExportOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">SVG Vectorial Limpio</div>
                    <div className="text-[10px] text-slate-400">Sin clases CSS ni basura DOM</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onExportPng(2);
                    setExportOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">PNG Alta Resolución (@2x)</div>
                    <div className="text-[10px] text-slate-400">Fondo transparente nítido</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onExportPng(4);
                    setExportOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">PNG Ultra Retina (@4x)</div>
                    <div className="text-[10px] text-slate-400">Para impresión y gigantografías</div>
                  </div>
                </button>

                <div className="border-t border-white/10 my-1.5 pt-1.5 px-2 text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Gestión de Proyecto
                </div>

                <button
                  onClick={() => {
                    onSaveJson();
                    setExportOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Guardar Proyecto (.JSON)</div>
                    <div className="text-[10px] text-slate-400">Descarga archivo de sesión completo</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. PICSART CONTEXT SUB-HEADER (Secondary Strip: fx, Isotipos, Paleta, Ratios, Fit) */}
      <div className="hidden md:flex h-10 border-b border-white/5 bg-[#090e15]/95 backdrop-blur-md px-4 items-center justify-between text-xs text-slate-300 select-none">
        {/* Left Side: fx & Quick Isotype Presets & Color */}
        <div className="flex items-center gap-3">
          {/* fx Button */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] font-bold text-cyan-300">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>fx</span>
          </div>

          {/* Quick Isotype Selector Dropdown */}
          <div className="relative" ref={presetDropdownRef}>
            <button
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 transition-colors cursor-pointer"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm border border-white/20"
                style={{ backgroundColor: currentPreset.colorLuz }}
              />
              <span className="font-semibold truncate max-w-[150px]">{currentPreset.name}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${presetDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {presetDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-84 max-h-[440px] overflow-hidden rounded-2xl bg-[#060C04] border border-white/15 shadow-2xl z-50 backdrop-blur-xl flex flex-col animate-fadeIn">
                <div className="p-2.5 border-b border-white/10 bg-slate-900/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 font-bold uppercase">
                    <span>13 Isotipos Canónicos & Variantes</span>
                    <span className="text-[9px] text-slate-400">{HMA_PRESETS.length} Plantillas</span>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      placeholder="Buscar plantilla..."
                      value={presetSearch}
                      onChange={(e) => setPresetSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

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

                <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 max-h-64">
                  {filteredPresets.length === 0 ? (
                    <p className="text-xs text-slate-400 p-4 text-center">
                      No se encontraron plantillas.
                    </p>
                  ) : (
                    filteredPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          onSelectPreset(preset.id);
                          setPresetDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
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

          {/* Palette Mode Quick Switch (Luz vs Profundo) */}
          <button
            onClick={onTogglePalette}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              paletteMode === 'luz'
                ? 'bg-amber-400/20 text-amber-200 border-amber-400/40'
                : 'bg-blue-500/20 text-blue-200 border-blue-400/40'
            }`}
            title={`Modo actual: ${paletteMode === 'luz' ? 'Luz (#FEFAE8)' : 'Profundo (#060C04)'}. Clic para alternar.`}
          >
            {paletteMode === 'luz' ? (
              <>
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Paleta Luz</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-blue-400" />
                <span>Paleta Profundo</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side: Canvas Resolution & Status */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 bg-black/30 px-2 py-0.5 rounded border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Lienzo Listo (1080p Vector)</span>
          </div>

          <button
            onClick={onResetCanvas}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 hover:underline cursor-pointer"
            title="Restablecer posición de capas y zoom"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Centrar Lienzo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
