import { ServiceDefinition } from '../types';

export const GLOBAL_NEUTRALS = {
  darkBg: '#081126',
  panelBg: '#0E1726',
  cardBg: '#131E32',
  borderColor: '#1E293B',
  lightBg: '#F8F9FC',
  uiAccent: '#0057FF',
  uiAccentCyan: '#38BDF8',
};

export const SERVICES: ServiceDefinition[] = [
  // Master / Core
  {
    id: 'hma-master',
    name: 'HMA MATRIX (MASTER)',
    cluster: 'Ecosistema Matriz',
    clusterNumber: 0,
    description: 'Isotipo Matriz canónico que rige el sistema modular 2016–2026.',
    colorLuz: '#3D80FD',
    colorProfundo: '#2D60C1',
  },

  // Clúster 01
  {
    id: 'hma-design',
    name: 'HMA DESIGN',
    cluster: 'Clúster 01 — Creación & Forma',
    clusterNumber: 1,
    description: 'Dirección de arte, sistemas de identidad y diseño modular.',
    colorLuz: '#3D80FD',
    colorProfundo: '#2D60C1',
  },
  {
    id: 'hma-type',
    name: 'HMA TYPE',
    cluster: 'Clúster 01 — Creación & Forma',
    clusterNumber: 1,
    description: 'Fundición tipográfica, caligrafía vectorial y ritmo editorial.',
    colorLuz: '#AE7176',
    colorProfundo: '#7A4F53',
  },
  {
    id: 'hma-visuals',
    name: 'HMA VISUALS',
    cluster: 'Clúster 01 — Creación & Forma',
    clusterNumber: 1,
    description: 'Comunicación visual, motion graphics e impacto cromático.',
    colorLuz: '#D96B43',
    colorProfundo: '#994B2E',
  },

  // Clúster 02
  {
    id: 'hma-photography',
    name: 'HMA PHOTOGRAPHY',
    cluster: 'Clúster 02 — Óptica & Sonido',
    clusterNumber: 2,
    description: 'Captura lumínica, encuadre óptico y fotografía de estudio.',
    colorLuz: '#11D7B6',
    colorProfundo: '#0C9982',
  },
  {
    id: 'hma-music',
    name: 'HMA MUSIC',
    cluster: 'Clúster 02 — Óptica & Sonido',
    clusterNumber: 2,
    description: 'Composición sonora, síntesis armónica y paisaje acústico.',
    colorLuz: '#16A097',
    colorProfundo: '#0F736C',
  },
  {
    id: 'hma-cinema',
    name: 'HMA CINEMA',
    cluster: 'Clúster 02 — Óptica & Sonido',
    clusterNumber: 2,
    description: 'Narrativa cinematográfica, óptica anamórfica y etalonaje.',
    colorLuz: '#2D60C1',
    colorProfundo: '#1E4387',
  },

  // Clúster 03
  {
    id: 'hma-temples',
    name: 'HMA TEMPLES',
    cluster: 'Clúster 03 — Estructura & Pensamiento',
    clusterNumber: 3,
    description: 'Arquitectura sagrada, espacios de contemplación y proporción.',
    colorLuz: '#7077B0',
    colorProfundo: '#4E537B',
  },
  {
    id: 'hma-publishing',
    name: 'HMA PUBLISHING',
    cluster: 'Clúster 03 — Estructura & Pensamiento',
    clusterNumber: 3,
    description: 'Edición impresa, cuadernos de autor y publicaciones de arte.',
    colorLuz: '#D7BB11',
    colorProfundo: '#96830C',
  },
  {
    id: 'hma-transcendence',
    name: 'HMA TRANSCENDENCE',
    cluster: 'Clúster 03 — Estructura & Pensamiento',
    clusterNumber: 3,
    description: 'Filosofía modular, consciencia de marca y legado temporal.',
    colorLuz: '#315629',
    colorProfundo: '#213B1C',
  },

  // Clúster 04
  {
    id: 'hma-watermark',
    name: 'HMA WATERMARK',
    cluster: 'Clúster 04 — Tecnología & Materia',
    clusterNumber: 4,
    description: 'Sello de autenticidad, trazabilidad y protección de activos.',
    colorLuz: '#75C962',
    colorProfundo: '#518C44',
  },
  {
    id: 'hma-software',
    name: 'HMA SOFTWARE',
    cluster: 'Clúster 04 — Tecnología & Materia',
    clusterNumber: 4,
    description: 'Ingeniería algorítmica, herramientas creativas y frontend.',
    colorLuz: '#2280AC',
    colorProfundo: '#165A7A',
  },
  {
    id: 'hma-print',
    name: 'HMA PRINT',
    cluster: 'Clúster 04 — Tecnología & Materia',
    clusterNumber: 4,
    description: 'Impresión de alta fidelidad, serigrafía y acabados tangibles.',
    colorLuz: '#C99700',
    colorProfundo: '#8C6900',
  },
];
