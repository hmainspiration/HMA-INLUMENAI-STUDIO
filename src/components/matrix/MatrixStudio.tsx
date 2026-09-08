import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MatrixShape, CustomGridLine, MatrixProjectData } from '../../types/matrix';
import { LogoData } from '../../types';
import { CANVAS_SIZE, UNIT, generateInitialGridLines, DEFAULT_MAIN_LINE_COLOR, DEFAULT_SUB_LINE_COLOR } from '../../utils/matrixGridUtils';
import { getAllShapeDistances } from '../../utils/matrixDistanceUtils';
import { Undo, Redo, Grid3X3, Layers } from 'lucide-react';
import { MATRIX_TEMPLATES } from '../../data/matrixTemplates';

import { createLogoDataFromMatrix } from '../../utils/matrixExportUtils';
import { downloadFile } from '../../utils/exportUtils';
import { MatrixGuidesManager } from './MatrixGuidesManager';
import { MatrixExportModal } from './MatrixExportModal';
import { MatrixSvgImportModal } from './MatrixSvgImportModal';
import { MatrixInspector } from './MatrixInspector';
import { MatrixGlobalTools } from './MatrixGlobalTools';

interface MatrixStudioProps {
  paletteMode: 'luz' | 'oscuridad';
  onSendToMotion: (logo: LogoData) => void;
  showNotification: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const MatrixStudio: React.FC<MatrixStudioProps> = ({ paletteMode, onSendToMotion, showNotification }) => {
  const [shapes, setShapes] = useState<MatrixShape[]>([]);
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
  const selectedShapeId = selectedShapeIds.length === 1 ? selectedShapeIds[0] : null;
  const [zoom, setZoom] = useState(1);
  const [showMainGrid, setShowMainGrid] = useState(true);
  const [showSubGrid, setShowSubGrid] = useState(true);
  const [snapMode, setSnapMode] = useState<number>(16.75);
  const [gridLines, setGridLines] = useState<Record<string, CustomGridLine>>(() => generateInitialGridLines());
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [guidesManagerOpen, setGuidesManagerOpen] = useState(false);
  const [guidesLocked, setGuidesLocked] = useState<boolean>(true);
  const [showDistances, setShowDistances] = useState<boolean>(false);
  
  // New features
  const [showDiagonals, setShowDiagonals] = useState(false);
  const [globalWireframe, setGlobalWireframe] = useState(false);
  const [bgMode, setBgMode] = useState<'dark' | 'light' | 'blueprint'>('light');
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [past, setPast] = useState<MatrixShape[][]>([]);
  const [future, setFuture] = useState<MatrixShape[][]>([]);

  const commitShapes = (newShapes: MatrixShape[] | ((prev: MatrixShape[]) => MatrixShape[])) => {
    if (typeof newShapes === 'function') {
      setShapes(prev => {
        const next = newShapes(prev);
        setPast(p => [...p.slice(-30), prev]);
        setFuture([]);
        return next;
      });
    } else {
      setPast(p => [...p.slice(-30), shapes]);
      setFuture([]);
      setShapes(newShapes);
    }
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setFuture(prev => [shapes, ...prev]);
    setPast(newPast);
    setShapes(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast(prev => [...prev, shapes]);
    setFuture(newFuture);
    setShapes(next);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future, shapes]);

  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);

  
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef<{x: number, y: number, scrollLeft: number, scrollTop: number} | null>(null);
  
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

  const [dragStart, setDragStart] = useState<{ items: { id: string, x: number, y: number }[], startX: number, startY: number } | null>(null);

  const defaultColor = paletteMode === 'luz' ? '#3D80FD' : '#11D7B6';
  const gridLinesList = Object.values(gridLines) as CustomGridLine[];
  const customizedGuidesCount = gridLinesList.filter((l) => l.isCustomized).length;

