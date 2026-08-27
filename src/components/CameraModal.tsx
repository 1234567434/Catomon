import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface Props {
  open: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export default function CameraModal({ open, onClose, onCapture }: Props) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [shot, setShot] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(
    async (mode: "environment" | "user") => {
      setLoading(true);
      setError(null);
      stop();

      if (!navigator.mediaDevices?.getUserMedia) {
        setError(t.camera.unsupported);
        setLoading(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setLoading(false);
      } catch (e) {
        console.warn("Camera error", e);
        const err = e as { name?: string };
        setError(
          err?.name === "NotAllowedError" || err?.name === "SecurityError"
            ? t.camera.denied
            : t.camera.unsupported
        );
        setLoading(false);
      }
    },
    [stop, t.camera.denied, t.camera.unsupported]
  );

  useEffect(() => {
    if (open) {
      setShot(null);
      start(facing);
    } else {
      stop();
      setShot(null);
    }
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const flip = () => {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    start(next);
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    const canvas = document.createElement("canvas");
    // квадратный кадр — идеально ложится в карточку
    canvas.width = 900;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    if (facing === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, size, size, 0, 0, canvas.width, canvas.height);

    setFlash(true);
    setTimeout(() => setFlash(false), 220);
    setShot(canvas.toDataURL("image/jpeg", 0.92));
  };

  const confirm = () => {
    if (!shot) return;
    onCapture(shot);
    stop();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h3 className="font-display text-[11px] text-white">📷 {t.camera.title}</h3>
          <button
            onClick={() => {
              stop();
              onClose();
            }}
            className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label={t.camera.close}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Viewport */}
        <div className="relative aspect-square w-full bg-black">
          {!shot && (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`h-full w-full object-cover ${facing === "user" ? "-scale-x-100" : ""}`}
            />
          )}
          {shot && <img src={shot} alt="shot" className="h-full w-full object-cover" />}

          {/* Flash */}
          {flash && <div className="absolute inset-0 animate-fade-in bg-white" />}

          {/* Framing guides */}
          {!shot && !error && (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-6 top-6 h-10 w-10 rounded-tl-xl border-l-4 border-t-4 border-white/60" />
              <div className="absolute right-6 top-6 h-10 w-10 rounded-tr-xl border-r-4 border-t-4 border-white/60" />
              <div className="absolute bottom-6 left-6 h-10 w-10 rounded-bl-xl border-b-4 border-l-4 border-white/60" />
              <div className="absolute bottom-6 right-6 h-10 w-10 rounded-br-xl border-b-4 border-r-4 border-white/60" />
            </div>
          )}

          {loading && !error && !shot && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/80">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-amber-400" />
              <p className="text-sm text-white/70">{t.camera.loading}</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="text-4xl">🚫</span>
              <p className="text-sm text-white/80">{error}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 px-4 py-4">
          {!shot ? (
            <>
              <button
                onClick={flip}
                disabled={!!error}
                className="rounded-xl bg-white/10 px-4 py-3 font-display text-[9px] text-white ring-1 ring-white/15 transition hover:bg-white/20 disabled:opacity-40"
              >
                {t.camera.flip}
              </button>
              <button
                onClick={capture}
                disabled={!!error || loading}
                className="group relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/40 transition hover:scale-110 disabled:opacity-40"
                aria-label={t.camera.shoot}
              >
                <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-white" />
                <span className="relative h-5 w-5 rounded-full border-[3px] border-white bg-white" />
              </button>
              <div className="w-[92px]" />
            </>
          ) : (
            <>
              <button
                onClick={() => setShot(null)}
                className="rounded-xl bg-white/10 px-5 py-3 font-display text-[9px] text-white ring-1 ring-white/15 transition hover:bg-white/20"
              >
                {t.camera.retake}
              </button>
              <button
                onClick={confirm}
                className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-6 py-3 font-display text-[9px] font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:scale-105"
              >
                {t.camera.use}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
