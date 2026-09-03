export const MODULE_1M = 67;
export const CANVAS_CENTER = 413;

export interface TechnicalBox {
  id: string;
  name: string;
  category: 'master' | 'container' | 'custom';
  widthM: number;
  heightM: number;
  widthPx: number;
  heightPx: number;
  x: number;
  y: number;
  visible: boolean;
  color: string;
  strokeDash: 'solid' | 'dashed' | 'dotted';
  strokeWidth: number;
  showMarginGuides?: boolean;
  marginTopM?: number;
  marginBottomM?: number;
  marginLeftM?: number;
  marginRightM?: number;
  customLabel?: string;
}

export const DEFAULT_TECHNICAL_BOXES: TechnicalBox[] = [
  {
    id: 'box-master-11x11',
    name: 'Caja Maestra (11×11 M)',
    category: 'master',
    widthM: 11,
    heightM: 11,
    widthPx: 737,
    heightPx: 737,
    x: CANVAS_CENTER,
    y: CANVAS_CENTER,
    visible: true,
    color: '#3D80FD',
    strokeDash: 'solid',
    strokeWidth: 2,
    showMarginGuides: true,
    marginTopM: 2,
    marginBottomM: 2,
    marginLeftM: 2,
    marginRightM: 2,
    customLabel: 'CAJA MAESTRA (11×11 M)'
  },
  {
    id: 'box-core-7x7',
    name: 'Núcleo Canónico (7×7 M)',
    category: 'master',
    widthM: 7,
    heightM: 7,
    widthPx: 469,
    heightPx: 469,
    x: CANVAS_CENTER,
    y: CANVAS_CENTER,
    visible: true,
    color: '#38BDF8',
    strokeDash: 'dashed',
    strokeWidth: 1.5,
    customLabel: 'ÁREA ISOTIPO (7×7 M)'
  },
  {
    id: 'box-logo-container-10x65',
    name: 'Contenedor Logotipo (6.5×10 M)',
    category: 'container',
    widthM: 10,
    heightM: 6.5,
    widthPx: 670,
    heightPx: 435.5,
    x: CANVAS_CENTER,
    y: CANVAS_CENTER,
    visible: false,
    color: '#EC4899',
    strokeDash: 'dashed',
    strokeWidth: 1.5,
    showMarginGuides: true,
    marginTopM: 1,
    marginBottomM: 1,
    marginLeftM: 1,
    marginRightM: 1,
    customLabel: 'CONTENEDOR LOGO (6.5×10 M)'
  },
  {
    id: 'box-hma-design',
    name: 'Márgenes HMA DESIGN (1.25x / 1x)',
    category: 'custom',
    widthM: 11,
    heightM: 11,
    widthPx: 737,
    heightPx: 737,
    x: CANVAS_CENTER,
    y: CANVAS_CENTER,
    visible: false,
    color: '#10B981',
    strokeDash: 'dotted',
    strokeWidth: 1.5,
    showMarginGuides: true,
    marginTopM: 1.25,
    marginBottomM: 1.25,
    marginLeftM: 1.25,
    marginRightM: 1.25,
    customLabel: 'MARGEN HMA DESIGN (1.25 M)'
  },
  {
    id: 'box-circular-10x10',
    name: 'Estructura Circular (10×10 M)',
    category: 'custom',
    widthM: 10,
    heightM: 10,
    widthPx: 670,
    heightPx: 670,
    x: CANVAS_CENTER,
    y: CANVAS_CENTER,
    visible: false,
    color: '#8B5CF6',
    strokeDash: 'dashed',
    strokeWidth: 1.5,
    customLabel: 'EJE CIRCULAR (10×10 M)'
  },
  {
    id: 'box-horizontal-30x4',
    name: 'Cápsula Horizontal (4×30.5 M)',
    category: 'container',
    widthM: 30.5,
    heightM: 4,
    widthPx: 2043.5,
    heightPx: 268,
    x: CANVAS_CENTER,
    y: CANVAS_CENTER,
    visible: false,
    color: '#D97706',
    strokeDash: 'dashed',
    strokeWidth: 1.5,
    customLabel: 'LOGOTIPO EXTENDIDO'
  }
];

export interface ExportOptions {
  dimensionMode: 'fullscreen' | '1080p' | 'square' | 'mobile' | 'custom';
  width: number;
  height: number;
  globalScale: number;
  includeBg: boolean;
  responsive: boolean;
  backgroundColor: string;
}

export interface Shape {
  id: string;
  displayName?: string;
  length: number;
  width: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

export interface LogoData {
  serviceId: string;
  serviceName: string;
  clusterName: string;
  luzColor?: string;
  profundoColor?: string;
  shapes: Shape[];
}

export interface ServiceDefinition {
  id: string;
  name: string;
  cluster: string;
  clusterNumber: number;
  description: string;
  colorLuz: string;
  colorProfundo: string;
}

export interface ShapePiece {
  id: string;
  index: number;
  label: string;
  roleName: string;
  x: number;
  y: number;
  length: number;
  width: number;
  rotation: number;
  color: string;
  toneType: 'luz' | 'profundo';
  hemisphere: 'superior' | 'inferior';
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex?: number;
}

export type AppModule = 'matrix' | 'motion' | 'canvas';
export type ThemePalette = 'luz' | 'profundo';

export interface HmaPiece {
  id: string;
  typeId: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

export interface VectorLayer {
  id: string;
  name: string;
  svgCode: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  blur: number;
  blendMode: 'normal' | 'screen' | 'multiply' | 'overlay';
  wireframe: boolean;
  isPattern: boolean;
  patternScale: number;
  patternSpacing: number;
  animationType: 'none' | 'float' | 'pulse' | 'spin';
  animDuration: number;
  animX: number;
  animY: number;
  animDelay: number;
  visible: boolean;
  locked: boolean;
  exportable: boolean;
  zIndex: number;
}
