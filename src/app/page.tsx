import { db } from "@/db";
import { catmons } from "@/db/schema";
import { desc } from "drizzle-orm";
import CatmonStudio from "@/components/CatmonStudio";
import type { CatmonCard } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rows = await db.select().from(catmons).orderBy(desc(catmons.createdAt), desc(catmons.id));

  const cards: CatmonCard[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    description: r.description,
    imageData: r.imageData,
    originalImageData: r.originalImageData,
    hp: r.hp,
    attack: r.attack,
    defense: r.defense,
    speed: r.speed,
    isShiny: r.is_shiny,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <header className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 20%, rgba(168,85,247,.4), transparent 40%), radial-gradient(circle at 80% 10%, rgba(251,191,36,.3), transparent 40%), radial-gradient(circle at 50% 90%, rgba(34,211,238,.25), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 lg:py-24">
          <div className="flex flex-col items-center text-center">
            <img src="/images/logo-cat.png" alt="Catmon logo" className="h-24 w-24 rounded-full ring-4 ring-amber-400/50 shadow-[0_0_40px_rgba(251,191,36,.4)]" />
            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                Catmon Lab
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              Преврати своего кота в легендарную коллекционную карточку с помощью нейросети!
              Фоткай, стилизуй, собирай свою банду. 🐾
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
              <span className="rounded-full bg-white/10 px-4 py-1.5 ring-1 ring-white/15">📸 Нейро-стилизация</span>
              <span className="rounded-full bg-white/10 px-4 py-1.5 ring-1 ring-white/15">🔥 18 стихий типов</span>
              <span className="rounded-full bg-white/10 px-4 py-1.5 ring-1 ring-white/15">✨ Шанс поймать SHINY</span>
            </div>
          </div>
        </div>
      </header>

      <CatmonStudio initialCards={cards} />
    </div>
  );
}
