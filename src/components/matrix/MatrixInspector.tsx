import React from 'react';
import { MatrixShape } from '../../types/matrix';
import { 
  MoveUp, MoveDown, ArrowUpToLine, ArrowDownToLine, 
  Eye, EyeOff, Lock, Unlock, ArrowLeftRight, ArrowUpDown, 
  RotateCw, Plus, Minus, RotateCcw, BoxSelect, Maximize, MousePointer2,
  Trash2
} from 'lucide-react';
import { ShapeColorPicker } from '../common/ShapeColorPicker';

interface MatrixInspectorProps {
  selectedShapes: MatrixShape[];
  onUpdate: (updates: Partial<MatrixShape>) => void;
  onLayerChange: (action: 'front' | 'forward' | 'backward' | 'back') => void;
  onSnapToGrid: () => void;
  snapMode: number;
  onDeleteSelected?: () => void;
}

export const MatrixInspector: React.FC<MatrixInspectorProps> = ({
  selectedShapes,
  onUpdate,
  onLayerChange,
  onSnapToGrid,
  snapMode,
  onDeleteSelected
}) => {
  if (selectedShapes.length === 0) {
    return (
      <div className="w-[300px] shrink-0 flex-shrink-0 bg-[#171d22] border-l border-slate-700/50 p-4 flex flex-col h-full items-center justify-center text-slate-500 font-mono text-xs text-center z-20 relative select-none">
        <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-3 text-slate-400">
          <MousePointer2 className="w-6 h-6 opacity-60" />
        </div>
        <p className="font-semibold text-slate-300">Ninguna Forma Seleccionada</p>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Haz clic en una forma del lienzo<br/>para inspeccionar, transformar o eliminar.</p>
      </div>
    );
  }

  const isMulti = selectedShapes.length > 1;
  const shape = selectedShapes[0];

  const applyToAll = (updates: Partial<MatrixShape>) => {
    onUpdate(updates);
  };

  return (
    <div className="w-[300px] shrink-0 flex-shrink-0 bg-[#171d22] border-l border-slate-700/50 flex flex-col h-full overflow-y-auto font-mono text-[11px] text-slate-300 z-20 relative shadow-[-10px_0_20px_rgba(0,0,0,0.25)] custom-scrollbar">
      <div className="p-3 border-b border-slate-700/50 bg-[#1e262c] flex items-center justify-between sticky top-0 z-10 shadow-md">
        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {isMulti ? `MÚLTIPLES (${selectedShapes.length})` : 'INSPECTOR DE FORMA'}
        </span>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => applyToAll({ hidden: !shape.hidden })} 
            className={`p-1.5 hover:bg-slate-700 rounded text-slate-400 transition-colors ${shape.hidden ? 'bg-slate-800 text-emerald-400' : 'hover:text-white'}`} 
            title={shape.hidden ? 'Mostrar Forma' : 'Ocultar Forma'}
          >
            {shape.hidden ? <EyeOff size={14} className="text-emerald-400" /> : <Eye size={14} />}
          </button>
          <button 
            onClick={() => applyToAll({ locked: !shape.locked })} 
            className={`p-1.5 hover:bg-slate-700 rounded text-slate-400 transition-colors ${shape.locked ? 'bg-amber-500/20 text-amber-400' : 'hover:text-white'}`} 
            title={shape.locked ? 'Desbloquear Forma' : 'Bloquear Forma'}
          >
            {shape.locked ? <Lock size={14} className="text-amber-400" /> : <Unlock size={14} />}
          </button>
          {onDeleteSelected && (
            <button 
              onClick={onDeleteSelected} 
              className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition-colors ml-1 border border-transparent hover:border-red-500/40" 
              title="Eliminar forma(s) seleccionada(s) (Supr / Backspace)"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-5">
        {/* Selector de Color y Paletas de la Forma */}
        <ShapeColorPicker
          currentColor={shape.color || '#3D80FD'}
          onChangeColor={(color) => applyToAll({ color })}
          wireframe={shape.wireframe}
          onToggleWireframe={(wireframe) => applyToAll({ wireframe })}
          isMultiSelection={isMulti}
          shapeCount={selectedShapes.length}
        />

        {/* Capas */}
        {!isMulti && (
          <div className="flex flex-col gap-2">
            <span className="text-slate-500 font-bold">ORDEN Z (CAPAS)</span>
            <div className="grid grid-cols-4 gap-1">
              <button onClick={() => onLayerChange('front')} className="bg-[#263238] border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 p-2 rounded flex justify-center transition-all shadow-sm" title="Traer al Frente"><ArrowUpToLine size={16}/></button>
              <button onClick={() => onLayerChange('forward')} className="bg-[#263238] border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 p-2 rounded flex justify-center transition-all shadow-sm" title="Subir Capa"><MoveUp size={16}/></button>
              <button onClick={() => onLayerChange('backward')} className="bg-[#263238] border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 p-2 rounded flex justify-center transition-all shadow-sm" title="Bajar Capa"><MoveDown size={16}/></button>
              <button onClick={() => onLayerChange('back')} className="bg-[#263238] border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 p-2 rounded flex justify-center transition-all shadow-sm" title="Enviar al Fondo"><ArrowDownToLine size={16}/></button>
            </div>
          </div>
        )}

        {/* Rotación */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-500 font-bold">ROTACIÓN</span>
          <div className="flex gap-2">
            <div className="bg-[#171d22] border border-slate-600 rounded flex items-center px-2 py-1.5 flex-1 shadow-inner focus-within:border-emerald-500 transition-colors">
              <RotateCw size={14} className="text-slate-500 mr-2" />
              <input 
                type="number" 
                value={Math.round(shape.rot)} 
                onChange={e => applyToAll({ rot: Number(e.target.value) })}
                className="bg-transparent w-full outline-none text-white font-bold"
              />
              <span className="text-slate-500">°</span>
            </div>
            <div className="flex gap-1">
               <button onClick={() => applyToAll({ rot: shape.rot - 1 })} className="bg-[#263238] border border-slate-700 hover:border-slate-500 hover:bg-slate-700 px-2 rounded transition-colors shadow-sm text-slate-300">-1°</button>
               <button onClick={() => applyToAll({ rot: shape.rot + 1 })} className="bg-[#263238] border border-slate-700 hover:border-slate-500 hover:bg-slate-700 px-2 rounded transition-colors shadow-sm text-slate-300">+1°</button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1 mt-1">
            <button onClick={() => applyToAll({ rot: shape.rot - 15 })} className="bg-[#263238] hover:bg-slate-700 border border-slate-700 p-1.5 rounded transition-colors shadow-sm text-slate-300">-15°</button>
            <button onClick={() => applyToAll({ rot: shape.rot - 5 })} className="bg-[#263238] hover:bg-slate-700 border border-slate-700 p-1.5 rounded transition-colors shadow-sm text-slate-300">-5°</button>
            <button onClick={() => applyToAll({ rot: shape.rot + 5 })} className="bg-[#263238] hover:bg-slate-700 border border-slate-700 p-1.5 rounded transition-colors shadow-sm text-slate-300">+5°</button>
            <button onClick={() => applyToAll({ rot: shape.rot + 15 })} className="bg-[#263238] hover:bg-slate-700 border border-slate-700 p-1.5 rounded transition-colors shadow-sm text-slate-300">+15°</button>
          </div>
          <div className="grid grid-cols-5 gap-1 mt-1 text-[9px]">
            {[-90, -45, -20, 0, 20, 35, 45, 90, 135, 180].map(a => (
               <button key={a} onClick={() => applyToAll({ rot: a })} className="bg-slate-800 border border-slate-700 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 py-1.5 rounded transition-colors shadow-sm">
                 {a > 0 ? `+${a}` : a}°
               </button>
            ))}
          </div>
        </div>

        {/* Dimensiones */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-500 font-bold">DIMENSIONES (X = 67px)</span>
          <div className="flex gap-2">
            <div className="bg-[#171d22] border border-slate-600 rounded flex items-center px-2 py-1.5 flex-1 shadow-inner focus-within:border-emerald-500 transition-colors">
              <ArrowLeftRight size={14} className="text-slate-500 mr-2" />
              <input 
                type="number" step="0.25"
                value={shape.widthX} 
                onChange={e => applyToAll({ widthX: Number(e.target.value) })}
                className="bg-transparent w-full outline-none text-white font-bold"
              />
              <span className="text-slate-500 font-bold">X</span>
            </div>
            <div className="bg-[#171d22] border border-slate-600 rounded flex items-center px-2 py-1.5 flex-1 shadow-inner focus-within:border-emerald-500 transition-colors">
              <ArrowUpDown size={14} className="text-slate-500 mr-2" />
              <input 
                type="number" step="0.25"
                value={shape.heightX} 
                onChange={e => applyToAll({ heightX: Number(e.target.value) })}
                className="bg-transparent w-full outline-none text-white font-bold"
              />
              <span className="text-slate-500 font-bold">X</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-2 text-[10px]">
            <div className="flex flex-col gap-1.5">
               <span className="text-slate-500 mb-0.5">Preset de Ancho (Grosor):</span>
               <div className="flex gap-1 flex-1">
                  {[0.5, 1, 1.5, 2].map(w => (
                    <button key={w} onClick={() => applyToAll({ widthX: w })} className="bg-slate-800 border border-slate-700 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 flex-1 py-1.5 rounded transition-colors shadow-sm">{w}X</button>
                  ))}
               </div>
            </div>
            <div className="flex flex-col gap-1.5">
               <span className="text-slate-500 mb-0.5">Preset de Alto (Longitud):</span>
               <div className="grid grid-cols-4 gap-1 flex-1">
                  {[1, 2, 2.5, 3, 3.2, 4, 6, 6.5, 8, 10, 30.5].map(h => (
                    <button key={h} onClick={() => applyToAll({ heightX: h })} className="bg-slate-800 border border-slate-700 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 py-1.5 rounded transition-colors shadow-sm">{h}X</button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Posición y Snap */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-500 font-bold">POSICIÓN Y NUDGE</span>
          <div className="flex gap-2">
            <div className="bg-[#171d22] border border-slate-600 rounded flex items-center px-2 py-1.5 flex-1 shadow-inner focus-within:border-emerald-500 transition-colors">
              <span className="text-slate-500 mr-2 font-bold">X</span>
              <input 
                type="number" step="1"
                value={Math.round(shape.x)} 
                onChange={e => applyToAll({ x: Number(e.target.value) })}
                className="bg-transparent w-full outline-none text-white font-bold"
              />
            </div>
            <div className="bg-[#171d22] border border-slate-600 rounded flex items-center px-2 py-1.5 flex-1 shadow-inner focus-within:border-emerald-500 transition-colors">
              <span className="text-slate-500 mr-2 font-bold">Y</span>
              <input 
                type="number" step="1"
                value={Math.round(shape.y)} 
                onChange={e => applyToAll({ y: Number(e.target.value) })}
                className="bg-transparent w-full outline-none text-white font-bold"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-slate-600 text-[10px] uppercase font-bold tracking-wider mb-1">Nudge Modular (X/Y)</span>
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              <button onClick={() => applyToAll({ x: shape.x - 67 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors" title="Izquierda -1X">-1X(X)</button>
              <button onClick={() => applyToAll({ x: shape.x + 67 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors" title="Derecha +1X">+1X(X)</button>
              <button onClick={() => applyToAll({ y: shape.y - 67 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors" title="Arriba -1X">-1X(Y)</button>
              <button onClick={() => applyToAll({ y: shape.y + 67 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors" title="Abajo +1X">+1X(Y)</button>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              <button onClick={() => applyToAll({ x: shape.x - 33.5 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors">-0.5X(X)</button>
              <button onClick={() => applyToAll({ x: shape.x + 33.5 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors">+0.5X(X)</button>
              <button onClick={() => applyToAll({ y: shape.y - 33.5 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors">-0.5X(Y)</button>
              <button onClick={() => applyToAll({ y: shape.y + 33.5 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors">+0.5X(Y)</button>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px]">
              <button onClick={() => applyToAll({ x: shape.x - 1 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors">-1px(X)</button>
              <button onClick={() => applyToAll({ x: shape.x + 1 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors">+1px(X)</button>
              <button onClick={() => applyToAll({ y: shape.y - 1 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors">-1px(Y)</button>
              <button onClick={() => applyToAll({ y: shape.y + 1 })} className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white py-1.5 rounded transition-colors">+1px(Y)</button>
            </div>
          </div>

          <button 
             onClick={onSnapToGrid}
             className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 rounded-lg font-bold transition-all shadow-md shadow-emerald-500/5"
          >
             <Maximize size={16} />
             SNAP GLOBAL AL GRID
          </button>
        </div>

        {/* Zona de Peligro / Eliminar Forma */}
        {onDeleteSelected && (
          <div className="pt-3 border-t border-slate-700/60 mt-1">
            <button
              onClick={onDeleteSelected}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 rounded-lg font-bold transition-all shadow-sm"
              title="Eliminar forma seleccionada (o pulsa tecla Supr / Backspace)"
            >
              <Trash2 size={15} />
              <span>{isMulti ? `ELIMINAR ${selectedShapes.length} FORMAS` : 'ELIMINAR FORMA'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
