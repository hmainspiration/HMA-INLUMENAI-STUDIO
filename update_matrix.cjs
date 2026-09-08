const fs = require('fs');

let content = fs.readFileSync('src/components/matrix/MatrixStudio.tsx', 'utf8');

// Imports
content = content.replace(
  "import { MatrixSvgImportModal } from './MatrixSvgImportModal';",
  "import { MatrixSvgImportModal } from './MatrixSvgImportModal';\nimport { MatrixInspector } from './MatrixInspector';\nimport { MatrixGlobalTools } from './MatrixGlobalTools';"
);

// State variables
content = content.replace(
  "const [zoom, setZoom] = useState(1);",
  "const [zoom, setZoom] = useState(1);\n  const [showDiagonals, setShowDiagonals] = useState(false);\n  const [globalWireframe, setGlobalWireframe] = useState(false);\n  const [bgMode, setBgMode] = useState<'dark' | 'light' | 'blueprint'>('dark');\n  const [isSpaceDown, setIsSpaceDown] = useState(false);\n  const scrollContainerRef = useRef<HTMLDivElement>(null);\n  const panStartRef = useRef<{x: number, y: number, scrollLeft: number, scrollTop: number} | null>(null);"
);

// Keyboard Space handling
content = content.replace(
  "window.addEventListener('keydown', handleKeyDown);",
  "window.addEventListener('keydown', handleKeyDown);\n\n    const handleSpaceDown = (e: KeyboardEvent) => { if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT') { setIsSpaceDown(true); e.preventDefault(); } };\n    const handleSpaceUp = (e: KeyboardEvent) => { if (e.code === 'Space') setIsSpaceDown(false); };\n    window.addEventListener('keydown', handleSpaceDown);\n    window.addEventListener('keyup', handleSpaceUp);"
);
content = content.replace(
  "return () => window.removeEventListener('keydown', handleKeyDown);",
  "return () => {\n      window.removeEventListener('keydown', handleKeyDown);\n      window.removeEventListener('keydown', handleSpaceDown);\n      window.removeEventListener('keyup', handleSpaceUp);\n    };"
);

// Delete addShape from inside and pass it to Global Tools, well actually we can keep it inside MatrixStudio
// Let's create layer reordering functions and snap functions

content = content.replace(
  "const [dragStart, setDragStart]",
  `const handleLayerChange = (action: 'front' | 'forward' | 'backward' | 'back') => {
    if (selectedShapeIds.length === 0) return;
    setShapes(prev => {
      const result = [...prev];
      const selected = result.filter(s => selectedShapeIds.includes(s.id));
      const unselected = result.filter(s => !selectedShapeIds.includes(s.id));
      
      switch(action) {
        case 'front': return [...unselected, ...selected];
        case 'back': return [...selected, ...unselected];
        case 'forward': {
          let modified = [...prev];
          // Simple impl for single selection, multi requires complex indexing
          const idx = modified.findIndex(s => s.id === selectedShapeIds[0]);
          if (idx < modified.length - 1) {
            const temp = modified[idx];
            modified[idx] = modified[idx+1];
            modified[idx+1] = temp;
          }
          return modified;
        }
        case 'backward': {
          let modified = [...prev];
          const idx = modified.findIndex(s => s.id === selectedShapeIds[0]);
          if (idx > 0) {
            const temp = modified[idx];
            modified[idx] = modified[idx-1];
            modified[idx-1] = temp;
          }
          return modified;
        }
        default: return prev;
      }
    });
  };

  const snapAllToGrid = () => {
    const snapUnit = snapMode === 1 ? 16.75 : snapMode; // Default to 0.25X if mode is free
    setShapes(prev => prev.map(s => ({
      ...s,
      x: Math.round(s.x / snapUnit) * snapUnit,
      y: Math.round(s.y / snapUnit) * snapUnit
    })));
  };

  const handleRotateGroup = (angle: number) => {
    if (shapes.length === 0) return;
    // Calculate centroid of all shapes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    shapes.forEach(s => {
      minX = Math.min(minX, s.x);
      minY = Math.min(minY, s.y);
      maxX = Math.max(maxX, s.x + s.widthX * 67);
      maxY = Math.max(maxY, s.y + s.heightX * 67);
    });
    const cx = minX + (maxX - minX) / 2;
    const cy = minY + (maxY - minY) / 2;
    
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    setShapes(prev => prev.map(s => {
      // Shape center
      const scx = s.x + (s.widthX * 67) / 2;
      const scy = s.y + (s.heightX * 67) / 2;
      // Rotate point
      const dx = scx - cx;
      const dy = scy - cy;
      const ncx = cx + dx * cos - dy * sin;
      const ncy = cy + dx * sin + dy * cos;
      // New top-left
      return {
        ...s,
        x: ncx - (s.widthX * 67) / 2,
        y: ncy - (s.heightX * 67) / 2,
        rot: (s.rot + angle) % 360
      };
    }));
  };
  
  const handlePanStart = (e: React.PointerEvent) => {
    if (isSpaceDown && scrollContainerRef.current) {
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: scrollContainerRef.current.scrollLeft,
        scrollTop: scrollContainerRef.current.scrollTop
      };
    }
  };

  const [dragStart, setDragStart]`
);

// We need to inject panning into handlePointerMove
content = content.replace(
  "const handlePointerMove = (e: React.PointerEvent) => {",
  `const handlePointerMove = (e: React.PointerEvent) => {
    if (isSpaceDown && panStartRef.current && scrollContainerRef.current) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      scrollContainerRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
      scrollContainerRef.current.scrollTop = panStartRef.current.scrollTop - dy;
      return;
    }`
);
content = content.replace(
  "const handlePointerUp = () => {",
  `const handlePointerUp = () => {
    panStartRef.current = null;`
);

// Replace UI. We will remove the top toolbar.
// We have `return (` at line ~335.
// Let's replace the content between `<div className="flex flex-col h-full bg-[#1e262c]` and `<svg`.
fs.writeFileSync('src/components/matrix/MatrixStudio.tsx', content);
