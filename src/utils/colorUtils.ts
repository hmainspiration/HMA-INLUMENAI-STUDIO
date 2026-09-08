/**
 * HMA INLUMENAI STUDIO (v2026.40)
 * Color Math & Chromatic Space Conversions: HEX <-> RGB <-> CMYK
 * Strict mathematical modeling without any floating artifacts.
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface HmaColorPreset {
  id: string;
  name: string;
  cluster: string;
  toneType: 'luz' | 'profundo' | 'neutro' | 'acento';
  hex: string;
}

/**
 * Validates and sanitizes a 3-char or 6-char HEX color string.
 */
export function sanitizeHex(hex: string): string {
  let clean = hex.replace(/[^0-9A-Fa-f]/g, '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length !== 6) {
    return '#06B6D4'; // Fallback to canonical HMA Cyan Luz
  }
  return `#${clean.toUpperCase()}`;
}

/**
 * Converts HEX (#RRGGBB) to RGB object {r, g, b} (0-255).
 */
export function hexToRgb(hex: string): RgbColor {
  const sanitized = sanitizeHex(hex).replace('#', '');
  const num = parseInt(sanitized, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Converts RGB object {r, g, b} (0-255) to uppercase HEX (#RRGGBB).
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Converts RGB (0-255) to standard subtractive CMYK percentages (0-100%).
 */
export function rgbToCmyk(r: number, g: number, b: number): CmykColor {
  const rNorm = Math.max(0, Math.min(255, r)) / 255;
  const gNorm = Math.max(0, Math.min(255, g)) / 255;
  const bNorm = Math.max(0, Math.min(255, b)) / 255;

  const kNorm = 1 - Math.max(rNorm, gNorm, bNorm);
  if (kNorm >= 0.9999) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = Math.round(((1 - rNorm - kNorm) / (1 - kNorm)) * 100);
  const m = Math.round(((1 - gNorm - kNorm) / (1 - kNorm)) * 100);
  const y = Math.round(((1 - bNorm - kNorm) / (1 - kNorm)) * 100);
  const k = Math.round(kNorm * 100);

  return {
    c: Math.max(0, Math.min(100, c)),
    m: Math.max(0, Math.min(100, m)),
    y: Math.max(0, Math.min(100, y)),
    k: Math.max(0, Math.min(100, k))
  };
}

/**
 * Converts subtractive CMYK percentages (0-100%) to RGB (0-255).
 */
export function cmykToRgb(c: number, m: number, y: number, k: number): RgbColor {
  const cNorm = Math.max(0, Math.min(100, c)) / 100;
  const mNorm = Math.max(0, Math.min(100, m)) / 100;
  const yNorm = Math.max(0, Math.min(100, y)) / 100;
  const kNorm = Math.max(0, Math.min(100, k)) / 100;

  const r = Math.round(255 * (1 - cNorm) * (1 - kNorm));
  const g = Math.round(255 * (1 - mNorm) * (1 - kNorm));
  const b = Math.round(255 * (1 - yNorm) * (1 - kNorm));

  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b))
  };
}

/**
 * Complete official color catalogue of the HMA ecosystem
 */
