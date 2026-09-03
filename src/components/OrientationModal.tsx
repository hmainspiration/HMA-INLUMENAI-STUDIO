/**
 * HMA INLUMENAI STUDIO (v2026.27)
 * User Orientation Guide & Workflow Documentation for Non-Programmers
 */

import React from 'react';
import {
  X,
  Sparkles,
  Layers,
  Film,
  Anchor,
  Download,
  Grid,
  Play,
  Video,
  FileCode,
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { APP_VERSION } from '../data/hmaDefinitions';

interface OrientationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: 'matrix' | 'motion' | 'canvas') => void;
}

export const OrientationModal: React.FC<OrientationModalProps> = ({
  isOpen,
  onClose,
  onSelectTool
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="w-full max-w-3xl rounded-2xl bg-[#060C04] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white tracking-tight">
                  Guía de Uso y Orientación Creativa
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {APP_VERSION}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aprende paso a paso cómo crear, animar y exportar tus isotipos sin necesidad de saber programar.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flujo de Trabajo en 3 Pasos */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            Flujo Creativo Integrado (De la Idea al Video Final)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Paso 1 */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center font-mono text-[11px]">
                  1
                </span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="font-bold text-white text-sm">HMA Matrix</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">

              </p>
              <button
                onClick={() => {
                  onSelectTool('matrix');
                  onClose();
                }}
                className="w-full py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold border border-cyan-500/40 flex items-center justify-center gap-1"
              >
                <span>Ir al Ensamblador</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Paso 2 */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center font-mono text-[11px]">
                  2
                </span>
                <Film className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="font-bold text-white text-sm">Motion</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Visualiza la animación oficial en <strong>"El Reloj de las 13 Formas"</strong> con sus 5 fases. Controla la velocidad (0.5x, 1x, 2x) y prueba la metamorfosis entre servicios.
              </p>
              <button
                onClick={() => {
                  onSelectTool('motion');
                  onClose();
                }}
                className="w-full py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[11px] font-bold border border-blue-500/40 flex items-center justify-center gap-1"
              >
                <span>Ir al Secuenciador</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Paso 3 */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center font-mono text-[11px]">
                  3
                </span>
                <Video className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="font-bold text-white text-sm">Canvas Animado</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Compón gráficos en formato <strong>16:9 (PC)</strong> o <strong>9:16 (Reels/TikTok)</strong>. Aplica físicas dinámicas (flotación, rebote, rotación) y <strong>graba video WebM</strong>.
              </p>
              <button
                onClick={() => {
                  onSelectTool('canvas');
                  onClose();
                }}
                className="w-full py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-bold border border-purple-500/40 flex items-center justify-center gap-1"
              >
                <span>Ir a Componer Video</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Guía de Funciones Clave */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            ¿Qué hace cada botón y función?
          </h3>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/50">
              <Anchor className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>

              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/50">
              <Grid className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Retícula Paramétrica (67px):</strong> 1 Módulo (1M) equivale exactamente a 67 píxeles. Puedes activar subretículas de 33.5px (0.5M) o 16.75px (0.25M) para alinear al milímetro.
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/50">
              <Download className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Menú Exportar:</strong> Te permite descargar tu diseño como <strong>SVG Limpio</strong>, <strong>Blueprint Técnico</strong> con cotas, <strong>PNG en Alta Definición (@2x / @4x)</strong> o guardar el archivo de proyecto en <strong>JSON</strong> para continuarlo después.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-[11px] font-mono text-slate-500">
            Sistema Oficial HMA INLUMENAI • {APP_VERSION}
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            Entendido, ¡Comenzar a Crear!
          </button>
        </div>
      </div>
    </div>
  );
};
