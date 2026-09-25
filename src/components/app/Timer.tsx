"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Countdown({
  seconds,
  onComplete,
  compact = false,
  autoStart = false,
}: {
  seconds: number;
  onComplete?: () => void;
  compact?: boolean;
  autoStart?: boolean;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(autoStart);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && !done) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            setDone(true);
            onComplete?.();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, done, onComplete]);

  const mm = Math.floor(remaining / 60);
  const ss = remaining % 60;
  const display = `${mm}:${String(ss).padStart(2, "0")}`;
  const pct = done ? 1 : 1 - remaining / seconds;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="tnum text-lg font-bold tabular-nums">{display}</span>
        {!done && (
          <Button
            type="button"
            size="sm"
            variant={running ? "outline" : "default"}
            onClick={() => setRunning((r) => !r)}
            className="h-8 w-8 p-0"
            aria-label={running ? "إيقاف مؤقت" : "تشغيل"}
          >
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex size-40 items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="6"
            className="stroke-border"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - pct)}
            className={cn(
              "transition-[stroke-dashoffset] duration-1000 ease-linear",
              done ? "stroke-success" : "stroke-primary"
            )}
          />
        </svg>
        <div className="text-center">
          <div className="tnum text-3xl font-bold">{display}</div>
          {done ? (
            <div className="text-xs font-semibold text-success">اكتمل الوقت</div>
          ) : (
            <div className="text-xs text-muted-foreground">
              {running ? "جارٍ التنفيذ…" : "متوقف"}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!done && (
          <>
            <Button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="min-w-28 gap-1.5"
            >
              {running ? (
                <>
                  <Pause className="size-4" /> إيقاف مؤقت
                </>
              ) : (
                <>
                  <Play className="size-4" /> {remaining === seconds ? "ابدأ" : "استئناف"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRemaining(seconds);
                setRunning(false);
                setDone(false);
              }}
              className="gap-1.5"
              aria-label="إعادة"
            >
              <RotateCcw className="size-4" />
            </Button>
          </>
        )}
        {done && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setRemaining(seconds);
              setDone(false);
            }}
            className="gap-1.5"
          >
            <RotateCcw className="size-4" /> مرة أخرى
          </Button>
        )}
      </div>
      {done && (
        <div className="flex items-center gap-1.5 text-sm font-semibold text-success">
          <Check className="size-4" /> أنجزت الوقت — أعد التقييم الآن
        </div>
      )}
    </div>
  );
}
