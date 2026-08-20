import { createContext, useContext } from "react";

export type Lang = "ru" | "uk" | "en";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export interface Translation {
  meta: { title: string; subtitle: string };
  nav: { create: string; pokedex: string };
  hero: { line1: string; line2: string; sub: string };
  upload: { drop: string; or: string; file: string; camera: string };
  ai: { toggle1: string; toggle2: string };
  mode: {
    title: string;
    localName: string;
    localDesc: string;
    localBadge: string;
    aiName: string;
    aiDesc: string;
    aiBadge: string;
  };
  report: {
    title: string;
    color: string;
    brightness: string;
    contrast: string;
    fluff: string;
    note: string;
  };
  features: { title: string; desc: string }[];
  uploaded: { title: string; scan: string; other: string };
  scanning: { title: string; stages: string[] };
  ready: {
    title: string;
    save: string;
    download: string;
    again: string;
    saved: string;
  };
  pokedex: {
    title: string;
    caught: string;
    emptyTitle: string;
    emptyDesc: string;
    emptyBtn: string;
    delete: string;
  };
  card: {
    hp: string;
    atk: string;
    def: string;
    spd: string;
    spc: string;
    height: string;
    weight: string;
    total: string;
    ability: string;
  };
  rarity: Record<
    "common" | "uncommon" | "rare" | "epic" | "legendary",
    string
  >;
  msg: {
    serverDown: string;
    noKey: string;
    downloadFail: string;
  };
  footer: string;
}

const ru: Translation = {
  meta: { title: "CATOMON", subtitle: "Котики → Покемоны" },
  nav: { create: "СОЗДАТЬ", pokedex: "ПОКЕДЕКС" },
  hero: {
    line1: "ПРЕВРАТИ СВОЕГО КОТА",
    line2: "В ПОКЕМОНА!",
    sub: "Загрузи фото своего кота — и наш покедекс на базе AI создаст для него уникальную карточку со статами, типом и суперспособностями.",
  },
  upload: {
    drop: "Брось фото кота сюда",
    or: "или выбери один из вариантов ниже",
    file: "📁 Загрузить файл",
    camera: "📸 Сфоткать кота",
  },
  ai: {
    toggle1: "Использовать AI для анализа фото (требует",
    toggle2: "на Vercel)",
  },
  mode: {
    title: "Режим анализа",
    localName: "Умный анализ фото",
    localDesc:
      "Разбирает фото на пиксели прямо в браузере: окрас, яркость, контраст, пушистость. Работает мгновенно и офлайн.",
    localBadge: "БЕСПЛАТНО",
    aiName: "OpenAI (GPT-4o)",
    aiDesc: "Нейросеть смотрит на фото и придумывает текст. Нужен платный API-ключ.",
    aiBadge: "НУЖЕН КЛЮЧ",
  },
  report: {
    title: "Отчёт сканера",
    color: "Окрас",
    brightness: "Яркость",
    contrast: "Контраст",
    fluff: "Пушистость",
    note: "Карточка построена по реальным пикселям фото — тот же кот всегда даёт ту же карточку.",
  },
  features: [
    { title: "1. Фоткай", desc: "Сфоткай кота или загрузи уже готовое фото." },
    { title: "2. Сканируй", desc: "AI проанализирует окрас и выдаст карточку." },
    { title: "3. Коллекционируй", desc: "Собери полный покедекс своих котов!" },
  ],
  uploaded: {
    title: "Фото загружено!",
    scan: "🔬 ПРОСКАНИРОВАТЬ",
    other: "Другое фото",
  },
  scanning: {
    title: "АНАЛИЗ ДНК КОТА...",
    stages: [
      "🔍 Сканирую шерсть...",
      "🧬 Анализирую мурчальные ДНК...",
      "⚖️ Измеряю уровень лени...",
      "✨ Определяю стихию...",
      "📊 Высчитываю статы...",
      "🎴 Печатаю карточку Catomon...",
    ],
  },
  ready: {
    title: "🎉 ВАШ CATOMON ГОТОВ!",
    save: "⭐ В ПОКЕДЕКС",
    download: "💾 СКАЧАТЬ PNG",
    again: "➕ НОВЫЙ КОТ",
    saved: "✅ Добавлено в Покедекс!",
  },
  pokedex: {
    title: "ТВОЙ ПОКЕДЕКС",
    caught: "Поймано котов:",
    emptyTitle: "Пусто!",
    emptyDesc:
      "Ты ещё не создал ни одного Catomon. Самое время поймать своего первого кота!",
    emptyBtn: "НА ОХОТУ 🐾",
    delete: "Удалить",
  },
  card: {
    hp: "HP",
    atk: "АТК",
    def: "ЗАЩ",
    spd: "СКР",
    spc: "СПЦ",
    height: "Рост",
    weight: "Вес",
    total: "Σ",
    ability: "Способность",
  },
  rarity: {
    common: "Обычная",
    uncommon: "Необычная",
    rare: "Редкая",
    epic: "Эпическая",
    legendary: "★ ЛЕГЕНДАРНАЯ ★",
  },
  msg: {
    serverDown: "Сервер недоступен — используется локальный генератор.",
    noKey:
      "Добавьте переменную окружения OPENAI_API_KEY в Vercel (Settings → Environment Variables), чтобы AI реально анализировал фото кота. Пока работает умный локальный генератор.",
    downloadFail: "Не удалось скачать картинку :(",
  },
  footer: "Сделано с любовью к котам и покемонам 🐱❤️",
};

