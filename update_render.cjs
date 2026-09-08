const fs = require('fs');

const content = fs.readFileSync('src/components/matrix/MatrixStudio.tsx', 'utf8');

const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('      {/* TOOLBAR */}'));
const endIdx = lines.findIndex(l => l.includes('      {/* CANVAS & RETÍCULA AREA */}'));

if (startIdx !== -1 && endIdx !== -1) {
  const before = lines.slice(0, startIdx).join('\n');
  const after = lines.slice(endIdx).join('\n');

  const newRender = `      <div className="flex flex-1 h-full overflow-hidden">
        <MatrixGlobalTools 
          onAddShape={addShape}
          onSelectAll={selectAllShapes}
          onImportSvg={() => setImportModalOpen(true)}
          onRotateGroup={handleRotateGroup}
          onSnapAll={snapAllToGrid}
          showMainGrid={showMainGrid}
          setShowMainGrid={setShowMainGrid}
          showSubGrid={showSubGrid}
          setShowSubGrid={setShowSubGrid}
          showDiagonals={showDiagonals}
          setShowDiagonals={setShowDiagonals}
          globalWireframe={globalWireframe}
          setGlobalWireframe={setGlobalWireframe}
          bgMode={bgMode}
          setBgMode={setBgMode}
          snapMode={snapMode}
          setSnapMode={setSnapMode}
        />
        
        <div className="flex-1 flex flex-col relative h-full">
          {/* Main Top Header with Tools */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#263238] p-3 shadow-lg z-10 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setGuidesManagerOpen(!guidesManagerOpen)}
                className={\`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all border \${
                  guidesManagerOpen || customizedGuidesCount > 0
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-[#171d22] text-slate-300 border-slate-700 hover:border-slate-500'
                }\`}
              >
                <span>GUÍAS 📐</span>
              </button>

              <button
                onClick={() => setGuidesLocked(!guidesLocked)}
                className={\`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold transition-all border \${
                  guidesLocked
                    ? 'bg-[#171d22] text-amber-300/90 border-amber-500/30 hover:border-amber-400'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                }\`}
              >
                {guidesLocked ? 'Bloqueadas' : 'Editables'}
              </button>
            </div>
            
            <div className="flex items-center gap-2 bg-[#171d22] px-2 py-1 rounded border border-slate-700 text-[11px]">
              <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className="hover:text-emerald-400 px-1 font-bold text-slate-300">-</button>
              <span className="text-emerald-400 font-bold w-10 text-center cursor-pointer" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="hover:text-emerald-400 px-1 font-bold text-slate-300">+</button>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setExportModalOpen(true)} className="flex items-center gap-1 px-3 py-1.5 bg-[#171d22] text-emerald-400 border border-emerald-500/30 rounded text-xs">EXPORTAR</button>
              <button onClick={handleExportToMotion} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs">A MOTION</button>
            </div>
          </div>
`;

  const finalContent = before + '\n' + newRender + '\n' + after;
  fs.writeFileSync('src/components/matrix/MatrixStudio.tsx', finalContent);
}

