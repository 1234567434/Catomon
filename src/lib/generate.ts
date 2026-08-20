import { randomCatName, randomStat, randomType } from "./catmon-data";

export interface CatmonResult {
  name: string;
  typeName: string;
  description: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  isShiny: boolean;
}

const MOTIVATIONS = [
  "steals your snacks but always brings you gifts",
  "rules the household like a tiny fluffy tyrant",
  "claims every cardboard box as its royal throne",
  "practices parkour across the furniture at 3am",
  "gives laser-pointer chases a level of seriousness they deserve",
  "purrs so loudly it could power a small village",
  "plots world domination one nap at a time",
  "is convinced the window bird is its lifelong rival",
  "demands belly rubs but will absolutely retaliate",
  "has mastered the art of appearing out of nowhere",
];

const SHINY_MOTIVATIONS = [
  "glows with an ethereal aura, blessed by the cat gods",
  "radiates rainbow energy that blinds those unworthy of its gaze",
  "was struck by a meteor and gained forbidden cosmic power",
  "wears the legendary golden bell of the mew kingdom",
];

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function buildDescription(rng: () => number): string {
  return pick(MOTIVATIONS, rng);
}

export function generateCatmon(rng: () => number = Math.random): CatmonResult {
  const type = randomType(rng);
  const shiny = rng() < 0.08;
  const description = shiny
    ? `A legendary SHINY ${type.name} catmon that ${pick(SHINY_MOTIVATIONS, rng)}.`
    : `A ${type.name}-type catmon that ${buildDescription(rng)}.`;

  return {
    name: randomCatName(rng),
    typeName: type.name,
    description,
    hp: randomStat(40, 110, rng),
    attack: randomStat(30, 120, rng),
    defense: randomStat(30, 100, rng),
    speed: randomStat(40, 120, rng),
    isShiny: shiny,
  };
}

/** Builds a detailed visual prompt for the AI image model from cat traits. */
export function buildArtPrompt(catmon: CatmonResult, furColor: string, vibe: string): string {
  const type = catmon.typeName;
  const shiny = catmon.isShiny;
  const palette = shiny
    ? "iridescent rainbow holographic coat"
    : `${furColor} fur with ${type.toLowerCase()}-themed accents`;

  const style = [
    "Ultra detailed anime pokemon trading card art",
    `A cute cat pokemon character named ${catmon.name}`,
    `${palette}, ${vibe} pose, big sparkly expressive eyes`,
    `elemental ${type.toLowerCase()} energy swirling around it`,
    "clean bold outlines, dynamic shading, vibrant saturated colors",
    "centered composition, plain studio background with soft glow",
    "high quality illustration, 4k, sharp details",
    "square card art aspect ratio",
  ].join(", ");

  return style;
}

export function buildPromptWithOptions(
  catmon: CatmonResult,
  furColor: string,
  vibe: string
): string {
  return buildArtPrompt(catmon, furColor, vibe);
}
