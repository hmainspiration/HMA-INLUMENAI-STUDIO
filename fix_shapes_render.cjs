const fs = require('fs');
let content = fs.readFileSync('src/components/matrix/MatrixStudio.tsx', 'utf8');

const replacement = `{shapes.map((shape) => {
                if (shape.hidden) return null;
                const w = shape.widthX * UNIT;
                const h = shape.heightX * UNIT;
                const rx = Math.min(w, h) / 2;
                const isSelected = selectedShapeIds.includes(shape.id);
                
                const isWireframe = globalWireframe || shape.wireframe;
                const fill = isWireframe ? 'none' : shape.color;
                const stroke = isWireframe ? shape.color : 'none';
                const strokeWidth = isWireframe ? 2 : 0;

                return (
                  <rect
                    key={shape.id}
                    id={shape.id}
                    className={\`draggable-shape \${isSelected ? 'selected' : ''}\`}
                    x={0}
                    y={0}
                    width={w}
                    height={h}
                    rx={rx}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    opacity={shape.locked ? 0.8 : 1}
                    transform={\`translate(\${shape.x}, \${shape.y}) rotate(\${shape.rot}, \${w / 2}, \${h / 2})\`}
                    onPointerDown={(e) => {
                      if (shape.locked) return;
                      handlePointerDown(e, shape.id);
                    }}
                  />
                );
              })}`;

content = content.replace(
  /{shapes\.map\(\(shape\) => {[\s\S]*?return \([\s\S]*?<\/rect>[\s\S]*?\);[\s\S]*?}\)}/m,
  replacement
);

fs.writeFileSync('src/components/matrix/MatrixStudio.tsx', content);
