export interface TypeMeta {
  name: string;
  color: string;
  text: string;
  emoji: string;
}

export const POKEMON_TYPES: TypeMeta[] = [
  { name: "Fire", color: "#ee8130", text: "#ffffff", emoji: "🔥" },
  { name: "Water", color: "#6390f0", text: "#ffffff", emoji: "💧" },
  { name: "Grass", color: "#7ac74c", text: "#ffffff", emoji: "🌿" },
  { name: "Electric", color: "#f7d02c", text: "#1f2b33", emoji: "⚡" },
  { name: "Ice", color: "#96d9d6", text: "#1f2b33", emoji: "❄️" },
  { name: "Fighting", color: "#c22e28", text: "#ffffff", emoji: "🥊" },
  { name: "Poison", color: "#a33ea1", text: "#ffffff", emoji: "☠️" },
  { name: "Ground", color: "#e2bf65", text: "#1f2b33", emoji: "⛰️" },
  { name: "Flying", color: "#a98ff3", text: "#ffffff", emoji: "🕊️" },
  { name: "Psychic", color: "#f95587", text: "#ffffff", emoji: "🔮" },
  { name: "Bug", color: "#a6b91a", text: "#1f2b33", emoji: "🐛" },
  { name: "Rock", color: "#b6a136", text: "#1f2b33", emoji: "🪨" },
  { name: "Ghost", color: "#735797", text: "#ffffff", emoji: "👻" },
  { name: "Dragon", color: "#6f35fc", text: "#ffffff", emoji: "🐉" },
  { name: "Dark", color: "#705746", text: "#ffffff", emoji: "🌙" },
  { name: "Steel", color: "#b7b7ce", text: "#1f2b33", emoji: "🛡️" },
  { name: "Fairy", color: "#d685ad", text: "#ffffff", emoji: "🧚" },
  { name: "Normal", color: "#a8a77a", text: "#1f2b33", emoji: "🐾" },
];

const NAME_PARTS_A = [
  "Purr", "Mew", "Whisk", "Fuzz", "Claw", "Scratch", "Tom", "Gato", "Neko",
  "Luna", "Milo", "Ollie", "Pounce", "Sniff", "Tail", "Paw", "Meow", "Velvet",
  "Butter", "Socks", "Tiger", "Pebble", "Shadow", "Sparkle", "Fang",
];

const NAME_PARTS_B = [
  "mon", "lix", "chu", "ra", "tin", "dew", "toe", "nick", "dra", "borg",
  "star", "blaze", "fang", "whisker", "puff", "dash", "boom", "shine", "bolt",
];

export function randomCatName(rng: () => number = Math.random): string {
  const a = NAME_PARTS_A[Math.floor(rng() * NAME_PARTS_A.length)];
  const b = NAME_PARTS_B[Math.floor(rng() * NAME_PARTS_B.length)];
  return a + b;
}

export function randomType(rng: () => number = Math.random): TypeMeta {
  return POKEMON_TYPES[Math.floor(rng() * POKEMON_TYPES.length)];
}

export function randomStat(min: number, max: number, rng: () => number = Math.random): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function getTypeMeta(name: string): TypeMeta {
  return POKEMON_TYPES.find((t) => t.name === name) ?? POKEMON_TYPES[0];
}
