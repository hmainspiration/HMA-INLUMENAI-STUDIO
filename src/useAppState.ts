import { useState, useCallback } from 'react';
import { AppModule, ThemePalette, HmaPiece, VectorLayer } from './types';
import { PIECE_TYPES, PALETTES } from './constants';

const createDefaultPieces = (palette: ThemePalette): HmaPiece[] => {
  const colors = PALETTES[palette];
  return PIECE_TYPES.map((type, i) => ({
    id: `piece-${i}`,
    typeId: type,
    x: (i % 4) * 2,
    y: Math.floor(i / 4) * 2,
    rotation: 0,
    scale: 1,
    color: colors[i % colors.length],
    visible: true,
    locked: false,
    zIndex: i
  }));
};

export function useAppState() {
  const [currentModule, setCurrentModule] = useState<AppModule>('matrix');
  const [palette, setPalette] = useState<ThemePalette>('luz');
  const [pieces, setPieces] = useState<HmaPiece[]>(createDefaultPieces('luz'));
  const [layers, setLayers] = useState<VectorLayer[]>([]);
  const [showSubgrid, setShowSubgrid] = useState(false);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

  const togglePalette = useCallback(() => {
    setPalette(p => {
      const newPalette = p === 'luz' ? 'profundo' : 'luz';
      const colors = PALETTES[newPalette];
      setPieces(prev => prev.map((piece, i) => ({
        ...piece,
        color: colors[i % colors.length]
      })));
      return newPalette;
    });
  }, []);

  const updatePiece = useCallback((id: string, updates: Partial<HmaPiece>) => {
    setPieces(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const resetBaseHMA = useCallback(() => {
    // Reset the first 7 pieces to some canonical shape
    const colors = PALETTES[palette];
    setPieces(prev => prev.map((p, i) => {
      if (i < 7) {
        return {
          ...p,
          x: i * 2,
          y: 6,
          rotation: 0,
          scale: 1,
          color: colors[i % colors.length]
        };
      }
      return p;
    }));
  }, [palette]);

  return {
    currentModule, setCurrentModule,
    palette, togglePalette,
    pieces, updatePiece, resetBaseHMA,
    layers, setLayers,
    showSubgrid, setShowSubgrid,
    selectedPieceId, setSelectedPieceId
  };
}
