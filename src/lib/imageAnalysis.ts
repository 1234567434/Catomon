import type { CatomonType } from "./types";

/**
 * Локальный «AI»-анализ фото кота прямо в браузере через Canvas.
 * Никаких API, ключей и интернета — всё считается на пикселях.
 *
 * Анализируем: доминирующий окрас, яркость, насыщенность, контраст,
 * «пушистость» (детализация/шум), долю тёмных и светлых зон.
 * Из этого выводим стихию, редкость и характеристики.
 *
 * Результат детерминированный: одно и то же фото всегда даёт
 * одну и ту же карточку (как в настоящем покедексе).
 */

export interface ImageAnalysis {
  seed: number;
  hue: number; // 0-360
  saturation: number; // 0-1
  brightness: number; // 0-1
  contrast: number; // 0-1
  detail: number; // 0-1 «пушистость»
  darkRatio: number; // 0-1
  lightRatio: number; // 0-1
  dominantHex: string;
  palette: string[];
  type: CatomonType;
  subtype?: CatomonType;
  rarityScore: number; // 0-1
}

/* -------------------- Детерминированный ГПСЧ (mulberry32) -------------------- */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------- Утилиты ------------------------------- */
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      default:
        h = ((r - g) / d + 4) * 60;
    }
  }
  return { h, s, l };
}

function toHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/* ------------------------- Основная функция анализа ------------------------- */
export async function analyzeImage(dataUrl: string): Promise<ImageAnalysis> {
  const img = await loadImage(dataUrl);

  const W = 80;
  const H = 80;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return fallbackAnalysis(dataUrl);

  ctx.drawImage(img, 0, 0, W, H);
  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, W, H).data;
  } catch {
    return fallbackAnalysis(dataUrl);
  }

  const lumas: number[] = [];
  const hueBuckets = new Array(12).fill(0); // по 30°
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let sumS = 0;
  let dark = 0;
  let light = 0;
  let hash = 2166136261;

  // центрально-взвешенный доминирующий цвет (кот обычно в центре)
  let cR = 0;
  let cG = 0;
  let cB = 0;
  let cCount = 0;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      sumR += r;
      sumG += g;
      sumB += b;

      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      lumas.push(luma);
      if (luma < 62) dark++;
      if (luma > 196) light++;

      const { h, s } = rgbToHsl(r, g, b);
      sumS += s;
      // насыщенные и не крайние по яркости пиксели голосуют за оттенок
      if (s > 0.16 && luma > 28 && luma < 238) {
        hueBuckets[Math.floor(h / 30) % 12] += s;
      }

      const inCenter = x > W * 0.22 && x < W * 0.78 && y > H * 0.18 && y < H * 0.82;
      if (inCenter) {
        cR += r;
        cG += g;
        cB += b;
        cCount++;
      }

      // стабильный хэш (FNV-1a) — семя для генератора
      hash ^= r + (g << 3) + (b << 6);
      hash = Math.imul(hash, 16777619);
    }
  }

  const total = W * H;
  const avgR = sumR / total;
  const avgG = sumG / total;
  const avgB = sumB / total;
  const domR = cCount ? cR / cCount : avgR;
  const domG = cCount ? cG / cCount : avgG;
  const domB = cCount ? cB / cCount : avgB;

  const meanLuma = lumas.reduce((a, b) => a + b, 0) / total;
  const variance = lumas.reduce((acc, l) => acc + (l - meanLuma) ** 2, 0) / total;
  const contrast = Math.min(1, Math.sqrt(variance) / 80);

  // «Пушистость» — средняя разница между соседними пикселями (высокочастотный шум)
  let edgeSum = 0;
  let edgeCount = 0;
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const idx = y * W + x;
      edgeSum +=
        Math.abs(lumas[idx] - lumas[idx + 1]) + Math.abs(lumas[idx] - lumas[idx + W]);
      edgeCount += 2;
    }
  }
  const detail = Math.min(1, edgeSum / edgeCount / 34);

  const brightness = meanLuma / 255;
  const saturation = sumS / total;
  const darkRatio = dark / total;
  const lightRatio = light / total;

  // Доминирующий оттенок по гистограмме
  let bestBucket = 0;
  let secondBucket = 0;
  hueBuckets.forEach((v, i) => {
    if (v > hueBuckets[bestBucket]) bestBucket = i;
  });
  hueBuckets.forEach((v, i) => {
    if (i !== bestBucket && v > hueBuckets[secondBucket]) secondBucket = i;
  });
  const hue = bestBucket * 30 + 15;
  const secondHue = secondBucket * 30 + 15;

  const seed = Math.abs(hash) >>> 0;
  const rng = makeRng(seed);

  const type = pickType({ hue, saturation, brightness, contrast, detail, darkRatio, lightRatio }, rng);
  const subRoll = rng();
  const subtype =
    subRoll > 0.62
      ? pickType(
          {
            hue: secondHue,
            saturation: saturation * 0.9,
            brightness,
            contrast,
            detail,
            darkRatio,
            lightRatio,
          },
          rng
        )
      : undefined;

  // «Эпичность» кадра → редкость
  const rarityScore = Math.min(
    1,
    contrast * 0.3 + saturation * 0.3 + detail * 0.2 + Math.abs(brightness - 0.5) * 0.2 + rng() * 0.28
  );

  // Палитра из 4 характерных цветов
  const palette = buildPalette(data, W, H);

  return {
    seed,
    hue,
    saturation,
    brightness,
    contrast,
    detail,
    darkRatio,
    lightRatio,
    dominantHex: toHex(domR, domG, domB),
    palette,
    type,
    subtype: subtype === type ? undefined : subtype,
    rarityScore,
  };
}

