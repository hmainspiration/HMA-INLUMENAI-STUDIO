import { MatrixShape } from '../types/matrix';
import { UNIT } from './matrixGridUtils';

export interface ShapeDistanceDimension {
  id: string;
  shapeAId: string;
  shapeBId: string;
  // Puntos donde se coloca la línea de cota (en coordenadas del canvas)
  pA: { x: number; y: number };
  pB: { x: number; y: number };
  // Distancia en px y en unidades X
  distancePx: number;
  distanceX: number;
  label: string; // ej: '0.25X', '0.5X', '1X'
  isModular: boolean; // Si coincide con múltiplo exacto de 0.25X
  centerPoint: { x: number; y: number };
}

/**
 * Calcula los puntos clave del contorno inferior de una forma paramétrica de Matrix.
 * Si la forma está rotada, calcula los puntos de su extremo inferior (base) rotados en el espacio del canvas.
 */
export function getShapeBottomGeometry(shape: MatrixShape) {
  const w = shape.widthX * UNIT;
  const h = shape.heightX * UNIT;
  const cx = shape.x + w / 2;
  const cy = shape.y + h / 2;
  const rad = (shape.rot * Math.PI) / 180;

  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Función para transformar un punto local relativo a (cx, cy) al canvas
  const transform = (lx: number, ly: number) => ({
    x: cx + lx * cos - ly * sin,
    y: cy + lx * sin + ly * cos
  });

  // Puntos clave del extremo inferior (base)
  const bottomCenter = transform(0, h / 2);
  const bottomLeft = transform(-w / 2, h / 2);
  const bottomRight = transform(w / 2, h / 2);

  // Muestreo denso de la base inferior para precisión milimétrica al calcular distancias libres
  const bottomSamples: Array<{ x: number; y: number }> = [];
  const steps = 7;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lx = -w / 2 + t * w;
    const ly = h / 2;
    bottomSamples.push(transform(lx, ly));
  }

  return {
    cx,
    cy,
    w,
    h,
    rot: shape.rot,
    bottomCenter,
    bottomLeft,
    bottomRight,
    bottomSamples
  };
}

/**
 * Formatea una distancia en px a la nomenclatura de retícula modular X.
 * ej: 16.75px -> '0.25X', 33.5px -> '0.5X', 67px -> '1X', etc.
 */
export function formatDistanceToModularX(distPx: number): { label: string; isModular: boolean; unitsX: number } {
  const unitsX = distPx / UNIT;
  const nearestQuarter = Math.round(unitsX * 4) / 4;
  const diff = Math.abs(unitsX - nearestQuarter);

  // Tolerancia de ~2.5px para snapping visual modular
  const isModular = diff <= 0.04;

  let label: string;
  if (isModular) {
    // Si es múltiplo exacto de 0.25X (0.25, 0.5, 0.75, 1, 1.25, etc.)
    label = Number.isInteger(nearestQuarter) ? `${nearestQuarter}X` : `${nearestQuarter.toFixed(2).replace(/\.?0+$/, '')}X`;
  } else {
    // Si es una distancia arbitraria no alineada a la cuadrícula
    label = `${unitsX.toFixed(2)}X`;
  }

  return { label, isModular, unitsX };
}

/**
 * Calcula la distancia entre los extremos inferiores de dos formas.
 * Para formas rotadas (ej: 20° o 45° que convergen en la parte superior pero divergen en la base),
 * calcula la distancia libre entre sus extremos inferiores.
 */
