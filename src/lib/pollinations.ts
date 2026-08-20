import { buildPromptWithOptions, generateCatmon } from "./generate";

const IMAGE_WIDTH = 512;
const IMAGE_HEIGHT = 512;
const POLLI_TIMEOUT_MS = 120_000;

/** Fetches an AI-generated image from Pollinations and returns a base64 data-URI. */
export async function generateCardImage(
  furColor: string,
  vibe: string
): Promise<{ imageData: string; prompt: string }> {
  const seed = Math.floor(Math.random() * 1_000_000_000);
  const catmon = generateCatmon();
  const prompt = buildPromptWithOptions(catmon, furColor, vibe);

  const encoded = encodeURIComponent(prompt);
  const params = new URLSearchParams({
    width: String(IMAGE_WIDTH),
    height: String(IMAGE_HEIGHT),
    seed: String(seed),
    nologo: "true",
    model: "flux",
    private: "true",
    referrer: "catmon.app",
  });

  const url = `https://image.pollinations.ai/prompt/${encoded}?${params.toString()}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), POLLI_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Pollinations image failed with status ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // The free flux endpoint returns JPG by default.
    const mime = "image/jpeg";
    const imageData = `data:${mime};base64,${buffer.toString("base64")}`;
    return { imageData, prompt };
  } catch (err) {
    throw new Error(
      err instanceof Error && err.name === "AbortError"
        ? "AI изображение генерировалось слишком долго, попробуйте ещё раз"
        : "Не удалось сгенерировать изображение, попробуйте ещё раз"
    );
  } finally {
    clearTimeout(timer);
  }
}
