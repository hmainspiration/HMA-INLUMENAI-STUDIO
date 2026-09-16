import { MatrixShape } from '../types/matrix';

const UNIT = 67; // 1X = 67px
const CANVAS_SIZE = 737; // 11X = 737px

export interface SvgImportResult {
  shapes: MatrixShape[];
  detectedCount: number;
  warnings: string[];
  viewBox?: string;
  sourceType: 'matrix_native' | 'generic_svg' | 'inlumenai_motion';
}

/**
 * Parses an SVG string and extracts editable Matrix shapes.
 */
export function parseSvgToMatrixShapes(
  svgString: string,
  options: { autoCenter?: boolean; defaultColor?: string } = {}
): SvgImportResult {
  const warnings: string[] = [];
  const shapes: MatrixShape[] = [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('El archivo no es un SVG válido o contiene errores de sintaxis XML.');
  }

  const svgElement = doc.querySelector('svg');
  if (!svgElement) {
    throw new Error('No se encontró el elemento raíz <svg> en el archivo.');
  }

  const viewBox = svgElement.getAttribute('viewBox') || '';
  let vbMinX = 0;
  let vbMinY = 0;
  let vbWidth = CANVAS_SIZE;
  let vbHeight = CANVAS_SIZE;

  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && !parts.some(isNaN)) {
      [vbMinX, vbMinY, vbWidth, vbHeight] = parts;
    }
  }

  let sourceType: SvgImportResult['sourceType'] = 'generic_svg';

  // Check if it was exported from Matrix or Inlumenai Motion
  const isMatrixNative =
    svgString.includes('draggable-shape') ||
    svgString.includes('Matrix_Isotype') ||
    svgString.includes('shapes-layer') ||
    (vbMinX === -140 && vbWidth === 957);

  const isInlumenaiMotion =
    svgString.includes('master-rotation-group') ||
    svgString.includes('g-forma-') ||
    (vbWidth === 1080 && vbHeight === 1080);

  if (isMatrixNative) {
    sourceType = 'matrix_native';
  } else if (isInlumenaiMotion) {
    sourceType = 'inlumenai_motion';
  }

  // 1. Detect Rectangles (canonical Matrix shapes)
  const rectElements = Array.from(doc.querySelectorAll('rect'));

  // Exclude canvas background rectangles
  const candidateRects = rectElements.filter(rect => {
    const cls = rect.getAttribute('class') || '';
    const id = rect.getAttribute('id') || '';
    const fill = rect.getAttribute('fill') || '';
    const width = parseFloat(rect.getAttribute('width') || '0');
    const height = parseFloat(rect.getAttribute('height') || '0');

    // Filter out huge background rectangles
    if (cls.includes('bg') || cls.includes('canvas-bg') || id.includes('bg') || id.includes('grid')) {
      return false;
    }
    if (width >= 700 && height >= 700 && (fill === '#ffffff' || fill === '#f8f9fa' || fill === '#1e262c')) {
      return false;
    }
    if (width <= 0 || height <= 0) return false;

    return true;
  });

  candidateRects.forEach((rect, idx) => {
    try {
      const rawW = parseFloat(rect.getAttribute('width') || '67');
      const rawH = parseFloat(rect.getAttribute('height') || '67');
      let rawX = parseFloat(rect.getAttribute('x') || '0');
      let rawY = parseFloat(rect.getAttribute('y') || '0');

      let rot = 0;
      let rotCx = rawX + rawW / 2;
      let rotCy = rawY + rawH / 2;

      // Extract transformation
      const transform = rect.getAttribute('transform') || '';
      if (transform) {
        // Match translate(tx, ty)
        const translateMatch = transform.match(/translate\(\s*([-\d.]+)(?:[,\s]+([-\d.]+))?\s*\)/);
        if (translateMatch) {
          const tx = parseFloat(translateMatch[1]);
          const ty = translateMatch[2] ? parseFloat(translateMatch[2]) : 0;
          rawX += tx;
          rawY += ty;
        }

        // Match rotate(deg, cx, cy) or rotate(deg)
        const rotateMatch = transform.match(/rotate\(\s*([-\d.]+)(?:[,\s]+([-\d.]+)[,\s]+([-\d.]+))?\s*\)/);
        if (rotateMatch) {
          rot = parseFloat(rotateMatch[1]) || 0;
          if (rotateMatch[2] && rotateMatch[3]) {
            rotCx = parseFloat(rotateMatch[2]);
            rotCy = parseFloat(rotateMatch[3]);
          }
        }
      }

      // Check parent <g> transformations (e.g. from Inlumenai Motion <g className="g-forma-01" transform="...">)
      let parent = rect.parentElement;
      while (parent && parent.tagName.toLowerCase() === 'g') {
        const parentTransform = parent.getAttribute('transform') || '';
        if (parentTransform) {
          const pTransMatch = parentTransform.match(/translate\(\s*([-\d.]+)(?:[,\s]+([-\d.]+))?\s*\)/);
          if (pTransMatch) {
            rawX += parseFloat(pTransMatch[1]);
            rawY += pTransMatch[2] ? parseFloat(pTransMatch[2]) : 0;
          }
          const pRotMatch = parentTransform.match(/rotate\(\s*([-\d.]+)\s*\)/);
          if (pRotMatch) {
            rot = (rot + parseFloat(pRotMatch[1])) % 360;
          }
        }
        parent = parent.parentElement;
      }

      // Colors & styles
      const fill = rect.getAttribute('fill') || '';
      const stroke = rect.getAttribute('stroke') || '';
      const isWireframe = fill === 'none' || fill === 'transparent';
      const shapeColor = isWireframe
        ? stroke && stroke !== 'none'
          ? stroke
          : options.defaultColor || '#0277bd'
        : fill && fill !== 'none'
        ? fill
        : options.defaultColor || '#0277bd';

      // Dimensions in 1X units
      let widthX = Math.round((rawW / UNIT) * 100) / 100;
      let heightX = Math.round((rawH / UNIT) * 100) / 100;

      // Ensure minimal positive size
      if (widthX <= 0) widthX = 1;
      if (heightX <= 0) heightX = 1;

      // Handle Inlumenai Motion coordinates (offset to Matrix workspace)
      if (sourceType === 'inlumenai_motion') {
        // In Inlumenai Motion, center is (540, 540). Matrix center is (368.5, 368.5).
        // Forms in Inlumenai are centered at (x, y) with rect at (-w/2, -h/2)
        rawX = rawX - 540 + 368.5 - (widthX * UNIT) / 2;
        rawY = rawY - 540 + 368.5 - (heightX * UNIT) / 2;
      }

      // Normalize rotation between -180 and 180 or 0 and 360
      let normalizedRot = Math.round(rot);
      while (normalizedRot < 0) normalizedRot += 360;
      normalizedRot = normalizedRot % 360;

      shapes.push({
        id: `shape-imp-${Date.now()}-${idx + 1}`,
        x: Math.round(rawX * 10) / 10,
        y: Math.round(rawY * 10) / 10,
        widthX,
        heightX,
        rot: normalizedRot,
        color: shapeColor,
        wireframe: isWireframe
      });
    } catch (e: any) {
      warnings.push(`No se pudo procesar la forma #${idx + 1}: ${e?.message || 'Error de parseo'}`);
    }
  });

  // If no rects were detected, check for paths/polygons
  if (shapes.length === 0) {
    const pathElements = Array.from(doc.querySelectorAll('path, polygon, circle'));
    const validPaths = pathElements.filter(el => {
      const id = el.getAttribute('id') || '';
      return !id.includes('grid');
    });

    if (validPaths.length > 0) {
      warnings.push(
        `Se encontraron ${validPaths.length} elementos vectoriales complejos (paths/círculos). Se han aproximado sus dimensiones y posiciones originales.`
      );

      // Tag elements to find them in the mounted DOM
      validPaths.forEach((el, idx) => el.setAttribute('data-hma-import-idx', idx.toString()));

      // We need to mount the SVG to the DOM to compute real bounding boxes
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.pointerEvents = 'none';
      tempContainer.style.top = '0px';
      tempContainer.style.left = '0px';
      
      const clonedSvg = doc.documentElement.cloneNode(true) as SVGSVGElement;
      
      // Force the SVG to render at 1:1 scale (1 SVG unit = 1 pixel)
      clonedSvg.setAttribute('width', `${vbWidth}px`);
      clonedSvg.setAttribute('height', `${vbHeight}px`);
      // Preserve the original viewBox if it exists, otherwise add one
      if (!viewBox) {
        clonedSvg.setAttribute('viewBox', `${vbMinX} ${vbMinY} ${vbWidth} ${vbHeight}`);
      }

      tempContainer.appendChild(clonedSvg);
      document.body.appendChild(tempContainer);

      const svgRect = clonedSvg.getBoundingClientRect();

      validPaths.forEach((el, idx) => {
        let fill = el.getAttribute('fill');
        if (!fill) {
          let parent = el.parentElement;
          while (parent && parent.tagName.toLowerCase() !== 'svg') {
            const parentFill = parent.getAttribute('fill');
            if (parentFill) {
              fill = parentFill;
              break;
            }
            parent = parent.parentElement;
          }
        }
        fill = fill || options.defaultColor || '#0277bd';
        
        // Fallback generic grid positions if computation fails
        let bboxX = 201 + (idx % 4) * 67;
        let bboxY = 201 + Math.floor(idx / 4) * 67;
        let bboxW = 2 * 67;
        let bboxH = 1 * 67;

        try {
          const mountedEl = tempContainer.querySelector(`[data-hma-import-idx="${idx}"]`) as SVGGraphicsElement;
          if (mountedEl) {
            const elRect = mountedEl.getBoundingClientRect();
            if (elRect.width > 0 && elRect.height > 0) {
              // Calculate relative to SVG and account for viewBox offset
              bboxX = (elRect.x - svgRect.x) + vbMinX;
              bboxY = (elRect.y - svgRect.y) + vbMinY;
              bboxW = elRect.width;
              bboxH = elRect.height;
              
              // Handle Inlumenai Motion coordinates (offset to Matrix workspace)
              if (sourceType === 'inlumenai_motion') {
                bboxX = bboxX - 540 + 368.5;
                bboxY = bboxY - 540 + 368.5;
              }
            }
          }
        } catch (e) {
          // ignore getBoundingClientRect errors
        }

        let widthX = Math.max(0.25, Math.round((bboxW / UNIT) * 100) / 100);
        let heightX = Math.max(0.25, Math.round((bboxH / UNIT) * 100) / 100);

        shapes.push({
          id: `shape-path-${Date.now()}-${idx + 1}`,
          x: Math.round(bboxX * 10) / 10,
          y: Math.round(bboxY * 10) / 10,
          widthX,
          heightX,
          rot: 0, // Path internal geometry holds rotation, we treat as 0 bounding box
          color: fill === 'none' ? options.defaultColor || '#0277bd' : fill,
          wireframe: fill === 'none'
        });
      });

      document.body.removeChild(tempContainer);
    }
  }

  // Auto-center shapes if requested or if shapes fall completely outside 0..737
  if (shapes.length > 0 && options.autoCenter) {
    centerShapesInMatrix(shapes);
  } else if (shapes.length > 0) {
    const minX = Math.min(...shapes.map(s => s.x));
    const maxX = Math.max(...shapes.map(s => s.x + s.widthX * UNIT));
    const minY = Math.min(...shapes.map(s => s.y));
    const maxY = Math.max(...shapes.map(s => s.y + s.heightX * UNIT));

    // If completely out of bounds, automatically re-center to fit in the 11X grid
    if (minX < -200 || maxX > 1000 || minY < -200 || maxY > 1000) {
      centerShapesInMatrix(shapes);
      warnings.push('Las formas estaban fuera del campo visual y fueron centradas automáticamente en la retícula.');
    }
  }

  return {
    shapes,
    detectedCount: shapes.length,
    warnings,
    viewBox,
    sourceType
  };
}

