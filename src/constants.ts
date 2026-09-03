export const M_UNIT = 67;

export const SHAPES: Record<string, { path: string; width: number; height: number }> = {
  P1: { path: 'M0,0 L67,0 L0,67 Z', width: 67, height: 67 }, // Triángulo rectángulo
  P2: { path: 'M0,0 L67,0 L67,67 L0,67 Z', width: 67, height: 67 }, // Cuadrado
  P3: { path: 'M0,0 L134,0 L134,67 L0,67 Z', width: 134, height: 67 }, // Rectángulo horizontal
  P4: { path: 'M67,0 L134,0 L67,67 L0,67 Z', width: 134, height: 67 }, // Paralelogramo 45°
  P5: { path: 'M16.75,0 L50.25,0 L67,67 L0,67 Z', width: 67, height: 67 }, // Trapecio simétrico
  P6: { path: 'M0,0 L67,0 A67,67 0 0,1 0,67 Z', width: 67, height: 67 }, // Arco circular
  P7: { path: 'M0,0 L67,33.5 L0,67 L16.75,33.5 Z', width: 67, height: 67 }, // Punta de flecha
  P8: { path: 'M33.5,0 L67,33.5 L33.5,67 L0,33.5 Z', width: 67, height: 67 }, // Rombo/Diamante
  P9: { path: 'M0,0 L67,0 L67,33.5 L33.5,33.5 L33.5,67 L0,67 Z', width: 67, height: 67 }, // Conector L
  P10: { path: 'M16.75,16.75 L50.25,16.75 L50.25,50.25 L16.75,50.25 Z', width: 67, height: 67 }, // Cuadrado menor
  P11: { path: 'M0,33.5 A33.5,33.5 0 1,1 67,33.5 A33.5,33.5 0 1,1 0,33.5 Z', width: 67, height: 67 }, // Círculo
  P12: { path: 'M0,0 L67,67 L50.25,67 L0,16.75 Z', width: 67, height: 67 }, // Diagonal ancha
  P13: { path: 'M16.75,0 L67,0 L67,67 L16.75,67 A16.75,16.75 0 0,1 16.75,0 Z', width: 67, height: 67 }, // Terminal curva
};

export const PALETTES = {
  luz: [
    '#3D80FD', '#AE7176', '#D96B43', '#052D63', '#0E8490', '#1D5B8F', 
    '#7D77B0', '#C5A367', '#315629', '#75C962', '#11D7B6', '#D7BB11', '#FEFAE8'
  ],
  profundo: [
    '#2D60C1', '#77454A', '#964222', '#031C3D', '#074349', '#1B3F67', 
    '#514B7D', '#82600A', '#1B3315', '#4B893C', '#0A8570', '#8C7907', '#060C04'
  ]
};

export const BRAND_COLORS = [
  ...PALETTES.luz,
  ...PALETTES.profundo
];

export const PRESETS = [
  'HMA Master', 'Alpha', 'Beta', 'Quantum', 'Cyber', 'Cloud', 'AI Core', 'Data', 'Energy', 'Security', 'Sync', 'Vision', 'Nexus'
];

export const PIECE_TYPES = Array.from({ length: 13 }, (_, i) => `P${i + 1}`);
