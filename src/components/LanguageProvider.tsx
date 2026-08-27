import { useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nContext, TRANSLATIONS, detectLang, type Lang } from "@/lib/i18n";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("catomon-lang", l);
    } catch {}
  };

  const value = useMemo(
    () => ({ lang, setLang, t: TRANSLATIONS[lang] }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