/**
 * Centers an array of shapes in the 11X (737x737) matrix canvas
 */
export function centerShapesInMatrix(shapes: MatrixShape[]): void {
  if (shapes.length === 0) return;

  const minX = Math.min(...shapes.map(s => s.x));
  const maxX = Math.max(...shapes.map(s => s.x + s.widthX * UNIT));
  const minY = Math.min(...shapes.map(s => s.y));
  const maxY = Math.max(...shapes.map(s => s.y + s.heightX * UNIT));

  const bboxWidth = maxX - minX;
  const bboxHeight = maxY - minY;

  const targetCenterX = CANVAS_SIZE / 2; // 368.5
  const targetCenterY = CANVAS_SIZE / 2; // 368.5

  const currentCenterX = minX + bboxWidth / 2;
  const currentCenterY = minY + bboxHeight / 2;

  const shiftX = targetCenterX - currentCenterX;
  const shiftY = targetCenterY - currentCenterY;

  // Snap shift to closest 0.25X (16.75px)
  const snapUnit = 16.75;
  const snappedShiftX = Math.round(shiftX / snapUnit) * snapUnit;
  const snappedShiftY = Math.round(shiftY / snapUnit) * snapUnit;

  shapes.forEach(s => {
    s.x = Math.round((s.x + snappedShiftX) * 10) / 10;
    s.y = Math.round((s.y + snappedShiftY) * 10) / 10;
  });

  // Strict clamp to ensure no part of any shape is outside the grid [0, CANVAS_SIZE]
  shapes.forEach(s => {
    // Limit shape size to max canvas size to prevent impossible clamping
    if (s.widthX * UNIT > CANVAS_SIZE) s.widthX = Math.floor(CANVAS_SIZE / UNIT);
    if (s.heightX * UNIT > CANVAS_SIZE) s.heightX = Math.floor(CANVAS_SIZE / UNIT);

    if (s.x < 0) s.x = 0;
    if (s.y < 0) s.y = 0;
    
    if (s.x + s.widthX * UNIT > CANVAS_SIZE) {
      s.x = CANVAS_SIZE - s.widthX * UNIT;
    }
    if (s.y + s.heightX * UNIT > CANVAS_SIZE) {
      s.y = CANVAS_SIZE - s.heightX * UNIT;
    }

    // Final snap to guarantee alignment
    s.x = Math.round(s.x / snapUnit) * snapUnit;
    s.y = Math.round(s.y / snapUnit) * snapUnit;
  });
}
