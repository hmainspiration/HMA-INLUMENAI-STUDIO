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
  onSelectTool: (tool: 'motion' | 'canvas') => void;
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white tracking-tight">
                  Guía de Uso • INLUMENAI STUDIO
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {APP_VERSION}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aprende paso a paso cómo secuenciar, animar, componer y exportar videos de tus isotipos.
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

        {/* Flujo de Trabajo en 2 Pasos */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            Ecosistema Continuo (Secuenciación GSAP ➔ Compositor de Video)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Paso 1: Motion */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center font-mono text-xs shadow-md shadow-blue-500/30">
                  1
                </span>
                <Film className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="font-bold text-white text-base">Motion (GSAP Sequencer)</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Visualiza y reproduce la animación oficial de <strong>"El Reloj de las 13 Formas"</strong> con sus 5 fases canónicas. Controla la velocidad (0.5x, 1x, 2x), alterna entre los 13 isotipos y transfiere la animación con un solo clic.
              </p>
              <button
                onClick={() => {
                  onSelectTool('motion');
                  onClose();
                }}
                className="w-full py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 text-xs font-bold border border-blue-500/40 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Ir a Motion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Paso 2: Animation */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center font-mono text-xs shadow-md shadow-purple-500/30">
                  2
                </span>
                <Video className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="font-bold text-white text-base">Animation (Canvas & Video)</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Compón escenas dinámicas en formato <strong>16:9 (PC/Web)</strong> o <strong>9:16 (Reels/TikTok)</strong>. Aplica físicas de partículas, flotación suave, rotación continua y <strong>graba video WebM</strong> listo para publicar.
              </p>
              <button
                onClick={() => {
                  onSelectTool('canvas');
                  onClose();
                }}
                className="w-full py-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold border border-purple-500/40 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Ir a Animation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Guía de Funciones Clave */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
            Herramientas y Funcionalidades
          </h3>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/50 border border-white/5">
              <Film className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Secuencias Inlumenai:</strong> Reproducción matemática fluida con curvas de aceleración `power2.inOut` sincronizadas con los módulos de 67px.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/50 border border-white/5">
              <Video className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Grabación de Video & Modo Cine:</strong> Captura directa a 60 FPS en formato WebM de alta nitidez sin marcas de agua ni elementos de interfaz.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/50 border border-white/5">
              <Download className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Exportación Autónoma HTML:</strong> Descarga paquetes HTML interactivos que funcionan de forma 100% independiente en cualquier navegador.
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
            Entendido, ¡Comenzar!
          </button>
        </div>
      </div>
    </div>
  );
};
