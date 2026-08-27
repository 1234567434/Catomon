import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export const KEY_STORAGE = "catomon-gemini-key";

export function getStoredKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
}

interface Health {
  anyKey?: boolean;
  gemini?: { present?: boolean; length?: number; prefix?: string };
  similarEnvNames?: string[];
}

export default function ApiKeyPanel() {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [stored, setStored] = useState("");
  const [saved, setSaved] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const k = getStoredKey();
    setStored(k);
    setValue(k);
  }, []);

  const check = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/health");
      setHealth(await res.json());
    } catch {
      setHealth({ anyKey: false });
    }
    setChecking(false);
  };

  const save = () => {
    const v = value.trim();
    try {
      if (v) localStorage.setItem(KEY_STORAGE, v);
      else localStorage.removeItem(KEY_STORAGE);
    } catch {}
    setStored(v);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clear = () => {
    try {
      localStorage.removeItem(KEY_STORAGE);
    } catch {}
    setValue("");
    setStored("");
  };

  const status = stored
    ? { text: t.key.statusLocal, cls: "text-emerald-300", dot: "bg-emerald-400" }
    : health?.anyKey
      ? { text: t.key.statusServer, cls: "text-emerald-300", dot: "bg-emerald-400" }
      : { text: t.key.statusNone, cls: "text-amber-300", dot: "bg-amber-400" };

  return (
    <div className="mx-auto mt-3 max-w-2xl rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-display text-[9px] uppercase tracking-wider text-amber-300">
          🔑 {t.key.title}
        </h4>
        <span className={`flex items-center gap-1.5 text-[10px] ${status.cls}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.text}
        </span>
      </div>

      <p className="mb-3 text-[11px] leading-snug text-white/50">{t.key.hint}</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.key.placeholder}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={save}
            className="flex-1 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 font-display text-[9px] font-bold text-white transition hover:scale-105 sm:flex-none"
          >
            {t.key.save}
          </button>
          {stored && (
            <button
              onClick={clear}
              className="rounded-lg bg-white/10 px-3 py-2 font-display text-[9px] text-white/70 ring-1 ring-white/10 transition hover:bg-white/20"
            >
              {t.key.clear}
            </button>
          )}
        </div>
      </div>

      {saved && <p className="mt-2 text-[11px] text-emerald-300">{t.key.saved}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-medium text-sky-300 underline-offset-2 hover:underline"
        >
          {t.key.getKey}
        </a>
        <button
          onClick={check}
          disabled={checking}
          className="text-[11px] text-white/50 underline-offset-2 hover:text-white/80 hover:underline disabled:opacity-50"
        >
          {checking ? "..." : t.key.check}
        </button>
        <span className="text-[10px] text-white/30">⚠️ {t.key.warn}</span>
      </div>

      {health && (
        <pre className="mt-3 overflow-x-auto rounded-lg bg-black/50 p-2 font-mono text-[10px] leading-relaxed text-white/60">
{`server key: ${health.gemini?.present ? `✅ found (len ${health.gemini.length}, starts "${health.gemini.prefix}")` : "❌ not found"}
env names : ${health.similarEnvNames?.length ? health.similarEnvNames.join(", ") : "—"}`}
        </pre>
      )}
    </div>
  );
}
