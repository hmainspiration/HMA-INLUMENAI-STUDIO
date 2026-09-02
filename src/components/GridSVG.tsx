import React, { useRef } from 'react';
import { M_UNIT, SHAPES } from '../constants';
import { HmaPiece } from '../types';

export default function GridSVG({ 
  pieces, 
  showSubgrid, 
  selectedId, 
  onSelect 
}: { 
  pieces: HmaPiece[], 
  showSubgrid: boolean,
  selectedId: string | null,
  onSelect: (id: string | null) => void 
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  // viewBox 11x11 modules roughly
  const gridWidth = 11 * M_UNIT;
  const gridHeight = 11 * M_UNIT;
  const cx = gridWidth / 2;
  const cy = gridHeight / 2;

  return (
    <svg 
      ref={svgRef}
      className="w-full h-full cursor-crosshair" 
      viewBox={`0 0 ${gridWidth} ${gridHeight}`}
      onClick={(e) => {
        if (e.target === svgRef.current) onSelect(null);
      }}
    >
      <defs>
        {/* Subgrid 0.25M */}
        <pattern id="subgrid25" width={M_UNIT/4} height={M_UNIT/4} patternUnits="userSpaceOnUse">
          <path d={`M ${M_UNIT/4} 0 L 0 0 0 ${M_UNIT/4}`} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
        </pattern>
        {/* Subgrid 0.5M */}
        <pattern id="subgrid50" width={M_UNIT/2} height={M_UNIT/2} patternUnits="userSpaceOnUse">
          <rect width={M_UNIT/2} height={M_UNIT/2} fill="url(#subgrid25)"/>
          <path d={`M ${M_UNIT/2} 0 L 0 0 0 ${M_UNIT/2}`} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
        </pattern>
        {/* Major Grid 1M */}
        <pattern id="grid" width={M_UNIT} height={M_UNIT} patternUnits="userSpaceOnUse">
          {showSubgrid && <rect width={M_UNIT} height={M_UNIT} fill="url(#subgrid50)"/>}
          <path d={`M ${M_UNIT} 0 L 0 0 0 ${M_UNIT}`} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        </pattern>
      </defs>

      {/* Grid Background */}
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {/* Axes */}
      <line x1={cx} y1="0" x2={cx} y2={gridHeight} stroke="rgba(6,182,212,0.3)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="0" y1={cy} x2={gridWidth} y2={cy} stroke="rgba(6,182,212,0.3)" strokeWidth="1" strokeDasharray="4 4" />

      {/* Origin Marker */}
      <circle cx={cx} cy={cy} r="3" fill="#06B6D4" />

      {/* Pieces Container (centered mapping) */}
      <g transform={`translate(${cx}, ${cy})`}>
        {pieces.filter(p => p.visible).map(piece => {
          const shape = SHAPES[piece.typeId];
          if (!shape) return null;
          
          const isSelected = selectedId === piece.id;
          // Coordinates in M units
          const px = piece.x * M_UNIT;
          const py = piece.y * M_UNIT;

          return (
            <g 
              key={piece.id}
              transform={`translate(${px}, ${py}) rotate(${piece.rotation}) scale(${piece.scale})`}
              onClick={(e) => { e.stopPropagation(); onSelect(piece.id); }}
              className="transition-all duration-300 ease-out"
              style={{ cursor: piece.locked ? 'not-allowed' : 'pointer' }}
            >
              <path 
                d={shape.path} 
                fill={piece.color} 
                className="transition-colors duration-300"
                stroke={isSelected ? '#FFFFFF' : 'none'}
                strokeWidth={isSelected ? 2 : 0}
              />
              {isSelected && !piece.locked && (
                <rect 
                  x="0" y="0" 
                  width={shape.width} height={shape.height} 
                  fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="2 2"
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
