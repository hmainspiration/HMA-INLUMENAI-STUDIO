const fs = require('fs');

// Update MatrixGlobalTools
let globalTools = fs.readFileSync('src/components/matrix/MatrixGlobalTools.tsx', 'utf8');

globalTools = globalTools.replace(
  "showDiagonals: boolean;",
  "showDiagonals: boolean;\n  showDistances: boolean;\n  setShowDistances: (val: boolean) => void;"
);

globalTools = globalTools.replace(
  "showDiagonals, setShowDiagonals,",
  "showDiagonals, setShowDiagonals, showDistances, setShowDistances,"
);

const distancesToggle = `
        <div className="flex flex-col gap-1.5 mt-2">
          <span className="text-slate-600 text-[10px] uppercase font-bold tracking-wider">COTAS / ESPACIOS</span>
          <button 
             onClick={() => setShowDistances(!showDistances)} 
             className={\`flex items-center justify-between px-2 py-1.5 rounded transition-all shadow-sm border \${showDistances ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-[#171d22] border-slate-700 text-slate-400 hover:border-slate-500'}\`}
          >
             <span>Ver Espacios (Ext. Inferior)</span>
             <Eye size={14} className={showDistances ? 'text-cyan-400' : 'text-slate-600'} />
          </button>
        </div>
`;

globalTools = globalTools.replace(
  /\{ \/\* Opciones Visuales del Lienzo \[\s\S]*?<\/div>/m, // Wait, I will just insert it after the Wireframe Global
  (match) => {
    // Actually I'll just use string replacement
    return match;
  }
);

globalTools = globalTools.replace(
  /<button \n\s*onClick=\{\(\) => setGlobalWireframe\(!globalWireframe\)\}[\s\S]*?<\/button>/m,
  (match) => {
    return match + distancesToggle;
  }
);

fs.writeFileSync('src/components/matrix/MatrixGlobalTools.tsx', globalTools);

// Update MatrixStudio
let studio = fs.readFileSync('src/components/matrix/MatrixStudio.tsx', 'utf8');

studio = studio.replace(
  "showDiagonals={showDiagonals} setShowDiagonals={setShowDiagonals}",
  "showDiagonals={showDiagonals} setShowDiagonals={setShowDiagonals}\n          showDistances={showDistances} setShowDistances={setShowDistances}"
);

// We also need to render the distances layer in MatrixStudio!
// Ah, earlier I saw it commented out or missing?
// Let's check MatrixStudio SVG children.
const distancesLayerRender = `
                  <g id="shapes-layer">
                    {shapes.map(shape => {
                      if (shape.hidden) return null;
                      const w = shape.widthX * UNIT;
                      const h = shape.heightX * UNIT;
                      const rx = Math.min(w, h) / 2;
                      const isSelected = selectedShapeIds.includes(shape.id);
                      const isWf = globalWireframe || shape.wireframe;
                      const fill = isWf ? 'none' : shape.color;
                      const stroke = isWf ? shape.color : 'none';
                      const strokeW = isWf ? 2 : 0;
                      return (
                        <rect key={shape.id} id={shape.id} className={\`draggable-shape \${isSelected ? 'selected' : ''}\`} x={0} y={0} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={strokeW} opacity={shape.locked ? 0.8 : 1} transform={\`translate(\${shape.x}, \${shape.y}) rotate(\${shape.rot}, \${w/2}, \${h/2})\`} onPointerDown={e => { if(shape.locked) return; handlePointerDown(e, shape.id); }} />
                      );
                    })}
                  </g>

                  {/* 4. Capa de Cotas y Espaciados X entre formas (medidos desde extremos inferiores) */}
                  {showDistances && shapeDistances.length > 0 && (
                    <g id="shape-distances-layer" className="pointer-events-none select-none">
                      {shapeDistances.map((dim) => {
                        const dx = dim.pB.x - dim.pA.x;
                        const dy = dim.pB.y - dim.pA.y;
                        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                        const labelAngle = angle > 90 || angle < -90 ? angle + 180 : angle;

                        return (
                          <g key={dim.id}>
                            <line
                              x1={dim.pA.x} y1={dim.pA.y}
                              x2={dim.pB.x} y2={dim.pB.y}
                              stroke="#00e676"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                            />
                            <circle cx={dim.pA.x} cy={dim.pA.y} r="3" fill="#00e676" />
                            <circle cx={dim.pB.x} cy={dim.pB.y} r="3" fill="#00e676" />
                            
                            <g transform={\`translate(\${dim.centerPoint.x}, \${dim.centerPoint.y}) rotate(\${labelAngle})\`}>
                              <rect x="-24" y="-10" width="48" height="20" rx="4" fill="#1e262c" stroke="#00e676" strokeWidth="1" />
                              <text x="0" y="4" textAnchor="middle" fill="#00e676" fontSize="10px" fontWeight="bold" fontFamily="monospace">
                                {dim.label}
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </g>
                  )}
`;

studio = studio.replace(
  /<g id="shapes-layer">[\s\S]*?<\/g>/,
  distancesLayerRender
);

fs.writeFileSync('src/components/matrix/MatrixStudio.tsx', studio);
