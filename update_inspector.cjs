const fs = require('fs');
let content = fs.readFileSync('src/components/matrix/MatrixInspector.tsx', 'utf8');

const positionSection = `        {/* Posición y Snap */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-500 font-bold">POSICIÓN (PX)</span>
          <div className="flex gap-2">
            <div className="bg-[#263238] border border-slate-600 rounded flex items-center px-2 py-1 flex-1">
              <span className="text-slate-500 mr-2 font-bold">X</span>
              <input 
                type="number" step="1"
                value={Math.round(shape.x)} 
                onChange={e => applyToAll({ x: Number(e.target.value) })}
                className="bg-transparent w-full outline-none text-white font-bold"
              />
            </div>
            <div className="bg-[#263238] border border-slate-600 rounded flex items-center px-2 py-1 flex-1">
              <span className="text-slate-500 mr-2 font-bold">Y</span>
              <input 
                type="number" step="1"
                value={Math.round(shape.y)} 
                onChange={e => applyToAll({ y: Number(e.target.value) })}
                className="bg-transparent w-full outline-none text-white font-bold"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1 text-[10px] mt-1">
            <button onClick={() => applyToAll({ x: shape.x - 67 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded" title="Izquierda -1M">-1M X</button>
            <button onClick={() => applyToAll({ x: shape.x + 67 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded" title="Derecha +1M">+1M X</button>
            <button onClick={() => applyToAll({ y: shape.y - 67 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded" title="Arriba -1M">-1M Y</button>
            <button onClick={() => applyToAll({ y: shape.y + 67 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded" title="Abajo +1M">+1M Y</button>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px]">
            <button onClick={() => applyToAll({ x: shape.x - 33.5 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded">-0.5X</button>
            <button onClick={() => applyToAll({ x: shape.x + 33.5 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded">+0.5X</button>
            <button onClick={() => applyToAll({ y: shape.y - 33.5 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded">-0.5Y</button>
            <button onClick={() => applyToAll({ y: shape.y + 33.5 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded">+0.5Y</button>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px]">
            <button onClick={() => applyToAll({ x: shape.x - 1 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded">-1px X</button>
            <button onClick={() => applyToAll({ x: shape.x + 1 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded">+1px X</button>
            <button onClick={() => applyToAll({ y: shape.y - 1 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded">-1px Y</button>
            <button onClick={() => applyToAll({ y: shape.y + 1 })} className="bg-slate-800 hover:bg-emerald-500/20 text-slate-400 py-1 rounded">+1px Y</button>
          </div>

          <button 
             onClick={onSnapToGrid}
             className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded font-bold transition-colors"
          >
             <Maximize size={14} />
             SNAP GLOBAL AL GRID
          </button>
        </div>`;

content = content.replace(
  /{[\s\S]*?Posición y Snap[\s\S]*?<div className="flex flex-col gap-2">[\s\S]*?SNAP A INTERSECCIÓN \(\{snapMode === 1 \? '1px' : snapMode === 67 \? '1X' : '0.25X\/0.5X'\}\)[\s\S]*?<\/button>[\s\S]*?<\/div>/m,
  positionSection
);

fs.writeFileSync('src/components/matrix/MatrixInspector.tsx', content);
