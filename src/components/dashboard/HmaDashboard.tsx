import React from 'react';
import { Grid3X3, Film, Layers, ArrowRight, X } from 'lucide-react';
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
  }[] = [
    {
      id: 'matrix',
      moduleNumber: 'MÓDULO 01',
      title: 'MATRIX STUDIO',
      description: 'Lienzo paramétrico 11x11, snap modular a retícula, cotas de ingeniería y exportación vectorial limpia.',
      icon: <Grid3X3 className="w-6 h-6 text-[#3D80FD]" />
    },
    {
      id: 'motion',
      moduleNumber: 'MÓDULO 02',
      title: 'INLUMENAI MOTION',
      description: 'Secuenciador cinético GSAP, interpolación orbital radial y animación procedural de isotipos canónicos.',
      icon: <Film className="w-6 h-6 text-[#3D80FD]" />
    },
    {
      id: 'canvas',
      moduleNumber: 'MÓDULO 03',
      title: 'ANIMATION CANVAS',
      description: 'Lienzo de capas SVG independientes, composición visual multicapa y render dinámico de video.',
      icon: <Layers className="w-6 h-6 text-[#3D80FD]" />
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
        className="relative z-10 w-full max-w-4xl rounded-3xl bg-[#091119]/85 backdrop-blur-2xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.85)] p-6 sm:p-10 lg:p-12 my-auto transition-all"
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
          <div className="relative mb-5 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0d1620] border border-white/15 shadow-xl flex items-center justify-center p-3 relative group">
              {/* Resplandor azul detrás del icono */}
              <div className="absolute inset-0 rounded-2xl bg-[#3D80FD]/15 blur-lg group-hover:bg-[#3D80FD]/25 transition-colors pointer-events-none" />
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
          <p className="mt-3 sm:mt-4 text-slate-300 text-xs sm:text-sm lg:text-base max-w-xl leading-relaxed">
            Plataforma de composición, animación y diseño vectorial SVG. Selecciona la sección de entorno de trabajo para iniciar.
          </p>
        </div>

        {/* Cuadrícula con las Tres Secciones (en vez de computadora y móvil) */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {sections.map((section) => {
            const isCurrent = currentSection === section.id;
            return (
              <div
                key={section.id}
                id={`dashboard-card-${section.id}`}
                onClick={() => onSelectSection(section.id)}
                className={`group relative rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 border ${
                  isCurrent
                    ? 'bg-[#122133] border-[#3D80FD] shadow-lg shadow-[#3D80FD]/20 ring-1 ring-[#3D80FD]/50'
                    : 'bg-[#0d1620]/90 hover:bg-[#121f2d] border-white/10 hover:border-[#3D80FD]/60 shadow-md hover:shadow-xl hover:shadow-[#3D80FD]/15 hover:-translate-y-1'
                }`}
              >
                {/* Resplandor superior en hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#3D80FD]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

                {/* Contenedor del Icono de la Sección */}
                <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 group-hover:border-[#3D80FD]/40 flex items-center justify-center mb-3.5 transition-colors shadow-inner">
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
                <p className="mt-2 text-xs text-slate-400 leading-relaxed flex-1">
                  {section.description}
                </p>

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
        <div className="mt-8 sm:mt-10 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3D80FD]" />
            <span>Colores HMA Master: Luz (#3D80FD) • Profundo (#2D60C1)</span>
          </div>
          <span>Módulo 1M = 67px • 13 Formas Canónicas</span>
        </div>
      </div>
    </div>
  );
};