const uk: Translation = {
  meta: { title: "CATOMON", subtitle: "Котики → Покемони" },
  nav: { create: "СТВОРИТИ", pokedex: "ПОКЕДЕКС" },
  hero: {
    line1: "ПЕРЕТВОРИ СВОГО КОТА",
    line2: "НА ПОКЕМОНА!",
    sub: "Завантаж фото свого кота — і наш покедекс на базі AI створить для нього унікальну картку зі статами, типом і суперздібностями.",
  },
  upload: {
    drop: "Кинь фото кота сюди",
    or: "або обери один із варіантів нижче",
    file: "📁 Завантажити файл",
    camera: "📸 Сфоткати кота",
  },
  ai: {
    toggle1: "Використовувати AI для аналізу фото (потрібен",
    toggle2: "на Vercel)",
  },
  mode: {
    title: "Режим аналізу",
    localName: "Розумний аналіз фото",
    localDesc:
      "Розбирає фото на пікселі прямо в браузері: забарвлення, яскравість, контраст, пухнастість. Працює миттєво й офлайн.",
    localBadge: "БЕЗКОШТОВНО",
    aiName: "OpenAI (GPT-4o)",
    aiDesc: "Нейромережа дивиться на фото й вигадує текст. Потрібен платний API-ключ.",
    aiBadge: "ПОТРІБЕН КЛЮЧ",
  },
  report: {
    title: "Звіт сканера",
    color: "Забарвлення",
    brightness: "Яскравість",
    contrast: "Контраст",
    fluff: "Пухнастість",
    note: "Картка побудована за реальними пікселями фото — той самий кіт завжди дає ту саму картку.",
  },
  features: [
    { title: "1. Фоткай", desc: "Сфоткай кота або завантаж готове фото." },
    { title: "2. Скануй", desc: "AI проаналізує забарвлення й видасть картку." },
    { title: "3. Колекціонуй", desc: "Збери повний покедекс своїх котів!" },
  ],
  uploaded: {
    title: "Фото завантажено!",
    scan: "🔬 ПРОСКАНУВАТИ",
    other: "Інше фото",
  },
  scanning: {
    title: "АНАЛІЗ ДНК КОТА...",
    stages: [
      "🔍 Скану́ю шерсть...",
      "🧬 Аналізую муркотливу ДНК...",
      "⚖️ Вимірюю рівень лінощів...",
      "✨ Визначаю стихію...",
      "📊 Обчислюю стати...",
      "🎴 Друкую картку Catomon...",
    ],
  },
  ready: {
    title: "🎉 ВАШ CATOMON ГОТОВИЙ!",
    save: "⭐ У ПОКЕДЕКС",
    download: "💾 ЗАВАНТАЖИТИ PNG",
    again: "➕ НОВИЙ КІТ",
    saved: "✅ Додано до Покедексу!",
  },
  pokedex: {
    title: "ТВІЙ ПОКЕДЕКС",
    caught: "Спіймано котів:",
    emptyTitle: "Порожньо!",
    emptyDesc:
      "Ти ще не створив жодного Catomon. Саме час спіймати свого першого кота!",
    emptyBtn: "НА ПОЛЮВАННЯ 🐾",
    delete: "Видалити",
  },
  card: {
    hp: "HP",
    atk: "АТК",
    def: "ЗАХ",
    spd: "ШВД",
    spc: "СПЦ",
    height: "Зріст",
    weight: "Вага",
    total: "Σ",
    ability: "Здібність",
  },
  rarity: {
    common: "Звичайна",
    uncommon: "Незвичайна",
    rare: "Рідкісна",
    epic: "Епічна",
    legendary: "★ ЛЕГЕНДАРНА ★",
  },
  msg: {
    serverDown: "Сервер недоступний — використовується локальний генератор.",
    noKey:
      "Додайте змінну середовища OPENAI_API_KEY у Vercel (Settings → Environment Variables), щоб AI справді аналізував фото кота. Наразі працює розумний локальний генератор.",
    downloadFail: "Не вдалося завантажити зображення :(",
  },
  footer: "Зроблено з любов'ю до котів і покемонів 🐱❤️",
};

