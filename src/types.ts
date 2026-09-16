export const MODULE_1M = 67;
export const CANVAS_CENTER = 413;

export interface TechnicalBox {
  id: string;
  name: string;
  category: 'master' | 'circular' | 'core' | 'logo-container' | 'design' | 'horizontal' | 'custom' | string;
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
  middleGapM?: number;
  customLabel?: string;
}

export const DEFAULT_TECHNICAL_BOXES: TechnicalBox[] = [
  {
    id: 'box-master-11x11',
    name: 'Plantilla Canónica 11×11 M (12 Logotipos / 4 Clústeres)',
    category: 'master',
    widthM: 11,
    heightM: 11,
    widthPx: 737,
    heightPx: 737,
    x: 413,
    y: 413,
    visible: true,
    color: '#8B3A1C',
    strokeDash: 'solid',
    strokeWidth: 1.5,
    showMarginGuides: true,
    marginTopM: 0.5,
    marginBottomM: 0.5,
    marginLeftM: 1.0,
    marginRightM: 1.0,
    middleGapM: 1.0,
    customLabel: 'LOGOTIPO HMA DESIGN — CAJA TÉCNICA 11×11',
  },
  {
    id: 'box-maestra-11x11',
    name: 'Caja Maestra (11x11 Módulos = 737x737 px)',
    category: 'master',
    widthM: 11,
    heightM: 11,
    widthPx: 737,
    heightPx: 737,
    x: 413,
    y: 413,
    visible: false,
    color: '#0057FF',
    strokeDash: 'solid',
    strokeWidth: 1.5,
    showMarginGuides: false,
    customLabel: 'CAJA MAESTRA 11×11 (737×737px)',
  },
  {
    id: 'box-circular-10x10',
    name: 'Plantilla Especial Circular 10×10 M (13 Puntos Radiales cada 30°)',
    category: 'circular',
    widthM: 10,
    heightM: 10,
    widthPx: 670,
    heightPx: 670,
    x: 413,
    y: 413,
    visible: false,
    color: '#EC4899',
    strokeDash: 'solid',
    strokeWidth: 1.5,
    showMarginGuides: false,
    customLabel: 'PLANTILLA CIRCULAR 10×10 M — 13 NODOS RADIALES 30° (0°–360°)',
  },
  {
    id: 'box-core-7x7',
    name: 'Caja Núcleo 7×7 M',
    category: 'core',
    widthM: 7,
    heightM: 7,
    widthPx: 469,
    heightPx: 469,
    x: 413,
    y: 413,
    visible: false,
    color: '#38BDF8',
    strokeDash: 'dashed',
    strokeWidth: 1.5,
    showMarginGuides: false,
    customLabel: 'CAJA NÚCLEO 7×7 (469×469px)',
  },
  {
    id: 'box-logo-container-10x65',
    name: 'Contenedor Símbolo Superior 6.5M',
    category: 'logo-container',
    widthM: 8.5,
    heightM: 6.5,
    widthPx: 569.5,
    heightPx: 435.5,
    x: 413,
    y: 295.75,
    visible: false,
    color: '#8B5CF6',
    strokeDash: 'dashed',
    strokeWidth: 1.5,
    showMarginGuides: true,
    marginTopM: 0,
    marginBottomM: 0,
    marginLeftM: 0,
    marginRightM: 0,
    middleGapM: 0,
    customLabel: 'SÍMBOLO SUPERIOR 6.5M (Y: 78px a 513.5px)',
  },
  {
    id: 'box-hma-design',
    name: 'Caja HMA DESIGN (Guías 1.25x / 0.5x / 1x)',
    category: 'design',
    widthM: 11,
    heightM: 11,
    widthPx: 737,
    heightPx: 737,
    x: 413,
    y: 413,
    visible: false,
    color: '#D97706',
    strokeDash: 'solid',
    strokeWidth: 1.5,
    showMarginGuides: true,
    marginTopM: 0.5,
    marginBottomM: 0.5,
    marginLeftM: 1.25,
    marginRightM: 1.25,
    middleGapM: 1.0,
    customLabel: 'LOGOTIPO HMA DESIGN (CAJA 11×11)',
  },
  {
    id: 'box-horizontal-30x4',
    name: 'Caja Horizontal 30.5×4 M (Logotipo Completo)',
    category: 'horizontal',
    widthM: 30.5,
    heightM: 4,
    widthPx: 2043.5,
    heightPx: 268,
    x: 413,
    y: 413,
    visible: false,
    color: '#10B981',
    strokeDash: 'solid',
    strokeWidth: 1.5,
    showMarginGuides: true,
    marginTopM: 0,
    marginBottomM: 0,
    marginLeftM: 0.5,
    marginRightM: 0.5,
    middleGapM: 0.5,
    customLabel: 'CAJA 4×30.5 (Logotipo Horizontal)',
  },
  {
    id: 'box-custom',
    name: 'Caja Paramétrica Personalizada',
    category: 'custom',
    widthM: 8,
    heightM: 8,
    widthPx: 536,
    heightPx: 536,
    x: 413,
    y: 413,
    visible: false,
    color: '#F59E0B',
    strokeDash: 'dashed',
    strokeWidth: 1.5,
    showMarginGuides: false,
    customLabel: 'CAJA PERSONALIZADA (8×8 M)',
  },
];

export interface ExportOptions {
  dimensionMode: 'fullscreen' | '1080p' | 'square' | 'mobile' | 'hero' | 'custom';
  width: number;
  height: number;
  globalScale: number;
  includeBg: boolean;
  responsive: boolean;
  backgroundColor: string;
  heroOptions?: {
    fullBleed?: boolean;
    transparentBg?: boolean;
    centerAlignment?: 'center' | 'left' | 'right';
    minHeightVh?: number;
    seamlessEmbed?: boolean;
  };
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
