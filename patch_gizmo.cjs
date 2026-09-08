const fs = require('fs');

let code = fs.readFileSync('src/components/matrix/MatrixStudio.tsx', 'utf-8');

const rotateStates = `
  const [isRotating, setIsRotating] = useState(false);
  const rotationStartRef = useRef<{ id: string, startAngle: number, startRotation: number, cx: number, cy: number } | null>(null);

  const handleRotateStart = (e: React.PointerEvent, shape: MatrixShape) => {
    e.stopPropagation();
    setIsRotating(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Canvas coords
    const mx = (e.clientX - rect.left) / zoom;
    const my = (e.clientY - rect.top) / zoom;
    
    // Shape center
    const w = shape.widthX * 67;
    const h = shape.heightX * 67;
    const cx = shape.x + w/2;
    const cy = shape.y + h/2;
    
    const startAngle = Math.atan2(my - cy, mx - cx) * (180 / Math.PI);
    rotationStartRef.current = { id: shape.id, startAngle, startRotation: shape.rot, cx, cy };
  };
`;

if (!code.includes('const [isRotating, setIsRotating] = useState(false);')) {
  code = code.replace('const [dragStart, setDragStart] = useState', rotateStates + '\n  const [dragStart, setDragStart] = useState');
}

// Now handlePointerMove and handlePointerUp need to be updated.
const handleMoveOld = `const handlePointerMove = (e: React.PointerEvent) => {
    if (panStartRef.current && isSpaceDown) {`;
const handleMoveNew = `const handlePointerMove = (e: React.PointerEvent) => {
    if (isRotating && rotationStartRef.current) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = (e.clientX - rect.left) / zoom;
      const my = (e.clientY - rect.top) / zoom;
      const { id, startAngle, startRotation, cx, cy } = rotationStartRef.current;
      const currentAngle = Math.atan2(my - cy, mx - cx) * (180 / Math.PI);
      let angleDiff = currentAngle - startAngle;
      
      let newRot = (startRotation + angleDiff) % 360;
      if (newRot < -180) newRot += 360;
      if (newRot > 180) newRot -= 360;
      
      if (e.shiftKey) {
        newRot = Math.round(newRot / 15) * 15;
      } else {
        newRot = Math.round(newRot);
      }
      
      setShapes(prev => prev.map(s => s.id === id ? { ...s, rot: newRot } : s));
      return;
    }
    if (panStartRef.current && isSpaceDown) {`;
code = code.replace(handleMoveOld, handleMoveNew);

// Add to handlePointerUp:
const handleUpOld = `const handlePointerUp = () => {
    panStartRef.current = null;
    if (dragStart) {
      const currentShapes = shapes;`;
const handleUpNew = `const handlePointerUp = () => {
    if (isRotating) {
      setIsRotating(false);
      rotationStartRef.current = null;
      // Also commit shapes to history
      commitShapes([...shapes]);
    }
    panStartRef.current = null;
    if (dragStart) {
      const currentShapes = shapes;`;
code = code.replace(handleUpOld, handleUpNew);

// Rendering the Gizmo. When exactly ONE shape is selected, render a small circle with a line above it.
const renderGizmo = `
                  {/* Rotation Gizmo */}
                  {selectedShapeId && !isRotating && (() => {
                    const shape = shapes.find(s => s.id === selectedShapeId);
                    if (!shape || shape.locked || shape.hidden) return null;
                    const w = shape.widthX * 67;
                    const h = shape.heightX * 67;
                    // Rotate the gizmo position with the shape
                    return (
                      <g transform={\`translate(\${shape.x + w/2}, \${shape.y + h/2}) rotate(\${shape.rot})\`}>
                        <line x1={0} y1={-h/2 - 10} x2={0} y2={-h/2 - 30} stroke="#10b981" strokeWidth={2} strokeDasharray="2 2" />
                        <circle 
                          cx={0} 
                          cy={-h/2 - 30} 
                          r={6} 
                          fill="#10b981" 
                          stroke="#064e3b" 
                          strokeWidth={2}
                          className="cursor-crosshair hover:scale-125 transition-transform origin-center"
                          onPointerDown={(e) => handleRotateStart(e, shape)}
                        />
                      </g>
                    );
                  })()}
`;

// Insert the gizmo inside the SVG, right after <g id="shapes-layer"> ... </g>
const shapesEnd = `</g>\n                  </svg>`;
if (!code.includes('{/* Rotation Gizmo */}')) {
  code = code.replace(shapesEnd, `</g>\n${renderGizmo}\n                  </svg>`);
}

fs.writeFileSync('src/components/matrix/MatrixStudio.tsx', code);
