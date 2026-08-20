import { useEffect, useRef, useState } from "react";
import UploadZone from "@/components/UploadZone";
import ScannerAnimation from "@/components/ScannerAnimation";
import HoloCard from "@/components/HoloCard";
import { generateCatomon } from "@/lib/generator";
import type { Catomon } from "@/lib/types";
import { toPng } from "html-to-image";

type Stage = "idle" | "uploaded" | "scanning" | "ready";

const STORAGE_KEY = "catomon-pokedex-v1";

export default function App() {
  const [stage, setStage] = useState<Stage>("idle");
  const [photo, setPhoto] = useState<string | null>(null);
  const [catomon, setCatomon] = useState<Catomon | null>(null);
  const [pokedex, setPokedex] = useState<Catomon[]>([]);
  const [view, setView] = useState<"create" | "pokedex">("create");
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiOn, setAiOn] = useState<boolean>(true);
  const [savingFlash, setSavingFlash] = useState(false);
  const cardWrapRef = useRef<HTMLDivElement | null>(null);

  // Load pokedex from localStorage
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

    let aiData: Partial<Catomon> | null = null;
    let message: string | null = null;

    if (aiOn) {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: photo }),
        });
        const json = await res.json();
        if (json?.aiGenerated && json?.data) {
          aiData = json.data as Partial<Catomon>;
        } else if (json?.message) {
          message = json.message;
        }
      } catch (e) {
        console.warn("API недоступен, использую локальный генератор", e);
        message = "Сервер недоступен — используется локальный генератор.";
      }
    }

    // Маленькая задержка для анимации
    await new Promise((r) => setTimeout(r, 2800));

    const result = generateCatomon(photo, aiData ?? undefined);
    setCatomon(result);
    setAiMessage(message);
    setStage("ready");
  };

  const handleSave = () => {
    if (!catomon) return;
    setPokedex((prev) => {
      if (prev.some((c) => c.id === catomon.id)) return prev;
      return [catomon, ...prev];
    });
    setSavingFlash(true);
    setTimeout(() => setSavingFlash(false), 1400);
  };

  const handleDownload = async () => {
    if (!cardWrapRef.current || !catomon) return;
    try {
      const dataUrl = await toPng(cardWrapRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#000",
      });
      const link = document.createElement("a");
      link.download = `catomon-${catomon.name.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert("Не удалось скачать картинку :(");
    }
  };

  const handleReset = () => {
    setPhoto(null);
    setCatomon(null);
    setStage("idle");
    setAiMessage(null);
  };

  const handleDelete = (id: string) => {
    setPokedex((prev) => prev.filter((c) => c.id !== id));
  };

  const totalCatomon = pokedex.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-red-950 text-white animate-bg-move">
      {/* Decorative pokeball blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute right-[-100px] top-1/3 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border-2 border-white bg-red-500" style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }} />
              <div className="absolute inset-0 rounded-full border-2 border-white bg-white" style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }} />
              <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white" />
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white" />
            </div>
            <div>
              <h1 className="font-display text-lg leading-none text-white sm:text-xl">
                CATOMON
              </h1>
              <p className="font-mono text-[10px] text-white/60 sm:text-xs">
                Котики → Покемоны
              </p>
            </div>
          </div>
          <nav className="flex gap-2">
            <button
              onClick={() => setView("create")}
              className={`rounded-lg px-3 py-2 font-display text-[10px] font-bold transition sm:text-xs ${
                view === "create"
                  ? "bg-gradient-to-r from-red-500 to-amber-500 shadow-lg shadow-red-500/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              СОЗДАТЬ
            </button>
            <button
              onClick={() => setView("pokedex")}
              className={`rounded-lg px-3 py-2 font-display text-[10px] font-bold transition sm:text-xs ${
                view === "pokedex"
                  ? "bg-gradient-to-r from-red-500 to-amber-500 shadow-lg shadow-red-500/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              ПОКЕДЕКС ({totalCatomon})
            </button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {view === "create" && (
          <section>
            {stage === "idle" && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-block">
                    <span className="font-display text-3xl font-bold leading-tight sm:text-5xl bg-gradient-to-br from-amber-300 via-red-400 to-pink-500 bg-clip-text text-transparent">
                      ПРЕВРАТИ СВОЕГО КОТА
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl leading-tight text-white sm:text-4xl">
                    В ПОКЕМОНА!
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 sm:text-base">
                    Загрузи фото своего кота — и наш покедекс на базе AI создаст для него
                    уникальную карточку со статами, типом и суперспособностями.
                  </p>
                </div>

                <UploadZone onImage={handleImage} />

                <label className="mx-auto flex max-w-md cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 hover:bg-white/10">
                  <input
                    type="checkbox"
                    checked={aiOn}
                    onChange={(e) => setAiOn(e.target.checked)}
                    className="h-4 w-4 accent-amber-400"
                  />
                  <span>
                    Использовать AI для анализа фото (требует{" "}
                    <code className="rounded bg-black/40 px-1 py-0.5 text-[11px] text-amber-300">
                      OPENAI_API_KEY
                    </code>{" "}
                    на Vercel)
                  </span>
                </label>

                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                  <Feature icon="📸" title="1. Фоткай" desc="Сфоткай кота или загрузи уже готовое фото." />
                  <Feature icon="✨" title="2. Сканируй" desc="AI проанализирует окрас и выдаст карточку." />
                  <Feature icon="💾" title="3. Коллекционируй" desc="Собери полный покедекс своих котов!" />
                </div>
              </div>
            )}

            {stage === "uploaded" && photo && (
              <div className="flex flex-col items-center gap-6">
                <h2 className="font-display text-2xl sm:text-3xl">Фото загружено!</h2>
                <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-4 border-white/20 bg-black/30 p-1">
                  <img src={photo} alt="cat" className="w-full rounded-lg object-cover" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleScan}
                    className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-8 py-4 font-display text-sm font-bold shadow-lg shadow-emerald-500/30 transition hover:scale-105 sm:text-base"
                  >
                    🔬 ПРОСКАНИРОВАТЬ
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-xl bg-white/10 px-6 py-4 font-display text-sm font-bold ring-1 ring-white/20 transition hover:bg-white/20 sm:text-base"
                  >
                    Другое фото
                  </button>
                </div>
              </div>
            )}

            {stage === "scanning" && (
              <div className="py-8">
                <h2 className="mb-8 text-center font-display text-2xl sm:text-3xl">
                  АНАЛИЗ ДНК КОТА...
                </h2>
                <ScannerAnimation />
              </div>
            )}

            {stage === "ready" && catomon && (
              <div className="flex flex-col items-center gap-6">
                <h2 className="font-display text-2xl sm:text-3xl">
                  🎉 ВАШ CATOMON ГОТОВ!
                </h2>
                <div ref={cardWrapRef} className="animate-card-pop p-4 sm:p-6">
                  <HoloCard catomon={catomon} />
                </div>

                {aiMessage && (
                  <div className="max-w-lg rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-center text-xs text-amber-200 sm:text-sm">
                    ℹ️ {aiMessage}
                  </div>
                )}

                {savingFlash && (
                  <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-300 animate-fade-in">
                    ✅ Добавлено в Покедекс!
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleSave}
                    className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-display text-xs font-bold shadow-lg shadow-orange-500/30 transition hover:scale-105 sm:text-sm"
                  >
                    ⭐ В ПОКЕДЕКС
                  </button>
                  <button
                    onClick={handleDownload}
                    className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-display text-xs font-bold shadow-lg shadow-purple-500/30 transition hover:scale-105 sm:text-sm"
                  >
                    💾 СКАЧАТЬ PNG
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-xl bg-white/10 px-6 py-3 font-display text-xs font-bold ring-1 ring-white/20 transition hover:bg-white/20 sm:text-sm"
                  >
                    ➕ НОВЫЙ КОТ
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {view === "pokedex" && (
          <section>
            <div className="mb-8 text-center">
              <h2 className="font-display text-2xl sm:text-4xl">
                ТВОЙ ПОКЕДЕКС
              </h2>
              <p className="mt-2 text-sm text-white/60 sm:text-base">
                Поймано котов: <span className="font-bold text-amber-300">{totalCatomon}</span>
              </p>
            </div>

            {pokedex.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
                <div className="mb-4 text-6xl">🔴</div>
                <h3 className="font-display text-lg">Пусто!</h3>
                <p className="mt-2 text-sm text-white/60">
                  Ты ещё не создал ни одного Catomon. Самое время поймать своего первого кота!
                </p>
                <button
                  onClick={() => setView("create")}
                  className="mt-6 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 px-6 py-3 font-display text-xs font-bold shadow-lg transition hover:scale-105"
                >
                  НА ОХОТУ 🐾
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
                      title="Удалить"
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

      <footer className="relative z-10 mt-12 border-t border-white/10 py-6 text-center font-mono text-xs text-white/40">
        <p>Catomon © {new Date().getFullYear()} • Сделано с любовью к котам и покемонам 🐱❤️</p>
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
      <div className="mb-3 text-4xl">{icon}</div>
      <h3 className="font-display text-sm font-bold text-amber-300">{title}</h3>
      <p className="mt-2 text-xs text-white/70 sm:text-sm">{desc}</p>
    </div>
  );
}
