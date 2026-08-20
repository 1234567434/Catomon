import { useEffect, useRef, useState } from "react";
import { LANGS, useI18n } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/15 hover:text-white sm:px-3"
        aria-label="Language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden font-display text-[10px] uppercase sm:inline">
          {current.code}
        </span>
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl animate-fade-in">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm transition ${
                l.code === lang
                  ? "bg-gradient-to-r from-red-500/30 to-amber-500/20 text-amber-200"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <span className="text-lg">{l.flag}</span>
              <span className="font-medium">{l.label}</span>
              {l.code === lang && <span className="ml-auto text-amber-300">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
