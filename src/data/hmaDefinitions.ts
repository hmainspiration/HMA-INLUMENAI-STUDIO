/**
 * HMA INLUMENAI STUDIO (v2026.40)
 * Geometric definitions, presets, canonical coordinates & chromatic rules.
 */

import { HMAPiece, HMAPreset, PieceGeometry, ShapeType } from '../types/hma';
import {
  getPresetMasterDiagonal,
  getPresetMasterCircle,
  getPresetMasterLogo,
  getPresetDesign,
  getPresetType,
  getPresetVisuals,
  getPresetPhotography,
  getPresetMusic,
  getPresetCinema,
  getPresetTemples,
  getPresetPublishing,
  getPresetTranscendence,
  getPresetWatermark,
  getPresetSoftware,
  getPresetPrint,
  mapShapePieceToHMAPiece
} from './presets';

export const MODULE_PX = 67; // 1M = 67px
export const RADIUS_PX = 33.5; // 0.5M = 33.5px
export const APP_VERSION = 'v2026.40';

/**
 * Generates exact continuous curvature SVG path for HMA modular capsules / pills
 * w: width (thickness across when vertical)
 * h: height (length along primary axis when vertical)
 */
export function getCapsuleSvgPath(w: number, h: number): string {
  const minDim = Math.min(w, h);
  const r = minDim / 2; // standard 33.5px for 67px thickness

  if (Math.abs(w - h) < 1) {
    // Pure circle 1Mx1M (67x67px)
    return `M 0 ${-r} A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r} Z`;
  }

  if (h >= w) {
    // Standard Vertical HMA Capsule (0° rotation orientation)
    const dy = h / 2 - r;
    return `M ${-r} ${-dy} A ${r} ${r} 0 0 1 ${r} ${-dy} V ${dy} A ${r} ${r} 0 0 1 ${-r} ${dy} Z`;
  } else {
    // Horizontal Capsule
    const dx = w / 2 - r;
    return `M ${-dx} ${-r} H ${dx} A ${r} ${r} 0 0 1 ${dx} ${r} H ${-dx} A ${r} ${r} 0 0 1 ${-dx} ${-r} Z`;
  }
}

/**
 * 13 Canonical Closed Geometries
 */
export const PIECE_GEOMETRIES: PieceGeometry[] = [
  // 7 Piezas Inferiores Base (H-M-A)
  {
    type: 'P1_triangle45',
    name: 'P1: Triángulo Isósceles 45°',
    category: 'base',
    defaultWidthM: 1,
    defaultHeightM: 1,
    description: 'Triángulo rectángulo isósceles 45° (1M x 1M = 67x67px)'
  },
  {
    type: 'P2_square',
    name: 'P2: Cuadrado Unitario 1M',
    category: 'base',
    defaultWidthM: 1,
    defaultHeightM: 1,
    description: 'Cuadrado modular unitario (1M x 1M = 67x67px con esquinas redondeadas 33.5px)'
  },
  {
    type: 'P3_rect2x1',
    name: 'P3: Rectángulo Cápsula 2M',
    category: 'base',
    defaultWidthM: 1,
    defaultHeightM: 2,
    description: 'Rectángulo modular cápsula (1M x 2M = 67x134px)'
  },
  {
    type: 'P4_parallelogram',
    name: 'P4: Paralelogramo 45°',
    category: 'base',
    defaultWidthM: 1.5,
    defaultHeightM: 1,
    description: 'Paralelogramo modular inclinado a 45°'
  },
  {
    type: 'P5_trapezoid',
    name: 'P5: Trapecio de Ensamble',
    category: 'base',
    defaultWidthM: 2,
    defaultHeightM: 1,
    description: 'Trapecio simétrico para ensamble estructural de base'
  },
  {
    type: 'P6_arc90',
    name: 'P6: Arco Cuadrante 90°',
    category: 'base',
    defaultWidthM: 1,
    defaultHeightM: 1,
    description: 'Arco / Cuadrante circular de 90° con radio exterior 1M'
  },
  {
    type: 'P7_arrow',
    name: 'P7: Punta de Flecha / Cuña',
    category: 'base',
    defaultWidthM: 1,
    defaultHeightM: 1,
    description: 'Punta de flecha angular 45° de cierre base'
  },

  // 6 Piezas Superiores Complementarias (P8 a P13)
  {
    type: 'P8_diagonal',
    name: 'P8: Bloque Diagonal 45°',
    category: 'upper',
    defaultWidthM: 1,
    defaultHeightM: 2,
    description: 'Cápsula diagonal de conexión superior 45°'
  },
  {
    type: 'P9_t_connector',
    name: 'P9: Conector Ortogonal T',
    category: 'upper',
    defaultWidthM: 1.5,
    defaultHeightM: 1.5,
    description: 'Conector ortogonal en forma de T / L para entrelazado'
  },
  {
    type: 'P10_point',
    name: 'P10: Punto Ecosistema (Circular)',
    category: 'upper',
    defaultWidthM: 1,
    defaultHeightM: 1,
    description: 'Punto circular central de unión y origen (diámetro 1M = 67px)'
  },
  {
    type: 'P11_capsule3x1',
    name: 'P11: Cápsula Larga 3M',
    category: 'upper',
    defaultWidthM: 1,
    defaultHeightM: 3,
    description: 'Cápsula alargada 1M x 3M (67x201px) para vigas maestras'
  },
  {
    type: 'P12_oblique_wedge',
    name: 'P12: Cuña Oblicua Superior',
    category: 'upper',
    defaultWidthM: 1.5,
    defaultHeightM: 1,
    description: 'Cuña oblicua complementaria para crestas y vórtices'
  },
  {
    type: 'P13_vertical_bar',
    name: 'P13: Columna Vertical 2.5M',
    category: 'upper',
    defaultWidthM: 1,
    defaultHeightM: 2.5,
    description: 'Columna vertical portante de 2.5M de elevación'
  }
];

