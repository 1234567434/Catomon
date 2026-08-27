/**
 * Vercel Serverless Function: /api/generate
 *
 * Принимает { image: dataURL, lang: "ru" | "uk" | "en" }
 *
 * Поддерживает двух провайдеров (ключ читается ТОЛЬКО из переменных окружения):
 *   1. GEMINI_API_KEY  — Google Gemini (есть бесплатный тариф) — приоритет
 *   2. OPENAI_API_KEY  — OpenAI GPT-4o-mini (платный)
 *
 * Если ключей нет — возвращает aiGenerated: false, и фронтенд использует
 * встроенный локальный анализ пикселей (полностью бесплатный).
 *
 * НИКОГДА не хардкодьте ключи в этом файле!
 */

type Req = { method?: string; body?: unknown };
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  end: () => void;
  setHeader: (name: string, value: string) => void;
};

const LANG_NAME: Record<string, string> = {
  ru: "русском языке",
  uk: "украинском языке (українською мовою)",
  en: "английском языке (in English)",
};

function buildPrompt(lang: string): string {
  const langName = LANG_NAME[lang] ?? LANG_NAME.ru;
  return `Ты — эксперт по покемонам и котам. На основе фото кота создай карточку "Catomon" — кота в виде покемона.

Верни ТОЛЬКО валидный JSON без markdown-обёрток и комментариев:

{
  "name": "короткое забавное имя в стиле покемона с кошачьей темой",
  "type": "fire" | "water" | "grass" | "electric" | "psychic" | "normal" | "dark" | "fairy" | "fighting" | "ghost" | "ice" | "rock",
  "title": "титул из 2-4 слов, например Повелитель дивана",
  "description": "2-3 предложения, смешное описание в стиле покедекс-записи про характер и привычки именно этого кота с фото",
  "rarity": "common" | "uncommon" | "rare" | "epic" | "legendary",
  "ability": "одна забавная способность",
  "stats": { "hp": 30-95, "attack": 25-95, "defense": 20-90, "speed": 30-100, "special": 30-100 },
  "moves": [ { "name": "название атаки", "power": 20-100 }, { "name": "название атаки", "power": 20-100 } ],
  "height": "например 28 см",
  "weight": "например 4.2 кг"
}

Тип выбирай по окрасу, выражению морды и атмосфере фото:
- рыжие/оранжевые → fire
- чёрные/тёмные с хитрой мордой → dark или ghost
- белые/голубоглазые → ice или fairy
- полосатые/дикие → fighting или normal
- пушистые/персидские → fairy или psychic
- серые/голубые → water
- очень активные/безумный взгляд → electric
- черепаховые/пёстрые → grass или psychic
- толстые/лежащие как бревно → rock или normal

ВАЖНО: ВСЕ текстовые поля (name, title, description, ability, названия атак, единицы измерения)
пиши на ${langName}. Пиши с юмором, ориентируйся на то, что реально видно на фото.`;
}

/** Разбирает data URL вида "data:image/jpeg;base64,XXXX" */
function parseDataUrl(dataUrl: string): { mimeType: string; base64: string } | null {
  const m = /^data:([^;,]+);base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  return { mimeType: m[1], base64: m[2] };
}

/** Достаёт JSON из ответа модели (иногда приходит в ```json блоке) */
function extractJson(text: string): unknown | null {
  const cleaned = text
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

/* ------------------------------- GEMINI ------------------------------- */
async function callGemini(
  apiKey: string,
  image: string,
  lang: string
): Promise<unknown | null> {
  const parsed = parseDataUrl(image);
  if (!parsed) return null;

  // gemini-2.0-flash — быстрая мультимодальная модель с щедрым бесплатным лимитом
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildPrompt(lang) }],
      },
      contents: [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: parsed.mimeType, data: parsed.base64 } },
            { text: "Проанализируй этого кота и создай его Catomon-карточку. Верни только JSON." },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gemini error:", res.status, errText.slice(0, 400));
    return null;
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;
  return extractJson(text);
}

/* ------------------------------- OPENAI ------------------------------- */
async function callOpenAI(
  apiKey: string,
  image: string,
  lang: string
): Promise<unknown | null> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildPrompt(lang) },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: image, detail: "low" } },
            { type: "text", text: "Проанализируй этого кота и создай его Catomon-карточку. Верни только JSON." },
          ],
        },
      ],
      max_tokens: 800,
      temperature: 0.9,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("OpenAI error:", res.status, errText.slice(0, 400));
    return null;
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;
  return extractJson(content);
}

/* ------------------------------- HANDLER ------------------------------- */
export default async function handler(req: Req, res: Res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    const body = (req.body ?? {}) as { image?: string; lang?: string };
    const image = body.image;
    const lang = body.lang === "uk" || body.lang === "en" ? body.lang : "ru";

    if (!image || typeof image !== "string") {
      res.status(400).json({ error: "Missing 'image' field (base64 data URL)" });
      return;
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!geminiKey && !openaiKey) {
      res.status(200).json({ aiGenerated: false, reason: "no_api_key" });
      return;
    }

    // Gemini в приоритете — у него есть бесплатный тариф
    let parsed: unknown | null = null;
    let provider = "";

    if (geminiKey) {
      parsed = await callGemini(geminiKey, image, lang);
      provider = "gemini";
    }
    if (!parsed && openaiKey) {
      parsed = await callOpenAI(openaiKey, image, lang);
      provider = "openai";
    }

    if (!parsed) {
      res.status(200).json({ aiGenerated: false, reason: "provider_error" });
      return;
    }

    res.status(200).json({ aiGenerated: true, provider, data: parsed });
  } catch (err) {
    console.error("Generate error:", err);
    res.status(200).json({ aiGenerated: false, reason: "server_error" });
  }
}
