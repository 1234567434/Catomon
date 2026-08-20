/**
 * Vercel Serverless Function: /api/generate
 *
 * Принимает { image: dataURL, lang: "ru" | "uk" | "en" }
 * Если задана переменная окружения OPENAI_API_KEY — отправляет фото в GPT-4o-mini
 * и возвращает сгенерированные данные карточки Catomon.
 * Если ключа нет — возвращает aiGenerated: false, и фронтенд использует
 * встроенный локальный генератор.
 */

type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  end: () => void;
  setHeader: (name: string, value: string) => void;
};

const LANG_NAME: Record<string, string> = {
  ru: "русском",
  uk: "украинском (українською мовою)",
  en: "английском (in English)",
};

function buildPrompt(lang: string): string {
  const langName = LANG_NAME[lang] ?? LANG_NAME.ru;
  return `Ты — эксперт по покемонам и котам. На основе фото кота пользователя ты создаёшь описание "Catomon" — кота в виде покемона.
Верни ТОЛЬКО валидный JSON (без markdown, без комментариев), соответствующий этому типу:

{
  "name": string (короткое забавное имя, звучащее как покемон, но с кошачьей темой),
  "type": "fire" | "water" | "grass" | "electric" | "psychic" | "normal" | "dark" | "fairy" | "fighting" | "ghost" | "ice" | "rock",
  "title": string (2-4 слова, титул вроде "Повелитель дивана"),
  "description": string (2-3 предложения, смешное описание в стиле покедекс-записи, про характер и привычки кота на фото),
  "rarity": "common" | "uncommon" | "rare" | "epic" | "legendary",
  "ability": string (одна забавная способность),
  "stats": { "hp": number (30-95), "attack": number (25-95), "defense": number (20-90), "speed": number (30-100), "special": number (30-100) },
  "moves": [ { "name": string, "power": number (20-100) }, { "name": string, "power": number (20-100) } ],
  "height": string (например "28 см" / "28 cm"),
  "weight": string (например "4.2 кг" / "4.2 kg")
}

Тип выбирай на основе окраса, выражения морды, шерсти и атмосферы фото:
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
пиши на ${langName}. Пиши с юмором.`;
}

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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(200).json({ aiGenerated: false, reason: "no_api_key" });
      return;
    }

    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
              {
                type: "text",
                text: "Проанализируй этого кота и создай его Catomon-карточку. Верни только JSON.",
              },
            ],
          },
        ],
        max_tokens: 800,
        temperature: 0.9,
        response_format: { type: "json_object" },
      }),
    });

    if (!openAiRes.ok) {
      const errText = await openAiRes.text();
      console.error("OpenAI error:", openAiRes.status, errText);
      res.status(200).json({ aiGenerated: false, reason: "openai_error" });
      return;
    }

    const data = (await openAiRes.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? "{}";

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      res.status(200).json({ aiGenerated: false, reason: "parse_error" });
      return;
    }

    res.status(200).json({ aiGenerated: true, data: parsed });
  } catch (err) {
    console.error("Generate error:", err);
    res.status(200).json({ aiGenerated: false, reason: "server_error" });
  }
}