/**
 * Returns SVG path or elements for a given shape type normalized around its origin (0,0)
 */
export function getShapeSvgPath(shapeType: ShapeType, widthPx: number, heightPx: number): string {
  const w = widthPx;
  const h = heightPx;

  switch (shapeType) {
    case 'P1_triangle45':
      // Right-angled isosceles triangle centered at (0,0)
      return `M ${-w / 2} ${h / 2} L ${w / 2} ${h / 2} L ${-w / 2} ${-h / 2} Z`;

    case 'P2_square':
    case 'P3_rect2x1':
    case 'P8_diagonal':
    case 'P11_capsule3x1':
    case 'P13_vertical_bar':
      // Canonical modular capsule with perfect semicircular caps
      return getCapsuleSvgPath(w, h);

    case 'P4_parallelogram': {
      // 45° slanted parallelogram
      const skew = h * 0.7;
      return `M ${-w / 2 + skew / 2} ${-h / 2} 
              L ${w / 2 + skew / 2} ${-h / 2} 
              L ${w / 2 - skew / 2} ${h / 2} 
              L ${-w / 2 - skew / 2} ${h / 2} Z`;
    }

    case 'P5_trapezoid':
      // Symmetrical assembly trapezoid
      return `M ${-w / 4} ${-h / 2} 
              L ${w / 4} ${-h / 2} 
              L ${w / 2} ${h / 2} 
              L ${-w / 2} ${h / 2} Z`;

    case 'P6_arc90':
      // 90° circular quadrant arc
      return `M ${-w / 2} ${h / 2} 
              A ${w} ${h} 0 0 1 ${w / 2} ${-h / 2} 
              L ${w / 2} ${h / 2} Z`;

    case 'P7_arrow':
      // Arrowhead / wedge 45°
      return `M ${-w / 2} ${-h / 2} 
              L ${w / 2} 0 
              L ${-w / 2} ${h / 2} 
              L ${-w / 4} 0 Z`;

    case 'P9_t_connector': {
      // T/L connector
      const stemW = MODULE_PX;
      return `M ${-w / 2} ${-h / 2} 
              H ${w / 2} 
              V ${-h / 2 + stemW} 
              H ${stemW / 2} 
              V ${h / 2} 
              H ${-stemW / 2} 
              V ${-h / 2 + stemW} 
              H ${-w / 2} Z`;
    }

    case 'P10_point': {
      // Pure circle (diámetro 1M = 67px)
      const rad = Math.min(w, h) / 2;
      return `M 0 ${-rad} 
              A ${rad} ${rad} 0 1 1 0 ${rad} 
              A ${rad} ${rad} 0 1 1 0 ${-rad} Z`;
    }

    case 'P12_oblique_wedge':
      // Oblique upper wedge
      return `M ${-w / 2} ${-h / 2} 
              L ${w / 2} ${-h / 4} 
              L ${w / 3} ${h / 2} 
              L ${-w / 2} ${h / 2} Z`;

    default:
      return getCapsuleSvgPath(w, h);
  }
}