/* ------------------------ Выбор стихии по признакам ------------------------ */
function pickType(
  f: {
    hue: number;
    saturation: number;
    brightness: number;
    contrast: number;
    detail: number;
    darkRatio: number;
    lightRatio: number;
  },
  rng: () => number
): CatomonType {
  const { hue, saturation, brightness, contrast, detail, darkRatio, lightRatio } = f;

  // Почти монохромный кот (чёрный / белый / серый / дымчатый)
  if (saturation < 0.15) {
    if (brightness < 0.3 || darkRatio > 0.5) {
      return rng() > 0.45 ? "dark" : "ghost";
    }
    if (brightness > 0.7 || lightRatio > 0.42) {
      return rng() > 0.5 ? "ice" : "fairy";
    }
    if (contrast > 0.62) return "fighting"; // полосатый/резкий
    return rng() > 0.55 ? "rock" : "normal";
  }

  // Очень тёмное фото с цветом → призрак/тьма
  if (darkRatio > 0.58 && brightness < 0.33) {
    return rng() > 0.5 ? "ghost" : "dark";
  }

  // Цветовые зоны
  if (hue < 45 || hue >= 345) {
    // красно-оранжевый — рыжие коты
    if (saturation > 0.34 && brightness > 0.34) return "fire";
    return contrast > 0.6 ? "fighting" : "fire";
  }
  if (hue < 70) {
    // жёлтый
    return saturation > 0.42 && brightness > 0.55 ? "electric" : "normal";
  }
  if (hue < 100) {
    return rng() > 0.4 ? "grass" : "electric";
  }
  if (hue < 165) {
    return "grass";
  }
  if (hue < 200) {
    return brightness > 0.6 ? "ice" : "water";
  }
  if (hue < 250) {
    return rng() > 0.35 ? "water" : "psychic";
  }
  if (hue < 300) {
    return rng() > 0.45 ? "psychic" : "ghost";
  }
  // розово-пурпурный
  if (detail > 0.5 || lightRatio > 0.3) return "fairy";
  return rng() > 0.5 ? "fairy" : "psychic";
}

/* ------------------------------- Палитра ------------------------------- */
function buildPalette(data: Uint8ClampedArray, W: number, H: number): string[] {
  const zones = [
    [0, 0, W / 2, H / 2],
    [W / 2, 0, W, H / 2],
    [0, H / 2, W / 2, H],
    [W / 2, H / 2, W, H],
  ];
  return zones.map(([x0, y0, x1, y1]) => {
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (let y = Math.floor(y0); y < y1; y++) {
      for (let x = Math.floor(x0); x < x1; x++) {
        const i = (y * W + x) * 4;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
    }
    return toHex(r / n, g / n, b / n);
  });
}

/* --------------------------- Загрузка изображения --------------------------- */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* ------------------------- Фолбэк, если Canvas недоступен ------------------------- */
function fallbackAnalysis(dataUrl: string): ImageAnalysis {
  let hash = 2166136261;
  for (let i = 0; i < Math.min(dataUrl.length, 4000); i++) {
    hash ^= dataUrl.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const seed = Math.abs(hash) >>> 0;
  const rng = makeRng(seed);
  const types: CatomonType[] = [
    "fire", "water", "grass", "electric", "psychic", "normal",
    "dark", "fairy", "fighting", "ghost", "ice", "rock",
  ];
  return {
    seed,
    hue: rng() * 360,
    saturation: 0.4,
    brightness: 0.5,
    contrast: 0.5,
    detail: 0.5,
    darkRatio: 0.3,
    lightRatio: 0.3,
    dominantHex: "#8a7a63",
    palette: ["#8a7a63", "#6b5f4d", "#a89478", "#5c5245"],
    type: types[Math.floor(rng() * types.length)],
    rarityScore: rng(),
  };
}
