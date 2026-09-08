import React from 'react';
import { 
  Plus, Upload, Layers, Grid3x3, MousePointer2, Focus,
  RotateCw, ArrowRightLeft, AppWindow, Eye, 
  Settings2
} from 'lucide-react';

interface MatrixGlobalToolsProps {
  onAddShape: () => void;
  onSelectAll: () => void;
  onImportSvg: () => void;
  onRotateGroup: (angle: number) => void;
  onSnapAll: () => void;
  
  // Canvas / Grid Settings
  showMainGrid: boolean;
  setShowMainGrid: (val: boolean) => void;
  showSubGrid: boolean;
  setShowSubGrid: (val: boolean) => void;
  showDiagonals: boolean;
  showDistances: boolean;
  setShowDistances: (val: boolean) => void;
  setShowDiagonals: (val: boolean) => void;
  
  globalWireframe: boolean;
  setGlobalWireframe: (val: boolean) => void;
  
  bgMode: 'dark' | 'light' | 'blueprint';
  setBgMode: (val: 'dark' | 'light' | 'blueprint') => void;
  
  snapMode: number;
  setSnapMode: (val: number) => void;
}

export const MatrixGlobalTools: React.FC<MatrixGlobalToolsProps> = ({
  onAddShape, onSelectAll, onImportSvg,
  onRotateGroup, onSnapAll,
  showMainGrid, setShowMainGrid,
  showSubGrid, setShowSubGrid,
  showDiagonals, setShowDiagonals, showDistances, setShowDistances,
  globalWireframe, setGlobalWireframe,
  bgMode, setBgMode,
  snapMode, setSnapMode
}) => {

  return (
    <div className="w-64 bg-[#171d22] border-r border-slate-700/50 flex flex-col h-full overflow-y-auto font-mono text-[11px] text-slate-300">
      <div className="p-4 flex flex-col gap-6">
        
        {/* Acciones Generales */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-500 font-bold mb-1">ACCIONES</span>
          <button onClick={onAddShape} className="flex items-center gap-2 w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded transition-colors">
            <Plus size={16} /> AÑADIR FORMA
          </button>
          <button onClick={onSelectAll} className="flex items-center gap-2 w-full px-3 py-2 bg-[#263238] hover:bg-slate-700 text-white rounded transition-colors border border-slate-600">
            <Layers size={16} /> SELECCIONAR TODAS
          </button>
          <button onClick={onImportSvg} className="flex items-center gap-2 w-full px-3 py-2 bg-[#263238] hover:bg-slate-700 text-white rounded transition-colors border border-slate-600">
            <Upload size={16} /> CARGAR SVG
          </button>
        </div>

        {/* Global Group */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-500 font-bold">ACCIONES GLOBALES</span>
          <button onClick={onSnapAll} className="flex items-center gap-2 w-full px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded transition-colors border border-amber-500/30">
            <Focus size={16} /> SNAP GLOBAL
          </button>
          
          <div className="bg-[#263238] p-2 rounded border border-slate-700 mt-1">
            <span className="text-[10px] text-slate-400 mb-1 block flex items-center gap-1"><RotateCw size={12}/> Rotar Grupo Entero</span>
            <div className="grid grid-cols-5 gap-1">
              <button onClick={() => onRotateGroup(-90)} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-300 rounded py-1">-90</button>
              <button onClick={() => onRotateGroup(-15)} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-300 rounded py-1">-15</button>
              <button onClick={() => onRotateGroup(-5)} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-300 rounded py-1">-5</button>
              <button onClick={() => onRotateGroup(5)} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-300 rounded py-1">+5</button>
              <button onClick={() => onRotateGroup(15)} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-300 rounded py-1">+15</button>
            </div>
          </div>
        </div>

        {/* Entorno y Canvas */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-500 font-bold mb-1">ENTORNO Y CANVAS</span>
          
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input type="checkbox" checked={showMainGrid} onChange={e => setShowMainGrid(e.target.checked)} className="accent-emerald-500" />
              Malla 1X (67px)
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input type="checkbox" checked={showSubGrid} onChange={e => setShowSubGrid(e.target.checked)} className="accent-emerald-500" />
              Malla 0.25X (16.75px)
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input type="checkbox" checked={showDiagonals} onChange={e => setShowDiagonals(e.target.checked)} className="accent-emerald-500" />
              Diagonales Maestras (45°)
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input type="checkbox" checked={globalWireframe} onChange={e => setGlobalWireframe(e.target.checked)} className="accent-amber-500" />
              Modo Wireframe Global
            </label>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <span className="text-slate-400">Fondo de Presentación:</span>
            <select 
              value={bgMode} 
              onChange={e => setBgMode(e.target.value as any)}
              className="bg-[#263238] border border-slate-600 text-white p-1.5 rounded focus:outline-none focus:border-emerald-500"
            >
              <option value="light">Claro (Estándar)</option>
              <option value="dark">Oscuro (Oficial)</option>
              <option value="blueprint">Blueprint Técnico</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <span className="text-slate-400">Control de Snap (Magnetismo):</span>
            <select 
              value={snapMode} 
              onChange={e => setSnapMode(Number(e.target.value))}
              className="bg-[#263238] border border-slate-600 text-white p-1.5 rounded focus:outline-none focus:border-emerald-500"
            >
              <option value={67}>1X (67px)</option>
              <option value={33.5}>0.5X (33.5px)</option>
              <option value={16.75}>0.25X (16.75px)</option>
              <option value={1}>Libre (1px)</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
};