const en: Translation = {
  meta: { title: "CATOMON", subtitle: "Cats → Pokémon" },
  nav: { create: "CREATE", pokedex: "POKEDEX" },
  hero: {
    line1: "TURN YOUR CAT",
    line2: "INTO A POKÉMON!",
    sub: "Upload a photo of your cat — our AI-powered pokedex will create a unique trading card with stats, an elemental type and super abilities.",
  },
  upload: {
    drop: "Drop your cat photo here",
    or: "or pick one of the options below",
    file: "📁 Upload file",
    camera: "📸 Take a photo",
  },
  ai: {
    toggle1: "Use AI to analyse the photo (requires",
    toggle2: "on Vercel)",
  },
  mode: {
    title: "Analysis mode",
    localName: "Smart photo analysis",
    localDesc:
      "Breaks the photo down to pixels right in your browser: fur colour, brightness, contrast, fluffiness. Instant and offline.",
    localBadge: "FREE",
    aiName: "OpenAI (GPT-4o)",
    aiDesc: "A neural net looks at the photo and writes the text. Requires a paid API key.",
    aiBadge: "KEY REQUIRED",
  },
  report: {
    title: "Scanner report",
    color: "Fur colour",
    brightness: "Brightness",
    contrast: "Contrast",
    fluff: "Fluffiness",
    note: "The card is built from the actual pixels of your photo — the same cat always gives the same card.",
  },
  features: [
    { title: "1. Snap", desc: "Take a photo of your cat or upload an existing one." },
    { title: "2. Scan", desc: "AI analyses the fur and generates a card." },
    { title: "3. Collect", desc: "Build a complete pokedex of your cats!" },
  ],
  uploaded: {
    title: "Photo uploaded!",
    scan: "🔬 SCAN IT",
    other: "Another photo",
  },
  scanning: {
    title: "ANALYSING CAT DNA...",
    stages: [
      "🔍 Scanning the fur...",
      "🧬 Analysing purr DNA...",
      "⚖️ Measuring laziness level...",
      "✨ Determining element...",
      "📊 Calculating stats...",
      "🎴 Printing the Catomon card...",
    ],
  },
  ready: {
    title: "🎉 YOUR CATOMON IS READY!",
    save: "⭐ TO POKEDEX",
    download: "💾 DOWNLOAD PNG",
    again: "➕ NEW CAT",
    saved: "✅ Added to Pokedex!",
  },
  pokedex: {
    title: "YOUR POKEDEX",
    caught: "Cats caught:",
    emptyTitle: "Empty!",
    emptyDesc:
      "You haven't created any Catomon yet. Time to catch your very first cat!",
    emptyBtn: "GO HUNTING 🐾",
    delete: "Delete",
  },
  card: {
    hp: "HP",
    atk: "ATK",
    def: "DEF",
    spd: "SPD",
    spc: "SPC",
    height: "Height",
    weight: "Weight",
    total: "Σ",
    ability: "Ability",
  },
  rarity: {
    common: "Common",
    uncommon: "Uncommon",
    rare: "Rare",
    epic: "Epic",
    legendary: "★ LEGENDARY ★",
  },
  msg: {
    serverDown: "Server unavailable — using the local generator.",
    noKey:
      "Add the OPENAI_API_KEY environment variable in Vercel (Settings → Environment Variables) so the AI can actually analyse your cat's photo. For now the smart local generator is running.",
    downloadFail: "Could not download the image :(",
  },
  footer: "Made with love for cats and Pokémon 🐱❤️",
};

export const TRANSLATIONS: Record<Lang, Translation> = { ru, uk, en };

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const stored = localStorage.getItem("catomon-lang");
  if (stored === "ru" || stored === "uk" || stored === "en") return stored;
  const n = navigator.language.toLowerCase();
  if (n.startsWith("uk")) return "uk";
  if (n.startsWith("ru") || n.startsWith("be") || n.startsWith("kk")) return "ru";
  return "en";
}

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translation;
}

export const I18nContext = createContext<I18nCtx>({
  lang: "ru",
  setLang: () => {},
  t: ru,
});

export const useI18n = () => useContext(I18nContext);
