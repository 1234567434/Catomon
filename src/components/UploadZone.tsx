import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import CameraModal from "./CameraModal";

interface Props {
  onImage: (dataUrl: string) => void;
}

export default function UploadZone({ onImage }: Props) {
  const { t } = useI18n();
  const [dragActive, setDragActive] = useState(false);
  const [camOpen, setCamOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fallbackCamRef = useRef<HTMLInputElement | null>(null);

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const openCamera = () => {
    // Настоящая камера с живым превью (работает и на ПК, и на телефоне)
    const hasCam = typeof navigator.mediaDevices?.getUserMedia === "function";
    if (hasCam && window.isSecureContext) {
      setCamOpen(true);
    } else {
      // Запасной путь: системная камера телефона
      fallbackCamRef.current?.click();
    }
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl border-4 border-dashed p-8 sm:p-12 text-center transition-all ${
          dragActive
            ? "border-amber-300 bg-amber-100/20 scale-[1.02]"
            : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const f = e.dataTransfer.files?.[0];
          if (f) readFile(f);
        }}
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
          <div className="relative h-16 w-16 animate-bounce-slow">
            <div className="absolute inset-0 rounded-full border-[3px] border-white bg-gradient-to-b from-red-500 to-red-600" style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }} />
            <div className="absolute inset-0 rounded-full border-[3px] border-white bg-gradient-to-b from-white to-slate-200" style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }} />
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-white" />
            <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-white shadow-inner">
              <div className="absolute inset-1 rounded-full border-2 border-slate-800 bg-white" />
            </div>
          </div>
        </div>

        <h3 className="font-display text-base font-bold text-white sm:text-2xl">
          {t.upload.drop}
        </h3>
        <p className="mt-2 text-sm text-white/70 sm:text-base">{t.upload.or}</p>

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <button
            onClick={() => inputRef.current?.click()}
            className="rounded-xl bg-gradient-to-r from-amber-400 to-red-500 px-6 py-3 font-display text-[10px] font-bold text-white shadow-lg shadow-red-500/30 transition hover:scale-105 hover:shadow-xl sm:text-sm"
          >
            {t.upload.file}
          </button>
          <button
            onClick={openCamera}
            className="rounded-xl bg-white/10 px-6 py-3 font-display text-[10px] font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:scale-105 hover:bg-white/20 sm:text-sm"
          >
            {t.upload.camera}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) readFile(f);
            e.target.value = "";
          }}
        />
        <input
          ref={fallbackCamRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) readFile(f);
            e.target.value = "";
          }}
        />
      </div>

      <CameraModal open={camOpen} onClose={() => setCamOpen(false)} onCapture={onImage} />
    </>
  );
}
