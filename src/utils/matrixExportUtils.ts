import { MatrixShape } from '../types/matrix';
import { LogoData, Shape } from '../types';

export function mapMatrixShapeToMotionShape(matrixShape: MatrixShape, index: number): Shape {
  const UNIT = 67;
  // Convert top-left Matrix coordinates to center coordinates for Motion
  const centerX = matrixShape.x + (matrixShape.widthX * UNIT) / 2;
  const centerY = matrixShape.y + (matrixShape.heightX * UNIT) / 2;

  // In Motion, TARGET_CENTER is 540.
  // The center of the 11x11 Matrix grid is 737 / 2 = 368.5.
  // We offset it so that the Matrix center maps to the Motion center.
  const motionX = centerX - 368.5 + 540;
  const motionY = centerY - 368.5 + 540;

  return {
    id: `forma-${(index + 1).toString().padStart(2, '0')}`,
    displayName: `Forma ${index + 1}`,
    length: matrixShape.heightX * UNIT,
    width: matrixShape.widthX * UNIT,
    x: motionX,
    y: motionY,
    rotation: matrixShape.rot,
    color: matrixShape.color
  };
}

export function createLogoDataFromMatrix(shapes: MatrixShape[]): LogoData {
  return {
    serviceId: `matrix-export-${Date.now()}`,
    serviceName: 'Matrix Export',
    clusterName: 'Creación Custom',
    shapes: shapes.map(mapMatrixShapeToMotionShape)
  };
}
