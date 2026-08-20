import type { VercelRequest, VercelResponse } from "@vercel/node";

// Inline-подсказка для Vercel: используем этот тип для работы без локальной dev-зависимости.
// На Vercel @vercel/node доступен автоматически в рантайме.
type Req = VercelRequest;
type Res = VercelResponse;

const SYSTEM_PROMPT = `Ты — эксперт по покемонам и котам. На основе фото кота пользователя ты создаёшь описание "Catomon" - кота в виде покемона.
Верни ТОЛЬКО валидный JSON (без markdown, без комментариев), соответствующий этому TypeScript типу:

{
  "name": string (короткое забавное имя, звучащее как покемон, но с кошачьей темой, например "Мурзар", "Огнемур", "Каплецап"),
  "type": "fire" | "water" | "grass" | "electric" | "psychic" | "normal" | "dark" | "fairy" | "fighting" | "ghost" | "ice" | "rock",
  "title": string (2-4 слова, титул вроде "Повелитель дивана", "Мурлыкающий воин"),
  "description": string (2-3 предложения, смешное описание в стиле покемон-декс-записи, про характер и привычки кота на фото),
  "rarity": "common" | "uncommon" | "rare" | "epic" | "legendary" (редкость на основе того, насколько кот эпично выглядит),
  "ability": string (одна забавная способность),
  "stats": { "hp": number (30-95), "attack": number (25-95), "defense": number (20-90), "speed": number (30-100), "special": number (30-100) },
  "moves": [
    { "name": string, "power": number (20-100) },
    { "name": string, "power": number (20-100) }
  ],
  "height": string (например "28 см"),
  "weight": string (например "4.2 кг")
}

Тип выбирай на основе окраса, выражения морды, шерсти и атмосферы фото:
- рыжие/оранжевые → fire
- чёрные/тёмные/серые с хитрой мордой → dark или ghost
- белые/голубоглазые → ice или fairy
- полосатые/дикие → fighting или normal
- пушистые/персидские → fairy или psychic
- серые/голубые/любят воду → water
- очень активные/с безумным взглядом → electric
- черепаховые/пёстрые → grass или psychic
- толстые/лежащие как бревно → rock или normal

Пиши на русском, с юмором.`;

export default async function handler(req: Req, res: Res) {
  // Разрешаем CORS для локальной разработки
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { image } = req.body as { image?: string };
    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "Missing 'image' field (base64 data URL)" });
    }

    // Если нет API-ключа OpenAI — возвращаем специальный флаг:
    // фронтенд сгенерирует данные локально.
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        aiGenerated: false,
        message:
          "Добавьте переменную окружения OPENAI_API_KEY в Vercel (Settings → Environment Variables), чтобы AI реально анализировал фото кота. Пока работает умный локальный генератор.",
      });
    }

    // Если есть ключ — запрашиваем GPT-4o с мультимодальностью.
    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // доступная быстрая модель для изображений
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: image, detail: "low" },
              },
              {
                type: "text",
                text: "Проанализируй этого кота и создай его Catomon-карточку. Верни только JSON.",
              },
            ],
          },
        ],
        max_tokens: 800,
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    });

    if (!openAiRes.ok) {
      const errText = await openAiRes.text();
      console.error("OpenAI error:", openAiRes.status, errText);
      return res
        .status(502)
        .json({ error: "OpenAI API error", details: errText.slice(0, 500) });
    }

    const data = (await openAiRes.json()) as {
      choices: { message: { content: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return res.status(502).json({ error: "Failed to parse AI JSON", raw: content });
    }

    return res.status(200).json({ aiGenerated: true, data: parsed });
  } catch (err) {
    console.error("Generate error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
