"use client";

import { useRef, useState } from "react";
import { Camera, Sparkles, Trash2, ImagePlus, Loader2, RefreshCw, Download } from "lucide-react";
import type { CatmonCard } from "@/lib/types";
import CardView from "./CatmonCard";
import { toPng } from "html-to-image";

const FUR_COLORS = [
  "cinnamon orange",
  "ginger tabby",
  "calico",
  "gray tuxedo",
  "snow white",
  "jet black",
  "tortoiseshell",
  "golden cream",
  "blue siamese",
  "pointed brown",
];

const VIBES = [
  "playful",
  "majestic",
  "sleepy",
  "mischievous",
  "royal",
  "adventurous",
  "goofy",
];

interface Props {
  initialCards: CatmonCard[];
}

export default function CatmonStudio({ initialCards }: Props) {
  const [cards, setCards] = useState<CatmonCard[]>(initialCards);
  const [photo, setPhoto] = useState<string | null>(null);
  const [furColor, setFurColor] = useState<string>("cinnamon orange");
  const [vibe, setVibe] = useState<string>("playful");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<CatmonCard | null>(null);
  const [phase, setPhase] = useState<"idle" | "generating" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<CatmonCard | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  async function onDownload() {
    if (!previewRef.current || !preview) return;
    try {
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement("a");
      link.download = `${preview.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    }
  }

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhoto(dataUrl);
      // Produce a small thumbnail to send to the server.
      makeThumb(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function makeThumb(dataUrl: string) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 160;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const scale = Math.max(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      setPendingPhoto(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = dataUrl;
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) readFile(file);
  }

  async function onGenerate() {
    setLoading(true);
    setPhase("generating");
    setError(null);
    try {
      const res = await fetch("/api/catmons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ furColor, vibe, photoThumb: pendingPhoto ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не удалось создать карточку");
      const card: CatmonCard = data.card;
      setPreview(card);
      setPendingImage(card);
      setPhase("done");
    } catch (e) {
      setPhase("error");
      setError(e instanceof Error ? e.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  }

  async function onSave() {
    if (!pendingImage) return;
    setCards((prev) => [pendingImage, ...prev]);
    setPreview(null);
    setPendingImage(null);
    setPhase("idle");
  }

  async function onDelete(id: number) {
    setCards((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/catmons/${id}`, { method: "DELETE" });
    } catch {
      // ignore
    }
  }

  const generating = loading && phase === "generating";

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24">
      {/* Studio grid */}
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* CONTROL PANEL */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur">
          <h2 className="text-xl font-black text-white">Создать Catmon 🐾</h2>
          <p className="mt-1 text-sm text-slate-400">
            Загрузи фото своего кота или выбери характеристики — нейросеть превратит его в легендарную карточку.
          </p>

          {/* Photo upload */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className={`mt-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 transition ${
              photo ? "border-emerald-400/60 bg-emerald-400/5" : "border-white/20 bg-slate-800/40 hover:border-white/40"
            }`}
          >
            {photo ? (
              <div className="flex w-full items-center gap-3">
                <img src={photo} alt="cat" className="h-20 w-20 rounded-xl object-cover ring-2 ring-white/20" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Твой кот ✓</p>
                  <p className="text-xs text-slate-400">Он станет основой для карточки</p>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPendingPhoto(null);
                    }}
                    className="mt-1 text-xs font-medium text-rose-400 hover:underline"
                  >
                    Убрать фото
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="pointer-events-none flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                  <ImagePlus />
                </div>
                <p className="mt-2 text-sm font-semibold text-white">Перетащи фото кота сюда</p>
                <p className="text-xs text-slate-500">или</p>
                <label className="mt-2 cursor-pointer rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-500">
                  <span className="flex items-center gap-2">
                    <Camera /> Выбрать / сфотографировать
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) readFile(f);
                    }}
                  />
                </label>
                <p className="mt-2 text-[10px] text-slate-500">Можно без фото — карточка создастся сама</p>
              </>
            )}
          </div>

          {/* Fur color */}
          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-slate-400">Окрас шерсти</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {FUR_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFurColor(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  furColor === c
                    ? "bg-violet-500 text-white shadow-lg shadow-violet-500/40"
                    : "bg-slate-800 text-slate-300 ring-1 ring-white/10 hover:bg-slate-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Vibe */}
          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-slate-400">Характер</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVibe(v)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  vibe === v
                    ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/40"
                    : "bg-slate-800 text-slate-300 ring-1 ring-white/10 hover:bg-slate-700"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Generate */}
          <button
            type="button"
            onClick={onGenerate}
            disabled={generating}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 px-6 py-3.5 text-lg font-black text-white shadow-xl shadow-fuchsia-500/30 transition hover:brightness-110 disabled:opacity-60"
          >
            {generating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Нейросеть рисует...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" /> Создать карточку
              </>
            )}
          </button>

          {generating && (
            <div className="mt-4 space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-1/2 animate-[loadingbar_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-violet-500 to-amber-400" />
              </div>
              <p className="text-center text-xs text-slate-500">
                Генерация может занять до 30 секунд. Магия требует времени ✨
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-300 ring-1 ring-rose-500/30">{error}</div>
          )}

          {/* Result actions */}
          {phase === "done" && preview && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onSave}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white transition hover:bg-emerald-400"
              >
                💾 Сохранить
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setPendingImage(null);
                  setPhase("idle");
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 font-bold text-white ring-1 ring-white/10 transition hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4" /> Ещё раз
              </button>
            </div>
          )}
        </div>

        {/* PREVIEW */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            {preview ? (
              <div className="flex flex-col items-center gap-3">
                <div ref={previewRef} className="animate-[fadein_0.6s_ease]">
                  <CardView card={preview} />
                </div>
                <button
                  type="button"
                  onClick={onDownload}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20"
                >
                  <Download className="h-4 w-4" /> Скачать PNG
                </button>
              </div>
            ) : (
              <div className="flex h-[520px] w-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-slate-900/40 p-6 text-center">
                <img src="/images/hero-cat.png" alt="art" className="h-40 w-40 object-contain opacity-60" />
                <p className="mt-4 font-black text-white">Здесь появится твоя карточка</p>
                <p className="mt-1 text-sm text-slate-400">
                  Выбери стиль и нажми «Создать карточку». Можешь листать карточку — она 3D!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <div className="mt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-black text-white">🃏 Моя коллекция</h2>
          <span className="text-sm font-bold text-slate-400">{cards.length} карточек</span>
        </div>
        {cards.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-slate-900/50 p-8 text-center text-slate-400 ring-1 ring-white/5">
            Пока пусто. Создай первую карточку выше! 🐈
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <div key={c.id} className="relative">
                <CardView card={c} />
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg ring-2 ring-black/30 transition hover:bg-rose-400"
                  title="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes loadingbar { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes fadein { 0%{opacity:0;transform:scale(.9)} 100%{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}


