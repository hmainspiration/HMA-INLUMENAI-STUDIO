import { CustomGridLine, GridLineAxis, GridLineType } from '../types/matrix';

export const UNIT = 67; // 1X = 67px
export const SUB_UNIT = 16.75; // 0.25X = 16.75px
export const CANVAS_SIZE = 737; // 11X = 737px

export const DEFAULT_MAIN_LINE_COLOR = '#263238';
export const DEFAULT_SUB_LINE_COLOR = '#cfd8dc';

/**
 * Initializes the full set of grid lines (1X and 0.25X, both axes).
 */
export function generateInitialGridLines(): Record<string, CustomGridLine> {
  const lines: Record<string, CustomGridLine> = {};

  // 1. Sub grid 0.25X (45 lines on each axis)
  for (let i = 0; i <= 44; i++) {
    const pos = i * SUB_UNIT;
    const isMain = i % 4 === 0;
    const mainIdx = i / 4;

    // Vertical Sub Line
    const vSubId = `v-sub-${i}`;
    lines[vSubId] = {
      id: vSubId,
      axis: 'x',
      type: isMain ? 'main' : 'sub',
      index: i,
      pos,
      posUnits: i * 0.25,
      color: isMain ? DEFAULT_MAIN_LINE_COLOR : DEFAULT_SUB_LINE_COLOR,
      strokeWidth: isMain ? 1.5 : 0.75,
      dashArray: isMain ? 'none' : '2 2',
      opacity: isMain ? 1 : 0.8,
      visible: true,
      isCustomized: false,
      label: isMain ? `${mainIdx}X` : `${(i * 0.25).toFixed(2)}X`
    };

    // Horizontal Sub Line
    const hSubId = `h-sub-${i}`;
    lines[hSubId] = {
      id: hSubId,
      axis: 'y',
      type: isMain ? 'main' : 'sub',
      index: i,
      pos,
      posUnits: i * 0.25,
      color: isMain ? DEFAULT_MAIN_LINE_COLOR : DEFAULT_SUB_LINE_COLOR,
      strokeWidth: isMain ? 1.5 : 0.75,
      dashArray: isMain ? 'none' : '2 2',
      opacity: isMain ? 1 : 0.8,
      visible: true,
      isCustomized: false,
      label: isMain ? `${mainIdx}X` : `${(i * 0.25).toFixed(2)}X`
    };
  }

  return lines;
}

/**
 * Palette of recommended high-contrast guide colors for logo construction
 */
export const GUIDE_COLOR_PRESETS = [
  { name: 'Rojo Guía', color: '#ef4444' },
  { name: 'Cian Neón', color: '#06b6d4' },
  { name: 'Magenta', color: '#ec4899' },
  { name: 'Amarillo', color: '#eab308' },
  { name: 'Verde Éxito', color: '#10b981' },
  { name: 'Azul Real', color: '#3b82f6' },
  { name: 'Naranja', color: '#f97316' },
  { name: 'Blanco', color: '#ffffff' },
  { name: 'Gris Neutro', color: '#94a3b8' }
];

export const STROKE_DASH_OPTIONS = [
  { id: 'none', label: 'Sólida' },
  { id: '4 4', label: 'Discontinua' },
  { id: '2 2', label: 'Punteada' },
  { id: '10 4', label: 'Raya Larga' },
  { id: '8 2 2 2', label: 'Cadena' }
];
