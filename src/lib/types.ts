export type CatomonType =
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "normal"
  | "dark"
  | "fairy"
  | "fighting"
  | "ghost"
  | "ice"
  | "rock";

export interface CatomonStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  special: number;
}

export interface CatomonMove {
  name: string;
  power: number;
  type: CatomonType;
}

export interface Catomon {
  id: string;
  name: string;
  type: CatomonType;
  subtype?: CatomonType;
  title: string;
  description: string;
  stats: CatomonStats;
  moves: [CatomonMove, CatomonMove];
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  height: string;
  weight: string;
  ability: string;
  photo: string; // data URL
  createdAt: number;
}

export const TYPE_META: Record<
  CatomonType,
  { label: string; color: string; bg: string; emoji: string }
> = {
  fire: { label: "Огонь", color: "#FF4422", bg: "from-orange-500 to-red-600", emoji: "🔥" },
  water: { label: "Вода", color: "#2277FF", bg: "from-blue-400 to-cyan-600", emoji: "💧" },
  grass: { label: "Трава", color: "#33CC44", bg: "from-lime-400 to-green-600", emoji: "🌿" },
  electric: { label: "Электро", color: "#FFD622", bg: "from-yellow-300 to-amber-500", emoji: "⚡" },
  psychic: { label: "Психо", color: "#CC44CC", bg: "from-pink-400 to-fuchsia-600", emoji: "🔮" },
  normal: { label: "Нормальный", color: "#B6A184", bg: "from-stone-300 to-stone-500", emoji: "🐾" },
  dark: { label: "Тёмный", color: "#3A2B4D", bg: "from-zinc-700 to-slate-900", emoji: "🌙" },
  fairy: { label: "Фея", color: "#FF77AA", bg: "from-pink-300 to-rose-500", emoji: "✨" },
  fighting: { label: "Боевой", color: "#BB5544", bg: "from-red-600 to-orange-800", emoji: "🥊" },
  ghost: { label: "Призрак", color: "#7755AA", bg: "from-purple-600 to-indigo-900", emoji: "👻" },
  ice: { label: "Лёд", color: "#66DDFF", bg: "from-cyan-200 to-sky-500", emoji: "❄️" },
  rock: { label: "Камень", color: "#B8A062", bg: "from-yellow-700 to-stone-800", emoji: "🪨" },
};
