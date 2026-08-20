"use client";

import { useState } from "react";
import { getTypeMeta } from "@/lib/catmon-data";
import type { CatmonCard as Card } from "@/lib/types";

const STAT_COLOR = (v: number) =>
  v >= 90 ? "text-emerald-400" : v >= 60 ? "text-yellow-300" : "text-red-400";

function StatRow({ label, value }: { label: string; value: number }) {
  const max = 120;
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 text-[10px] font-bold tracking-widest text-slate-400">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-slate-700/70 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`w-8 text-right text-sm font-black tabular-nums ${STAT_COLOR(value)}`}>
        {value}
      </span>
    </div>
  );
}

export default function CatmonCard({ card }: { card: Card }) {
  const type = getTypeMeta(card.type);
  const total = card.hp + card.attack + card.defense + card.speed;
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="group relative block w-[300px] [perspective:1200px] text-left"
    >
      <div className="relative w-full transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: flipped ? "rotateY(180deg)" : "none" }}>
        {/* FRONT */}
        <div
          className="relative rounded-2xl p-3 ring-1 ring-white/20 shadow-lg transition-shadow group-hover:shadow-[0_0_40px_-5px_var(--tw-shadow-color)] [backface-visibility:hidden]"
          style={{
            background: `linear-gradient(160deg, ${type.color}, #0f172a 70%)`,
            boxShadow: `0 20px 50px -12px ${type.color}66`,
          }}
        >
          {/* Border frame */}
          <div className="rounded-xl border-4 border-yellow-400/70 bg-slate-900/60 p-3 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-300">CATMON · #{String(card.id).padStart(3, "0")}</p>
                <h3 className="text-2xl font-black text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">
                  {card.name}
                </h3>
              </div>
              {card.isShiny && (
                <span className="rounded-full bg-gradient-to-r from-amber-300 via-fuchsia-400 to-cyan-300 px-2 py-0.5 text-[10px] font-black text-slate-900 shadow">
                  ✦ SHINY
                </span>
              )}
            </div>

            {/* Type chip */}
            <span
              className="mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-slate-900"
              style={{ background: type.color }}
            >
              {type.emoji} {type.name}
            </span>

            {/* Art */}
            <div className="mt-3 relative overflow-hidden rounded-xl border-4 border-slate-700/70">
              <img
                src={card.imageData}
                alt={card.name}
                className="aspect-square w-full object-cover"
                draggable={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>

            {/* Stats */}
            <div className="mt-3 space-y-1.5">
              <StatRow label="HP" value={card.hp} />
              <StatRow label="ATK" value={card.attack} />
              <StatRow label="DEF" value={card.defense} />
              <StatRow label="SPD" value={card.speed} />
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2">
              <p className="text-[10px] text-slate-400">
                Base total: <span className="font-black text-white">{total}</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Tap to flip <span className="text-white">↻</span>
              </p>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 flex flex-col rounded-2xl p-3 ring-1 ring-white/20 bg-slate-800 [transform:rotateY(180deg)] [backface-visibility:hidden]"
        >
          <div className="flex h-full flex-col rounded-xl border-4 border-yellow-400/70 bg-slate-900/90 p-4">
            <p className="text-center text-[10px] font-bold tracking-widest text-slate-400">CATMONPCIA</p>
            <div className="mt-3 flex-1 overflow-y-auto text-sm text-slate-200 leading-relaxed">
              <p className="text-lg font-black text-white">{card.name}</p>
              <p className="mt-1">{card.description}</p>
            </div>
            {card.originalImageData && (
              <div className="mt-3 rounded-lg overflow-hidden border-2 border-slate-700">
                <p className="bg-slate-800 px-2 py-1 text-[9px] font-bold text-slate-400">ORIGINAL PHOTO</p>
                <img src={card.originalImageData} alt="original cat" className="h-24 w-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
