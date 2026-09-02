/**
 * HMA INLUMENAI STUDIO (v2026.40)
 * Module 1: Interactive Parametric Matrix Assembler (1M = 67px)
 * Supports Collapsible/Foldable Sidebars, Dropdown Panels, Drag & Drop of SVG & JSON,
 * 4 Exact Movement Modes (Free, 1.0M, 0.5M, 0.25M), Background Blueprint Guides & Group Rotations.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  Move,
  Grid,
  Square,
  Crosshair,
  Ruler,
  UploadCloud,
  FileCode,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Sliders,
  Layers,
  CheckSquare
} from 'lucide-react';
import { BoundingBoxSize, GridSettings, HMAPiece, MoveStepMode, ShapeType } from '../../types/hma';
import { MODULE_PX, PIECE_GEOMETRIES, getShapeSvgPath } from '../../data/hmaDefinitions';
import { PieceToolbar } from './PieceToolbar';
import { BoxManagerModal } from './BoxManagerModal';
import { TechnicalBox, DEFAULT_TECHNICAL_BOXES } from '../../types';
import { InspectorPanel } from './InspectorPanel';

interface HmaMatrixStudioProps {
  pieces: HMAPiece[];
  setPieces: React.Dispatch<React.SetStateAction<HMAPiece[]>>;
  selectedPieceId: string | null;
  setSelectedPieceId: (id: string | null) => void;
  gridSettings: GridSettings;
  setGridSettings: React.Dispatch<React.SetStateAction<GridSettings>>;
  onAnchorBase?: () => void;
  colorLuz: string;
  colorProfundo: string;
  activePresetName: string;
  onLoadJson?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSvg?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HmaMatrixStudio: React.FC<HmaMatrixStudioProps> = ({
  pieces,
  setPieces,
  selectedPieceId,
  setSelectedPieceId,
  gridSettings,
  setGridSettings,
  colorLuz,
  colorProfundo,
  activePresetName,
  onLoadJson,
  onLoadSvg
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<TechnicalBox[]>(DEFAULT_TECHNICAL_BOXES);
  const [activeBoxId, setActiveBoxId] = useState<string>(DEFAULT_TECHNICAL_BOXES[0].id);
  const [isBoxManagerOpen, setIsBoxManagerOpen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0 });
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);

  // Collapsible Sidebars State
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const isAllSelected = selectedPieceId === 'ALL_PIECES';
  const selectedPiece = isAllSelected ? null : pieces.find((p) => p.id === selectedPieceId) || null;

  const isAllPanelsCollapsed = !isLeftPanelOpen && !isRightPanelOpen;

  const toggleFullscreenCanvas = () => {
    if (isAllPanelsCollapsed) {
      setIsLeftPanelOpen(true);
      setIsRightPanelOpen(true);
    } else {
      setIsLeftPanelOpen(false);
      setIsRightPanelOpen(false);
    }
  };

  const moveMode: MoveStepMode = gridSettings.moveStepMode || '1.0M';

  // Snapping helper: 4 Modes (Free / 1.0M = 67px / 0.5M = 33.5px / 0.25M = 16.75px)
  const snapValue = useCallback(
    (val: number): number => {
      if (moveMode === 'free' || !gridSettings.snapToGrid) return Math.round(val);
      let step = MODULE_PX; // 67px (1.0M)
      if (moveMode === '0.25M') step = MODULE_PX / 4; // 16.75px
      else if (moveMode === '0.5M') step = MODULE_PX / 2; // 33.5px

      return Math.round(val / step) * step;
    },
    [moveMode, gridSettings.snapToGrid]
  );

  // Rotate Entire Group around Center (0, 0)
  const handleRotateGroup = (angleDeltaDeg: number) => {
    const rad = (angleDeltaDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    setPieces((prev) =>
      prev.map((p) => {
        const rx = p.x * cos - p.y * sin;
        const ry = p.x * sin + p.y * cos;
        const newRot = ((p.rotation + angleDeltaDeg) % 360 + 360) % 360;
        return {
          ...p,
          x: Math.round(rx * 100) / 100,
          y: Math.round(ry * 100) / 100,
          rotation: Math.round(newRot * 100) / 100
        };
      })
    );
  };

  // Move Entire Group (Offset)
  const handleMoveGroup = (dx: number, dy: number) => {
    setPieces((prev) =>
      prev.map((p) => ({
        ...p,
        x: Math.round((p.x + dx) * 100) / 100,
        y: Math.round((p.y + dy) * 100) / 100
      }))
    );
  };

  // Update all pieces simultaneously
  const handleUpdateAllPieces = (updated: Partial<HMAPiece>) => {
    setPieces((prev) => prev.map((p) => ({ ...p, ...updated })));
  };

  // Select all toggle
  const handleSelectAllPieces = () => {
    if (selectedPieceId === 'ALL_PIECES') {
      setSelectedPieceId(null);
    } else {
      setSelectedPieceId('ALL_PIECES');
    }
  };

  // Keyboard navigation for precise movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere if typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const stepPx =
        moveMode === 'free'
          ? 1
          : moveMode === '0.25M'
          ? MODULE_PX / 4
          : moveMode === '0.5M'
          ? MODULE_PX / 2
          : MODULE_PX;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isAllSelected) handleMoveGroup(0, -stepPx);
        else if (selectedPieceId) {
          setPieces((prev) =>
            prev.map((p) => (p.id === selectedPieceId ? { ...p, y: p.y - stepPx } : p))
          );
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (isAllSelected) handleMoveGroup(0, stepPx);
        else if (selectedPieceId) {
          setPieces((prev) =>
            prev.map((p) => (p.id === selectedPieceId ? { ...p, y: p.y + stepPx } : p))
          );
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isAllSelected) handleMoveGroup(-stepPx, 0);
        else if (selectedPieceId) {
          setPieces((prev) =>
            prev.map((p) => (p.id === selectedPieceId ? { ...p, x: p.x - stepPx } : p))
          );
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isAllSelected) handleMoveGroup(stepPx, 0);
        else if (selectedPieceId) {
          setPieces((prev) =>
            prev.map((p) => (p.id === selectedPieceId ? { ...p, x: p.x + stepPx } : p))
          );
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        handleSelectAllPieces();
      } else if (e.key === 'Escape') {
        setSelectedPieceId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveMode, isAllSelected, selectedPieceId, pieces]);

  // Mouse handlers for dragging pieces or panning canvas
  const handleMouseDownPiece = (e: React.MouseEvent, piece: HMAPiece) => {
    e.stopPropagation();
    if (piece.locked) return;

    if (!isAllSelected) {
      setSelectedPieceId(piece.id);
    }
    setDraggingPieceId(piece.id);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - rect.width / 2 - gridSettings.panX) / gridSettings.zoom;
      const mouseY = (e.clientY - rect.top - rect.height / 2 - gridSettings.panY) / gridSettings.zoom;
      setDragOffset({
        x: mouseX - piece.x,
        y: mouseY - piece.y
      });
    }
  };

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setSelectedPieceId(null);
      setIsPanning(true);
      setPanStart({
        x: e.clientX - gridSettings.panX,
        y: e.clientY - gridSettings.panY
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - rect.width / 2 - gridSettings.panX) / gridSettings.zoom;
      const canvasY = (e.clientY - rect.top - rect.height / 2 - gridSettings.panY) / gridSettings.zoom;
      setMouseCoord({ x: Math.round(canvasX), y: Math.round(canvasY) });

      if (isPanning) {
        setGridSettings((s) => ({
          ...s,
          panX: e.clientX - panStart.x,
          panY: e.clientY - panStart.y
        }));
      } else if (draggingPieceId) {
        const rawX = canvasX - dragOffset.x;
        const rawY = canvasY - dragOffset.y;
        const snappedX = snapValue(rawX);
        const snappedY = snapValue(rawY);

        if (isAllSelected) {
          const activePiece = pieces.find((p) => p.id === draggingPieceId);
          if (activePiece) {
            const dx = snappedX - activePiece.x;
            const dy = snappedY - activePiece.y;
            if (dx !== 0 || dy !== 0) {
              setPieces((prev) =>
                prev.map((p) => ({
                  ...p,
                  x: Math.round((p.x + dx) * 100) / 100,
                  y: Math.round((p.y + dy) * 100) / 100
                }))
              );
            }
          }
        } else {
          setPieces((prev) =>
            prev.map((p) => (p.id === draggingPieceId ? { ...p, x: snappedX, y: snappedY } : p))
          );
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingPieceId(null);
  };

  // Drag & Drop File onto canvas (SVG or JSON)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCanvas(true);
  };

  const handleDragLeave = () => {
    setIsDragOverCanvas(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverCanvas(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json.pieces && Array.isArray(json.pieces)) {
            setPieces(json.pieces);
            setSelectedPieceId(null);
          }
        } catch (err) {
          console.error('Error al soltar JSON:', err);
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.svg')) {
      if (onLoadSvg) {
        const syntheticEvent = {
          target: { files: [file], value: '' }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onLoadSvg(syntheticEvent);
      }
    }
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    setGridSettings((s) => ({
      ...s,
      zoom: Math.min(3, Math.max(0.3, s.zoom + delta))
    }));
  };

  const handleResetView = () => {
    setGridSettings((s) => ({
      ...s,
      zoom: 1,
      panX: 0,
      panY: 0
    }));
  };

  // Add piece to canvas
  const handleAddPiece = (shapeType: ShapeType) => {
    const geom = PIECE_GEOMETRIES.find((g) => g.type === shapeType);
    if (!geom) return;

    const newId = `piece-${Date.now()}`;
    const newPiece: HMAPiece = {
      id: newId,
      shapeType,
      name: geom.name.split(':')[0],
      x: 0,
      y: 0,
      rotation: 0,
      widthM: geom.defaultWidthM,
      heightM: geom.defaultHeightM,
      scaleX: 1,
      scaleY: 1,
      color: geom.category === 'base' ? colorProfundo : colorLuz,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: pieces.length + 1,
      category: geom.category,
      wireframe: false
    };

    setPieces((prev) => [...prev, newPiece]);
    setSelectedPieceId(newId);
  };

  // Update selected piece
  const handleUpdatePiece = (updated: Partial<HMAPiece>) => {
    if (!selectedPieceId) return;
    setPieces((prev) =>
      prev.map((p) => (p.id === selectedPieceId ? { ...p, ...updated } : p))
    );
  };

  // Duplicate piece
  const handleDuplicatePiece = (id: string) => {
    const target = pieces.find((p) => p.id === id);
    if (!target) return;

    const newId = `piece-${Date.now()}`;
    const duplicated: HMAPiece = {
      ...target,
      id: newId,
      name: `${target.name} (Copia)`,
      x: target.x + MODULE_PX / 2,
      y: target.y + MODULE_PX / 2,
      zIndex: pieces.length + 1
    };

    setPieces((prev) => [...prev, duplicated]);
    setSelectedPieceId(newId);
  };

  // Delete piece
  const handleDeletePiece = (id: string) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
    if (selectedPieceId === id) setSelectedPieceId(null);
  };

  // Move layer order
  const handleMoveLayer = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    setPieces((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);

      if (direction === 'up' && idx < copy.length) copy.splice(idx + 1, 0, item);
      else if (direction === 'down' && idx > 0) copy.splice(idx - 1, 0, item);
      else if (direction === 'top') copy.push(item);
      else if (direction === 'bottom') copy.unshift(item);

      return copy.map((p, i) => ({ ...p, zIndex: i + 1 }));
    });
  };

  // Toggle Piece Visibility
  const handleTogglePieceVisibility = (id: string) => {
    setPieces((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p))
    );
  };

  // Render Grid lines
  const renderGridLines = () => {
    if (!gridSettings.showGrid) return null;

    const lines = [];
    const size = 1200;
    const step = gridSettings.moduleSize; // 67px

    // Subgrid 0.25M (16.75px)
    if (gridSettings.showSubgrid025) {
      const sub025 = step / 4;
      for (let i = -size; i <= size; i += sub025) {
        lines.push(
          <line
            key={`sg025-x-${i}`}
            x1={i}
            y1={-size}
            x2={i}
            y2={size}
            stroke="rgba(99, 102, 241, 0.12)"
            strokeWidth="0.5"
          />,
          <line
            key={`sg025-y-${i}`}
            x1={-size}
            y1={i}
            x2={size}
            y2={i}
            stroke="rgba(99, 102, 241, 0.12)"
            strokeWidth="0.5"
          />
        );
      }
    }

    // Subgrid 0.5M (33.5px)
    if (gridSettings.showSubgrid05) {
      const sub05 = step / 2;
      for (let i = -size; i <= size; i += sub05) {
        lines.push(
          <line
            key={`sg05-x-${i}`}
            x1={i}
            y1={-size}
            x2={i}
            y2={size}
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="0.75"
          />,
          <line
            key={`sg05-y-${i}`}
            x1={-size}
            y1={i}
            x2={size}
            y2={i}
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="0.75"
          />
        );
      }
    }

    // Main Grid 1.0M (67px)
    for (let i = -size; i <= size; i += step) {
      const isAxis = i === 0;
      lines.push(
        <line
          key={`mg-x-${i}`}
          x1={i}
          y1={-size}
          x2={i}
          y2={size}
          stroke={isAxis ? 'rgba(6, 182, 212, 0.8)' : 'rgba(59, 130, 246, 0.3)'}
          strokeWidth={isAxis ? 1.5 : 1}
          strokeDasharray={isAxis ? '4 4' : undefined}
        />,
        <line
          key={`mg-y-${i}`}
          x1={-size}
          y1={i}
          x2={size}
          y2={i}
          stroke={isAxis ? 'rgba(6, 182, 212, 0.8)' : 'rgba(59, 130, 246, 0.3)'}
          strokeWidth={isAxis ? 1.5 : 1}
          strokeDasharray={isAxis ? '4 4' : undefined}
        />
      );
    }

    return lines;
  };

  // Render Technical Bounding Box and Complete Background Guide Lines
  const renderBoundingBox = () => {
    const boxSizeKey = gridSettings.showBoundingBox;
    if (!boxSizeKey) return null;

    const activeBox =
      boxes.find((b) => b.id === activeBoxId || b.name.includes(boxSizeKey)) ||
      DEFAULT_TECHNICAL_BOXES[0];

    const sizeM =
      boxSizeKey === '11x11'
        ? 11
        : boxSizeKey === '7x7'
        ? 7
        : boxSizeKey === '5x5'
        ? 5
        : boxSizeKey === '3x3'
        ? 3
        : activeBox.sizeM;

    const boxSizePx = sizeM * MODULE_PX;
    const half = boxSizePx / 2;

    return (
      <g id="technical-box-overlay" className="pointer-events-none">
        {/* Background Subtle Tint */}
        <rect
          x={-half}
          y={-half}
          width={boxSizePx}
          height={boxSizePx}
          fill="rgba(59, 130, 246, 0.03)"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeOpacity="0.85"
        />

        {/* Master Inner Guide Lines (Subdivision & Margins 1.25x, 0.5x, 3x, 6x as shown in reference) */}
        {/* Left margin guide (1.25M) */}
        <line
          x1={-half + 1.25 * MODULE_PX}
          y1={-half}
          x2={-half + 1.25 * MODULE_PX}
          y2={half}
          stroke="#f97316"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeOpacity="0.75"
        />
        {/* Right margin guide (0.5M) */}
        <line
          x1={half - 0.5 * MODULE_PX}
          y1={-half}
          x2={half - 0.5 * MODULE_PX}
          y2={half}
          stroke="#f97316"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeOpacity="0.75"
        />
        {/* Top margin guide (0.5M) */}
        <line
          x1={-half}
          y1={-half + 0.5 * MODULE_PX}
          x2={half}
          y2={-half + 0.5 * MODULE_PX}
          stroke="#f97316"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeOpacity="0.75"
        />
        {/* Bottom margin guide (1.25M) */}
        <line
          x1={-half}
          y1={half - 1.25 * MODULE_PX}
          x2={half}
          y2={half - 1.25 * MODULE_PX}
          stroke="#f97316"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeOpacity="0.75"
        />

        {/* Diagonal 45° Guidelines */}
        <line
          x1={-half}
          y1={-half}
          x2={half}
          y2={half}
          stroke="rgba(59, 130, 246, 0.35)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <line
          x1={-half}
          y1={half}
          x2={half}
          y2={-half}
          stroke="rgba(59, 130, 246, 0.35)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Helper Crosses on 4 Outer Corners */}
        <path
          d={`M ${-half - 15} ${-half} L ${-half + 15} ${-half} M ${-half} ${-half - 15} L ${-half} ${-half + 15}`}
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <path
          d={`M ${half - 15} ${-half} L ${half + 15} ${-half} M ${half} ${-half - 15} L ${half} ${-half + 15}`}
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <path
          d={`M ${-half - 15} ${half} L ${-half + 15} ${half} M ${-half} ${half - 15} L ${-half} ${half + 15}`}
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <path
          d={`M ${half - 15} ${half} L ${half + 15} ${half} M ${half} ${half - 15} L ${half} ${half + 15}`}
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Top Header Labels */}
        <text
          x={-half}
          y={-half - 22}
          fill="#f97316"
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="bold"
          letterSpacing="0.5"
        >
          LOGOTIPO HMA DESIGN - CAJA {sizeM}x{sizeM} ({boxSizePx}x{boxSizePx}px - Offset 44.5px)
        </text>
        <text
          x={-half}
          y={-half - 6}
          fill="#38bdf8"
          fontFamily="JetBrains Mono, monospace"
          fontSize="11"
          fontWeight="bold"
        >
          CAJA MAESTRA {sizeM}x{sizeM}
        </text>

        {/* Metric annotations along edges */}
        <text
          x={-half + 18}
          y={half + 22}
          fill="#f97316"
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="bold"
        >
          1.25x
        </text>
        <text
          x={half - 45}
          y={-half - 6}
          fill="#f97316"
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="bold"
        >
          1.25x
        </text>
        <text
          x={half + 10}
          y={-half + 24}
          fill="#f97316"
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="bold"
        >
          0.5x
        </text>
        <text
          x={half + 10}
          y={half - 10}
          fill="#f97316"
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="bold"
        >
          0.5x
        </text>
        <text
          x={half + 10}
          y={half / 3}
          fill="#f97316"
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="bold"
        >
          3x
        </text>
        <text
          x={-half - 28}
          y={-half / 4}
          fill="#f97316"
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="bold"
        >
          6x
        </text>
        <text
          x={-half - 24}
          y={half / 3}
          fill="#f97316"
          fontFamily="JetBrains Mono, monospace"
          fontSize="13"
          fontWeight="bold"
        >
          1x
        </text>
      </g>
    );
  };

  // Render Technical Skeleton & Smart GAP badges (like blueprint references)
  const renderTechnicalGuides = () => {
    if (!gridSettings.showTechnicalGuides) return null;

    return (
      <g id="technical-gap-guides" className="pointer-events-none">
        {pieces.map((p) => {
          if (!p.visible) return null;
          const w = p.widthM * MODULE_PX * p.scaleX;
          const h = p.heightM * MODULE_PX * p.scaleY;
          const rad = Math.min(w, h) / 2;
          const halfH = h / 2;

          return (
            <g
              key={`guide-${p.id}`}
              transform={`translate(${p.x}, ${p.y}) rotate(${p.rotation})`}
            >
              {/* Longitudinal axis line */}
              <line
                x1={0}
                y1={-halfH + rad}
                x2={0}
                y2={halfH - rad}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.8"
              />
              {/* Pivot Endpoints */}
              <circle
                cx={0}
                cy={-halfH + rad}
                r={3}
                fill="#10b981"
                stroke="#081126"
                strokeWidth="1"
              />
              <circle
                cx={0}
                cy={halfH - rad}
                r={3}
                fill="#10b981"
                stroke="#081126"
                strokeWidth="1"
              />
              {/* Center point */}
              <circle cx={0} cy={0} r={2} fill="#38bdf8" />
            </g>
          );
        })}

        {/* GAP Badges between adjacent pieces */}
        {pieces.length >= 2 && (
          <g id="gap-badges">
            <g transform={`translate(${(pieces[0].x + pieces[1].x) / 2}, ${(pieces[0].y + pieces[1].y) / 2})`}>
              <rect
                x={-28}
                y={-10}
                width={56}
                height={20}
                rx={4}
                fill="#064e3b"
                stroke="#10b981"
                strokeWidth="1"
                opacity="0.9"
              />
              <text
                x={0}
                y={4}
                fill="#6ee7b7"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
              >
                GAP 0.5M
              </text>
            </g>
            {pieces.length >= 4 && (
              <g transform={`translate(${(pieces[2].x + pieces[3].x) / 2}, ${(pieces[2].y + pieces[3].y) / 2})`}>
                <rect
                  x={-28}
                  y={-10}
                  width={56}
                  height={20}
                  rx={4}
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth="1"
                  opacity="0.9"
                />
                <text
                  x={0}
                  y={4}
                  fill="#6ee7b7"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  GAP 1.0M
                </text>
              </g>
            )}
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Left Toolbar with Collapsible Dropdowns */}
      {isLeftPanelOpen && (
        <PieceToolbar
          gridSettings={gridSettings}
          setGridSettings={setGridSettings}
          pieces={pieces}
          selectedPieceId={selectedPieceId}
          onSelectPiece={(id) => setSelectedPieceId(id)}
          onSelectAllPieces={handleSelectAllPieces}
          onRotateGroup={handleRotateGroup}
          onAddPiece={handleAddPiece}
          onTogglePieceVisibility={handleTogglePieceVisibility}
          onOpenBoxManager={() => setIsBoxManagerOpen(true)}
          onClose={() => setIsLeftPanelOpen(false)}
        />
      )}

      {/* Center Interactive SVG Canvas Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDownCanvas}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex-1 h-[calc(100vh-4rem)] bg-[#040814] relative overflow-hidden cursor-crosshair select-none"
      >
        {/* Floating Left Panel Reopen Button (when collapsed) */}
        {!isLeftPanelOpen && (
          <button
            onClick={() => setIsLeftPanelOpen(true)}
            title="Mostrar barra de herramientas izquierda (13 Formas / Retícula)"
            className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#081126]/95 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-950/80 shadow-2xl backdrop-blur-md transition-all text-xs font-mono font-bold group animate-fadeIn"
          >
            <PanelLeftOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Herramientas (13 Formas)</span>
          </button>
        )}

        {/* Drag & Drop Visual Dropzone Overlay */}
        {isDragOverCanvas && (
          <div className="absolute inset-0 z-40 bg-cyan-950/80 border-2 border-dashed border-cyan-400 flex flex-col items-center justify-center gap-3 backdrop-blur-sm pointer-events-none animate-fadeIn">
            <UploadCloud className="w-12 h-12 text-cyan-300 animate-bounce" />
            <div className="text-sm font-mono font-bold text-white">
              Suelta aquí tu archivo SVG o proyecto JSON
            </div>
            <p className="text-xs text-cyan-300/80">
              Se cargará automáticamente en la matriz paramétrica
            </p>
          </div>
        )}

        {/* Floating Canvas View Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#081126]/90 border border-white/10 p-1.5 rounded-xl shadow-xl backdrop-blur-md">
          {/* Toggle Left Sidebar */}
          <button
            onClick={() => setIsLeftPanelOpen((prev) => !prev)}
            title={isLeftPanelOpen ? 'Ocultar panel izquierdo' : 'Mostrar panel izquierdo'}
            className={`p-1.5 rounded-lg transition-colors ${
              isLeftPanelOpen ? 'text-cyan-400 bg-white/5' : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            {isLeftPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

          {/* Movement Step Mode Indicator Badge */}
          <button
            onClick={() => {
              const nextMode: Record<MoveStepMode, MoveStepMode> = {
                free: '1.0M',
                '1.0M': '0.5M',
                '0.5M': '0.25M',
                '0.25M': 'free'
              };
              const target = nextMode[moveMode];
              const snapPx =
                target === 'free'
                  ? 1
                  : target === '0.25M'
                  ? MODULE_PX / 4
                  : target === '0.5M'
                  ? MODULE_PX / 2
                  : MODULE_PX;

              setGridSettings((s) => ({
                ...s,
                moveStepMode: target,
                snapStep: snapPx,
                snapToGrid: target !== 'free'
              }));
            }}
            title="Cambiar paso de movimiento (Libre, 1.0M, 0.5M, 0.25M)"
            className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold transition-all"
          >
            <Move className="w-3 h-3" />
            <span>Paso: {moveMode}</span>
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

          <button
            onClick={() => handleZoom(-0.15)}
            title="Reducir zoom"
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-cyan-300 px-2 font-bold min-w-[45px] text-center">
            {Math.round(gridSettings.zoom * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.15)}
            title="Aumentar zoom"
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
          <button
            onClick={handleResetView}
            title="Centrar y reajustar lienzo (100%)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

          {/* Fullscreen Canvas Mode Toggle */}
          <button
            onClick={toggleFullscreenCanvas}
            title={
              isAllPanelsCollapsed
                ? 'Restaurar paneles laterales'
                : 'Pantalla completa (Ocultar ambos paneles laterales)'
            }
            className={`p-1.5 px-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono font-bold ${
              isAllPanelsCollapsed
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-300 hover:text-cyan-300 hover:bg-white/10'
            }`}
          >
            {isAllPanelsCollapsed ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px]">
              {isAllPanelsCollapsed ? 'Restaurar' : 'Pantalla Completa'}
            </span>
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

          {/* Toggle Right Inspector */}
          <button
            onClick={() => setIsRightPanelOpen((prev) => !prev)}
            title={isRightPanelOpen ? 'Ocultar inspector derecho' : 'Mostrar inspector derecho'}
            className={`p-1.5 rounded-lg transition-colors ${
              isRightPanelOpen ? 'text-cyan-400 bg-white/5' : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            {isRightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>
        </div>

        {/* Floating Right Panel Reopen Button (when collapsed) */}
        {!isRightPanelOpen && (
          <button
            onClick={() => setIsRightPanelOpen(true)}
            title="Mostrar panel inspector derecho"
            className="absolute top-16 right-4 z-30 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#081126]/95 border border-cyan-500/40 text-cyan-300 hover:text-white hover:bg-cyan-950/80 shadow-2xl backdrop-blur-md transition-all text-xs font-mono font-bold group animate-fadeIn"
          >
            <PanelRightOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Inspector</span>
          </button>
        )}

        {/* SVG Stage */}
        <svg
          className="w-full h-full block"
          style={{
            transform: `translate(${gridSettings.panX}px, ${gridSettings.panY}px)`
          }}
        >
          <g
            transform={`translate(${
              (containerRef.current?.clientWidth || 800) / 2
            }, ${(containerRef.current?.clientHeight || 600) / 2}) scale(${gridSettings.zoom})`}
          >
            {/* Parametric Grid (67px) */}
            <g id="grid-group">{renderGridLines()}</g>

            {/* Bounding Box Overlay & Background Guides */}
            {renderBoundingBox()}

            {/* Smart GAP & Skeleton Blueprint Guides */}
            {renderTechnicalGuides()}

            {/* Origin Markers (0,0) */}
            {gridSettings.showOrigin && (
              <g id="origin-marker">
                <circle cx="0" cy="0" r="5" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2" fill="#06B6D4" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#06B6D4" strokeWidth="1" />
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#06B6D4" strokeWidth="1" />
                <text
                  x="8"
                  y="14"
                  fill="#06B6D4"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="11"
                  fontWeight="bold"
                >
                  (413, 413) ORIGEN
                </text>
              </g>
            )}

            {/* Rendered Pieces (Sorted by zIndex) */}
            {[...pieces]
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((piece) => {
                if (!piece.visible) return null;
                const isSelected = piece.id === selectedPieceId || isAllSelected;
                const w = piece.widthM * MODULE_PX * piece.scaleX;
                const h = piece.heightM * MODULE_PX * piece.scaleY;
                const pathD = getShapeSvgPath(piece.shapeType, w, h);

                return (
                  <g
                    key={piece.id}
                    id={piece.id}
                    transform={`translate(${piece.x}, ${piece.y}) rotate(${piece.rotation})`}
                    opacity={piece.opacity}
                    onMouseDown={(e) => handleMouseDownPiece(e, piece)}
                    className="cursor-move"
                  >
                    {/* Active Piece Aura/Glow */}
                    {isSelected && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke="#06B6D4"
                        strokeWidth="8"
                        strokeOpacity="0.4"
                      />
                    )}

                    {/* Shape Geometry */}
                    <path
                      d={pathD}
                      fill={piece.wireframe ? 'none' : piece.color}
                      stroke={piece.wireframe ? piece.color : isSelected ? '#06B6D4' : 'rgba(255,255,255,0.1)'}
                      strokeWidth={piece.wireframe ? 2.5 : isSelected ? 2 : 1}
                      className="transition-all hover:brightness-110"
                    />

                    {/* Center Anchor Point Handle */}
                    {isSelected && (
                      <g>
                        <circle cx="0" cy="0" r="4" fill="#06B6D4" stroke="#081126" strokeWidth="1.5" />
                        <line x1="-8" y1="0" x2="8" y2="0" stroke="#06B6D4" strokeWidth="1" />
                        <line x1="0" y1="-8" x2="0" y2="8" stroke="#06B6D4" strokeWidth="1" />
                      </g>
                    )}

                    {/* Cotas Técnicas (Dimensions in M & px) */}
                    {gridSettings.showDimensions && (
                      <g transform="translate(0, 0)">
                        <text
                          x={w / 2 + 10}
                          y="0"
                          fill="#38bdf8"
                          fontFamily="JetBrains Mono, monospace"
                          fontSize="9"
                          opacity="0.8"
                        >
                          [{(piece.x / MODULE_PX).toFixed(1)}M, {(piece.y / MODULE_PX).toFixed(1)}M] {Math.round(piece.rotation)}°
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
          </g>
        </svg>

        {/* Bottom Technical Status Bar */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between px-4 py-2 bg-[#081126]/90 border border-white/10 rounded-xl shadow-xl backdrop-blur-md text-[11px] font-mono text-slate-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              Cursor: X: {mouseCoord.x}px ({(mouseCoord.x / MODULE_PX).toFixed(2)}M) | Y: {mouseCoord.y}px ({(mouseCoord.y / MODULE_PX).toFixed(2)}M)
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">
              Plantilla: <strong className="text-white">{activePresetName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAllSelected ? (
              <span className="text-cyan-300 font-bold flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                Todas las formas seleccionadas ({pieces.length})
              </span>
            ) : selectedPiece ? (
              <span className="text-emerald-300 font-bold">
                Seleccionado: {selectedPiece.name} [{Math.round(selectedPiece.rotation)}°]
              </span>
            ) : (
              <span className="text-slate-500">Haz clic para seleccionar o arrastrar formas</span>
            )}
            <span className="hidden lg:inline px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              Paso: {moveMode}
            </span>
            <span className="hidden lg:inline px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px]">
              1M = {MODULE_PX}px
            </span>
          </div>
        </div>
      </div>

      {/* Right Inspector & Modal */}
      <BoxManagerModal
        isOpen={isBoxManagerOpen}
        onClose={() => setIsBoxManagerOpen(false)}
        boxes={boxes}
        activeBoxId={activeBoxId}
        onUpdateBoxes={setBoxes}
        onSelectActiveBox={setActiveBoxId}
      />

      {isRightPanelOpen && (
        <InspectorPanel
          selectedPiece={selectedPiece}
          pieces={pieces}
          selectedPieceId={selectedPieceId}
          onSelectPiece={(id) => setSelectedPieceId(id)}
          onSelectAllPieces={handleSelectAllPieces}
          onUpdatePiece={handleUpdatePiece}
          onUpdateAllPieces={handleUpdateAllPieces}
          onRotateGroup={handleRotateGroup}
          onMoveGroup={handleMoveGroup}
          onDuplicatePiece={handleDuplicatePiece}
          onDeletePiece={handleDeletePiece}
          onMoveLayer={handleMoveLayer}
          colorLuz={colorLuz}
          colorProfundo={colorProfundo}
          onClose={() => setIsRightPanelOpen(false)}
          moveStepMode={moveMode}
          onChangeMoveStepMode={(mode) => {
            const snapPx =
              mode === 'free'
                ? 1
                : mode === '0.25M'
                ? MODULE_PX / 4
                : mode === '0.5M'
                ? MODULE_PX / 2
                : MODULE_PX;
            setGridSettings((s) => ({
              ...s,
              moveStepMode: mode,
              snapStep: snapPx,
              snapToGrid: mode !== 'free'
            }));
          }}
          showTechnicalGuides={gridSettings.showTechnicalGuides}
          onToggleTechnicalGuides={() =>
            setGridSettings((s) => ({
              ...s,
              showTechnicalGuides: !s.showTechnicalGuides
            }))
          }
        />
      )}
    </div>
  );
};
