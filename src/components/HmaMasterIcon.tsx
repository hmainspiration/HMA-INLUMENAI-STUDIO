import React from 'react';
import { INITIAL_DATA } from '../data/canonicalLogos';

interface HmaMasterIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const HmaMasterIcon: React.FC<HmaMasterIconProps> = ({
  className = '',
  size = 48,
  glow = false
}) => {
  const masterLogo = INITIAL_DATA[0]; // hma-madre / HMA MASTER
  const shapes = masterLogo?.shapes || [];

  // Center of 1080x1080 canvas
  // Bounding box of shapes is centered around 540, 540 with width/height ~500px
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none opacity-60 transition-opacity"
          style={{
            background: 'radial-gradient(circle, rgba(61, 128, 253, 0.4) 0%, rgba(45, 96, 193, 0.15) 70%, transparent 100%)'
          }}
        />
      )}
      <svg
        viewBox="60 60 960 960"
        className="w-full h-full relative z-10 drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="hma-master-icon-group">
          {shapes.map((s, idx) => {
            const rx = s.width / 2;
            return (
              <rect
                key={s.id || idx}
                x={-s.width / 2}
                y={-s.length / 2}
                width={s.width}
                height={s.length}
                rx={rx}
                ry={rx}
                fill={s.color}
                transform={`translate(${s.x}, ${s.y}) rotate(${s.rotation})`}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
