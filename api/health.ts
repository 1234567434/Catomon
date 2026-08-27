/**
 * Диагностика: GET /api/health
 * Показывает, видит ли серверлесс-функция ключи в переменных окружения.
 * САМИ КЛЮЧИ НЕ ВОЗВРАЩАЮТСЯ — только факт наличия, длина и первые символы,
 * чтобы можно было убедиться, что вставлено именно то значение.
 */

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

function describe(v?: string) {
  if (!v) return { present: false };
  const trimmed = v.trim();
  return {
    present: true,
    length: trimmed.length,
    prefix: trimmed.slice(0, 4),
    hasWhitespace: v !== trimmed,
    looksQuoted: /^["'].*["']$/.test(trimmed),
  };
}

export default function handler(_req: unknown, res: Res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  const gemini = describe(process.env.GEMINI_API_KEY);
  const openai = describe(process.env.OPENAI_API_KEY);

  res.status(200).json({
    ok: true,
    runtime: "vercel-serverless",
    gemini,
    openai,
    anyKey: gemini.present || openai.present,
    // Список имён переменных окружения, начинающихся на нужные префиксы,
    // помогает поймать опечатки вроде GEMINI_APIKEY или GEMINI_API_KEY_
    similarEnvNames: Object.keys(process.env).filter(
      (k) => /GEMINI|GOOGLE|OPENAI|API.?KEY/i.test(k) && !/^(npm_|VERCEL_GIT)/.test(k)
    ),
  });
}
