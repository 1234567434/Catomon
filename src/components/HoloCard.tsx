import { useRef, useState, useEffect } from "react";
import type { Catomon } from "@/lib/types";
import { TYPE_META } from "@/lib/types";

interface Props {
  catomon: Catomon;
  size?: "sm" | "md" | "lg";
}

const RARITY_STYLES: Record<Catomon["rarity"], { label: string; glow: string; border: string }> = {
  common: { label: "Обычная", glow: "shadow-slate-400/30", border: "border-slate-300" },
  uncommon: { label: "Необычная", glow: "shadow-green-400/50", border: "border-green-400" },
  rare: { label: "Редкая", glow: "shadow-blue-500/60", border: "border-blue-400" },
  epic: { label: "Эпическая", glow: "shadow-purple-500/70", border: "border-purple-400" },
  legendary: { label: "★ ЛЕГЕНДАРНАЯ ★", glow: "shadow-amber-400/90 shadow-[0_0_60px_rgba(251,191,36,0.6)]", border: "border-amber-300" },
};

const SIZES = {
  sm: "w-full max-w-[220px]",
  md: "w-full max-w-[340px]",
  lg: "w-full max-w-[420px]",
};

export default function HoloCard({ catomon, size = "lg" }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [angle, setAngle] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const typeMeta = TYPE_META[catomon.type];
  const subtypeMeta = catomon.subtype ? TYPE_META[catomon.subtype] : null;
  const rarity = RARITY_STYLES[catomon.rarity];
  const totalStats =
    catomon.stats.hp +
    catomon.stats.attack +
    catomon.stats.defense +
    catomon.stats.speed +
    catomon.stats.special;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width;
      const py = y / rect.height;
      // rotate around center
      const rotY = (px - 0.5) * 18; // -9 .. +9 deg
      const rotX = (0.5 - py) * 18;
      setAngle({ x: rotX, y: rotY });
      setGlarePos({ x: px * 100, y: py * 100 });
    };
    const handleLeave = () => {
      setAngle({ x: 0, y: 0 });
      setGlarePos({ x: 50, y: 50 });
    };
    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative ${SIZES[size]} aspect-[3/4] select-none transition-transform duration-200 ease-out [transform-style:preserve-3d] drop-shadow-2xl ${rarity.glow}`}
      style={{
        transform: `perspective(1000px) rotateX(${angle.x}deg) rotateY(${angle.y}deg)`,
      }}
    >
      {/* Outer card */}
      <div
        className={`relative h-full w-full overflow-hidden rounded-2xl border-[3px] ${rarity.border} bg-gradient-to-br ${typeMeta.bg} p-2 sm:p-3`}
      >
        {/* Inner card */}
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border-2 border-yellow-300 bg-yellow-50">
          {/* Header: Name + HP */}
          <div className="flex items-center justify-between bg-gradient-to-b from-yellow-100 to-yellow-50 px-2.5 py-1.5 sm:px-3 sm:py-2">
            <h3 className="font-display text-[11px] font-bold tracking-wide text-slate-900 uppercase sm:text-sm">
              {catomon.name}
            </h3>
            <div className="flex items-center gap-1">
              <span className="font-display text-[10px] font-bold text-red-600 sm:text-xs">HP</span>
              <span className="font-mono text-sm font-extrabold text-red-600 sm:text-lg">
                {catomon.stats.hp}
              </span>
            </div>
          </div>

          {/* Photo window */}
          <div className={`relative mx-2 mt-1 sm:mx-3 overflow-hidden rounded-lg border-2 ${rarity.border} bg-gradient-to-br ${typeMeta.bg} p-1`}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-slate-900">
              <img
                src={catomon.photo}
                alt={catomon.name}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
              {/* Holo sheen */}
              <div
                className="pointer-events-none absolute inset-0 mix-blend-color-dodge opacity-40"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.85), rgba(255,255,255,0) 55%)`,
                }}
              />
              {/* Rainbow holographic overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  background: `linear-gradient(${glarePos.x}deg,
                    rgba(255,0,0,0.35),
                    rgba(255,165,0,0.3),
                    rgba(255,255,0,0.3),
                    rgba(0,128,0,0.3),
                    rgba(0,0,255,0.3),
                    rgba(75,0,130,0.3),
                    rgba(238,130,238,0.35)
                  )`,
                  transform: `translate(${(glarePos.x - 50) * 0.2}px, ${(glarePos.y - 50) * 0.2}px)`,
                }}
              />
              {/* Rarity badge */}
              <div className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-amber-300 backdrop-blur sm:text-[10px]">
                {rarity.label}
              </div>
            </div>

            {/* Type pills */}
            <div className="mt-1 flex items-center justify-between gap-1 px-1">
              <span
                className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white shadow-inner sm:text-[10px]"
                style={{ backgroundColor: typeMeta.color }}
              >
                <span>{typeMeta.emoji}</span>
                {typeMeta.label}
              </span>
              {subtypeMeta && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white shadow-inner sm:text-[10px]"
                  style={{ backgroundColor: subtypeMeta.color }}
                >
                  <span>{subtypeMeta.emoji}</span>
                  {subtypeMeta.label}
                </span>
              )}
              <span className="ml-auto font-mono text-[8px] text-slate-700 sm:text-[9px]">
                #{catomon.id.slice(0, 6)}
              </span>
            </div>
          </div>

          {/* Title + description */}
          <div className="mx-2 mt-2 flex-1 px-1 sm:mx-3">
            <div className="text-center font-display text-[9px] italic text-amber-700 sm:text-[11px]">
              «{catomon.title}»
            </div>
            <p className="mt-0.5 text-center font-mono text-[8px] leading-snug text-slate-700 sm:text-[10px]">
              {catomon.description}
            </p>
          </div>

          {/* Stats bars */}
          <div className="mx-2 mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 px-1 sm:mx-3 sm:gap-y-1">
            <StatBar label="АТК" value={catomon.stats.attack} color="#dc2626" />
            <StatBar label="ЗАЩ" value={catomon.stats.defense} color="#2563eb" />
            <StatBar label="СКР" value={catomon.stats.speed} color="#eab308" />
            <StatBar label="СПЦ" value={catomon.stats.special} color="#9333ea" />
          </div>

          {/* Moves */}
          <div className="mx-2 mt-1.5 mb-2 rounded-lg border border-slate-300 bg-white/80 p-1.5 sm:mx-3 sm:mt-2 sm:p-2">
            <div className="grid grid-cols-2 gap-1.5">
              {catomon.moves.map((move, i) => {
                const moveType = TYPE_META[move.type];
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-1.5 py-1"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm" style={{ color: moveType.color }}>
                        {moveType.emoji}
                      </span>
                      <span className="font-display text-[8px] font-bold leading-tight text-slate-800 sm:text-[10px]">
                        {move.name}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] font-bold text-slate-900 sm:text-[11px]">
                      {move.power}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between bg-yellow-100/80 px-2 py-1 font-mono text-[7px] text-slate-600 sm:px-3 sm:text-[9px]">
            <span>Рост {catomon.height}</span>
            <span>Вес {catomon.weight}</span>
            <span>Σ {totalStats}</span>
          </div>

          {/* Global holo sweep */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(105deg,
                transparent 30%,
                rgba(255,255,255,0.12) 40%,
                rgba(255,255,255,0.35) 50%,
                rgba(255,255,255,0.12) 60%,
                transparent 70%
              )`,
              backgroundSize: "200% 200%",
              backgroundPosition: `${glarePos.x}% ${glarePos.y}%`,
              mixBlendMode: "overlay",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(100, value);
  return (
    <div className="flex items-center gap-1">
      <span className="w-7 font-display text-[8px] font-bold text-slate-700 sm:w-8 sm:text-[10px]">
        {label}
      </span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 sm:h-2">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-5 text-right font-mono text-[8px] font-bold text-slate-800 sm:text-[10px]">
        {value}
      </span>
    </div>
  );
}
