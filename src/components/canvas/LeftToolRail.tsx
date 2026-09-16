import React from 'react';
import {
  Library,
  Layers,
  Sparkles,
  Type,
  Palette,
  Crop,
  Plus
} from 'lucide-react';

export type LeftRailTab = 'library' | 'layers' | 'elements' | 'text' | 'background' | 'canvas';

interface LeftToolRailProps {
  activeTab: LeftRailTab;
  isDrawerOpen: boolean;
  onSelectTab: (tab: LeftRailTab) => void;
  onToggleDrawer: () => void;
  onQuickAdd: () => void;
  layersCount: number;
}

export const LeftToolRail: React.FC<LeftToolRailProps> = ({
  activeTab,
  isDrawerOpen,
  onSelectTab,
  onToggleDrawer,
  onQuickAdd,
  layersCount
}) => {
  const tools: { id: LeftRailTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'library',
      label: 'Biblioteca',
      icon: <Library className="w-5 h-5" />
    },
    {
      id: 'layers',
      label: 'Capas',
      icon: <Layers className="w-5 h-5" />,
      badge: layersCount
    },
    {
      id: 'elements',
      label: 'Formas',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'text',
      label: 'Texto',
      icon: <Type className="w-5 h-5" />
    },
    {
      id: 'background',
      label: 'Fondo',
      icon: <Palette className="w-5 h-5" />
    },
    {
      id: 'canvas',
      label: 'Lienzo',
      icon: <Crop className="w-5 h-5" />
    }
  ];

  return (
    <nav 
      aria-label="Riel de herramientas Picsart"
      className="w-16 shrink-0 bg-[#060C04]/98 border-r border-white/10 flex flex-col items-center py-3 select-none z-30 justify-between h-full shadow-xl"
    >
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Primary Picsart-Style Add Button */}
        <button
          onClick={onQuickAdd}
          title="Añadir capa rápida (SVG / Secuencia)"
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#3D80FD] to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white flex flex-col items-center justify-center shadow-lg shadow-blue-500/25 active:scale-95 transition-all mb-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Tool Items */}
        <div className="flex flex-col items-center gap-1.5 w-full px-1.5">
          {tools.map((tool) => {
            const isActive = activeTab === tool.id && isDrawerOpen;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  if (activeTab === tool.id && isDrawerOpen) {
                    onToggleDrawer();
                  } else {
                    onSelectTab(tool.id);
                  }
                }}
                className={`w-full py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group ${
                  isActive
                    ? 'bg-[#3D80FD]/20 text-white font-bold border border-[#3D80FD]/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
                title={`${tool.label}${isActive ? ' (Activo - Clic para cerrar cajón)' : ''}`}
              >
                <div className="relative">
                  {tool.icon}
                  {typeof tool.badge === 'number' && tool.badge > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#3D80FD] text-[9px] font-mono text-white flex items-center justify-center font-bold">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-medium tracking-tight">
                  {tool.label}
                </span>

                {/* Left Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#3D80FD] rounded-r-full shadow-sm shadow-[#3D80FD]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Brand Monogram / Bottom Helper */}
      <div className="flex flex-col items-center gap-1 text-slate-500 text-[9px] font-mono">
        <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        <span className="opacity-70">HMA</span>
      </div>
    </nav>
  );
};
