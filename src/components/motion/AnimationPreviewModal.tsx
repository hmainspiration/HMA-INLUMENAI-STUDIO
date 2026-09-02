import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { LogoData, Shape } from "../../types";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Grid,
  LayoutTemplate,
} from "lucide-react";
import gsap from "gsap";
import { cn } from "../../lib/utils";

interface AnimationPreviewModalProps {
  logos: LogoData[];
  initialIndex: number;
  onClose: () => void;
}

const TARGET_CENTER = 540;
const CLOCK_RADIUS = 360;
const UNIT_M = 67;

function findPointPiece(shapes: Shape[]) {
  // Looks for the piece that is a perfect square (width == length)
  return shapes.find((s) => Math.abs(s.length - s.width) < 0.01) || shapes[0];
}

function calculateClockPositions(shapes: Shape[]) {
  const pointShape = findPointPiece(shapes);
  const otherShapes = shapes
    .filter((s) => s.id !== pointShape.id)
    .sort((a, b) => a.id.localeCompare(b.id));

  const map: Record<string, { x: number; y: number }> = {};
  otherShapes.forEach((shape, i) => {
    const hour = i + 1; // 1 to 12
    const angleRad = ((hour * 30 - 90) * Math.PI) / 180;
    map[shape.id] = {
      x: TARGET_CENTER + CLOCK_RADIUS * Math.cos(angleRad),
      y: TARGET_CENTER + CLOCK_RADIUS * Math.sin(angleRad),
    };
  });
  map[pointShape.id] = { x: TARGET_CENTER, y: TARGET_CENTER };
  return map;
}

