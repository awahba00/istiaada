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

  // Completion is DERIVED from remaining === 0 (B6/lint restructure): the
  // tick is the only thing that drives remaining to 0, and `done` is
  // therefore always consistent with the displayed clock — no completion
  // effect racing setState (the old pattern the react-hooks
  // set-state-in-effect rule rightly flags; F11's purity fix predates it).
  // Behavior contract preserved exactly:
  //   - reaching 0 stops the clock (the interval effect keys on done);
  //   - the reset button keeps `running=false` (shows «ابدأ»);
  //   - the restart-after-done button ALSO sets running=false — identical
  //     to the old completion path where the transition effect turned
  //     running off before done was cleared;
  //   - a seconds===0 initial mount completes instantly (same as before).
  const done = remaining === 0;

  // The ticking updater stays pure (F11): decrement only, never a
  // side-effect inside the updater.
  useEffect(() => {
    if (!running || done) return;
    const id = setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running, done]);

  // onComplete fires exactly once per completion transition (mount included
  // when seconds === 0). The latest callback is kept in a ref so parent
  // re-renders (inline arrow functions) can neither refire it nor keep it
  // stale.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });
  useEffect(() => {
    if (done) onCompleteRef.current?.();
  }, [done]);

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
            <div className="text-xs font-semibold text-success">الوقت خلص</div>
          ) : (
            <div className="text-xs text-muted-foreground">
              {running ? "شغّال دلوقتي…" : "متوقف"}
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
                  <Play className="size-4" /> {remaining === seconds ? "ابدأ" : "كمّل"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRemaining(seconds);
                setRunning(false);
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
              setRunning(false);
            }}
            className="gap-1.5"
          >
            <RotateCcw className="size-4" /> اعملها مرة تانية
          </Button>
        )}
      </div>
      {done && (
        <div className="flex items-center gap-1.5 text-sm font-semibold text-success">
          <Check className="size-4" /> الوقت خلص — عيد التقييم دلوقتي
        </div>
      )}
    </div>
  );
}
