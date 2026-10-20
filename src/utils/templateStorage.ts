/**
 * HMA INLUMENAI STUDIO - Template & Project Persistence Engine
 * Supports local persistence, auto-draft recovery, custom templates, and JSON backups.
 */
import { AnimatedLayer, HMAPiece, PaletteMode } from '../types/hma';

export interface CustomTemplate {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  canvasBgColor: string;
  aspectRatio: '16:9' | '21:9' | '9:16' | '1:1';
  layers: AnimatedLayer[];
  pieces?: HMAPiece[];
  paletteMode?: PaletteMode;
  colorLuz?: string;
  colorProfundo?: string;
  previewColors: string[];
}

export interface ActiveDraftState {
  version: string;
  savedAt: string;
  projectName: string;
  activePresetId: string;
  paletteMode: PaletteMode;
  canvasBgColor: string;
  aspectRatio: '16:9' | '21:9' | '9:16' | '1:1';
  canvasLayers: AnimatedLayer[];
  pieces: HMAPiece[];
}

const TEMPLATES_STORAGE_KEY = 'hma_inlumenai_custom_templates_v1';
const ACTIVE_DRAFT_KEY = 'hma_inlumenai_active_draft_v1';

/**
 * Extracts representative hex/rgba colors from layers and pieces for preview badges
 */
export function extractPreviewColors(layers: AnimatedLayer[], pieces?: HMAPiece[]): string[] {
  const colorSet = new Set<string>();

  // Extract from pieces
  if (pieces && pieces.length > 0) {
    for (const p of pieces) {
      if (p.color && p.color.startsWith('#') && colorSet.size < 5) {
        colorSet.add(p.color);
      }
    }
  }

  // Extract from layer SVG codes
  for (const l of layers) {
    if (colorSet.size >= 5) break;
    if (l.svgCode) {
      const hexMatches = l.svgCode.match(/#([0-9a-fA-F]{3,8})\b/g);
      if (hexMatches) {
        for (const hex of hexMatches) {
          if (colorSet.size < 5) {
            colorSet.add(hex);
          }
        }
      }
    }
  }

  // Fallback defaults if no colors detected
  if (colorSet.size === 0) {
    colorSet.add('#3D80FD');
    colorSet.add('#11D7B6');
  }

  return Array.from(colorSet);
}

/**
 * Get all custom templates saved by user
 */
export function getSavedTemplates(): CustomTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading custom templates from localStorage:', err);
    return [];
  }
}

/**
 * Save a new custom template or update existing
 */
export function saveCustomTemplate(
  templateData: Omit<CustomTemplate, 'id' | 'createdAt' | 'updatedAt' | 'previewColors'> & {
    id?: string;
  }
): CustomTemplate {
  const existingTemplates = getSavedTemplates();
  const now = new Date().toISOString();
  const previewColors = extractPreviewColors(templateData.layers, templateData.pieces);

  const id = templateData.id || `hma_tmpl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newTemplate: CustomTemplate = {
    ...templateData,
    id,
    previewColors,
    createdAt: now,
    updatedAt: now
  };

  const filtered = existingTemplates.filter((t) => t.id !== id);
  const updatedList = [newTemplate, ...filtered];

  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.error('Error saving template to localStorage:', err);
  }

  return newTemplate;
}

/**
 * Delete a custom template by ID
 */
export function deleteCustomTemplate(id: string): boolean {
  try {
    const existing = getSavedTemplates();
    const updated = existing.filter((t) => t.id !== id);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('Error deleting template from localStorage:', err);
    return false;
  }
}

/**
 * Export a single template as downloadable JSON file
 */
export function exportTemplateToJson(template: CustomTemplate) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(template, null, 2));
  const downloadAnchor = document.createElement('a');
  const sanitizedName = template.name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `HMA_PLANTILLA_${sanitizedName}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Save current active canvas draft (debounced auto-save)
 */
export function saveActiveDraft(draft: Omit<ActiveDraftState, 'version' | 'savedAt'>): void {
  try {
    const payload: ActiveDraftState = {
      ...draft,
      version: '3.0',
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(ACTIVE_DRAFT_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Could not auto-save active draft to localStorage:', err);
  }
}

/**
 * Load active canvas draft from storage
 */
export function loadActiveDraft(): ActiveDraftState | null {
  try {
    const raw = localStorage.getItem(ACTIVE_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.canvasLayers)) {
      return parsed as ActiveDraftState;
    }
    return null;
  } catch (err) {
    console.error('Error loading active draft from localStorage:', err);
    return null;
  }
}

/**
 * Clear active draft
 */
export function clearActiveDraft(): void {
  try {
    localStorage.removeItem(ACTIVE_DRAFT_KEY);
  } catch (err) {
    console.warn('Error clearing active draft:', err);
  }
}
