import React, { useEffect, useRef } from 'react';
import { useAppState } from '../useAppState';
import { Play, Pause, Rewind, FastForward } from 'lucide-react';
import gsap from 'gsap';
import { M_UNIT, SHAPES } from '../constants';

export default function InlumenaiMotion({ state }: { state: ReturnType<typeof useAppState> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Setup GSAP animation Sequence (The Clock Metaphor)
    if (!containerRef.current) return;
    
    const elements = containerRef.current.querySelectorAll('.motion-piece');
    
    tl.current = gsap.timeline({ repeat: -1, paused: true });
    
    // Phase 1: Metamorphosis
    tl.current.to(elements, {
      duration: 1.5,
      scale: 1,
      rotation: (i) => state.pieces[i]?.rotation || 0,
      x: (i) => (state.pieces[i]?.x || 0) * M_UNIT,
      y: (i) => (state.pieces[i]?.y || 0) * M_UNIT,
      ease: 'power3.inOut',
      stagger: 0.05
    })
    // Phase 2: Hold
    .to({}, { duration: 2 })
    // Phase 3: Return to Clock
    .to(elements, {
      duration: 1.5,
      scale: 0.5,
      rotation: (i) => i * 30, // 360 / 12 (forming a clock circle)
      x: (i) => Math.sin(i * (Math.PI / 6)) * 200 + 400, // Circular distribution
      y: (i) => -Math.cos(i * (Math.PI / 6)) * 200 + 400,
      ease: 'power3.inOut',
    })
    // Phase 4: Convergence
    .to(elements, {
      duration: 1,
      x: 400,
      y: 400,
      rotation: 0,
      scale: 0,
      ease: 'back.in(1.5)',
      stagger: 0.02
    });

    return () => {
      tl.current?.kill();
    };
  }, [state.pieces]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
      {/* 1080x1080 canvas scaled to fit */}
      <div 
        className="aspect-square w-full max-w-[70vh] bg-black/40 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden"
        ref={containerRef}
      >
        {/* Render pieces initially at Convergence state */}
        <svg viewBox="0 0 800 800" className="w-full h-full">
          {state.pieces.map((piece, i) => {
            const shape = SHAPES[piece.typeId];
            if (!shape || !piece.visible) return null;
            return (
              <g 
                key={piece.id}
                className="motion-piece"
                // Initial state: center convergence
                transform={`translate(400, 400) scale(0)`}
              >
                <path d={shape.path} fill={piece.color} />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Timeline Controls */}
      <div className="mt-8 glass-panel px-6 py-4 flex items-center gap-6">
        <button onClick={() => tl.current?.timeScale(0.5)} className="text-white/60 hover:text-white transition-colors">
          <Rewind className="w-5 h-5" />
        </button>
        <button onClick={() => tl.current?.play()} className="w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30">
          <Play className="w-6 h-6 ml-1" />
        </button>
        <button onClick={() => tl.current?.pause()} className="text-white/60 hover:text-white transition-colors">
          <Pause className="w-5 h-5" />
        </button>
        <button onClick={() => tl.current?.timeScale(2)} className="text-white/60 hover:text-white transition-colors">
          <FastForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
