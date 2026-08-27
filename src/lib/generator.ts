import type { Catomon, CatomonType, CatomonMove } from "./types";
import { ALL_TYPES } from "./types";
import { GAME_DATA } from "./gameData";
import type { Lang } from "./i18n";
import { makeRng, type ImageAnalysis } from "./imageAnalysis";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

/**
 * Собирает карточку Catomon.
 * Приоритет данных: aiData (если включён OpenAI) → анализ фото → случайность.
 */
export function generateCatomon(
  photo: string,
  lang: Lang,
  analysis?: ImageAnalysis,
  aiData?: Partial<Catomon>
): Catomon {
  const D = GAME_DATA[lang];

  // Детерминированный генератор на основе хэша пикселей фото
  const seed = analysis?.seed ?? Math.floor(Math.random() * 0xffffffff);
  const rng = makeRng(seed);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const randInt = (min: number, max: number) => Math.floor(min + rng() * (max - min + 1));

  const type: CatomonType = (aiData?.type as CatomonType) ?? analysis?.type ?? pick(ALL_TYPES);
  const subtype: CatomonType | undefined =
    (aiData?.subtype as CatomonType) ??
    analysis?.subtype ??
    (rng() > 0.72 ? pick(ALL_TYPES.filter((x) => x !== type)) : undefined);

  const name = aiData?.name ?? `${pick(D.prefixes[type])}${pick(D.suffixes)}`;

  /* ---------------------------- Редкость ---------------------------- */
  let rarity: Catomon["rarity"];
  if (aiData?.rarity) {
    rarity = aiData.rarity;
  } else {
    const score = analysis?.rarityScore ?? rng();
    if (score > 0.9) rarity = "legendary";
    else if (score > 0.76) rarity = "epic";
    else if (score > 0.58) rarity = "rare";
    else if (score > 0.34) rarity = "uncommon";
    else rarity = "common";
  }
  const bonus = { common: 0, uncommon: 8, rare: 16, epic: 26, legendary: 38 }[rarity];

  /* ------------------- Статы из реальных признаков фото ------------------- */
  let stats: Catomon["stats"];
  if (aiData?.stats) {
    stats = aiData.stats;
  } else if (analysis) {
    const a = analysis;
    stats = {
      // Крупный тёмный кот = больше здоровья
      hp: clamp(38 + a.darkRatio * 46 + (1 - a.brightness) * 20 + rng() * 12 + bonus, 30, 100),
      // Контраст и насыщенность = агрессивность
      attack: clamp(30 + a.contrast * 44 + a.saturation * 26 + rng() * 12 + bonus, 25, 100),
      // Толстенький, мало деталей = броня
      defense: clamp(30 + (1 - a.detail) * 40 + a.darkRatio * 20 + rng() * 12 + bonus, 22, 100),
      // Светлый и детализированный = шустрый
      speed: clamp(32 + a.brightness * 34 + a.detail * 30 + rng() * 14 + bonus, 25, 100),
      // Необычный окрас = магия
      special: clamp(30 + a.saturation * 40 + a.lightRatio * 22 + rng() * 14 + bonus, 25, 100),
    };
  } else {
    stats = {
      hp: randInt(35, 75) + bonus,
      attack: randInt(30, 80) + bonus,
      defense: randInt(25, 75) + bonus,
      speed: randInt(40, 95) + bonus,
      special: randInt(30, 90) + bonus,
    };
  }

  /* ------------------------------ Атаки ------------------------------ */
  const powerBase = analysis ? 28 + analysis.contrast * 40 : 45;
  const move1: CatomonMove = {
    name: aiData?.moves?.[0]?.name ?? pick(D.moves[type]),
    power: aiData?.moves?.[0]?.power ?? clamp(powerBase + rng() * 34, 20, 100),
    type,
  };
  const move2: CatomonMove = {
    name: aiData?.moves?.[1]?.name ?? pick(D.moves[subtype ?? type]),
    power: aiData?.moves?.[1]?.power ?? clamp(powerBase - 6 + rng() * 42, 20, 100),
    type: subtype ?? type,
  };

  /* --------------------- Рост и вес из пропорций фото --------------------- */
  const height =
    aiData?.height ??
    `${clamp(analysis ? 22 + (1 - analysis.brightness) * 22 + rng() * 14 : randInt(20, 55), 18, 60)} ${D.cm}`;
  const weight =
    aiData?.weight ??
    `${(analysis ? 2.4 + analysis.darkRatio * 4.2 + (1 - analysis.detail) * 2.2 + rng() * 1.4 : randInt(25, 85) / 10).toFixed(1)} ${D.kg}`;

  return {
    id: aiData?.id ?? `${seed.toString(36)}-${Date.now().toString(36).slice(-4)}`,
    name,
    type,
    subtype: subtype === type ? undefined : subtype,
    title: aiData?.title ?? pick(D.titles),
    description: aiData?.description ?? pick(D.descriptions[type]),
    rarity,
    stats,
    moves: [move1, move2],
    ability: aiData?.ability ?? pick(D.abilities[type]),
    height,
    weight,
    photo,
    createdAt: Date.now(),
    lang,
    analysis: analysis
      ? {
          dominantHex: analysis.dominantHex,
          palette: analysis.palette,
          brightness: analysis.brightness,
          contrast: analysis.contrast,
          detail: analysis.detail,
          saturation: analysis.saturation,
        }
      : undefined,
  };
}
