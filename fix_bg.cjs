const fs = require('fs');
let content = fs.readFileSync('src/components/matrix/MatrixStudio.tsx', 'utf8');

const replacement = `            {/* Base Backgrounds */}
            <rect x="-140" y="-80" width="957" height="897" fill={canvasBg} />
            <rect x="0" y="0" width="737" height="737" fill={bgMode === 'blueprint' ? '#0f2950' : bgMode === 'dark' ? '#0f172a' : '#ffffff'} />

            {/* Diagonales Maestras */}
            {showDiagonals && (
              <g id="diagonals-layer">
                {[-737, -368.5, 0, 368.5, 737].map(offset => (
                  <line key={\`diag1-\${offset}\`} x1={0} y1={offset} x2={737} y2={737+offset} stroke={bgMode==='blueprint'?'rgba(59,130,246,0.3)':bgMode==='dark'?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'} strokeWidth="1" />
                ))}
                {[-737, -368.5, 0, 368.5, 737].map(offset => (
                  <line key={\`diag2-\${offset}\`} x1={737} y1={offset} x2={0} y2={737+offset} stroke={bgMode==='blueprint'?'rgba(59,130,246,0.3)':bgMode==='dark'?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'} strokeWidth="1" />
                ))}
              </g>
            )}`;

content = content.replace(
  /{[\s\S]*?Base Backgrounds[\s\S]*?<rect x="-140" y="-80" width="957" height="897" className="bg" \/>[\s\S]*?<rect x="0" y="0" width="737" height="737" className="canvas-bg" \/>/m,
  replacement
);

fs.writeFileSync('src/components/matrix/MatrixStudio.tsx', content);
