import { useEffect, useRef, useState } from "react";
import UploadZone from "@/components/UploadZone";
import ScannerAnimation from "@/components/ScannerAnimation";
import HoloCard from "@/components/HoloCard";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LanguageProvider } from "@/components/LanguageProvider";
import ApiKeyPanel, { getStoredKey } from "@/components/ApiKeyPanel";
import { generateCatomon } from "@/lib/generator";
import { analyzeImage, type ImageAnalysis } from "@/lib/imageAnalysis";
import { useI18n } from "@/lib/i18n";
import type { Catomon } from "@/lib/types";
import { toPng } from "html-to-image";

type Stage = "idle" | "uploaded" | "scanning" | "ready";
const STORAGE_KEY = "catomon-pokedex-v1";

export default function App() {
  return (
    <LanguageProvider>
      <CatomonApp />
    </LanguageProvider>
  );
}

function CatomonApp() {
  const { t, lang } = useI18n();
  const [stage, setStage] = useState<Stage>("idle");
  const [photo, setPhoto] = useState<string | null>(null);
  const [catomon, setCatomon] = useState<Catomon | null>(null);
  const [pokedex, setPokedex] = useState<Catomon[]>([]);
  const [view, setView] = useState<"create" | "pokedex">("create");
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"local" | "ai">("local");
  const [savingFlash, setSavingFlash] = useState(false);
  const cardWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPokedex(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pokedex));
    } catch {}
  }, [pokedex]);

  const handleImage = (dataUrl: string) => {
    setPhoto(dataUrl);
    setCatomon(null);
    setStage("uploaded");
    setAiMessage(null);
  };

  const handleScan = async () => {
    if (!photo) return;
    setStage("scanning");

    let aiData: Partial<Catomon> | undefined;
    let analysis: ImageAnalysis | undefined;
    let message: string | null = null;

    // 1. Локальный анализ пикселей — работает всегда, бесплатно
    try {
      analysis = await analyzeImage(photo);
    } catch (e) {
      console.warn("Local analysis failed", e);
    }

    // 2. Опционально дополняем текстом от OpenAI
    if (mode === "ai") {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: photo, lang, apiKey: getStoredKey() }),
        });
        const json = await res.json();
        if (json?.aiGenerated && json?.data) {
          aiData = json.data as Partial<Catomon>;
        } else {
          const reason = json?.reason as string | undefined;
          const detail: Record<string, string> = {
            invalid_key: "❌ Ключ отклонён Google (invalid API key). Создайте новый в AI Studio.",
            rate_limit: "⏳ Превышен бесплатный лимит Gemini. Попробуйте через минуту.",
            parse_error: "Модель вернула неожиданный ответ.",
            empty_response: "Модель не вернула ответ (возможно, сработал фильтр).",
            bad_image: "Не удалось прочитать изображение.",
          };
          message = detail[reason ?? ""] ?? t.msg.noKey;
        }
      } catch (e) {
        console.warn("API unavailable, using local analysis", e);
        message = t.msg.serverDown;
      }
    }

    await new Promise((r) => setTimeout(r, 2600));

    setCatomon(generateCatomon(photo, lang, analysis, aiData));
    setAiMessage(message);
    setStage("ready");
  };

  const handleSave = () => {
    if (!catomon) return;
    setPokedex((prev) =>
      prev.some((c) => c.id === catomon.id) ? prev : [catomon, ...prev]
    );
    setSavingFlash(true);
    setTimeout(() => setSavingFlash(false), 1400);
  };

  const handleDownload = async () => {
    if (!cardWrapRef.current || !catomon) return;
    try {
      const dataUrl = await toPng(cardWrapRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0b1020",
      });
      const link = document.createElement("a");
      link.download = `catomon-${catomon.name.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert(t.msg.downloadFail);
    }
  };

  const handleReset = () => {
    setPhoto(null);
    setCatomon(null);
    setStage("idle");
    setAiMessage(null);
  };

  const handleDelete = (id: string) =>
    setPokedex((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-red-950 text-white animate-bg-move">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute right-[-100px] top-1/3 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10">
              <div className="absolute inset-0 rounded-full border-2 border-white bg-red-500" style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }} />
              <div className="absolute inset-0 rounded-full border-2 border-white bg-white" style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }} />
              <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white" />
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white" />
            </div>
            <div>
              <h1 className="font-display text-base leading-none text-white sm:text-xl">
                {t.meta.title}
              </h1>
              <p className="mt-1 font-mono text-[9px] text-white/60 sm:text-xs">
                {t.meta.subtitle}
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setView("create")}
              className={`rounded-lg px-2.5 py-2 font-display text-[9px] font-bold transition sm:px-3 sm:text-xs ${
                view === "create"
                  ? "bg-gradient-to-r from-red-500 to-amber-500 shadow-lg shadow-red-500/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t.nav.create}
            </button>
            <button
              onClick={() => setView("pokedex")}
              className={`rounded-lg px-2.5 py-2 font-display text-[9px] font-bold transition sm:px-3 sm:text-xs ${
                view === "pokedex"
                  ? "bg-gradient-to-r from-red-500 to-amber-500 shadow-lg shadow-red-500/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t.nav.pokedex} ({pokedex.length})
            </button>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {view === "create" && (
          <section>
            {stage === "idle" && (
              <div className="space-y-8">
                <div className="text-center">
                  <span className="font-display text-2xl font-bold leading-tight sm:text-5xl bg-gradient-to-br from-amber-300 via-red-400 to-pink-500 bg-clip-text text-transparent">
                    {t.hero.line1}
                  </span>
                  <h2 className="mt-3 font-display text-xl leading-tight text-white sm:text-4xl">
                    {t.hero.line2}
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 sm:text-base">
                    {t.hero.sub}
                  </p>
                </div>

                <UploadZone onImage={handleImage} />

                <div className="mx-auto max-w-2xl">
                  <p className="mb-3 text-center font-display text-[10px] uppercase tracking-wider text-white/50">
                    {t.mode.title}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ModeCard
                      active={mode === "local"}
                      onClick={() => setMode("local")}
                      icon="🔬"
                      name={t.mode.localName}
                      desc={t.mode.localDesc}
                      badge={t.mode.localBadge}
                      badgeClass="bg-emerald-500/20 text-emerald-300 ring-emerald-400/30"
                      activeRing="ring-emerald-400/60 bg-emerald-400/10"
                    />
                    <ModeCard
                      active={mode === "ai"}
                      onClick={() => setMode("ai")}
                      icon="🧠"
                      name={t.mode.aiName}
                      desc={t.mode.aiDesc}
                      badge={t.mode.aiBadge}
                      badgeClass="bg-amber-500/20 text-amber-300 ring-amber-400/30"
                      activeRing="ring-amber-400/60 bg-amber-400/10"
                    />
                  </div>
                  {mode === "ai" && <ApiKeyPanel />}
                </div>

                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                  {t.features.map((f, i) => (
                    <Feature key={i} icon={["📸", "✨", "💾"][i]} title={f.title} desc={f.desc} />
                  ))}
                </div>
              </div>
            )}

            {stage === "uploaded" && photo && (
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-center font-display text-xl sm:text-3xl">
                  {t.uploaded.title}
                </h2>
                <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-4 border-white/20 bg-black/30 p-1">
                  <img src={photo} alt="cat" className="w-full rounded-lg object-cover" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleScan}
                    className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-8 py-4 font-display text-xs font-bold shadow-lg shadow-emerald-500/30 transition hover:scale-105 sm:text-base"
                  >
                    {t.uploaded.scan}
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-xl bg-white/10 px-6 py-4 font-display text-xs font-bold ring-1 ring-white/20 transition hover:bg-white/20 sm:text-base"
                  >
                    {t.uploaded.other}
                  </button>
                </div>
              </div>
            )}

            {stage === "scanning" && (
              <div className="py-8">
                <h2 className="mb-8 text-center font-display text-lg sm:text-3xl">
                  {t.scanning.title}
                </h2>
                <ScannerAnimation />
              </div>
            )}

            {stage === "ready" && catomon && (
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-center font-display text-lg sm:text-3xl">
                  {t.ready.title}
                </h2>
                <div ref={cardWrapRef} className="animate-card-pop p-4 sm:p-6">
                  <HoloCard catomon={catomon} />
                </div>

                <ScanReport catomon={catomon} />

                {aiMessage && (
                  <div className="max-w-lg rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-center text-xs text-amber-200 sm:text-sm">
                    ℹ️ {aiMessage}
                  </div>
                )}

                {savingFlash && (
                  <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-300 animate-fade-in">
                    {t.ready.saved}
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleSave}
                    className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 font-display text-[10px] font-bold shadow-lg shadow-orange-500/30 transition hover:scale-105 sm:text-sm"
                  >
                    {t.ready.save}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 font-display text-[10px] font-bold shadow-lg shadow-purple-500/30 transition hover:scale-105 sm:text-sm"
                  >
                    {t.ready.download}
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-xl bg-white/10 px-5 py-3 font-display text-[10px] font-bold ring-1 ring-white/20 transition hover:bg-white/20 sm:text-sm"
                  >
                    {t.ready.again}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {view === "pokedex" && (
          <section>
            <div className="mb-8 text-center">
              <h2 className="font-display text-xl sm:text-4xl">{t.pokedex.title}</h2>
              <p className="mt-3 text-sm text-white/60 sm:text-base">
                {t.pokedex.caught}{" "}
                <span className="font-bold text-amber-300">{pokedex.length}</span>
              </p>
            </div>

            {pokedex.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center sm:p-12">
                <div className="mb-4 text-6xl">🔴</div>
                <h3 className="font-display text-base sm:text-lg">{t.pokedex.emptyTitle}</h3>
                <p className="mx-auto mt-3 max-w-sm text-sm text-white/60">
                  {t.pokedex.emptyDesc}
                </p>
                <button
                  onClick={() => setView("create")}
                  className="mt-6 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 font-display text-[10px] font-bold shadow-lg transition hover:scale-105 sm:text-xs"
                >
                  {t.pokedex.emptyBtn}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pokedex.map((c) => (
                  <div key={c.id} className="group relative w-full max-w-sm">
                    <HoloCard catomon={c} size="md" />
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="absolute right-2 top-2 z-10 rounded-full bg-red-500/80 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                      title={t.pokedex.delete}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="relative z-10 mt-12 border-t border-white/10 py-6 text-center font-mono text-[10px] text-white/40 sm:text-xs">
        <p>
          Catomon © {new Date().getFullYear()} • {t.footer}
        </p>
      </footer>
    </div>
  );
}

function ModeCard({
  active,
  onClick,
  icon,
  name,
  desc,
  badge,
  badgeClass,
  activeRing,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  name: string;
  desc: string;
  badge: string;
  badgeClass: string;
  activeRing: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative rounded-2xl border p-4 text-left transition ${
        active
          ? `border-transparent ring-2 ${activeRing}`
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[10px] font-bold text-white sm:text-[11px]">
              {name}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 font-display text-[7px] ring-1 ${badgeClass}`}
            >
              {badge}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-snug text-white/60 sm:text-xs">{desc}</p>
        </div>
        <span
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
            active ? "border-white bg-white" : "border-white/30"
          }`}
        >
          {active && <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />}
        </span>
      </div>
    </button>
  );
}

function ScanReport({ catomon }: { catomon: Catomon }) {
  const { t } = useI18n();
  const a = catomon.analysis;
  if (!a) return null;

  const rows = [
    { label: t.report.brightness, value: a.brightness, color: "#fbbf24" },
    { label: t.report.contrast, value: a.contrast, color: "#38bdf8" },
    { label: t.report.fluff, value: a.detail, color: "#c084fc" },
  ];

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-display text-[9px] uppercase tracking-wider text-emerald-300">
          🔬 {t.report.title}
        </h4>
        <div className="flex gap-1">
          {a.palette.map((c, i) => (
            <span
              key={i}
              className="h-4 w-4 rounded border border-white/20"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-[11px] text-white/60">{t.report.color}:</span>
        <span
          className="h-5 w-5 rounded-full border-2 border-white/30"
          style={{ backgroundColor: a.dominantHex }}
        />
        <code className="font-mono text-[11px] text-white/80">{a.dominantHex}</code>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <span className="w-20 shrink-0 text-[10px] text-white/60 sm:text-[11px]">
              {r.label}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.round(r.value * 100)}%`, backgroundColor: r.color }}
              />
            </div>
            <span className="w-8 text-right font-mono text-[10px] text-white/70">
              {Math.round(r.value * 100)}%
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-[10px] leading-snug text-white/40">
        {t.report.note}
      </p>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
      <div className="mb-3 text-4xl">{icon}</div>
      <h3 className="font-display text-[11px] font-bold text-amber-300 sm:text-sm">{title}</h3>
      <p className="mt-2 text-xs text-white/70 sm:text-sm">{desc}</p>
    </div>
  );
}