export function AnimationPreviewModal({
  logos,
  initialIndex,
  onClose,
}: AnimationPreviewModalProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [currentLogoIdx, setCurrentLogoIdx] = useState(initialIndex);
  const [logoName, setLogoName] = useState("");
  const [phaseText, setPhaseText] = useState("");

  const [bgColor, setBgColor] = useState<"transparent" | "black" | "white">(
    "black",
  );
  const [showTemplates, setShowTemplates] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wasPlayingBeforeDrag, setWasPlayingBeforeDrag] = useState(false);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.set(".master-rotation-group", { svgOrigin: "540 540" });
      gsap.set(".clock-guides", { opacity: 0 });

      logos[0].shapes.forEach((shape) => {
        gsap.set(`.g-${shape.id}`, {
          x: TARGET_CENTER,
          y: TARGET_CENTER,
          rotation: 0,
        });
        gsap.set(`.rect-${shape.id}`, {
          attr: {
            width: UNIT_M,
            height: UNIT_M,
            x: -UNIT_M / 2,
            y: -UNIT_M / 2,
            rx: UNIT_M / 2,
            ry: UNIT_M / 2,
          },
          fill: isWireframe ? "transparent" : "#3D80FD",
          stroke: isWireframe ? "#3D80FD" : "none",
          strokeWidth: isWireframe ? 2 : 0,
          opacity: 0,
          scale: 0,
        });
      });

      tl.current = gsap.timeline({
        repeat: -1,
        onUpdate: function () {
          setProgress(this.progress());
        },
      });

      // Nacimiento inicial
      logos[0].shapes.forEach((shape, i) => {
        tl.current!.to(
          `.rect-${shape.id}`,
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "back.out(1.5)",
          },
          i * 0.02,
        );
      });

      logos.forEach((st, idx) => {
        const label = `state_${idx}`;
        const clockPos = calculateClockPositions(st.shapes);

        // Usamos una lista ordenada de shapes para asegurar que el despliegue hacia el reloj
        // sea secuencial y forme la espiral correctamente (sin importar el orden Z-index en st.shapes)
        const sortedShapes = [...st.shapes].sort((a, b) =>
          a.id.localeCompare(b.id),
        );

        // --- 1. FORMAR RELOJ ---
        tl.current!.addLabel(`${label}_clock`);
        tl.current!.call(() => {
          setCurrentLogoIdx(idx);
          setLogoName(st.serviceName);
          setPhaseText("RELOJ MECÁNICO");

          // Reordenar nodos DOM para respetar el z-index de este logo específico
          const parent = svgRef.current?.querySelector(".master-rotation-group");
          if (parent) {
            st.shapes.forEach((shape) => {
              const el = parent.querySelector(`.g-${shape.id}`);
              if (el) parent.appendChild(el);
            });
          }
        });

        tl.current!.set(".master-rotation-group", {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          svgOrigin: "540 540",
        });
        tl.current!.to(
          ".clock-guides",
          { opacity: showTemplates ? 1 : 0, duration: 0.4 },
          "<",
        );

        sortedShapes.forEach((shape) => {
          const target = clockPos[shape.id];
          tl.current!.to(
            `.rect-${shape.id}`,
            {
              fill: isWireframe ? "transparent" : shape.color,
              stroke: isWireframe ? shape.color : "none",
              strokeWidth: isWireframe ? 2 : 0,
              attr: {
                width: UNIT_M,
                height: UNIT_M,
                x: -UNIT_M / 2,
                y: -UNIT_M / 2,
                rx: UNIT_M / 2,
                ry: UNIT_M / 2,
              },
              duration: 0.4,
              ease: "power2.out",
            },
            "<",
          );
          tl.current!.to(
            `.g-${shape.id}`,
            {
              x: target.x,
              y: target.y,
              rotation: 0,
              duration: 1.1,
              ease: "power3.inOut",
            },
            "<0.015",
          );
        });
        tl.current!.to({}, { duration: 0.3 });

        // --- 2. METAMORFOSIS ---
        tl.current!.addLabel(`${label}_morph`);
        tl.current!.call(() => setPhaseText("METAMORFOSIS"));
        tl.current!.to(".clock-guides", { opacity: 0, duration: 0.4 }, "<");

        // Usamos st.shapes normal aquí para mantener el sentido de flujo natural, aunque sortedShapes funcionaría igual
        st.shapes.forEach((shape) => {
          tl.current!.to(
            `.g-${shape.id}`,
            {
              x: shape.x,
              y: shape.y,
              rotation: shape.rotation,
              duration: 1.3,
              ease: "power3.inOut",
            },
            `${label}_morph`,
          );
          tl.current!.to(
            `.rect-${shape.id}`,
            {
              attr: {
                width: shape.width,
                height: shape.length,
                x: -shape.width / 2,
                y: -shape.length / 2,
                rx: shape.width / 2,
                ry: shape.width / 2,
              },
              duration: 1.3,
              ease: "power3.inOut",
            },
            `${label}_morph`,
          );
        });

        // --- 3. ISOTIPO CONSOLIDADO ---
        tl.current!.addLabel(`${label}_complete`);
        tl.current!.call(() => setPhaseText("ISOTIPO CONSOLIDADO"));
        tl.current!.to({}, { duration: 2.0 }); // Tiempo de contemplación

        // --- 4. RETORNO ---
        tl.current!.addLabel(`${label}_return`);
        tl.current!.call(() => setPhaseText("RETORNO AL RELOJ"));
        tl.current!.to(".clock-guides", {
          opacity: showTemplates ? 0.8 : 0,
          duration: 0.3,
        });

        sortedShapes.forEach((shape) => {
          const target = clockPos[shape.id];
          tl.current!.to(
            `.g-${shape.id}`,
            {
              x: target.x,
              y: target.y,
              rotation: 0,
              duration: 0.9,
              ease: "power3.inOut",
            },
            "<0.01",
          );
          tl.current!.to(
            `.rect-${shape.id}`,
            {
              attr: {
                width: UNIT_M,
                height: UNIT_M,
                x: -UNIT_M / 2,
                y: -UNIT_M / 2,
                rx: UNIT_M / 2,
                ry: UNIT_M / 2,
              },
              duration: 0.9,
              ease: "power3.inOut",
            },
            "<",
          );
        });

        // --- 5. CONVERGENCIA CENTRAL ---
        tl.current!.addLabel(`${label}_collapse`);
        tl.current!.call(() => setPhaseText("CONVERGENCIA CENTRAL"));
        tl.current!.to(".clock-guides", { opacity: 0, duration: 0.2 }, "<");

        st.shapes.forEach((shape) => {
          tl.current!.to(
            `.g-${shape.id}`,
            {
              x: TARGET_CENTER,
              y: TARGET_CENTER,
              duration: 0.7,
              ease: "power3.inOut",
            },
            "<0.01",
          );
        });
        tl.current!.to({}, { duration: 0.1 });
      });

      // Jump to initial
      if (initialIndex > 0) {
        tl.current.seek(`state_${initialIndex}_complete`);
      }
    }, svgRef);

    return () => ctx.revert();
  }, [logos, initialIndex, isWireframe, showTemplates]);

  const togglePlay = () => {
    if (tl.current) {
      if (isPlaying) tl.current.pause();
      else tl.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const nextLogo = () => {
    if (tl.current) {
      const nextIdx = (currentLogoIdx + 1) % logos.length;
      tl.current.seek(`state_${nextIdx}_complete`);
      if (!isPlaying) tl.current.pause();
    }
  };

  const prevLogo = () => {
    if (tl.current) {
      const prevIdx = (currentLogoIdx - 1 + logos.length) % logos.length;
      tl.current.seek(`state_${prevIdx}_complete`);
      if (!isPlaying) tl.current.pause();
    }
  };

  const handleSpeed = (s: number) => {
    setSpeed(s);
    if (tl.current) tl.current.timeScale(s);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (tl.current) {
      tl.current.progress(val);
    }
  };

  const handleSeekStart = () => {
    if (tl.current) {
      setWasPlayingBeforeDrag(isPlaying);
      tl.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeekEnd = () => {
    if (tl.current && wasPlayingBeforeDrag) {
      tl.current.play();
      setIsPlaying(true);
    }
  };

  const clockTicks = Array.from({ length: 12 }).map((_, i) => {
    const h = i + 1;
    const rad = ((h * 30 - 90) * Math.PI) / 180;
    const x1 = TARGET_CENTER + (CLOCK_RADIUS - 10) * Math.cos(rad);
    const y1 = TARGET_CENTER + (CLOCK_RADIUS - 10) * Math.sin(rad);
    const x2 = TARGET_CENTER + (CLOCK_RADIUS + 10) * Math.cos(rad);
    const y2 = TARGET_CENTER + (CLOCK_RADIUS + 10) * Math.sin(rad);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#14E5C3"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    );
  });

  return (
    <div className="fixed inset-0 bg-neutral-950/95 z-50 flex flex-col font-sans backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/50 gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white uppercase">{logoName}</h2>
          <span className="text-xs text-blue-400 font-mono tracking-wider">
            {phaseText}
          </span>
        </div>

        {/* Render Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => setBgColor("transparent")}
              className={cn(
                "w-6 h-6 rounded-md mr-1 border border-neutral-700 transition-all bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3neF/wX5GBEVM4oZcAIYjYThYCwMhkYDE8wH0WhgMBr4AQDX5RE+w9G8wAAAAABJRU5ErkJggg==')]",
                bgColor === "transparent" && "ring-2 ring-blue-500",
              )}
              title="Fondo Transparente"
            />
            <button
              onClick={() => setBgColor("black")}
              className={cn(
                "w-6 h-6 rounded-md mr-1 border border-neutral-700 bg-black transition-all",
                bgColor === "black" && "ring-2 ring-blue-500",
              )}
              title="Fondo Negro"
            />
            <button
              onClick={() => setBgColor("white")}
              className={cn(
                "w-6 h-6 rounded-md mr-2 border border-neutral-300 bg-white transition-all",
                bgColor === "white" && "ring-2 ring-blue-500",
              )}
              title="Fondo Blanco"
            />
          </div>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={cn(
              "p-2 rounded-lg border flex items-center gap-2 transition-colors",
              showTemplates
                ? "bg-teal-600/20 border-teal-500 text-teal-400"
                : "bg-neutral-900 border-neutral-700 text-neutral-400",
            )}
          >
            <Grid size={16} />{" "}
            <span className="text-xs hidden sm:inline">Plantillas</span>
          </button>
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={cn(
              "p-2 rounded-lg border flex items-center gap-2 transition-colors",
              isWireframe
                ? "bg-blue-600/20 border-blue-500 text-blue-400"
                : "bg-neutral-900 border-neutral-700 text-neutral-400",
            )}
          >
            <LayoutTemplate size={16} />{" "}
            <span className="text-xs hidden sm:inline">Wireframe</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-neutral-400 hover:text-white bg-neutral-900 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
        <div
          className="w-full max-w-[800px] aspect-square relative rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center transition-colors duration-300"
          style={{
            backgroundColor:
              bgColor === "transparent" ? "transparent" : bgColor,
            backgroundImage:
              bgColor === "transparent"
                ? 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3neF/wX5GBEVM4oZcAIYjYThYCwMhkYDE8wH0WhgMBr4AQDX5RE+w9G8wAAAAABJRU5ErkJggg==")'
                : "none",
          }}
        >
          <svg
            viewBox="0 0 1080 1080"
            ref={svgRef}
            className="w-full h-full overflow-visible"
          >
            <defs>
              <pattern
                id="grid-pattern-preview"
                width="67"
                height="67"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 67 0 L 0 0 0 67"
                  fill="none"
                  className={cn(
                    "stroke-neutral-500",
                    bgColor === "white" ? "opacity-20" : "opacity-30",
                  )}
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <g
              className="master-box-group"
              style={{
                opacity: showTemplates ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            >
              <rect
                x="0"
                y="0"
                width="1080"
                height="1080"
                rx="48"
                fill="transparent"
              />
              <rect
                x="0"
                y="0"
                width="1080"
                height="1080"
                rx="48"
                fill="url(#grid-pattern-preview)"
                pointerEvents="none"
              />
              <rect
                x="0"
                y="0"
                width="1080"
                height="1080"
                rx="48"
                fill="none"
                className="stroke-neutral-500"
                strokeWidth="2"
                strokeDasharray="8 8"
                opacity="0.5"
              />
            </g>

            <g className="clock-guides">
              <circle
                cx="540"
                cy="540"
                r="360"
                fill="none"
                className="stroke-teal-500"
                strokeWidth="2"
                opacity="0.4"
                strokeDasharray="4 8"
              />
              {clockTicks}
              <circle cx="540" cy="540" r="5" fill="#14E5C3" opacity="0.8" />
            </g>

            <g className="master-rotation-group">
              {logos[0].shapes.map((shape) => (
                <g key={shape.id} className={`g-${shape.id}`}>
                  <rect className={`rect-${shape.id}`} />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* Controls Footer */}
      <div className="bg-neutral-900/50 border-t border-neutral-800 flex flex-col">
        {/* Timeline Slider */}
        <div className="w-full px-6 pt-4 pb-2 flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={handleSeek}
            onMouseDown={handleSeekStart}
            onMouseUp={handleSeekEnd}
            onTouchStart={handleSeekStart}
            onTouchEnd={handleSeekEnd}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
          />
        </div>

        <div className="p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={prevLogo}
              className="p-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition-colors"
            >
              <SkipBack size={18} />
            </button>
            <button
              onClick={togglePlay}
              className="px-6 py-3 bg-white text-black hover:bg-neutral-200 rounded-full font-bold flex items-center gap-2 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause size={18} /> Pausar
                </>
              ) : (
                <>
                  <Play size={18} /> Reproducir
                </>
              )}
            </button>
            <button
              onClick={nextLogo}
              className="p-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition-colors"
            >
              <SkipForward size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
            <span className="px-2">VELOCIDAD:</span>
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeed(s)}
                className={cn(
                  "px-2 py-1 rounded transition-colors",
                  speed === s
                    ? "bg-blue-600 text-white"
                    : "hover:bg-neutral-800 hover:text-white",
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