export const HMA_OFFICIAL_PRESET_COLORS: HmaColorPreset[] = [
  // Marca Maestra
  { id: 'master-luz', name: 'Cyan Luz (Canónico)', cluster: 'Marca Maestra', toneType: 'luz', hex: '#06B6D4' },
  { id: 'master-profundo', name: 'Azul Profundo Nocturno', cluster: 'Marca Maestra', toneType: 'profundo', hex: '#082F49' },
  { id: 'master-diag-luz', name: 'Azul Eléctrico Luz', cluster: 'Variantes Master', toneType: 'luz', hex: '#3D80FD' },
  { id: 'master-diag-prof', name: 'Cobalto Profundo', cluster: 'Variantes Master', toneType: 'profundo', hex: '#2D60C1' },
  { id: 'master-logo-luz', name: 'Esmeralda Luz', cluster: 'Variantes Master', toneType: 'luz', hex: '#10B981' },
  { id: 'master-logo-prof', name: 'Verde Pino Profundo', cluster: 'Variantes Master', toneType: 'profundo', hex: '#064E3B' },

  // Clúster 01: Creación & Forma
  { id: 'c1-design-luz', name: 'Azul Internacional Klein', cluster: 'Clúster 01: Creación & Forma', toneType: 'luz', hex: '#0057FF' },
  { id: 'c1-design-prof', name: 'Azul Marino Índigo', cluster: 'Clúster 01: Creación & Forma', toneType: 'profundo', hex: '#002266' },
  { id: 'c1-type-luz', name: 'Púrpura Tipográfico', cluster: 'Clúster 01: Creación & Forma', toneType: 'luz', hex: '#7C3AED' },
  { id: 'c1-type-prof', name: 'Berenjena Profundo', cluster: 'Clúster 01: Creación & Forma', toneType: 'profundo', hex: '#3B0764' },
  { id: 'c1-vis-luz', name: 'Rosa Escarlata Visual', cluster: 'Clúster 01: Creación & Forma', toneType: 'luz', hex: '#F43F5E' },
  { id: 'c1-vis-prof', name: 'Vino Tinto Obscuro', cluster: 'Clúster 01: Creación & Forma', toneType: 'profundo', hex: '#881337' },

  // Clúster 02: Óptica & Sonido
  { id: 'c2-photo-luz', name: 'Violeta Espectral', cluster: 'Clúster 02: Óptica & Sonido', toneType: 'luz', hex: '#8B5CF6' },
  { id: 'c2-photo-prof', name: 'Índigo Profundo', cluster: 'Clúster 02: Óptica & Sonido', toneType: 'profundo', hex: '#3730A3' },
  { id: 'c2-music-luz', name: 'Magenta Armónico', cluster: 'Clúster 02: Óptica & Sonido', toneType: 'luz', hex: '#EC4899' },
  { id: 'c2-music-prof', name: 'Grosella Sónica', cluster: 'Clúster 02: Óptica & Sonido', toneType: 'profundo', hex: '#831843' },
  { id: 'c2-cinema-luz', name: 'Naranja Fotónico', cluster: 'Clúster 02: Óptica & Sonido', toneType: 'luz', hex: '#F97316' },
  { id: 'c2-cinema-prof', name: 'Óxido Cinematográfico', cluster: 'Clúster 02: Óptica & Sonido', toneType: 'profundo', hex: '#7C2D12' },

  // Clúster 03: Estructura & Legado
  { id: 'c3-temples-luz', name: 'Oro Templario', cluster: 'Clúster 03: Estructura & Legado', toneType: 'luz', hex: '#EAB308' },
  { id: 'c3-temples-prof', name: 'Bronce Antiguo', cluster: 'Clúster 03: Estructura & Legado', toneType: 'profundo', hex: '#713F12' },
  { id: 'c3-pub-luz', name: 'Turquesa Editorial', cluster: 'Clúster 03: Estructura & Legado', toneType: 'luz', hex: '#14B8A6' },
  { id: 'c3-pub-prof', name: 'Verde Petróleo', cluster: 'Clúster 03: Estructura & Legado', toneType: 'profundo', hex: '#042F2E' },
  { id: 'c3-trans-luz', name: 'Añil Trascendental', cluster: 'Clúster 03: Estructura & Legado', toneType: 'luz', hex: '#6366F1' },
  { id: 'c3-trans-prof', name: 'Espacio Profundo', cluster: 'Clúster 03: Estructura & Legado', toneType: 'profundo', hex: '#1E1B4B' },

  // Clúster 04: Tecnología & Materia
  { id: 'c4-soft-luz', name: 'Azul Algorítmico', cluster: 'Clúster 04: Tecnología & Materia', toneType: 'luz', hex: '#0284C7' },
  { id: 'c4-soft-prof', name: 'Abisal Cibernético', cluster: 'Clúster 04: Tecnología & Materia', toneType: 'profundo', hex: '#082F49' },
  { id: 'c4-print-luz', name: 'Ámbar Litográfico', cluster: 'Clúster 04: Tecnología & Materia', toneType: 'luz', hex: '#D97706' },
  { id: 'c4-print-prof', name: 'Sepia Prensa', cluster: 'Clúster 04: Tecnología & Materia', toneType: 'profundo', hex: '#78350F' },
  { id: 'c4-watermark-luz', name: 'Plata Filigrana', cluster: 'Clúster 04: Tecnología & Materia', toneType: 'luz', hex: '#94A3B8' },
  { id: 'c4-watermark-prof', name: 'Grafito Técnico', cluster: 'Clúster 04: Tecnología & Materia', toneType: 'profundo', hex: '#1E293B' },

  // Tonalidades Base Universales
  { id: 'uni-blanco', name: 'Blanco Puro Vectorial', cluster: 'Neutros & Base', toneType: 'neutro', hex: '#FFFFFF' },
  { id: 'uni-gris-luz', name: 'Gris Técnico Claro', cluster: 'Neutros & Base', toneType: 'neutro', hex: '#E2E8F0' },
  { id: 'uni-gris-medio', name: 'Pizarra Modular', cluster: 'Neutros & Base', toneType: 'neutro', hex: '#64748B' },
  { id: 'uni-obsidiana', name: 'Obsidiana Base', cluster: 'Neutros & Base', toneType: 'neutro', hex: '#000424' },
  { id: 'uni-negro', name: 'Negro Impresión 100K', cluster: 'Neutros & Base', toneType: 'neutro', hex: '#000000' }
];