  const shapeDistances = useMemo(() => {
    if (!showDistances) return [];
    return getAllShapeDistances(shapes, selectedShapeId);
  }, [showDistances, shapes, selectedShapeId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapeIds.length > 0) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) return;
        e.preventDefault();
        commitShapes(prev => prev.filter(s => !selectedShapeIds.includes(s.id)));
        setSelectedShapeIds([]);
      }
    };
    const handleSpaceDown = (e: KeyboardEvent) => { if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT') { setIsSpaceDown(true); e.preventDefault(); } };
    const handleSpaceUp = (e: KeyboardEvent) => { if (e.code === 'Space') setIsSpaceDown(false); };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleSpaceDown);
    window.addEventListener('keyup', handleSpaceUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleSpaceDown);
      window.removeEventListener('keyup', handleSpaceUp);
    };
  }, [selectedShapeIds]);

  const addShape = () => {
    const newShape: MatrixShape = {
      id: `shape-${Date.now()}`,
      x: 335, y: 335, widthX: 1, heightX: 1, rot: 0,
      color: defaultColor, wireframe: false, hidden: false, locked: false
    };
    commitShapes([...shapes, newShape]);
    setSelectedShapeIds([newShape.id]);
  };

  const selectAllShapes = () => {
    setSelectedShapeIds(shapes.map(s => s.id));
    showNotification(`${shapes.length} formas seleccionadas`);
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (isSpaceDown) return;
    const shape = shapes.find(s => s.id === id);
    if (!shape || shape.locked) return;

    let newSelection = [...selectedShapeIds];
    if (e.shiftKey) {
      if (newSelection.includes(id)) newSelection = newSelection.filter(sid => sid !== id);
      else newSelection.push(id);
    } else {
      if (!newSelection.includes(id)) newSelection = [id];
    }
    
    setSelectedShapeIds(newSelection);
    
    if (svgRef.current) {
      const pt = svgRef.current.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
      
      const items = newSelection.map(sid => {
        const s = shapes.find(ss => ss.id === sid);
        return s ? { id: s.id, x: s.x, y: s.y } : null;
      }).filter(Boolean) as any;

      setDragStart({ items, startX: svgP.x, startY: svgP.y });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isSpaceDown && panStartRef.current && scrollContainerRef.current) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      scrollContainerRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
      scrollContainerRef.current.scrollTop = panStartRef.current.scrollTop - dy;
      return;
    }
    
    if (!dragStart || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    
    const dx = svgP.x - dragStart.startX;
    const dy = svgP.y - dragStart.startY;

    commitShapes(prev => prev.map(shape => {
      const draggedItem = dragStart.items.find(i => i.id === shape.id);
      if (draggedItem && !shape.locked) {
        let newX = draggedItem.x + dx;
        let newY = draggedItem.y + dy;
        const snapUnit = snapMode === 1 ? 16.75 : snapMode;
        if (snapMode !== 1) {
          newX = Math.round(newX / snapUnit) * snapUnit;
          newY = Math.round(newY / snapUnit) * snapUnit;
        }
        return { ...shape, x: newX, y: newY };
      }
      return shape;
    }));
  };

  const handlePointerUp = () => {
    panStartRef.current = null;
    setDragStart(null);
  };
  
  const handlePanStart = (e: React.PointerEvent) => {
    if (isSpaceDown && scrollContainerRef.current) {
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: scrollContainerRef.current.scrollLeft,
        scrollTop: scrollContainerRef.current.scrollTop
      };
    } else {
      setSelectedShapeIds([]);
      setDragStart(null);
    }
  };

  const snapAllToGrid = () => {
    const snapUnit = snapMode === 1 ? 16.75 : snapMode;
    commitShapes(prev => prev.map(s => ({
      ...s,
      x: Math.round(s.x / snapUnit) * snapUnit,
      y: Math.round(s.y / snapUnit) * snapUnit
    })));
  };

  const handleRotateGroup = (angle: number) => {
    if (shapes.length === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    shapes.forEach(s => {
      minX = Math.min(minX, s.x);
      minY = Math.min(minY, s.y);
      maxX = Math.max(maxX, s.x + s.widthX * UNIT);
      maxY = Math.max(maxY, s.y + s.heightX * UNIT);
    });
    const cx = minX + (maxX - minX) / 2;
    const cy = minY + (maxY - minY) / 2;
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    commitShapes(prev => prev.map(s => {
      const scx = s.x + (s.widthX * UNIT) / 2;
      const scy = s.y + (s.heightX * UNIT) / 2;
      const dx = scx - cx;
      const dy = scy - cy;
      const ncx = cx + dx * cos - dy * sin;
      const ncy = cy + dx * sin + dy * cos;
      return {
        ...s,
        x: ncx - (s.widthX * UNIT) / 2,
        y: ncy - (s.heightX * UNIT) / 2,
        rot: (s.rot + angle) % 360
      };
    }));
  };

  const handleLayerChange = (action: 'front' | 'forward' | 'backward' | 'back') => {
    if (selectedShapeIds.length === 0) return;
    commitShapes(prev => {
      const selected = prev.filter(s => selectedShapeIds.includes(s.id));
      const unselected = prev.filter(s => !selectedShapeIds.includes(s.id));
      switch(action) {
        case 'front': return [...unselected, ...selected];
        case 'back': return [...selected, ...unselected];
        case 'forward': {
          let modified = [...prev];
          const idx = modified.findIndex(s => s.id === selectedShapeIds[0]);
          if (idx < modified.length - 1) {
            const temp = modified[idx]; modified[idx] = modified[idx+1]; modified[idx+1] = temp;
          }
          return modified;
        }
        case 'backward': {
          let modified = [...prev];
          const idx = modified.findIndex(s => s.id === selectedShapeIds[0]);
          if (idx > 0) {
            const temp = modified[idx]; modified[idx] = modified[idx-1]; modified[idx-1] = temp;
          }
          return modified;
        }
        default: return prev;
      }
    });
  };

  const handleUpdateLine = (id: string, updates: Partial<CustomGridLine>) => setGridLines(p => ({ ...p, [id]: { ...p[id], ...updates } }));
  const handleBatchUpdateLines = (updates: Record<string, Partial<CustomGridLine>>) => setGridLines(p => { const next = { ...p }; Object.keys(updates).forEach(k => { if(next[k]) next[k] = { ...next[k], ...updates[k] } }); return next; });
  const handleResetAllLines = () => setGridLines(generateInitialGridLines());
  const handleImportShapes = (imported: MatrixShape[], mode: 'replace' | 'append') => {
    if (mode === 'replace') { commitShapes(imported); setSelectedShapeIds(imported.length > 0 ? [imported[0].id] : []); }
    else { commitShapes(p => [...p, ...imported]); setSelectedShapeIds(imported.length > 0 ? [imported[imported.length - 1].id] : []); }
  };
  const handleExportToMotion = () => {
    if (shapes.length === 0) return showNotification('Añade o importa formas', 'error');
    onSendToMotion(createLogoDataFromMatrix(shapes));
  };

  const canvasBg = bgMode === 'dark' ? '#0f172a' : bgMode === 'blueprint' ? '#0f2950' : '#ffffff';

  return (
    <div className="flex flex-col h-full bg-[#1e262c] text-[#eceff1] font-mono text-xs overflow-hidden">
      <div className="flex flex-1 h-full overflow-hidden">
        <MatrixGlobalTools 
          onAddShape={addShape} onSelectAll={selectAllShapes} onImportSvg={() => setImportModalOpen(true)}
          onRotateGroup={handleRotateGroup} onSnapAll={snapAllToGrid}
          showMainGrid={showMainGrid} setShowMainGrid={setShowMainGrid}
          showSubGrid={showSubGrid} setShowSubGrid={setShowSubGrid}
          showDiagonals={showDiagonals} setShowDiagonals={setShowDiagonals}
          showDistances={showDistances} setShowDistances={setShowDistances}
          globalWireframe={globalWireframe} setGlobalWireframe={setGlobalWireframe}
          bgMode={bgMode} setBgMode={setBgMode} snapMode={snapMode} setSnapMode={setSnapMode}
        />
        
        <div className="flex-1 flex flex-col relative h-full">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#263238] p-3 shadow-lg z-10 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setGuidesManagerOpen(!guidesManagerOpen)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all border ${guidesManagerOpen || customizedGuidesCount > 0 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' : 'bg-[#171d22] text-slate-300 border-slate-700 hover:border-slate-500'}`}><span>GUÍAS 📐</span></button>
              <button onClick={() => setGuidesLocked(!guidesLocked)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold transition-all border ${guidesLocked ? 'bg-[#171d22] text-amber-300/90 border-amber-500/30 hover:border-amber-400' : 'bg-emerald-500/20 text-emerald-300 border-emerald-400'}`}>{guidesLocked ? 'Bloqueadas' : 'Editables'}</button>
            </div>
            <div className="flex items-center gap-2 bg-[#171d22] px-2 py-1 rounded border border-slate-700 text-[11px]">
              <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className="hover:text-emerald-400 px-1 font-bold text-slate-300">-</button>
              <span className="text-emerald-400 font-bold w-10 text-center cursor-pointer" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="hover:text-emerald-400 px-1 font-bold text-slate-300">+</button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setExportModalOpen(true)} className="flex items-center gap-1 px-3 py-1.5 bg-[#171d22] text-emerald-400 border border-emerald-500/30 rounded text-xs">EXPORTAR</button>
              <button onClick={handleExportToMotion} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs">A MOTION</button>
            
            <div className="flex items-center gap-1.5 ml-2 border-l border-slate-700/50 pl-3">
              <button onClick={undo} disabled={past.length === 0} className={`p-1.5 rounded transition-colors ${past.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`} title="Deshacer (Ctrl+Z)">
                <Undo className="w-4 h-4" />
              </button>
              <button onClick={redo} disabled={future.length === 0} className={`p-1.5 rounded transition-colors ${future.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`} title="Rehacer (Ctrl+Y)">
                <Redo className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative ml-2 border-l border-slate-700/50 pl-3">
              <button onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shadow-sm transition-colors">
                <Grid3X3 className="w-3.5 h-3.5" />
                PLANTILLAS
              </button>
              {templateDropdownOpen && (
                <div className="absolute top-full mt-2 w-56 bg-[#1a2228] border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Plantillas Oficiales
                  </div>
                  <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                    {MATRIX_TEMPLATES.map((tpl, i) => (
                      <button key={i} onClick={() => { commitShapes(tpl.shapes); setTemplateDropdownOpen(false); setSelectedShapeIds([]); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between">
                        <span>{tpl.name}</span>
                        <span className="text-[9px] text-slate-500">{tpl.shapes.length} pz</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            </div>
          </div>

          <div ref={scrollContainerRef} className={`flex-1 overflow-auto p-4 ${bgMode==='blueprint'?'bg-[#0a192f]':'bg-[#1e262c]'} relative`} onPointerDown={handlePanStart} style={{ cursor: isSpaceDown ? 'grab' : 'default' }}>
            <div className="min-h-full flex items-center justify-center min-w-max">
              <div className="shadow-2xl rounded-xl flex-shrink-0 relative transition-all duration-200" style={{ width: 957 * zoom, height: 897 * zoom, backgroundColor: bgMode === 'dark' ? '#1e262c' : bgMode === 'blueprint' ? '#0a192f' : '#f8f9fa' }}>
                <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="-140 -80 957 897" className="w-full h-full block select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} style={{ pointerEvents: isSpaceDown ? 'none' : 'auto' }}>
                  <defs>
                    <style>
                      {`
                        .text-label { fill: #546e7a; font-family: 'Courier New', monospace; font-size: 12px; }
                        .text-label-interactive { cursor: pointer; }
                        .text-label-interactive:hover { fill: #00e676; font-weight: bold; }
                        .draggable-shape { cursor: grab; transition: stroke 0.15s; }
                        .draggable-shape:active { cursor: grabbing; }
                        .selected { filter: drop-shadow(0px 0px 8px rgba(0, 230, 118, 0.8)); stroke: #00e676 !important; stroke-width: 3px !important; stroke-dasharray: 4; }
                        .line-interactive { cursor: pointer; }
                        .line-interactive:hover { stroke: #00e676 !important; stroke-width: 2.5px !important; }
                        .line-selected { stroke: #ef4444 !important; stroke-width: 3px !important; filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.9)); }
                      `}
                    </style>
                  </defs>
                  
                  <rect x="-140" y="-80" width="957" height="897" fill={bgMode === 'dark' ? '#1e262c' : bgMode === 'blueprint' ? '#0a192f' : '#f8f9fa'} />
                  <rect x="0" y="0" width="737" height="737" fill={canvasBg} />
                  
                  {showDiagonals && (
                    <g id="diagonals-layer">
                      {[-737, -368.5, 0, 368.5, 737].map(offset => (
                        <line key={`diag1-${offset}`} x1={0} y1={offset} x2={737} y2={737+offset} stroke={bgMode==='blueprint'?'rgba(59,130,246,0.3)':bgMode==='dark'?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'} strokeWidth="1" />
                      ))}
                      {[-737, -368.5, 0, 368.5, 737].map(offset => (
                        <line key={`diag2-${offset}`} x1={737} y1={offset} x2={0} y2={737+offset} stroke={bgMode==='blueprint'?'rgba(59,130,246,0.3)':bgMode==='dark'?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.05)'} strokeWidth="1" />
                      ))}
                    </g>
                  )}

                  {showSubGrid && (
                    <g id="sub-grid-layer">
                      {gridLinesList.filter(l => l.visible && (l.type === 'sub' || !showMainGrid)).map(line => (
                        <line key={line.id} x1={line.axis === 'x' ? line.pos : 0} y1={line.axis === 'y' ? line.pos : 0} x2={line.axis === 'x' ? line.pos : CANVAS_SIZE} y2={line.axis === 'y' ? line.pos : CANVAS_SIZE} stroke={line.isCustomized ? line.color : bgMode==='blueprint'?'rgba(59,130,246,0.2)':bgMode==='dark'?'#1e293b':DEFAULT_SUB_LINE_COLOR} strokeWidth={line.strokeWidth} strokeDasharray={line.dashArray === 'none' ? undefined : line.dashArray} strokeOpacity={line.opacity} className={`${!guidesLocked ? 'line-interactive' : ''} ${selectedLineId === line.id ? 'line-selected' : ''}`} onClick={e => { if(!guidesLocked) { e.stopPropagation(); setSelectedLineId(line.id); setGuidesManagerOpen(true); } }} />
                      ))}
                    </g>
                  )}

                  {showMainGrid && (
                    <g id="main-grid-layer">
                      {gridLinesList.filter(l => l.visible && l.type === 'main').map(line => (
                        <line key={line.id} x1={line.axis === 'x' ? line.pos : 0} y1={line.axis === 'y' ? line.pos : 0} x2={line.axis === 'x' ? line.pos : CANVAS_SIZE} y2={line.axis === 'y' ? line.pos : CANVAS_SIZE} stroke={line.isCustomized ? line.color : bgMode==='blueprint'?'#3b82f6':bgMode==='dark'?'#334155':DEFAULT_MAIN_LINE_COLOR} strokeWidth={line.strokeWidth} strokeDasharray={line.dashArray === 'none' ? undefined : line.dashArray} strokeOpacity={line.opacity} className={`${!guidesLocked ? 'line-interactive' : ''} ${selectedLineId === line.id ? 'line-selected' : ''}`} onClick={e => { if(!guidesLocked) { e.stopPropagation(); setSelectedLineId(line.id); setGuidesManagerOpen(true); } }} />
                      ))}
                    </g>
                  )}

                  <g className={`text-label ${!guidesLocked ? 'text-label-interactive' : ''}`} textAnchor="middle">
                    {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
                      <text key={`xt-${i}`} x={i*UNIT} y="-12" onClick={e => { if(!guidesLocked){ e.stopPropagation(); setSelectedLineId(`v-sub-${i*4}`); setGuidesManagerOpen(true); } }}>{i === 0 ? '0' : `${i}X`}</text>
                    ))}
                  </g>
                  <g className={`text-label ${!guidesLocked ? 'text-label-interactive' : ''}`} textAnchor="end">
                    {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
                      <text key={`yt-${i}`} x="-12" y={i*UNIT+4} onClick={e => { if(!guidesLocked){ e.stopPropagation(); setSelectedLineId(`h-sub-${i*4}`); setGuidesManagerOpen(true); } }}>{i === 0 ? '0' : `${i}X`}</text>
                    ))}
                  </g>

                  
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
                        <rect key={shape.id} id={shape.id} className={`draggable-shape ${isSelected ? 'selected' : ''}`} x={0} y={0} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={strokeW} opacity={shape.locked ? 0.8 : 1} transform={`translate(${shape.x}, ${shape.y}) rotate(${shape.rot}, ${w/2}, ${h/2})`} onPointerDown={e => { e.stopPropagation(); if(shape.locked) return; handlePointerDown(e, shape.id); }} />
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
                            
                            <g transform={`translate(${dim.centerPoint.x}, ${dim.centerPoint.y}) rotate(${labelAngle})`}>
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

                </svg>
              </div>
            </div>

            {guidesManagerOpen && (
              <MatrixGuidesManager lines={gridLines} selectedLineId={selectedLineId} onSelectLine={setSelectedLineId} onUpdateLine={handleUpdateLine} onBatchUpdateLines={handleBatchUpdateLines} onResetAllLines={handleResetAllLines} onClose={() => setGuidesManagerOpen(false)} showNotification={showNotification} guidesLocked={guidesLocked} onToggleGuidesLocked={() => setGuidesLocked(!guidesLocked)} />
            )}
          </div>
        </div>

        <MatrixInspector selectedShapes={shapes.filter(s => selectedShapeIds.includes(s.id))} onUpdate={updates => commitShapes(prev => prev.map(s => selectedShapeIds.includes(s.id) ? { ...s, ...updates } : s))} onLayerChange={handleLayerChange} onSnapToGrid={snapAllToGrid} snapMode={snapMode} />
      </div>

      {exportModalOpen && <MatrixExportModal shapes={shapes} gridLines={gridLines} showMainGrid={showMainGrid} showSubGrid={showSubGrid} onClose={() => setExportModalOpen(false)} showNotification={showNotification} />}
      {importModalOpen && <MatrixSvgImportModal onClose={() => setImportModalOpen(false)} onImport={handleImportShapes} showNotification={showNotification} defaultColor={defaultColor} />}
    </div>
  );
};