export function calculateShapesBottomDistance(shapeA: MatrixShape, shapeB: MatrixShape): ShapeDistanceDimension | null {
  const geomA = getShapeBottomGeometry(shapeA);
  const geomB = getShapeBottomGeometry(shapeB);

  // Si ambas formas tienen rotación 0 (paralelas verticales)
  if (Math.abs(shapeA.rot) < 0.1 && Math.abs(shapeB.rot) < 0.1) {
    // Medir la separación horizontal o vertical entre sus bases
    const xOverlap = !(shapeA.x + geomA.w < shapeB.x || shapeB.x + geomB.w < shapeA.x);
    const yOverlap = !(shapeA.y + geomA.h < shapeB.y || shapeB.y + geomB.h < shapeA.y);

    // Si están una al lado de la otra horizontalmente
    if (yOverlap || Math.abs((shapeA.y + geomA.h) - (shapeB.y + geomB.h)) < UNIT) {
      let pA: { x: number; y: number };
      let pB: { x: number; y: number };
      let distPx: number;

      if (shapeA.x + geomA.w <= shapeB.x) {
        pA = { x: shapeA.x + geomA.w, y: shapeA.y + geomA.h };
        pB = { x: shapeB.x, y: shapeA.y + geomA.h };
        distPx = shapeB.x - (shapeA.x + geomA.w);
      } else if (shapeB.x + geomB.w <= shapeA.x) {
        pA = { x: shapeB.x + geomB.w, y: shapeB.y + geomB.h };
        pB = { x: shapeA.x, y: shapeB.y + geomB.h };
        distPx = shapeA.x - (shapeB.x + geomB.w);
      } else {
        // Se tocan o solapan en X
        distPx = 0;
        pA = geomA.bottomCenter;
        pB = geomB.bottomCenter;
      }

      if (distPx > 0.5) {
        const { label, isModular, unitsX } = formatDistanceToModularX(distPx);
        return {
          id: `dist-${shapeA.id}-${shapeB.id}`,
          shapeAId: shapeA.id,
          shapeBId: shapeB.id,
          pA,
          pB,
          distancePx: distPx,
          distanceX: unitsX,
          label,
          isModular,
          centerPoint: { x: (pA.x + pB.x) / 2, y: (pA.y + pB.y) / 2 }
        };
      }
    }
  }

  // Para formas rotadas (o con ángulos distintos):
  // Buscamos los puntos más cercanos entre las bases inferiores de ambas formas
  let minDistSq = Infinity;
  let bestPA = geomA.bottomCenter;
  let bestPB = geomB.bottomCenter;

  for (const sA of geomA.bottomSamples) {
    for (const sB of geomB.bottomSamples) {
      const dx = sA.x - sB.x;
      const dy = sA.y - sB.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < minDistSq) {
        minDistSq = distSq;
        bestPA = sA;
        bestPB = sB;
      }
    }
  }

  const distPx = Math.sqrt(minDistSq);
  // Si la distancia es mayor a 1px (evitar solapamiento exacto)
  if (distPx > 1) {
    const { label, isModular, unitsX } = formatDistanceToModularX(distPx);
    return {
      id: `dist-${shapeA.id}-${shapeB.id}`,
      shapeAId: shapeA.id,
      shapeBId: shapeB.id,
      pA: bestPA,
      pB: bestPB,
      distancePx: distPx,
      distanceX: unitsX,
      label,
      isModular,
      centerPoint: { x: (bestPA.x + bestPB.x) / 2, y: (bestPA.y + bestPB.y) / 2 }
    };
  }

  return null;
}

/**
 * Calcula todas las cotas de distancia relevantes entre formas del lienzo.
 * Si hay una forma seleccionada, prioriza las distancias entre esa forma y las demás.
 */
export function getAllShapeDistances(
  shapes: MatrixShape[],
  selectedShapeId: string | null
): ShapeDistanceDimension[] {
  if (shapes.length < 2) return [];

  const dimensions: ShapeDistanceDimension[] = [];

  // Si hay exactamente 2 formas
  if (shapes.length === 2) {
    const dim = calculateShapesBottomDistance(shapes[0], shapes[1]);
    if (dim) dimensions.push(dim);
    return dimensions;
  }

  // Si hay una forma seleccionada, medir desde la forma seleccionada hacia las demás
  if (selectedShapeId) {
    const selected = shapes.find((s) => s.id === selectedShapeId);
    if (selected) {
      const otherShapes = shapes.filter((s) => s.id !== selectedShapeId);
      const measured: ShapeDistanceDimension[] = [];

      for (const other of otherShapes) {
        const dim = calculateShapesBottomDistance(selected, other);
        if (dim) measured.push(dim);
      }

      // Ordenar por cercanía y mostrar las 2 más cercanas para no saturar el lienzo
      measured.sort((a, b) => a.distancePx - b.distancePx);
      return measured.slice(0, 3);
    }
  }

  // Si no hay selección, medir entre pares adyacentes más cercanos
  const allPairs: ShapeDistanceDimension[] = [];
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const dim = calculateShapesBottomDistance(shapes[i], shapes[j]);
      if (dim && dim.distancePx < UNIT * 7) {
        // Filtrar solo distancias razonables dentro del lienzo
        allPairs.push(dim);
      }
    }
  }

  allPairs.sort((a, b) => a.distancePx - b.distancePx);
  // Devolver máximo las 4 cotas más representativas para un lienzo limpio
  return allPairs.slice(0, 4);
}
