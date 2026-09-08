export interface MatrixShape {
  id: string;
  x: number;
  y: number;
  widthX: number;
  heightX: number;
  rot: number;
  color: string;
  wireframe: boolean;
  locked?: boolean;
  hidden?: boolean;
}

export type GridLineAxis = 'x' | 'y'; // 'x' = vertical, 'y' = horizontal
export type GridLineType = 'main' | 'sub' | 'custom';

export interface CustomGridLine {
  id: string;
  axis: GridLineAxis; // 'x' (vertical) o 'y' (horizontal)
  type: GridLineType; // 'main' (1X), 'sub' (0.25X), 'custom'
  index: number; // ej. 0 a 11 para 1X, 0 a 44 para 0.25X
  pos: number; // Coordenada en píxeles (0 a 737)
  posUnits: number; // Valor en múltiplos X (ej. 1, 2.25, 5.5)
  color: string;
  strokeWidth: number;
  dashArray: string; // 'none' | '4 4' | '2 2' | '8 4'
  opacity: number;
  visible: boolean;
  isCustomized?: boolean;
  label?: string;
}

export interface MatrixProjectData {
  version: string;
  appName: string;
  timestamp: number;
  shapes: MatrixShape[];
  gridSettings: {
    showMain: boolean;
    showSub: boolean;
    customLines: CustomGridLine[];
  };
}
