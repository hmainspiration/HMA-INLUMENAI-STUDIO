const fs = require('fs');
let content = fs.readFileSync('src/components/matrix/MatrixStudio.tsx', 'utf8');

const bgMap = {
  light: '#f8f9fa',
  dark: '#1e262c',
  blueprint: '#0a192f'
};

const getCanvasBgStr = `const canvasBg = bgMode === 'dark' ? '#1e262c' : bgMode === 'blueprint' ? '#0a192f' : '#f8f9fa';`;
const getMainGridColor = `const mainGridColor = bgMode === 'blueprint' ? '#3b82f6' : bgMode === 'dark' ? '#334155' : 'rgba(0,0,0,0.1)';`;

content = content.replace(
  `const selectedShape = shapes.find((s) => s.id === selectedShapeId);`,
  `const selectedShape = shapes.find((s) => s.id === selectedShapeId);\n\n  ${getCanvasBgStr}`
);

content = content.replace(
  `<div \n             className="bg-[#f8f9fa] shadow-2xl rounded-xl flex-shrink-0 relative transition-all duration-200"`,
  `<div 
             className="shadow-2xl rounded-xl flex-shrink-0 relative transition-all duration-200" 
             style={{ width: 957 * zoom, height: 897 * zoom, backgroundColor: canvasBg }}`
);

content = content.replace(
  `style={{ width: 957 * zoom, height: 897 * zoom }}`,
  ``
);

// Add Diagonals rendering
const diagonalsStr = `
              {showDiagonals && (
                <g className="diagonals-layer">
                  {[-737, -368.5, 0, 368.5, 737].map(offset => (
                    <line key={\`diag1-\${offset}\`} x1={0} y1={offset} x2={737} y2={737+offset} stroke={bgMode==='blueprint'?'rgba(59,130,246,0.3)':bgMode==='dark'?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'} strokeWidth="1" />
                  ))}
                  {[-737, -368.5, 0, 368.5, 737].map(offset => (
                    <line key={\`diag2-\${offset}\`} x1={737} y1={offset} x2={0} y2={737+offset} stroke={bgMode==='blueprint'?'rgba(59,130,246,0.3)':bgMode==='dark'?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'} strokeWidth="1" />
                  ))}
                </g>
              )}
`;

content = content.replace(
  `{/* Canvas background area */}`,
  `${diagonalsStr}\n              {/* Canvas background area */}`
);

// Apply global wireframe
content = content.replace(
  `const fill = shape.wireframe ? 'none' : shape.color;`,
  `const isWireframe = globalWireframe || shape.wireframe;\n                      const fill = isWireframe ? 'none' : shape.color;`
);
content = content.replace(
  `const stroke = shape.wireframe ? shape.color : 'none';`,
  `const stroke = isWireframe ? shape.color : 'none';`
);
content = content.replace(
  `const strokeWidth = shape.wireframe ? 2 : 0;`,
  `const strokeWidth = isWireframe ? 2 : 0;`
);

fs.writeFileSync('src/components/matrix/MatrixStudio.tsx', content);
