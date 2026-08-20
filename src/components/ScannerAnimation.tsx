import { useI18n } from "@/lib/i18n";

export default function ScannerAnimation() {
  const { t } = useI18n();
  const STAGES = t.scanning.stages;
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
      <div className="relative h-40 w-40">
        {/* Spinning pokeball */}
        <div className="absolute inset-0 animate-spin-slow rounded-full border-4 border-white shadow-[0_0_40px_rgba(255,255,255,0.3)]">
          <div
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-red-500 to-red-700"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-full bg-gradient-to-b from-slate-100 to-slate-300"
          />
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-white" />
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-white shadow-inner">
            <div className="absolute inset-1 animate-pulse rounded-full border-2 border-slate-800 bg-white" />
          </div>
        </div>
        {/* Radar rings */}
        <div className="absolute inset-[-20px] animate-ping-slow rounded-full border-2 border-red-400/30" />
        <div className="absolute inset-[-40px] animate-ping-slow rounded-full border border-red-400/20 [animation-delay:0.5s]" />
      </div>

      <div className="w-full space-y-2 font-mono text-sm text-white/90">
        {STAGES.map((s, i) => (
          <div
            key={s}
            className="flex items-center gap-2 animate-fade-in"
            style={{ animationDelay: `${i * 0.4}s`, animationFillMode: "both" }}
          >
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" style={{ animationDelay: `${i * 0.4}s` }} />
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-full animate-progress rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 bg-[length:200%_100%]" />
      </div>
    </div>
  );
}