/**
 * 7 Canonical Base Pieces (H-M-A Foundation) Initial Configuration
 */
export function getCanonicalBasePieces(colorLuz = '#06B6D4', colorProfundo = '#2D60C1'): HMAPiece[] {
  return [
    {
      id: 'piece-p1',
      shapeType: 'P1_triangle45',
      name: 'P1: Triángulo Base H',
      category: 'base',
      x: -1.5 * MODULE_PX,
      y: 1.5 * MODULE_PX,
      rotation: 0,
      widthM: 1,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorProfundo,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 1
    },
    {
      id: 'piece-p2',
      shapeType: 'P2_square',
      name: 'P2: Cuadrado Base M',
      category: 'base',
      x: 0,
      y: 1.5 * MODULE_PX,
      rotation: 0,
      widthM: 1,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorProfundo,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 2
    },
    {
      id: 'piece-p3',
      shapeType: 'P3_rect2x1',
      name: 'P3: Viga Base A',
      category: 'base',
      x: 1.5 * MODULE_PX,
      y: 1.5 * MODULE_PX,
      rotation: 0,
      widthM: 2,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorProfundo,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 3
    },
    {
      id: 'piece-p4',
      shapeType: 'P4_parallelogram',
      name: 'P4: Enlace Diagonal Base',
      category: 'base',
      x: -0.75 * MODULE_PX,
      y: 0.75 * MODULE_PX,
      rotation: 45,
      widthM: 1.5,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorProfundo,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 4
    },
    {
      id: 'piece-p5',
      shapeType: 'P5_trapezoid',
      name: 'P5: Trapecio Pilar Central',
      category: 'base',
      x: 0.75 * MODULE_PX,
      y: 0.75 * MODULE_PX,
      rotation: 0,
      widthM: 1.5,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorProfundo,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 5
    },
    {
      id: 'piece-p6',
      shapeType: 'P6_arc90',
      name: 'P6: Arco Base Curvo',
      category: 'base',
      x: -1.75 * MODULE_PX,
      y: 0.5 * MODULE_PX,
      rotation: 90,
      widthM: 1,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorLuz,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 6
    },
    {
      id: 'piece-p7',
      shapeType: 'P7_arrow',
      name: 'P7: Punta de Flecha Base',
      category: 'base',
      x: 1.75 * MODULE_PX,
      y: 0.5 * MODULE_PX,
      rotation: 0,
      widthM: 1,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorLuz,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 7
    }
  ];
}

/**
 * 6 Canonical Upper Complementary Pieces
 */
export function getCanonicalUpperPieces(colorLuz = '#06B6D4', colorProfundo = '#2D60C1'): HMAPiece[] {
  return [
    {
      id: 'piece-p8',
      shapeType: 'P8_diagonal',
      name: 'P8: Bloque Diagonal Superior',
      category: 'upper',
      x: -1 * MODULE_PX,
      y: -1.25 * MODULE_PX,
      rotation: 45,
      widthM: 2,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorLuz,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 8
    },
    {
      id: 'piece-p9',
      shapeType: 'P9_t_connector',
      name: 'P9: Conector Ortogonal T',
      category: 'upper',
      x: 1.25 * MODULE_PX,
      y: -1 * MODULE_PX,
      rotation: 0,
      widthM: 1.5,
      heightM: 1.5,
      scaleX: 1,
      scaleY: 1,
      color: colorLuz,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 9
    },
    {
      id: 'piece-p10',
      shapeType: 'P10_point',
      name: 'P10: Punto Origen Ecosistema',
      category: 'upper',
      x: 0,
      y: 0,
      rotation: 0,
      widthM: 1,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorLuz,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 10
    },
    {
      id: 'piece-p11',
      shapeType: 'P11_capsule3x1',
      name: 'P11: Viga Superior 3M',
      category: 'upper',
      x: 0,
      y: -2 * MODULE_PX,
      rotation: 0,
      widthM: 3,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorLuz,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 11
    },
    {
      id: 'piece-p12',
      shapeType: 'P12_oblique_wedge',
      name: 'P12: Cuña Vórtice',
      category: 'upper',
      x: -1.75 * MODULE_PX,
      y: -0.5 * MODULE_PX,
      rotation: 45,
      widthM: 1.5,
      heightM: 1,
      scaleX: 1,
      scaleY: 1,
      color: colorProfundo,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 12
    },
    {
      id: 'piece-p13',
      shapeType: 'P13_vertical_bar',
      name: 'P13: Columna Eje Y',
      category: 'upper',
      x: 2 * MODULE_PX,
      y: -0.25 * MODULE_PX,
      rotation: 0,
      widthM: 1,
      heightM: 2.5,
      scaleX: 1,
      scaleY: 1,
      color: colorProfundo,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 13
    }
  ];
}

