import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MatrixShape, CustomGridLine, MatrixProjectData } from '../../types/matrix';
import { LogoData } from '../../types';
import { CANVAS_SIZE, UNIT, generateInitialGridLines, DEFAULT_MAIN_LINE_COLOR, DEFAULT_SUB_LINE_COLOR } from '../../utils/matrixGridUtils';
import { getAllShapeDistances } from '../../utils/matrixDistanceUtils';
import { 
  Undo, Redo, Grid3X3, Layers, Trash2, 
  PanelLeftClose, PanelLeft, PanelRightClose, PanelRight,
  Maximize2, Minimize2, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Compass, Sparkles, Check, Download, Send,
  Eye, EyeOff
} from 'lucide-react';
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

  // Estados de paneles desplegables y pantalla completa
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Malla base y guías
  const [showMainGrid, setShowMainGrid] = useState(true);
  const [showSubGrid, setShowSubGrid] = useState(true);
  const [snapMode, setSnapMode] = useState<number>(16.75);
  const [gridLines, setGridLines] = useState<Record<string, CustomGridLine>>(() => generateInitialGridLines());
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [guidesManagerOpen, setGuidesManagerOpen] = useState(false);
  const [guidesLocked, setGuidesLocked] = useState<boolean>(true);
  const [showDistances, setShowDistances] = useState<boolean>(false);
  
  // Malla a partir de 0.25X (Horizontal y Vertical)
  const [showGridH, setShowGridH] = useState(true);
  const [stepH, setStepH] = useState<number>(0.25);
  const [showGridV, setShowGridV] = useState(true);
  const [stepV, setStepV] = useState<number>(0.25);
  const [customGridColor, setCustomGridColor] = useState<string>('#3D80FD');

  // Modo dibujar línea de malla interactiva
  const [isDrawLineMode, setIsDrawLineMode] = useState(false);
  const [drawLineAxis, setDrawLineAxis] = useState<'x' | 'y'>('y');
  const [cursorPreviewCoord, setCursorPreviewCoord] = useState<number | null>(null);

  // Grosor, Estilo de Trazo y Opacidad de Malla
  const [lineStrokeWidth, setLineStrokeWidth] = useState<number>(1.5);
  const [lineDashStyle, setLineDashStyle] = useState<string>('none');
  const [lineOpacity, setLineOpacity] = useState<number>(1.0);

  // Ocultar / Mostrar medidas base canónicas (1X, 2X, 3X...)
  // Por defecto false para evitar amontonamiento y solapamiento
  const [showBaseMeasures, setShowBaseMeasures] = useState<boolean>(false);

  // Línea dibujada actualmente seleccionada
  const [selectedDrawnLineId, setSelectedDrawnLineId] = useState<string | null>(null);

  // Visuales y entorno
  const [showDiagonals, setShowDiagonals] = useState(false);
  const [globalWireframe, setGlobalWireframe] = useState(false);
  const [bgMode, setBgMode] = useState<'dark' | 'light' | 'blueprint'>('light');
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [zoomMenuOpen, setZoomMenuOpen] = useState(false);
  
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
    setPast(p => p.slice(0, -1));
    setFuture(f => [shapes, ...f]);
    setShapes(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(f => f.slice(1));
    setPast(p => [...p, shapes]);
    setShapes(next);
  };

  // Eliminación de formas seleccionadas
  const handleDeleteSelectedShapes = () => {
    if (selectedShapeIds.length === 0) return;
    const count = selectedShapeIds.length;
    commitShapes(prev => prev.filter(s => !selectedShapeIds.includes(s.id)));
    setSelectedShapeIds([]);
    showNotification(count === 1 ? 'Forma eliminada del lienzo' : `${count} formas eliminadas`, 'info');
  };

  // Control de pantalla completa (Zen Mode)
  const isZenMode = !leftPanelOpen && !rightPanelOpen;
  const toggleZenMode = () => {
    if (isZenMode) {
      setLeftPanelOpen(true);
      setRightPanelOpen(true);
    } else {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    }
  };

  const defaultColor = paletteMode === 'luz' ? '#3D80FD' : '#11D7B6';
  const gridLinesList = useMemo(() => Object.values(gridLines) as CustomGridLine[], [gridLines]);
  const customizedGuidesCount = useMemo(() => gridLinesList.filter((l) => l.isCustomized).length, [gridLinesList]);
  const customDrawnLines = useMemo(() => gridLinesList.filter(l => l.type === 'custom'), [gridLinesList]);
  const drawnLinesCount = customDrawnLines.length;

  // Actualizadores de propiedades de trazo y opacidad
  const handleUpdateStrokeWidth = (w: number) => {
    setLineStrokeWidth(w);
    if (selectedDrawnLineId && gridLines[selectedDrawnLineId]) {
      setGridLines(prev => ({
        ...prev,
        [selectedDrawnLineId]: { ...prev[selectedDrawnLineId], strokeWidth: w }
      }));
    }
  };

  const handleUpdateDashStyle = (d: string) => {
    setLineDashStyle(d);
    if (selectedDrawnLineId && gridLines[selectedDrawnLineId]) {
      setGridLines(prev => ({
        ...prev,
        [selectedDrawnLineId]: { ...prev[selectedDrawnLineId], dashArray: d }
      }));
    }
  };

  const handleUpdateOpacity = (o: number) => {
    setLineOpacity(o);
    if (selectedDrawnLineId && gridLines[selectedDrawnLineId]) {
      setGridLines(prev => ({
        ...prev,
        [selectedDrawnLineId]: { ...prev[selectedDrawnLineId], opacity: o }
      }));
    }
  };

  const handleSelectDrawnLine = (id: string | null) => {
    setSelectedDrawnLineId(id);
    if (id && gridLines[id]) {
      const line = gridLines[id];
      if (line.strokeWidth) setLineStrokeWidth(line.strokeWidth);
      if (line.dashArray) setLineDashStyle(line.dashArray);
      if (line.opacity !== undefined) setLineOpacity(line.opacity);
    }
  };

  // Eliminar una línea específica seleccionada por el usuario
  const handleDeleteSpecificLine = (id: string) => {
    const lineToDelete = gridLines[id];
    const lineLabel = lineToDelete ? `${lineToDelete.axis === 'x' ? 'Vertical' : 'Horizontal'} ${lineToDelete.posUnits}X` : 'Línea';
    setGridLines(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (selectedDrawnLineId === id) {
      setSelectedDrawnLineId(null);
    }
    showNotification(`${lineLabel} eliminada`, 'info');
  };

  // Agregar línea de malla dibujada por el usuario
  const handleAddDrawnLine = (axis: 'x' | 'y', posUnits: number, color: string) => {
    const clampedUnits = Math.max(0.25, Math.min(11, posUnits));
    const posPx = clampedUnits * UNIT;
    const id = `custom-${axis}-${Date.now()}`;
    const newLine: CustomGridLine = {
      id,
      axis,
      type: 'custom',
      index: Math.round(clampedUnits / 0.25),
      pos: posPx,
      posUnits: clampedUnits,
      color: color || '#06B6D4',
      strokeWidth: lineStrokeWidth,
      dashArray: lineDashStyle === 'none' ? 'none' : lineDashStyle,
      opacity: lineOpacity,
      visible: true,
      isCustomized: true,
      label: `${axis.toUpperCase()}: ${clampedUnits.toFixed(2)}X`
    };
    setGridLines(prev => ({ ...prev, [id]: newLine }));
    setSelectedDrawnLineId(id);
    showNotification(`Línea ${axis === 'y' ? 'horizontal' : 'vertical'} trazada en ${clampedUnits.toFixed(2)}X (${posPx.toFixed(1)}px)`, 'success');
  };

  // Limpiar todas las líneas de malla dibujadas
  const handleClearDrawnLines = () => {
    setGridLines(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        if (next[key].type === 'custom') {
          delete next[key];
        }
      });
      return next;
    });
    setSelectedDrawnLineId(null);
    showNotification('Todas las líneas personalizadas han sido eliminadas', 'info');
  };

  const shapeDistances = useMemo(() => {
    if (!showDistances) return [];
    return getAllShapeDistances(shapes, selectedShapeId);
  }, [showDistances, shapes, selectedShapeId]);

  // Atajos de teclado: Supr / Backspace para eliminar forma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapeIds.length > 0) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) return;
        e.preventDefault();
        handleDeleteSelectedShapes();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        redo();
      }
    };
    const handleSpaceDown = (e: KeyboardEvent) => { 
      if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT') { 
        setIsSpaceDown(true); 
        e.preventDefault(); 
      } 
    };
    const handleSpaceUp = (e: KeyboardEvent) => { 
      if (e.code === 'Space') setIsSpaceDown(false); 
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleSpaceDown);
    window.addEventListener('keyup', handleSpaceUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleSpaceDown);
      window.removeEventListener('keyup', handleSpaceUp);
    };
  }, [selectedShapeIds, past, future]);

  const addShape = () => {
    const newShape: MatrixShape = {
      id: `shape-${Date.now()}`,
      x: 335, y: 335, widthX: 1, heightX: 1, rot: 0,
      color: defaultColor, wireframe: false, hidden: false, locked: false
    };
    commitShapes([...shapes, newShape]);
    setSelectedShapeIds([newShape.id]);
    showNotification('Nueva forma agregada');
  };

  const selectAllShapes = () => {
    setSelectedShapeIds(shapes.map(s => s.id));
    showNotification(`${shapes.length} formas seleccionadas`);
  };

  // Dragging & Interaction
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef<{ x: number, y: number, scrollLeft: number, scrollTop: number } | null>(null);
  const [dragStart, setDragStart] = useState<{ items: { id: string, x: number, y: number }[], startX: number, startY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (isSpaceDown || isDrawLineMode) return;
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

  const handleSvgPointerDown = (e: React.PointerEvent) => {
    // Si el modo de dibujo de línea está activo, trazar línea en el clic con snap a 0.25X
    if (isDrawLineMode && svgRef.current) {
      const pt = svgRef.current.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
      const rawCoord = drawLineAxis === 'x' ? svgP.x : svgP.y;
      const subUnit = UNIT * 0.25; // 16.75px
      const snappedPx = Math.max(0.25 * UNIT, Math.min(CANVAS_SIZE, Math.round(rawCoord / subUnit) * subUnit));
      const units = Number((snappedPx / UNIT).toFixed(2));
      handleAddDrawnLine(drawLineAxis, units, '#06B6D4');
      return;
    }

    if (!isSpaceDown && e.target === svgRef.current) {
      setSelectedShapeIds([]);
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

    // Previsualización al dibujar línea
    if (isDrawLineMode && svgRef.current) {
      const pt = svgRef.current.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
      const rawCoord = drawLineAxis === 'x' ? svgP.x : svgP.y;
      const subUnit = UNIT * 0.25;
      const snappedPx = Math.max(0, Math.min(CANVAS_SIZE, Math.round(rawCoord / subUnit) * subUnit));
      setCursorPreviewCoord(snappedPx);
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
    }
  };

  const snapAllToGrid = () => {
    commitShapes(prev => prev.map(s => {
      const snapVal = snapMode === 1 ? 16.75 : snapMode;
      return {
        ...s,
        x: Math.round(s.x / snapVal) * snapVal,
        y: Math.round(s.y / snapVal) * snapVal
      };
    }));
    showNotification('Formas alineadas al grid');
  };

  const handleRotateGroup = (angleDeg: number) => {
    if (shapes.length === 0) return;
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Centro del grupo
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    shapes.forEach(s => {
      const w = s.widthX * 67;
      const h = s.heightX * 67;
      minX = Math.min(minX, s.x);
      maxX = Math.max(maxX, s.x + w);
      minY = Math.min(minY, s.y);
      maxY = Math.max(maxY, s.y + h);
    });
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    commitShapes(prev => prev.map(s => {
      const w = s.widthX * 67;
      const h = s.heightX * 67;
      const scx = s.x + w / 2;
      const scy = s.y + h / 2;

      const rx = cos * (scx - cx) - sin * (scy - cy) + cx;
      const ry = sin * (scx - cx) + cos * (scy - cy) + cy;

      return {
        ...s,
        x: rx - w / 2,
        y: ry - h / 2,
        rot: (s.rot + angleDeg) % 360
      };
    }));
  };

  const handleLayerChange = (action: 'front' | 'forward' | 'backward' | 'back') => {
    if (!selectedShapeId) return;
    const idx = shapes.findIndex(s => s.id === selectedShapeId);
    if (idx === -1) return;

    const newShapes = [...shapes];
    const [target] = newShapes.splice(idx, 1);

    if (action === 'front') newShapes.push(target);
    else if (action === 'back') newShapes.unshift(target);
    else if (action === 'forward') newShapes.splice(Math.min(newShapes.length, idx + 1), 0, target);
    else if (action === 'backward') newShapes.splice(Math.max(0, idx - 1), 0, target);

    commitShapes(newShapes);
  };

  const handleUpdateLine = (id: string, updates: Partial<CustomGridLine>) => {
    setGridLines(prev => ({ ...prev, [id]: { ...prev[id], ...updates, isCustomized: true } }));
  };

  const handleBatchUpdateLines = (lineIds: string[], updates: Partial<CustomGridLine>) => {
    setGridLines(prev => {
      const next = { ...prev };
      lineIds.forEach(id => {
        if (next[id]) next[id] = { ...next[id], ...updates, isCustomized: true };
      });
      return next;
    });
  };

  const handleResetAllLines = () => {
    setGridLines(generateInitialGridLines());
  };

  const handleImportShapes = (importedShapes: MatrixShape[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      commitShapes(importedShapes);
    } else {
      commitShapes(prev => [...prev, ...importedShapes]);
    }
  };

  const handleExportToMotion = () => {
    const logoData = createLogoDataFromMatrix(shapes);
    onSendToMotion(logoData);
    showNotification('Diseño enviado al Estudio de Motion');
  };

  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);

  const canvasBg = useMemo(() => {
    if (bgMode === 'dark') return '#171d22';
    if (bgMode === 'blueprint') return '#07162c';
    return '#ffffff';
  }, [bgMode]);

  return (
    <div className="flex flex-col h-full w-full bg-[#12181d] text-[#eceff1] font-mono text-xs overflow-hidden select-none">
      
      {/* Contenedor Principal con Paneles Laterales Protegidos y Central Flexible */}
      <div className="flex flex-1 h-full w-full overflow-hidden relative">
        
        {/* PANEL IZQUIERDO (HERRAMIENTAS GLOBALES Y MALLA) */}
        {leftPanelOpen && (
          <div className="shrink-0 flex-shrink-0 h-full relative z-20 transition-all duration-200">
            <MatrixGlobalTools
              onAddShape={addShape} 
              onSelectAll={selectAllShapes} 
              onImportSvg={() => setImportModalOpen(true)}
              onRotateGroup={handleRotateGroup} 
              onSnapAll={snapAllToGrid}
              onDeleteSelected={handleDeleteSelectedShapes}
              selectedCount={selectedShapeIds.length}
              showMainGrid={showMainGrid} 
              setShowMainGrid={setShowMainGrid}
              showSubGrid={showSubGrid} 
              setShowSubGrid={setShowSubGrid}
              showDiagonals={showDiagonals} 
              setShowDiagonals={setShowDiagonals}
              showDistances={showDistances} 
              setShowDistances={setShowDistances}
              globalWireframe={globalWireframe} 
              setGlobalWireframe={setGlobalWireframe}
              bgMode={bgMode} 
              setBgMode={setBgMode} 
              snapMode={snapMode} 
              setSnapMode={setSnapMode}
              showGridH={showGridH}
              setShowGridH={setShowGridH}
              stepH={stepH}
              setStepH={setStepH}
              showGridV={showGridV}
              setShowGridV={setShowGridV}
              stepV={stepV}
              setStepV={setStepV}
              gridColor={customGridColor}
              setGridColor={setCustomGridColor}
              strokeWidth={lineStrokeWidth}
              setStrokeWidth={handleUpdateStrokeWidth}
              dashStyle={lineDashStyle}
              setDashStyle={handleUpdateDashStyle}
              opacity={lineOpacity}
              setOpacity={handleUpdateOpacity}
              showBaseMeasures={showBaseMeasures}
              setShowBaseMeasures={setShowBaseMeasures}
              onAddDrawnLine={handleAddDrawnLine}
              customDrawnLines={customDrawnLines}
              selectedDrawnLineId={selectedDrawnLineId}
              onSelectDrawnLine={handleSelectDrawnLine}
              onDeleteSpecificLine={handleDeleteSpecificLine}
              drawnLinesCount={drawnLinesCount}
              onClearDrawnLines={handleClearDrawnLines}
              isDrawLineMode={isDrawLineMode}
              setIsDrawLineMode={setIsDrawLineMode}
              drawLineAxis={drawLineAxis}
              setDrawLineAxis={setDrawLineAxis}
              onToggleCollapse={() => setLeftPanelOpen(false)}
            />
          </div>
        )}

        {/* Tirador flotante para reabrir Panel Izquierdo si está colapsado */}
        {!leftPanelOpen && (
          <button
            onClick={() => setLeftPanelOpen(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-[#1e262c] text-emerald-400 hover:text-white border border-slate-700/80 border-l-0 p-2 rounded-r-lg shadow-2xl hover:bg-slate-700 transition-all group flex items-center gap-1"
            title="Desplegar Herramientas (Panel Izquierdo)"
          >
            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-bold writing-mode-vertical rotate-180 hidden sm:inline-block py-1">HERRAMIENTAS</span>
          </button>
        )}

        {/* CONTENEDOR CENTRAL: DASHBOARD DE CONTROL + LIENZO CON ZOOM PROTEGIDO */}
        <div className="flex-1 min-w-0 h-full flex flex-col relative overflow-hidden bg-[#0e1418]">
          
          {/* BARRA SUPERIOR / DASHBOARD TÉCNICO DE CONTROL */}
          <div className="flex items-center justify-between gap-2.5 bg-[#171f26] px-3.5 py-2.5 shadow-md z-10 border-b border-slate-700/60 shrink-0 select-none">
            
            {/* Lado Izquierdo: Botones de Paneles y Guías */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                className={`p-1.5 rounded-lg border transition-all ${
                  leftPanelOpen 
                    ? 'bg-[#263238] border-slate-600 text-slate-200' 
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm'
                }`}
                title={leftPanelOpen ? "Ocultar Herramientas Izquierda" : "Mostrar Herramientas Izquierda"}
              >
                {leftPanelOpen ? <PanelLeftClose size={15} /> : <PanelLeft size={15} />}
              </button>

              <button
                onClick={toggleZenMode}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                  isZenMode 
                    ? 'bg-[#3D80FD] text-white border-[#3D80FD] shadow-md shadow-[#3D80FD]/20 animate-pulse' 
                    : 'bg-[#1e262c] text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
                title={isZenMode ? "Salir de Pantalla Completa (Restaurar Paneles)" : "Pantalla Completa (Ocultar Paneles)"}
              >
                {isZenMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                <span className="hidden sm:inline">{isZenMode ? 'PANTALLA COMPLETA ON' : 'PANTALLA COMPLETA'}</span>
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

              <button 
                onClick={() => setGuidesManagerOpen(!guidesManagerOpen)} 
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                  guidesManagerOpen || customizedGuidesCount > 0 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' 
                    : 'bg-[#1e262c] text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
                title="Gestor Detallado de Guías y Cotas"
              >
                <Compass size={13} />
                <span className="hidden md:inline">GUÍAS</span>
                {customizedGuidesCount > 0 && (
                  <span className="px-1 bg-cyan-400 text-black text-[9px] font-bold rounded-full">{customizedGuidesCount}</span>
                )}
              </button>

              <button 
                onClick={() => setGuidesLocked(!guidesLocked)} 
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                  guidesLocked 
                    ? 'bg-[#1e262c] text-amber-300/90 border-amber-500/30 hover:border-amber-400' 
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                }`}
                title="Alternar bloqueo de guías"
              >
                {guidesLocked ? 'Bloqueadas' : 'Editables'}
              </button>

              <button 
                onClick={() => setShowBaseMeasures(!showBaseMeasures)} 
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                  showBaseMeasures 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' 
                    : 'bg-[#1e262c] text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title={showBaseMeasures ? "Ocultar medidas base canónicas (1X, 2X...)" : "Mostrar medidas base canónicas (1X, 2X...)"}
              >
                {showBaseMeasures ? <Eye size={13} className="text-cyan-400" /> : <EyeOff size={13} className="text-slate-500" />}
                <span className="hidden lg:inline">{showBaseMeasures ? 'Medidas 1X ON' : 'Medidas 1X OFF'}</span>
              </button>
            </div>

            {/* Centro: Controles de Zoom Inteligentes y Sin Deformación */}
            <div className="flex items-center gap-1.5 bg-[#12171b] px-2 py-1 rounded-lg border border-slate-700/80 text-[11px]">
              <button 
                onClick={() => setZoom(z => Math.max(0.25, Number((z - 0.25).toFixed(2))))} 
                className="hover:text-emerald-400 p-1 font-bold text-slate-400 hover:bg-slate-800 rounded transition-colors"
                title="Reducir Zoom"
              >
                <ZoomOut size={13} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setZoomMenuOpen(!zoomMenuOpen)}
                  className="text-emerald-400 font-bold px-2 py-0.5 hover:bg-slate-800 rounded transition-colors"
                  title="Cambiar Zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>

                {zoomMenuOpen && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-28 bg-[#1e262c] border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-[11px]">
                    {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(z => (
                      <button
                        key={z}
                        onClick={() => { setZoom(z); setZoomMenuOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 transition-colors flex items-center justify-between ${zoom === z ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
                      >
                        <span>{Math.round(z * 100)}%</span>
                        {zoom === z && <Check size={12} />}
                      </button>
                    ))}
                    <button
                      onClick={() => { setZoom(1); setZoomMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 border-t border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      Restablecer (100%)
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setZoom(z => Math.min(3, Number((z + 0.25).toFixed(2))))} 
                className="hover:text-emerald-400 p-1 font-bold text-slate-400 hover:bg-slate-800 rounded transition-colors"
                title="Aumentar Zoom"
              >
                <ZoomIn size={13} />
              </button>
            </div>

            {/* Lado Derecho: Deshacer/Rehacer, Plantillas, Exportar y Motion */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border-r border-slate-700/60 pr-2">
                <button 
                  onClick={undo} 
                  disabled={past.length === 0} 
                  className={`p-1.5 rounded-lg transition-colors ${
                    past.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`} 
                  title="Deshacer (Ctrl+Z)"
                >
                  <Undo size={14} />
                </button>
                <button 
                  onClick={redo} 
                  disabled={future.length === 0} 
                  className={`p-1.5 rounded-lg transition-colors ${
                    future.length === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`} 
                  title="Rehacer (Ctrl+Y)"
                >
                  <Redo size={14} />
                </button>
              </div>

              {/* Plantillas Oficiales */}
              <div className="relative">
                <button 
                  onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)} 
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1e262c] hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-[11px] font-semibold border border-slate-700 transition-colors shadow-sm"
                >
                  <Grid3X3 size={13} className="text-[#3D80FD]" />
                  <span className="hidden md:inline">PLANTILLAS</span>
                </button>
                {templateDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a2228] border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
                    <div className="px-3 py-2 border-b border-slate-700/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Plantillas Oficiales HMA
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {MATRIX_TEMPLATES.map((tpl, i) => (
                        <button 
                          key={i} 
                          onClick={() => { 
                            commitShapes(tpl.shapes); 
                            setTemplateDropdownOpen(false); 
                            setSelectedShapeIds([]); 
                            showNotification(`Plantilla ${tpl.name} cargada`);
                          }} 
                          className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between"
                        >
                          <span>{tpl.name}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{tpl.shapes.length} pz</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón Exportar */}
              <button 
                onClick={() => setExportModalOpen(true)} 
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1e262c] hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-[11px] font-semibold transition-colors"
                title="Exportar archivo de diseño"
              >
                <Download size={13} className="text-emerald-400" />
                <span className="hidden md:inline">EXPORTAR</span>
              </button>

              {/* Botón A Motion */}
              <button 
                onClick={handleExportToMotion} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3D80FD] hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold shadow-md shadow-[#3D80FD]/20 transition-colors"
                title="Enviar al estudio de Motion"
              >
                <Send size={12} />
                <span>A MOTION</span>
              </button>

              <div className="h-4 w-px bg-slate-700 mx-0.5" />

              {/* Alternar Panel Derecho */}
              <button
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className={`p-1.5 rounded-lg border transition-all ${
                  rightPanelOpen 
                    ? 'bg-[#263238] border-slate-600 text-slate-200' 
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm'
                }`}
                title={rightPanelOpen ? "Ocultar Inspector Derecha" : "Mostrar Inspector Derecha"}
              >
                {rightPanelOpen ? <PanelRightClose size={15} /> : <PanelRight size={15} />}
              </button>
            </div>
          </div>

          {/* ÁREA DE SCROLL CON ZOOM PROTEGIDO: LOS PANELES NO SE DEFORMAN */}
          <div 
            ref={scrollContainerRef} 
            className={`flex-1 w-full h-full overflow-auto relative p-6 custom-scrollbar ${
              bgMode === 'blueprint' ? 'bg-[#09131e]' : 'bg-[#0e1418]'
            }`} 
            onPointerDown={handlePanStart} 
            style={{ cursor: isSpaceDown ? 'grab' : isDrawLineMode ? 'crosshair' : 'default' }}
          >
            {/* Banner informativo flotante si el modo de dibujo de malla está activo */}
            {isDrawLineMode && (
              <div className="sticky top-2 z-40 mx-auto max-w-md bg-cyan-950/90 text-cyan-300 border border-cyan-400/80 px-3 py-1.5 rounded-lg shadow-xl flex items-center justify-between text-[11px] backdrop-blur-sm animate-pulse">
                <span>✏️ Haz clic en el lienzo para trazar línea {drawLineAxis === 'y' ? 'HORIZONTAL' : 'VERTICAL'} (Snap 0.25X)</span>
                <button 
                  onClick={() => setIsDrawLineMode(false)} 
                  className="ml-2 font-bold bg-cyan-500/20 hover:bg-cyan-500/40 px-2 py-0.5 rounded text-white"
                >
                  Salir
                </button>
              </div>
            )}

            <div className="min-h-full min-w-full flex items-center justify-center p-4">
              <div 
                className="shadow-2xl rounded-xl shrink-0 flex-shrink-0 relative transition-all duration-150 border border-slate-700/60" 
                style={{ 
                  width: 957 * zoom, 
                  height: 897 * zoom, 
                  minWidth: 957 * zoom, 
                  minHeight: 897 * zoom, 
                  backgroundColor: bgMode === 'dark' ? '#1e262c' : bgMode === 'blueprint' ? '#0a192f' : '#f8f9fa' 
                }}
              >
                <svg 
                  ref={svgRef} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="-140 -80 957 897" 
                  className="w-full h-full block select-none" 
                  onPointerDown={handleSvgPointerDown}
                  onPointerMove={handlePointerMove} 
                  onPointerUp={handlePointerUp} 
                  onPointerLeave={handlePointerUp} 
                  style={{ pointerEvents: isSpaceDown ? 'none' : 'auto' }}
                >
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
                  
                  {/* Fondos del SVG */}
                  <rect x="-140" y="-80" width="957" height="897" fill={bgMode === 'dark' ? '#1e262c' : bgMode === 'blueprint' ? '#0a192f' : '#f8f9fa'} />
                  <rect x="0" y="0" width="737" height="737" fill={canvasBg} />
                  
                  {/* Diagonales Maestras */}
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

                  {/* 1. MALLA PARAMÉTRICA HORIZONTAL A PARTIR DE 0.25X */}
                  {showGridH && (
                    <g id="parametric-grid-h-layer">
                      {Array.from({ length: Math.floor(11 / stepH) + 1 }).map((_, idx) => {
                        const u = Number((idx * stepH).toFixed(2));
                        const yPos = u * UNIT;
                        if (yPos > CANVAS_SIZE) return null;
                        const isInteger = Math.abs(u - Math.round(u)) < 0.001;
                        return (
                          <g key={`pgh-${u}`}>
                            <line 
                              x1={0} y1={yPos} 
                              x2={CANVAS_SIZE} y2={yPos} 
                              stroke={customGridColor} 
                              strokeWidth={isInteger ? Math.max(1, lineStrokeWidth) : Math.max(0.6, lineStrokeWidth * 0.65)} 
                              strokeDasharray={lineDashStyle === 'none' ? (isInteger ? undefined : '2 2') : lineDashStyle} 
                              strokeOpacity={isInteger ? lineOpacity * 0.75 : lineOpacity * 0.35} 
                            />
                            {/* Cota a la derecha */}
                            <text 
                              x={CANVAS_SIZE + 6} y={yPos + 3} 
                              fill={customGridColor} 
                              fontSize="8.5px" 
                              fontFamily="monospace"
                              opacity={isInteger ? 0.85 : 0.45}
                            >
                              {u}X
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* 2. MALLA PARAMÉTRICA VERTICAL A PARTIR DE 0.25X */}
                  {showGridV && (
                    <g id="parametric-grid-v-layer">
                      {Array.from({ length: Math.floor(11 / stepV) + 1 }).map((_, idx) => {
                        const u = Number((idx * stepV).toFixed(2));
                        const xPos = u * UNIT;
                        if (xPos > CANVAS_SIZE) return null;
                        const isInteger = Math.abs(u - Math.round(u)) < 0.001;
                        return (
                          <g key={`pgv-${u}`}>
                            <line 
                              x1={xPos} y1={0} 
                              x2={xPos} y2={CANVAS_SIZE} 
                              stroke={customGridColor} 
                              strokeWidth={isInteger ? Math.max(1, lineStrokeWidth) : Math.max(0.6, lineStrokeWidth * 0.65)} 
                              strokeDasharray={lineDashStyle === 'none' ? (isInteger ? undefined : '2 2') : lineDashStyle} 
                              strokeOpacity={isInteger ? lineOpacity * 0.75 : lineOpacity * 0.35} 
                            />
                            {/* Cota abajo en orientación VERTICAL para evitar solapamiento a 0.25X */}
                            <text 
                              x={xPos} 
                              y={CANVAS_SIZE + 8} 
                              textAnchor="start" 
                              dominantBaseline="central"
                              transform={`rotate(90, ${xPos}, ${CANVAS_SIZE + 8})`}
                              fill={customGridColor} 
                              fontSize="8px" 
                              fontFamily="monospace"
                              opacity={isInteger ? 0.85 : 0.45}
                            >
                              {u}X
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* 3. LÍNEAS DE MALLA DIBUJADAS POR EL USUARIO */}
                  <g id="user-drawn-grid-lines">
                    {gridLinesList.filter(l => l.type === 'custom' && l.visible).map(line => {
                      const isSelected = selectedDrawnLineId === line.id;
                      return (
                        <g key={line.id} className="group">
                          <line 
                            x1={line.axis === 'x' ? line.pos : 0} 
                            y1={line.axis === 'y' ? line.pos : 0} 
                            x2={line.axis === 'x' ? line.pos : CANVAS_SIZE} 
                            y2={line.axis === 'y' ? line.pos : CANVAS_SIZE} 
                            stroke={isSelected ? '#10B981' : line.color} 
                            strokeWidth={isSelected ? Math.max(3, (line.strokeWidth || 2) + 1.5) : (line.strokeWidth || 2)} 
                            strokeDasharray={line.dashArray === 'none' ? undefined : line.dashArray} 
                            strokeOpacity={isSelected ? 1 : line.opacity} 
                            className="cursor-pointer transition-all"
                            onClick={e => {
                              e.stopPropagation();
                              handleSelectDrawnLine(line.id);
                            }}
                          />
                          
                          {/* Indicador de cota: ORIENTADO EN VERTICAL PARA LÍNEAS VERTICALES (EJE X) */}
                          {line.axis === 'x' ? (
                            <g 
                              transform={`translate(${line.pos}, -6)`}
                              className="cursor-pointer"
                              onClick={e => {
                                e.stopPropagation();
                                handleSelectDrawnLine(line.id);
                              }}
                            >
                              {/* Pastilla vertical estrecha de 12px: imposible de solapar a 0.25X (16.75px) */}
                              <rect 
                                x="-6" 
                                y="-42" 
                                width="12" 
                                height="40" 
                                rx="3" 
                                fill={isSelected ? '#10B981' : '#171d22'} 
                                stroke={isSelected ? '#ffffff' : line.color} 
                                strokeWidth={isSelected ? 1.5 : 1} 
                              />
                              {/* Texto rotado verticalmente -90° para lectura clara de abajo hacia arriba */}
                              <text 
                                x="0" 
                                y="-22" 
                                textAnchor="middle" 
                                dominantBaseline="central"
                                transform="rotate(-90, 0, -22)"
                                fill={isSelected ? '#000000' : line.color} 
                                fontSize="9px" 
                                fontWeight="bold" 
                                fontFamily="monospace"
                              >
                                {line.posUnits.toFixed(2)}X
                              </text>

                              {/* Botón flotante de eliminación rápida si la línea está seleccionada */}
                              {isSelected && (
                                <g 
                                  transform="translate(0, -52)" 
                                  className="cursor-pointer"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleDeleteSpecificLine(line.id);
                                  }}
                                  title="Eliminar esta línea"
                                >
                                  <circle r="7" fill="#EF4444" stroke="#ffffff" strokeWidth="1" />
                                  <path d="M-2.5,-2.5 L2.5,2.5 M-2.5,2.5 L2.5,-2.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                                </g>
                              )}
                            </g>
                          ) : (
                            /* Cota Horizontal en margen izquierdo */
                            <g 
                              transform={`translate(-6, ${line.pos})`}
                              className="cursor-pointer"
                              onClick={e => {
                                e.stopPropagation();
                                handleSelectDrawnLine(line.id);
                              }}
                            >
                              <rect 
                                x="-46" 
                                y="-9" 
                                width="42" 
                                height="18" 
                                rx="3" 
                                fill={isSelected ? '#10B981' : '#171d22'} 
                                stroke={isSelected ? '#ffffff' : line.color} 
                                strokeWidth={isSelected ? 1.5 : 1} 
                              />
                              <text 
                                x="-25" 
                                y="3.5" 
                                textAnchor="middle" 
                                fill={isSelected ? '#000000' : line.color} 
                                fontSize="9px" 
                                fontWeight="bold" 
                                fontFamily="monospace"
                              >
                                {line.posUnits.toFixed(2)}X
                              </text>

                              {/* Botón flotante de eliminación rápida si la línea horizontal está seleccionada */}
                              {isSelected && (
                                <g 
                                  transform="translate(-56, 0)" 
                                  className="cursor-pointer"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleDeleteSpecificLine(line.id);
                                  }}
                                  title="Eliminar esta línea"
                                >
                                  <circle r="7" fill="#EF4444" stroke="#ffffff" strokeWidth="1" />
                                  <path d="M-2.5,-2.5 L2.5,2.5 M-2.5,2.5 L2.5,-2.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                                </g>
                              )}
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {/* Previsualización de línea al dibujar interactivamente */}
                  {isDrawLineMode && cursorPreviewCoord !== null && (
                    <g id="draw-mode-preview">
                      <line 
                        x1={drawLineAxis === 'x' ? cursorPreviewCoord : 0} 
                        y1={drawLineAxis === 'y' ? cursorPreviewCoord : 0} 
                        x2={drawLineAxis === 'x' ? cursorPreviewCoord : 737} 
                        y2={drawLineAxis === 'y' ? cursorPreviewCoord : 737} 
                        stroke="#06B6D4" 
                        strokeWidth={Math.max(2, lineStrokeWidth)} 
                        strokeDasharray={lineDashStyle === 'none' ? '4 4' : lineDashStyle} 
                        strokeOpacity="0.9"
                      />
                      {drawLineAxis === 'x' ? (
                        <g transform={`translate(${cursorPreviewCoord}, -6)`}>
                          <rect x="-6" y="-42" width="12" height="40" rx="3" fill="#06B6D4" />
                          <text 
                            x="0" 
                            y="-22" 
                            textAnchor="middle" 
                            dominantBaseline="central" 
                            transform="rotate(-90, 0, -22)" 
                            fill="#000000" 
                            fontSize="8.5px" 
                            fontWeight="bold" 
                            fontFamily="monospace"
                          >
                            {(cursorPreviewCoord / UNIT).toFixed(2)}X
                          </text>
                        </g>
                      ) : (
                        <g transform={`translate(-6, ${cursorPreviewCoord})`}>
                          <rect x="-46" y="-9" width="42" height="18" rx="3" fill="#06B6D4" />
                          <text x="-25" y="3.5" textAnchor="middle" fill="#000000" fontSize="9px" fontWeight="bold" fontFamily="monospace">
                            {(cursorPreviewCoord / UNIT).toFixed(2)}X
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* Sub-malla Canónica (si showSubGrid está activo) */}
                  {showSubGrid && (
                    <g id="sub-grid-layer">
                      {gridLinesList.filter(l => l.visible && l.type === 'sub' && !l.isCustomized).map(line => (
                        <line 
                          key={line.id} 
                          x1={line.axis === 'x' ? line.pos : 0} 
                          y1={line.axis === 'y' ? line.pos : 0} 
                          x2={line.axis === 'x' ? line.pos : CANVAS_SIZE} 
                          y2={line.axis === 'y' ? line.pos : CANVAS_SIZE} 
                          stroke={bgMode==='blueprint'?'rgba(59,130,246,0.2)':bgMode==='dark'?'#1e293b':DEFAULT_SUB_LINE_COLOR} 
                          strokeWidth={line.strokeWidth} 
                          strokeDasharray={line.dashArray === 'none' ? undefined : line.dashArray} 
                          strokeOpacity={line.opacity} 
                          className={`${!guidesLocked ? 'line-interactive' : ''} ${selectedLineId === line.id ? 'line-selected' : ''}`} 
                          onClick={e => { 
                            if(!guidesLocked) { 
                              e.stopPropagation(); 
                              setSelectedLineId(line.id); 
                              setGuidesManagerOpen(true); 
                            } 
                          }} 
                        />
                      ))}
                    </g>
                  )}

                  {/* Malla Canónica 1X (si showMainGrid está activo) */}
                  {showMainGrid && (
                    <g id="main-grid-layer">
                      {gridLinesList.filter(l => l.visible && l.type === 'main' && !l.isCustomized).map(line => (
                        <line 
                          key={line.id} 
                          x1={line.axis === 'x' ? line.pos : 0} 
                          y1={line.axis === 'y' ? line.pos : 0} 
                          x2={line.axis === 'x' ? line.pos : CANVAS_SIZE} 
                          y2={line.axis === 'y' ? line.pos : CANVAS_SIZE} 
                          stroke={bgMode==='blueprint'?'#3b82f6':bgMode==='dark'?'#334155':DEFAULT_MAIN_LINE_COLOR} 
                          strokeWidth={line.strokeWidth} 
                          strokeDasharray={line.dashArray === 'none' ? undefined : line.dashArray} 
                          strokeOpacity={line.opacity} 
                          className={`${!guidesLocked ? 'line-interactive' : ''} ${selectedLineId === line.id ? 'line-selected' : ''}`} 
                          onClick={e => { 
                            if(!guidesLocked) { 
                              e.stopPropagation(); 
                              setSelectedLineId(line.id); 
                              setGuidesManagerOpen(true); 
                            } 
                          }} 
                        />
                      ))}
                    </g>
                  )}

                  {/* Etiquetas de Ejes Canónicas (1X, 2X...): Ocultables a petición del usuario */}
                  {showBaseMeasures && (
                    <g id="base-axis-measures">
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
                    </g>
                  )}

                  {/* FORMAS VECTORIALES HMA */}
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
                        <rect 
                          key={shape.id} 
                          id={shape.id} 
                          className={`draggable-shape ${isSelected ? 'selected' : ''}`} 
                          x={0} y={0} 
                          width={w} height={h} rx={rx} 
                          fill={fill} stroke={stroke} strokeWidth={strokeW} 
                          opacity={shape.locked ? 0.8 : 1} 
                          transform={`translate(${shape.x}, ${shape.y}) rotate(${shape.rot}, ${w/2}, ${h/2})`} 
                          onPointerDown={e => { 
                            e.stopPropagation(); 
                            if(shape.locked) return; 
                            handlePointerDown(e, shape.id); 
                          }} 
                        />
                      );
                    })}
                  </g>

                  {/* Cotas y Espaciados X entre formas */}
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

            {/* Modal de Gestor de Guías */}
            {guidesManagerOpen && (
              <MatrixGuidesManager 
                lines={gridLines} 
                selectedLineId={selectedLineId} 
                onSelectLine={setSelectedLineId} 
                onUpdateLine={handleUpdateLine} 
                onBatchUpdateLines={handleBatchUpdateLines} 
                onResetAllLines={handleResetAllLines} 
                onClose={() => setGuidesManagerOpen(false)} 
                showNotification={showNotification} 
                guidesLocked={guidesLocked} 
                onToggleGuidesLocked={() => setGuidesLocked(!guidesLocked)} 
              />
            )}
          </div>
        </div>

        {/* Tirador flotante para reabrir Panel Derecho si está colapsado */}
        {!rightPanelOpen && (
          <button
            onClick={() => setRightPanelOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-[#1e262c] text-emerald-400 hover:text-white border border-slate-700/80 border-r-0 p-2 rounded-l-lg shadow-2xl hover:bg-slate-700 transition-all group flex items-center gap-1"
            title="Desplegar Inspector (Panel Derecho)"
          >
            <span className="text-[10px] font-bold writing-mode-vertical hidden sm:inline-block py-1">INSPECTOR</span>
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* PANEL DERECHO: INSPECTOR DE FORMA */}
        {rightPanelOpen && (
          <div className="shrink-0 flex-shrink-0 h-full relative z-20 transition-all duration-200">
            <MatrixInspector 
              selectedShapes={shapes.filter(s => selectedShapeIds.includes(s.id))} 
              onUpdate={updates => commitShapes(prev => prev.map(s => selectedShapeIds.includes(s.id) ? { ...s, ...updates } : s))} 
              onLayerChange={handleLayerChange} 
              onSnapToGrid={snapAllToGrid} 
              snapMode={snapMode}
              onDeleteSelected={handleDeleteSelectedShapes}
            />
          </div>
        )}

      </div>

      {/* Modales de Exportar e Importar */}
      {exportModalOpen && (
        <MatrixExportModal 
          shapes={shapes} 
          gridLines={gridLines} 
          showMainGrid={showMainGrid} 
          showSubGrid={showSubGrid} 
          onClose={() => setExportModalOpen(false)} 
          showNotification={showNotification} 
        />
      )}

      {importModalOpen && (
        <MatrixSvgImportModal 
          onClose={() => setImportModalOpen(false)} 
          onImport={handleImportShapes} 
          showNotification={showNotification} 
          defaultColor={defaultColor} 
        />
      )}
    </div>
  );
};
