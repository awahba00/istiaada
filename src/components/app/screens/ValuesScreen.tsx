"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScreenHeader, InfoNote, ChipMultiSelect } from "../shared";
import { PERSONAL_WHY_REASONS, SPIRITUAL_PRACTICES, SPIRITUAL_DISCLAIMER } from "@/data/app/taxonomy";
import { Heart, Save, Moon, Star, Compass } from "lucide-react";

export function ValuesScreen() {
  const data = useAppStore();
  const updateWhy = useAppStore((s) => s.updateWhy);
  const setSettings = useAppStore((s) => s.setSettings);

  const [why, setWhy] = useState(data.userProfile.why);
  const [whyReasons, setWhyReasons] = useState<string[]>(data.userProfile.whyReasons);
  const [saved, setSaved] = useState(false);
  const [savedTick, setSavedTick] = useState(0);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [saved, savedTick]);

  const save = () => {
    updateWhy(why, whyReasons);
    setSaved(true);
    setSavedTick((t) => t + 1);
  };

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="القيم والروحانيات"
        subtitle="سببك أنت — يظهر لك في اللحظات الصعبة. المحتوى الروحي اختياري بالكامل."
        icon={<Heart className="size-5" />}
      />

      {/* ————— Personal Why ————— */}
      <Card className="border-primary/30">
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center gap-2 text-lg font-bold text-primary">
            <Compass className="size-5" />
            لماذا أفعل هذا؟
          </div>

          <div className="flex flex-wrap gap-2">
            {whyReasons.map((r) => {
              const label = PERSONAL_WHY_REASONS.find((p) => p.id === r)?.label ?? r;
              return (
                <span
                  key={r}
                  className="rounded-full bg-primary/15 px-3.5 py-1.5 text-sm font-semibold text-primary"
                >
                  {label}
                </span>
              );
            })}
          </div>

          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="text-xs font-bold text-primary">كلماتك أنت:</div>
            <p className="mt-1.5 min-h-10 text-sm font-semibold leading-relaxed">
              {data.userProfile.why.trim() || "لم تكتب سببك بعد — اكتبه أدناه؛ سيظهر هنا وفي لحظاتك الصعبة."}
            </p>
          </div>

          <ChipMultiSelect
            size="sm"
            options={PERSONAL_WHY_REASONS}
            value={whyReasons}
            onChange={setWhyReasons}
          />
          <Textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="لسه ما كتبتش سببك — اكتبه تحت؛ وهتلاقيه هنا وفي لحظاتك الصعبة."
            className="min-h-28 bg-background text-sm leading-relaxed"
            maxLength={400}
          />
          <div className="flex items-center gap-3">
            <Button onClick={save} className="gap-1.5">
              <Save className="size-4" />
              حفظ سببي
            </Button>
            {saved && <span className="text-sm font-semibold text-success">حُفظ ✓</span>}
          </div>
        </CardContent>
      </Card>

      {/* ————— Values clarification ————— */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="font-bold">قيمي في جُمل</div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            اكتب جملة قصيرة لكل قيمة تهمّك — القيمة غير المكتوبة شعور عابر، والمكتوبة
            معيار يومي. صُغها بعمق — ستجد موضوع «القيم» في قاعدة المعرفة.
          </p>
          <ValuesDraft />
        </CardContent>
      </Card>

      {/* ————— Spiritual (gated) ————— */}
      <Card>
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold">
              <Moon className="size-4 text-primary" />
              المحتوى الروحي
            </div>
            <Switch
              checked={data.settings.spiritualContent}
              onCheckedChange={(v) => setSettings({ spiritualContent: v })}
              aria-label="تفعيل المحتوى الروحي"
            />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            صلاة، ذكر، قراءة قرآن، تأمل، توبة وعودة — تظهر فقط لمن يفعّلها، وتُفصل
            تمامًا عن المحتوى العلمي في التطبيق.
          </p>

          {data.settings.spiritualContent && (
            <>
              <InfoNote tone="info">{SPIRITUAL_DISCLAIMER}</InfoNote>
              <div className="space-y-2.5">
                {SPIRITUAL_PRACTICES.map((p) => (
                  <details
                    key={p.id}
                    className="rounded-xl border border-border bg-background px-4 py-3.5"
                  >
                    <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                      <Star className="size-4 text-primary" />
                      {p.title}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                    {p.steps && (
                      <ol className="mt-2.5 space-y-1.5 text-sm leading-relaxed">
                        {p.steps.map((s, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-[11px] font-bold text-primary">
                              {i + 1}
                            </span>
                            {s}
                          </li>
                        ))}
                      </ol>
                    )}
                  </details>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Values draft — persisted to its own localStorage key (I6) so meaningful
 * user input never disappears on navigation/reload. Kept OUTSIDE the main
 * app state on purpose: it is a scratchpad, not app data, so it neither
 * bloats backups nor changes the backup schema.
 */
const VALUES_DRAFT_KEY = "istiaada-values-draft-v1";

function ValuesDraft() {
  const [values, setValues] = useState<{ value: string; sentence: string }[]>(() => {
    try {
      const raw = localStorage.getItem(VALUES_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (x) => x && typeof x.value === "string" && typeof x.sentence === "string"
          )
        ) {
          return parsed as { value: string; sentence: string }[];
        }
      }
    } catch {
      /* unreadable draft — start fresh */
    }
    return [{ value: "", sentence: "" }];
  });

  // Save on every change (cheap payload, device-local).
  useEffect(() => {
    try {
      localStorage.setItem(VALUES_DRAFT_KEY, JSON.stringify(values));
    } catch {
      /* storage unavailable (private mode) — draft stays in-session */
    }
  }, [values]);

  return (
    <div className="space-y-2.5">
      {values.map((v, i) => (
        <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[110px_1fr]">
          <input
            value={v.value}
            onChange={(e) =>
              setValues((arr) => arr.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
            }
            placeholder={`قيمة ${i + 1}`}
            className="min-w-0 rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <input
            value={v.sentence}
            onChange={(e) =>
              setValues((arr) => arr.map((x, j) => (j === i ? { ...x, sentence: e.target.value } : x)))
            }
            placeholder="جملتها — مثال: أحترم وقتي فلا أبيعه رخيصًا"
            className="min-w-0 rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setValues((arr) => [...arr, { value: "", sentence: "" }])}
      >
        + قيمة أخرى
      </Button>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        تُحفظ هذه المسودة على جهازك تلقائيًا — تبقى هنا مهما تنقّلت أو أعدت فتح
        التطبيق، وما يعنيك منه انقله إلى سببك الشخصي أعلاه ليظهر في لحظاتك الصعبة.
      </p>
    </div>
  );
}