/**
 * 13 Canonical Isotype Presets & Master Variants with exact geometry
 */
export const HMA_PRESETS: HMAPreset[] = [
  // 1. HMA Master
  {
    id: 'hma-master',
    name: 'HMA MATRIX (MASTER)',
    cluster: 'Ecosistema Matriz',
    description: 'Isotipo Matriz canónico que rige el sistema modular 2016–2026 con 13 formas en equilibrio 45°.',
    colorLuz: '#3D80FD',
    colorProfundo: '#2D60C1',
    pieces: getPresetMasterDiagonal('#3D80FD', '#2D60C1').map(mapShapePieceToHMAPiece)
  },
  // 2. HMA Design
  {
    id: 'hma-design',
    name: 'HMA DESIGN',
    cluster: 'Clúster 01 — Creación & Forma',
    description: 'Dirección de arte, sistemas de identidad y diseño modular en equilibrio dinámico.',
    colorLuz: '#3D80FD',
    colorProfundo: '#2D60C1',
    pieces: getPresetDesign('#3D80FD', '#2D60C1').map(mapShapePieceToHMAPiece)
  },
  // 3. HMA Type
  {
    id: 'hma-type',
    name: 'HMA TYPE',
    cluster: 'Clúster 01 — Creación & Forma',
    description: 'Fundición tipográfica, caligrafía vectorial y ritmo modular estructurado.',
    colorLuz: '#AE7176',
    colorProfundo: '#77454A',
    pieces: getPresetType('#AE7176', '#77454A').map(mapShapePieceToHMAPiece)
  },
  // 4. HMA Visuals
  {
    id: 'hma-visuals',
    name: 'HMA VISUALS',
    cluster: 'Clúster 01 — Creación & Forma',
    description: 'Comunicación visual, motion graphics e impacto cromático angular.',
    colorLuz: '#D96B43',
    colorProfundo: '#964222',
    pieces: getPresetVisuals('#D96B43', '#964222').map(mapShapePieceToHMAPiece)
  },
  // 5. HMA Photography
  {
    id: 'hma-photography',
    name: 'HMA PHOTOGRAPHY',
    cluster: 'Clúster 02 — Óptica & Sonido',
    description: 'Captura lumínica, encuadre óptico y fotografía de estudio con diafragma focal.',
    colorLuz: '#052D63',
    colorProfundo: '#031C3D',
    pieces: getPresetPhotography('#052D63', '#031C3D').map(mapShapePieceToHMAPiece)
  },
  // 6. HMA Music
  {
    id: 'hma-music',
    name: 'HMA MUSIC',
    cluster: 'Clúster 02 — Óptica & Sonido',
    description: 'Composición sonora, síntesis armónica y paisaje acústico modular.',
    colorLuz: '#0E8490',
    colorProfundo: '#074349',
    pieces: getPresetMusic('#0E8490', '#074349').map(mapShapePieceToHMAPiece)
  },
  // 7. HMA Cinema
  {
    id: 'hma-cinema',
    name: 'HMA CINEMA',
    cluster: 'Clúster 02 — Óptica & Sonido',
    description: 'Narrativa cinematográfica, óptica anamórfica y etalonaje en encuadre continuo.',
    colorLuz: '#1D5B8F',
    colorProfundo: '#1B3F67',
    pieces: getPresetCinema('#1D5B8F', '#1B3F67').map(mapShapePieceToHMAPiece)
  },
  // 8. HMA Temples
  {
    id: 'hma-temples',
    name: 'HMA TEMPLES',
    cluster: 'Clúster 03 — Estructura & Pensamiento',
    description: 'Arquitectura sagrada, espacios de contemplación, columnas y proporción.',
    colorLuz: '#7D77B0',
    colorProfundo: '#514B7D',
    pieces: getPresetTemples('#7D77B0', '#514B7D').map(mapShapePieceToHMAPiece)
  },
  // 9. HMA Publishing
  {
    id: 'hma-publishing',
    name: 'HMA PUBLISHING',
    cluster: 'Clúster 03 — Estructura & Pensamiento',
    description: 'Edición impresa, cuadernos de autor y publicaciones de arte y legado.',
    colorLuz: '#C5A367',
    colorProfundo: '#82600A',
    pieces: getPresetPublishing('#C5A367', '#82600A').map(mapShapePieceToHMAPiece)
  },
  // 10. HMA Transcendence
  {
    id: 'hma-transcendence',
    name: 'HMA TRANSCENDENCE',
    cluster: 'Clúster 03 — Estructura & Pensamiento',
    description: 'Filosofía modular, consciencia de marca, cronología y trascendencia.',
    colorLuz: '#315629',
    colorProfundo: '#1B3315',
    pieces: getPresetTranscendence('#315629', '#1B3315').map(mapShapePieceToHMAPiece)
  },
  // 11. HMA Watermark
  {
    id: 'hma-watermark',
    name: 'HMA WATERMARK',
    cluster: 'Clúster 04 — Tecnología & Materia',
    description: 'Sello de autenticidad, trazabilidad y protección de activos vectoriales.',
    colorLuz: '#75C962',
    colorProfundo: '#4B893C',
    pieces: getPresetWatermark('#75C962', '#4B893C').map(mapShapePieceToHMAPiece)
  },
  // 12. HMA Software
  {
    id: 'hma-software',
    name: 'HMA SOFTWARE',
    cluster: 'Clúster 04 — Tecnología & Materia',
    description: 'Ingeniería algorítmica, herramientas creativas y frontend modular.',
    colorLuz: '#11D7B6',
    colorProfundo: '#0A8570',
    pieces: getPresetSoftware('#11D7B6', '#0A8570').map(mapShapePieceToHMAPiece)
  },
  // 13. HMA Print
  {
    id: 'hma-print',
    name: 'HMA PRINT',
    cluster: 'Clúster 04 — Tecnología & Materia',
    description: 'Impresión de alta fidelidad, serigrafía y acabados tangibles de producción.',
    colorLuz: '#D7BB11',
    colorProfundo: '#8C7907',
    pieces: getPresetPrint('#D7BB11', '#8C7907').map(mapShapePieceToHMAPiece)
  },
  // Variantes Master Especiales
  {
    id: 'hma-master-canonical',
    name: 'HMA Master (Canónico 45°)',
    cluster: 'Variantes Master',
    description: 'Distribución 45° original del manual de identidad de 13 formas',
    colorLuz: '#06B6D4',
    colorProfundo: '#082F49',
    pieces: [...getCanonicalBasePieces('#06B6D4', '#082F49'), ...getCanonicalUpperPieces('#06B6D4', '#082F49')]
  },
  {
    id: 'hma-master-circle',
    name: 'HMA Master Circle (Órbita)',
    cluster: 'Variantes Master',
    description: 'Geometría circular radial concéntrica orientada a ópticas y relojes',
    colorLuz: '#06B6D4',
    colorProfundo: '#082F49',
    pieces: getPresetMasterCircle('#06B6D4', '#082F49').map(mapShapePieceToHMAPiece)
  },
  {
    id: 'hma-master-logo',
    name: 'HMA Master Logo Lockup',
    cluster: 'Variantes Master',
    description: 'Lockup completo de isotipo y caja de protección',
    colorLuz: '#10B981',
    colorProfundo: '#064E3B',
    pieces: getPresetMasterLogo('#10B981', '#064E3B').map(mapShapePieceToHMAPiece)
  }
];

/**
 * 4 Master Variants
 */
export const MASTER_VARIANTS = [
  { id: 'master-canonical', name: 'Master Canónico 45°', description: 'Distribución 45° original del manual de identidad' },
  { id: 'master-circle', name: 'Master Circle (Órbita)', description: 'Geometría circular radial concéntrica' },
  { id: 'master-diagonal', name: 'Master Diagonal Dinámico', description: 'Inclinación angular acentuada para interfaces dinámicas' },
  { id: 'master-logo', name: 'Master Lockup + Wordmark', description: 'Lockup completo con cápsula y logotipo Aeonik' }
];
