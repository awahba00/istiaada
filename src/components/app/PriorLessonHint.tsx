"use client";

import { useState } from "react";
import type { RelevantLesson } from "@/lib/app/lesson-match";
import { TRIGGERS } from "@/data/app/taxonomy";
import { arabicDateTime } from "@/lib/app/helpers";
import { ChevronLeft, X, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GAP-09 — one quiet, collapsed-by-default line that offers the user
 * THEIR OWN prior lesson at the moment it might help. It is a question,
 * not an instruction; it never blocks the flow it appears in.
 *
 * Dismissal is session-scoped and keyed to the exact lesson: dismissing
 * the «ملل» lesson from last Tuesday does not silence a different lesson
 * tomorrow, but re-checking the same urge in the SAME session will not
 * nag with a lesson the user already waved off. The set is module-level
 * on purpose: it survives screen re-mounts (navigation) and dies on
 * reload — nothing about it is persisted.
 */
const dismissedLessonKeys = new Set<string>();

const lessonKey = (l: RelevantLesson): string =>
  `${l.source}:${l.ts}:${l.matchedTriggerId}`;

export function isLessonDismissedThisSession(l: RelevantLesson): boolean {
  return dismissedLessonKeys.has(lessonKey(l));
}

export function PriorLessonHint({
  lesson,
  compact = false,
}: {
  lesson: RelevantLesson;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(() =>
    isLessonDismissedThisSession(lesson)
  );

  if (dismissed) return null;

  const label =
    TRIGGERS.find((t) => t.id === lesson.matchedTriggerId)?.label ??
    lesson.matchedTriggerId;

  const dismiss = () => {
    dismissedLessonKeys.add(lessonKey(lesson));
    setDismissed(true);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/25 bg-primary/5",
        compact ? "px-4 py-3" : "p-4"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
          className="flex min-w-0 flex-1 items-start gap-2 text-start"
        >
          <NotebookPen className="mt-0.5 size-4 shrink-0 text-primary" />
          <span className="text-sm font-medium leading-relaxed">
            من تجربتك السابقة مع «{label}»: إيه اللي ساعدك توقف السلسلة؟
          </span>
          <ChevronLeft
            className={cn(
              "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform",
              expanded && "-rotate-90"
            )}
          />
        </button>
        <button
          type="button"
          aria-label="إخفاء تلميح الدرس"
          onClick={dismiss}
          className="-mt-1 shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2.5 border-t border-primary/15 pt-3">
          {lesson.cutPoint && (
            <div className="text-sm leading-relaxed">
              <span className="font-bold text-primary">نقطة القطع اللي سجلتها: </span>
              <span className="text-muted-foreground">{lesson.cutPoint}</span>
            </div>
          )}
          <div className="text-sm leading-relaxed">
            <span className="font-bold text-primary">درسك: </span>
            <span className="text-muted-foreground">{lesson.lesson}</span>
          </div>
          <p className="text-2xs leading-relaxed text-muted-foreground">
            سُجل {arabicDateTime(lesson.ts)} — كلماتك أنت. جربها لو حاسس إنها
            لسه بتناسب لحظتك، وسيبها لو مش وقتها.
          </p>
        </div>
      )}
    </div>
  );
}
