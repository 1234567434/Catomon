import type { Lang } from "./i18n";

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

export const ALL_TYPES: CatomonType[] = [
  "fire", "water", "grass", "electric", "psychic", "normal",
  "dark", "fairy", "fighting", "ghost", "ice", "rock",
];

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
  lang?: Lang;
  analysis?: {
    dominantHex: string;
    palette: string[];
    brightness: number;
    contrast: number;
    detail: number;
    saturation: number;
  };
}

export const TYPE_META: Record<
  CatomonType,
  { color: string; bg: string; emoji: string }
> = {
  fire: { color: "#FF4422", bg: "from-orange-500 to-red-600", emoji: "🔥" },
  water: { color: "#2277FF", bg: "from-blue-400 to-cyan-600", emoji: "💧" },
  grass: { color: "#33CC44", bg: "from-lime-400 to-green-600", emoji: "🌿" },
  electric: { color: "#E0B000", bg: "from-yellow-300 to-amber-500", emoji: "⚡" },
  psychic: { color: "#CC44CC", bg: "from-pink-400 to-fuchsia-600", emoji: "🔮" },
  normal: { color: "#8A7A63", bg: "from-stone-300 to-stone-500", emoji: "🐾" },
  dark: { color: "#3A2B4D", bg: "from-zinc-700 to-slate-900", emoji: "🌙" },
  fairy: { color: "#FF3D8B", bg: "from-pink-300 to-rose-500", emoji: "✨" },
  fighting: { color: "#BB5544", bg: "from-red-600 to-orange-800", emoji: "🥊" },
  ghost: { color: "#7755AA", bg: "from-purple-600 to-indigo-900", emoji: "👻" },
  ice: { color: "#2BA8CC", bg: "from-cyan-200 to-sky-500", emoji: "❄️" },
  rock: { color: "#8A7742", bg: "from-yellow-700 to-stone-800", emoji: "🪨" },
};

export const TYPE_LABELS: Record<Lang, Record<CatomonType, string>> = {
  ru: {
    fire: "Огонь", water: "Вода", grass: "Трава", electric: "Электро",
    psychic: "Психо", normal: "Обычный", dark: "Тёмный", fairy: "Фея",
    fighting: "Боевой", ghost: "Призрак", ice: "Лёд", rock: "Камень",
  },
  uk: {
    fire: "Вогонь", water: "Вода", grass: "Трава", electric: "Електро",
    psychic: "Психо", normal: "Звичайний", dark: "Темний", fairy: "Фея",
    fighting: "Бойовий", ghost: "Привид", ice: "Лід", rock: "Камінь",
  },
  en: {
    fire: "Fire", water: "Water", grass: "Grass", electric: "Electric",
    psychic: "Psychic", normal: "Normal", dark: "Dark", fairy: "Fairy",
    fighting: "Fighting", ghost: "Ghost", ice: "Ice", rock: "Rock",
  },
};

export function typeLabel(type: CatomonType, lang: Lang): string {
  return TYPE_LABELS[lang][type];
}
