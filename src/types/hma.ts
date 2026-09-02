/**
 * HMA INLUMENAI STUDIO (v2026.40)
 * Global Types & Interface Definitions
 */

export type AppToolMode = 'matrix' | 'motion' | 'canvas';

export type PaletteMode = 'luz' | 'profundo';

export type BoundingBoxSize = '11x11' | '7x7' | '5x5' | '3x3' | 'none';

export type ShapeType =
  // 7 Piezas Inferiores Base H-M-A
  | 'P1_triangle45'
  | 'P2_square'
  | 'P3_rect2x1'
  | 'P4_parallelogram'
  | 'P5_trapezoid'
  | 'P6_arc90'
  | 'P7_arrow'
  // 6 Piezas Superiores Complementarias
  | 'P8_diagonal'
  | 'P9_t_connector'
  | 'P10_point'
  | 'P11_capsule3x1'
  | 'P12_oblique_wedge'
  | 'P13_vertical_bar';

export interface PieceGeometry {
  type: ShapeType;
  name: string;
  category: 'base' | 'upper';
  defaultWidthM: number;
  defaultHeightM: number;
  description: string;
}

export interface HMAPiece {
  id: string;
  shapeType: ShapeType;
  name: string;
  category: 'base' | 'upper';
  // Position in canonical pixel units (relative to center 0,0)
  x: number;
  y: number;
  // Rotation in degrees (0, 15, 45, 90, etc.)
  rotation: number;
  // Dimensions / Scaling
  widthM: number;
  heightM: number;
  scaleX: number;
  scaleY: number;
  // Visual styling
  color: string;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  wireframe?: boolean;
}

export interface ServiceClusterInfo {
  id: string;
  name: string;
  cluster: 'Identidad & Arte' | 'Audiovisual & Sonido' | 'Fe & Legado' | 'Tecnología & Prod.' | 'Marca Maestra';
  description: string;
  colorLuz: string;
  colorProfundo: string;
  pieces: HMAPiece[];
}

export interface HMAPreset {
  id: string;
  name: string;
  cluster: string;
  description: string;
  colorLuz: string;
  colorProfundo: string;
  pieces: HMAPiece[];
}

export type CanvasAnimationType =
  | 'none'
  | 'inlumenai-morph'
  | 'float'
  | 'bounce'
  | 'pulse'
  | 'spin'
  | 'custom-path'
  | 'particle-dispersion'
  | 'explosion'
  | 'mesh'
  | 'fluid'
  | 'html-iframe';

export type BlendMode =
  | 'normal'
  | 'screen'
  | 'multiply'
  | 'overlay'
  | 'color-dodge'
  | 'luminosity'
  | 'difference';

export interface AnimatedLayer {
  id: string;
  name: string;
  svgCode: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
  rotation: number;
  opacity: number; // 0 to 1
  blur: number; // 0 to 50 px
  blendMode: BlendMode;
  wireframe: boolean;
  isPattern: boolean;
  patternScale: number;
  patternSpacing: number;
  color?: string; // Hex color for SVG customization
  animationType: CanvasAnimationType;
  animDuration: number; // in seconds
  animX: number; // in px
  animY: number; // in px
  animScale?: number;
  animDelay: number; // in seconds
  visible: boolean;
  locked: boolean;
  exportable: boolean;
  zIndex: number;
  // Motion sequence parameters (for Motion layers)
  isMotionSequence?: boolean;
  motionServiceId?: string; // 'all' or service ID like '01-inlumenai', '02-design', etc.
  motionIsLoop?: boolean;
  motionSpeed?: number;
  motionShowGuides?: boolean;
  motionWireframe?: boolean;
}

export interface HMAProjectData {
  version: string; // "2026.26"
  appName: string;
  timestamp: string;
  activePresetId: string;
  paletteMode: PaletteMode;
  pieces: HMAPiece[];
  layers: AnimatedLayer[];
  metadata: {
    artDirector: string;
    notes: string;
    gridModuleSize: number;
  };
}

export type MoveStepMode = 'free' | '1.0M' | '0.5M' | '0.25M';

export interface GridSettings {
  moduleSize: number; // 67px
  showGrid: boolean;
  showSubgrid05: boolean; // 33.5px
  showSubgrid025: boolean; // 16.75px
  showOrigin: boolean;
  showDimensions: boolean;
  showBoundingBox: BoundingBoxSize;
  snapToGrid: boolean;
  snapStep: number; // 1M, 0.5M or 0.25M
  moveStepMode?: MoveStepMode;
  showTechnicalGuides?: boolean;
  wireframeMode: boolean;
  zoom: number;
  panX: number;
  panY: number;
}
