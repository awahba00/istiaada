"use client";

import type { Intervention } from "@/lib/app/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "./Timer";
import { MapPin, Clock, ArrowLeft, Info } from "lucide-react";

export function InterventionCard({
  iv,
  onComplete,
  compactTimer = false,
}: {
  iv: Intervention;
  onComplete?: () => void;
  compactTimer?: boolean;
}) {
  // F11 — the old `started` state was SET by the Countdown's onComplete and
  // never READ anywhere: dead state (and a hidden StrictMode double-fire
  // hazard while it was written from inside a state updater). The timer is
  // self-contained now; completion needs no card-level bookkeeping.
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/10 px-5 py-3.5 font-bold text-primary">{iv.name}</div>
      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {iv.duration}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {iv.location}
          </span>
        </div>

        <ol className="space-y-2.5">
          {iv.instructions.map((step, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <details className="group rounded-xl border border-border bg-muted/40 px-4 py-3">
          <summary className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Info className="size-4" />
            ليه التدخل ده بيساعد؟
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{iv.whyItHelps}</p>
        </details>

        {iv.durationSec != null && (
          <div className="rounded-xl border border-border bg-background p-4">
            {compactTimer ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">المؤقت:</span>
                <Countdown seconds={iv.durationSec} compact />
              </div>
            ) : (
              <Countdown seconds={iv.durationSec} />
            )}
          </div>
        )}

        {onComplete && (
          <Button onClick={onComplete} className="w-full gap-1.5" size="lg">
            {iv.durationSec ? "تم — عيد التقييم" : "تم"}
            <ArrowLeft className="size-4" />
          </Button>
        )}
        <p className="text-center text-xs text-muted-foreground">
          الخطوة اللي بعدها: {iv.nextAction}
        </p>
      </CardContent>
    </Card>
  );
}
