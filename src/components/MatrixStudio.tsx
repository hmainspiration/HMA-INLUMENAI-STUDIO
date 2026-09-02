import React from 'react';
import GridSVG from './GridSVG';
import Inspector from './Inspector';
import { useAppState } from '../useAppState';
import { LayoutGrid } from 'lucide-react';

export default function MatrixStudio({ state }: { state: ReturnType<typeof useAppState> }) {
  const selectedPiece = state.selectedPieceId 
    ? state.pieces.find(p => p.id === state.selectedPieceId)
    : null;

  return (
    <div className="absolute inset-0 flex">
      {/* Main Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Top Controls Overlay */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button 
            onClick={() => state.setShowSubgrid(!state.showSubgrid)}
            className={`px-3 py-2 text-xs font-medium rounded-md glass-panel flex items-center gap-2 transition-colors ${state.showSubgrid ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            {state.showSubgrid ? 'Ocultar Subretícula' : 'Mostrar Subretícula'}
          </button>
        </div>

        {/* SVG Editor */}
        <div className="w-[80%] h-[80%] max-w-4xl max-h-4xl border border-white/5 bg-black/20 rounded-xl shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <GridSVG 
            pieces={state.pieces} 
            showSubgrid={state.showSubgrid} 
            selectedId={state.selectedPieceId}
            onSelect={state.setSelectedPieceId}
          />
        </div>
      </div>

      {/* Right Sidebar */}
      {selectedPiece ? (
        <Inspector 
          piece={selectedPiece}
          onUpdate={state.updatePiece}
          palette={state.palette}
        />
      ) : (
        <div className="glass-panel w-72 h-full mr-4 mt-4 mb-4 flex items-center justify-center text-white/30 text-sm text-center px-6">
          Selecciona una pieza geométrica en el lienzo para inspeccionar sus propiedades.
        </div>
      )}
    </div>
  );
}
