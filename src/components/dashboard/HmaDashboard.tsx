import React from 'react';
import { Grid3X3, Film, Layers, ArrowRight, X, Sparkles, Sliders, Maximize2 } from 'lucide-react';
import { AppToolMode } from '../../types/hma';
import { APP_VERSION } from '../../data/hmaDefinitions';
import { HmaMasterIcon } from '../HmaMasterIcon';

interface HmaDashboardProps {
  onSelectSection: (section: AppToolMode) => void;
  currentSection?: AppToolMode;
  onClose?: () => void;
  canClose?: boolean;
}

export const HmaDashboard: React.FC<HmaDashboardProps> = ({
  onSelectSection,
  currentSection,
  onClose,
  canClose = false,
}) => {
  const sections: {
    id: AppToolMode;
    moduleNumber: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
    features?: string[];
  }[] = [
    {
      id: 'matrix',
      moduleNumber: 'MÓDULO 01',
      title: 'MATRIX STUDIO',
      badge: 'NUEVO • MALLA 0.25X',
      description: 'Lienzo paramétrico 11x11, malla horizontal y vertical desde 0.25X, paneles retráctiles para pantalla completa y gestor de formas canónicas.',
      icon: <Grid3X3 className="w-6 h-6 text-[#3D80FD]" />,
      features: ['Malla H/V a partir de 0.25X', 'Paneles Plegables (Zen Mode)', 'Eliminar Formas (Supr)', 'Cotas en Tiempo Real']
    },
    {
      id: 'motion',
      moduleNumber: 'MÓDULO 02',
      title: 'INLUMENAI MOTION',
      description: 'Secuenciador cinético GSAP, interpolación orbital radial y animación procedural de isotipos canónicos.',
      icon: <Film className="w-6 h-6 text-[#3D80FD]" />,
      features: ['Línea de Tiempo GSAP', 'Interpolación Radial', 'Curvas de Aceleración']
    },
    {
      id: 'canvas',
      moduleNumber: 'MÓDULO 03',
      title: 'ANIMATION CANVAS',
      description: 'Lienzo de capas SVG independientes, composición visual multicapa y render dinámico de video.',
      icon: <Layers className="w-6 h-6 text-[#3D80FD]" />,
      features: ['Capas SVG Múltiples', 'Exportador WebM / MP4', 'Control de Escena']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#040807]/95 backdrop-blur-md select-none overflow-y-auto">
      {/* Luces de fondo ambientales inspiradas en la paleta HMA Master (Esmeralda oscuro y Azul profundo) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Foco esmeralda oscuro en la esquina inferior izquierda */}
        <div
          className="absolute -bottom-32 -left-32 w-[550px] h-[550px] rounded-full blur-[140px] opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(6, 78, 59, 0.2) 60%, transparent 100%)' }}
        />
        {/* Foco azul HMA Master en la esquina superior derecha */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[140px] opacity-35 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(61, 128, 253, 0.45) 0%, rgba(45, 96, 193, 0.25) 60%, transparent 100%)' }}
        />
        {/* Viñeta oscura radial */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
      </div>

      {/* Tarjeta Central Glassmorphism idéntica a la referencia */}
      <div
        id="hma-initial-dashboard-card"
        className="relative z-10 w-full max-w-5xl rounded-3xl bg-[#091119]/90 backdrop-blur-2xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] p-6 sm:p-10 lg:p-12 my-auto transition-all"
      >
        {/* Botón opcional para cerrar si el usuario ya tiene una sesión abierta */}
        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="Cerrar y volver al editor"
          >
            <X size={18} />
          </button>
        )}

        {/* Cabecera Principal */}
        <div className="flex flex-col items-center text-center">
          {/* Icono de HMA MASTER en contenedor redondeado */}
          <div className="relative mb-4 sm:mb-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0d1620] border border-white/15 shadow-xl flex items-center justify-center p-3 relative group">
              {/* Resplandor azul detrás del icono */}
              <div className="absolute inset-0 rounded-2xl bg-[#3D80FD]/20 blur-xl group-hover:bg-[#3D80FD]/30 transition-colors pointer-events-none" />
              {/* Isotipo HMA MASTER oficial con colores #3D80FD y #2D60C1 */}
              <HmaMasterIcon size={64} glow />
            </div>
          </div>

          {/* Título en estilo de la imagen: HMA_INLUMENAI v2026.40 */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span>HMA_INLUMENAI</span>
            <span className="text-[#3D80FD] font-mono tracking-tight">
              {APP_VERSION}
            </span>
          </h1>

          {/* Subtítulo descriptivo */}
          <p className="mt-2.5 sm:mt-3 text-slate-300 text-xs sm:text-sm lg:text-base max-w-2xl leading-relaxed">
            Plataforma de composición paramétrica, animación y diseño vectorial SVG. Selecciona la sección de entorno de trabajo para iniciar.
          </p>
        </div>

        {/* Cuadrícula con las Tres Secciones */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {sections.map((section) => {
            const isCurrent = currentSection === section.id;
            const isMatrix = section.id === 'matrix';

            return (
              <div
                key={section.id}
                id={`dashboard-card-${section.id}`}
                onClick={() => onSelectSection(section.id)}
                className={`group relative rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 border overflow-hidden ${
                  isCurrent
                    ? 'bg-[#122133] border-[#3D80FD] shadow-xl shadow-[#3D80FD]/20 ring-1 ring-[#3D80FD]/60'
                    : isMatrix
                      ? 'bg-gradient-to-b from-[#0d1824] to-[#091119] hover:from-[#112030] hover:to-[#0d1620] border-[#3D80FD]/30 hover:border-[#3D80FD]/70 shadow-lg hover:shadow-2xl hover:shadow-[#3D80FD]/20 hover:-translate-y-1'
                      : 'bg-[#0d1620]/90 hover:bg-[#121f2d] border-white/10 hover:border-[#3D80FD]/50 shadow-md hover:shadow-xl hover:shadow-[#3D80FD]/15 hover:-translate-y-1'
                }`}
              >
                {/* Resplandor superior en hover */}
                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#3D80FD] to-transparent transition-opacity rounded-t-2xl ${
                  isMatrix ? 'opacity-80' : 'opacity-0 group-hover:opacity-100'
                }`} />

                {/* Badge opcional de módulo */}
                {section.badge && (
                  <div className="mb-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-[9px] font-bold tracking-wider animate-pulse">
                    {section.badge}
                  </div>
                )}

                {/* Mini Preview Técnica en la tarjeta de Matrix Studio */}
                {isMatrix && (
                  <div className="w-full h-16 mb-3 rounded-lg bg-[#070e14] border border-[#3D80FD]/25 relative overflow-hidden flex items-center justify-center p-2 group-hover:border-[#3D80FD]/50 transition-colors">
                    {/* Retícula SVG de fondo */}
                    <svg className="w-full h-full opacity-40 group-hover:opacity-65 transition-opacity" viewBox="0 0 100 40">
                      <line x1="0" y1="10" x2="100" y2="10" stroke="#3D80FD" strokeWidth="0.75" strokeDasharray="2 2" />
                      <line x1="0" y1="20" x2="100" y2="20" stroke="#3D80FD" strokeWidth="1" />
                      <line x1="0" y1="30" x2="100" y2="30" stroke="#3D80FD" strokeWidth="0.75" strokeDasharray="2 2" />
                      <line x1="25" y1="0" x2="25" y2="40" stroke="#3D80FD" strokeWidth="0.75" strokeDasharray="2 2" />
                      <line x1="50" y1="0" x2="50" y2="40" stroke="#3D80FD" strokeWidth="1" />
                      <line x1="75" y1="0" x2="75" y2="40" stroke="#3D80FD" strokeWidth="0.75" strokeDasharray="2 2" />
                      <rect x="42" y="12" width="16" height="16" rx="8" fill="#3D80FD" opacity="0.85" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070e14] via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-1 right-2 text-[8px] font-mono text-[#3D80FD] font-bold">GRID 11X • 0.25X</span>
                  </div>
                )}

                {/* Contenedor del Icono de la Sección */}
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 group-hover:border-[#3D80FD]/50 flex items-center justify-center mb-3 transition-colors shadow-inner">
                  {section.icon}
                </div>

                {/* Identificador del Módulo */}
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#3D80FD] mb-1">
                  {section.moduleNumber}
                </span>

                {/* Título de la Sección en mayúsculas estilo referencia */}
                <h3 className="text-base sm:text-lg font-black text-white tracking-wide group-hover:text-[#3D80FD] transition-colors">
                  {section.title}
                </h3>

                {/* Descripción funcional */}
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {section.description}
                </p>

                {/* Lista de características clave */}
                {section.features && (
                  <div className="mt-3.5 w-full pt-3 border-t border-white/10 flex flex-col gap-1 text-left">
                    {section.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-[#3D80FD]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Indicador de acción en pie de tarjeta */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#3D80FD] group-hover:translate-x-1 transition-transform">
                  <span>{isCurrent ? 'Sección Activa' : 'Iniciar Sección'}</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer / Info de marca */}
        <div className="mt-8 sm:mt-10 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3D80FD]" />
            <span>Colores HMA Master: Luz (#3D80FD) • Profundo (#2D60C1)</span>
          </div>
          <span>Módulo 1M = 67px • Malla Paramétrica a partir de 0.25X</span>
        </div>
      </div>
    </div>
  );
};
