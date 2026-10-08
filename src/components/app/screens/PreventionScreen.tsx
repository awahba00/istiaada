"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScreenHeader, InfoNote, ToggleRow } from "../shared";
import {
  DIGITAL_PROTECTION_GUIDES,
  DIGITAL_PROTECTION_HONESTY,
  SUPPORT_MESSAGE_TEMPLATES,
} from "@/data/app/taxonomy";
import { ShieldCheck, Plus, Trash2, Pencil, Phone, Lock, ArrowRight } from "lucide-react";

export function PreventionScreen() {
  const data = useAppStore();
  const addRule = useAppStore((s) => s.addRule);
  const updateRule = useAppStore((s) => s.updateRule);
  const deleteRule = useAppStore((s) => s.deleteRule);
  const setSupportPerson = useAppStore((s) => s.setSupportPerson);

  const [addOpen, setAddOpen] = useState(false);
  const [ifText, setIfText] = useState("");
  const [thenText, setThenText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [spLabel, setSpLabel] = useState(data.supportPerson?.label ?? "");
  const [spPhone, setSpPhone] = useState(data.supportPerson?.phone ?? "");

  const saveRule = () => {
    if (!ifText.trim() || !thenText.trim()) return;
    if (editingId) {
      updateRule(editingId, { ifText: ifText.trim(), thenText: thenText.trim() });
    } else {
      addRule({
        ifText: ifText.trim(),
        thenText: thenText.trim(),
        active: true,
        source: "user",
      });
    }
    setAddOpen(false);
    setIfText("");
    setThenText("");
    setEditingId(null);
  };

  const openEdit = (id: string, i: string, t: string) => {
    setEditingId(id);
    setIfText(i);
    setThenText(t);
    setAddOpen(true);
  };

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="خطة الوقاية"
        subtitle="قواعد «إذا… إذن» وحمايتك الرقمية — بتتعمل في الهدوء عشان تشتغل وقت العاصفة."
        icon={<ShieldCheck className="size-5" />}
      />

      {/* ————— If/Then rules ————— */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center justify-between">
            <div className="font-bold">قواعدي «إذا… إذن»</div>
            <Button
              size="sm"
              className="gap-1"
              onClick={() => {
                setEditingId(null);
                setIfText("");
                setThenText("");
                setAddOpen(true);
              }}
            >
              <Plus className="size-4" />
              قاعدة جديدة
            </Button>
          </div>

          {data.preventionRules.length === 0 && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              لسه مفيش قواعد — أضف قاعدة لأكتر سياقاتك خطورة.
            </p>
          )}

          <div className="space-y-2.5">
            {data.preventionRules.map((r) => (
              <div
                key={r.id}
                className={`rounded-2xl border p-4 transition-opacity ${
                  r.active ? "border-border bg-card" : "border-border bg-muted/40 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-1.5">
                    <div className="text-sm font-semibold leading-relaxed">
                      <span className="rounded bg-warning/10 px-1.5 py-0.5 text-2xs font-bold text-warning">
                        إذا
                      </span>{" "}
                      {r.ifText}
                    </div>
                    <div className="text-sm font-semibold leading-relaxed">
                      <span className="rounded bg-success/10 px-1.5 py-0.5 text-2xs font-bold text-success">
                        إذن
                      </span>{" "}
                      {r.thenText}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      aria-label="تعديل"
                      onClick={() => openEdit(r.id, r.ifText, r.thenText)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="حذف"
                      onClick={() => deleteRule(r.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <ToggleRow
                  title={r.active ? "مُفعّلة" : "موقوفة"}
                  checked={r.active}
                  onCheckedChange={(v) => updateRule(r.id, { active: v })}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ————— Digital protection ————— */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <Lock className="size-4 text-primary" />
            الحماية الرقمية (أدوات خارجية اختيارية)
          </div>
          <div className="space-y-2">
            {DIGITAL_PROTECTION_GUIDES.map((g) => (
              <details
                key={g.id}
                className="group rounded-xl border border-border bg-background px-4 py-3"
              >
                <summary className="cursor-pointer text-sm font-semibold">
                  {g.title}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.what}</p>
                <ul className="mt-2 space-y-1 text-sm leading-relaxed">
                  {g.how.map((h, i) => (
                    <li key={i} className="flex gap-2">
                      <ArrowRight className="mt-1 size-3.5 shrink-0 rotate-180 text-primary" />
                      {h}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 rounded-lg bg-muted/60 p-2 text-xs leading-relaxed text-muted-foreground">
                  <b>حدوده:</b> {g.limits}
                </p>
              </details>
            ))}
          </div>
          <InfoNote tone="warning">{DIGITAL_PROTECTION_HONESTY}</InfoNote>
          <InfoNote>
            ما تضبطش الأدوات دي أثناء الأزمة (درجة الحالة ٥) — جهّزها من قبل في وقت هادي.
          </InfoNote>
        </CardContent>
      </Card>

      {/* ————— Support person ————— */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <Phone className="size-4 text-primary" />
            شخص دعم (اختياري تمامًا)
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            شخص تثق فيه — هيظهر لك زر الاتصال بيه وقت التصعيد. مش هيتكشف له أي حاجة تلقائيًا؛ الرسائل محايدة خالص.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={spLabel}
              onChange={(e) => setSpLabel(e.target.value)}
              placeholder="شخص تثق به — بيظهر زر اتصاله في التصعيد. لن يُكشف له أي حاجة تلقائيًا؛ الرسائل محايدة خالص."
              className="bg-background text-sm"
            />
            <Input
              value={spPhone}
              onChange={(e) => setSpPhone(e.target.value)}
              placeholder="رقمه (يُخزن محليًا بس)"
              inputMode="tel"
              className="bg-background text-sm"
              dir="ltr"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setSupportPerson(
                  spLabel.trim() && spPhone.trim() ? { label: spLabel.trim(), phone: spPhone.trim() } : null
                )
              }
            >
              {data.supportPerson ? "رقمه (يُخزن محليًا بس)" : "حفظ"}
            </Button>
            {data.supportPerson && (
              <a
                href={`tel:${data.supportPerson.phone}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                <Phone className="size-4" />
                اتصل بـ{data.supportPerson.label}
              </a>
            )}
            {data.supportPerson && (
              <Button size="sm" variant="ghost" onClick={() => setSupportPerson(null)}>
                إزالة
              </Button>
            )}
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <div className="mb-1.5 text-xs font-bold text-muted-foreground">
              قوالب رسائل محايدة (انسخها وقت ما تحتاج):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUPPORT_MESSAGE_TEMPLATES.map((t) => (
                <span key={t} className="rounded-full bg-background px-3 py-1.5 text-xs">
                  «{t}»
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/edit rule dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader className="text-start">
            <DialogTitle>{editingId ? "تعديل" : "قاعدة وقاية جديدة"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 text-sm font-semibold">
                <span className="rounded bg-warning/10 px-1.5 py-0.5 text-2xs font-bold text-warning">
                  إذا
                </span>{" "}
                إيه اللي حصل؟
              </div>
              <Textarea
                value={ifText}
                onChange={(e) => setIfText(e.target.value)}
                placeholder="مثال: حسّيت بالملل ومسكت الهاتف من غير هدف…"
                className="min-h-20 text-sm"
              />
            </div>
            <div>
              <div className="mb-1.5 text-sm font-semibold">
                <span className="rounded bg-success/10 px-1.5 py-0.5 text-2xs font-bold text-success">
                  إذن
                </span>{" "}
                أعمل إيه فورًا؟
              </div>
              <Textarea
                value={thenText}
                onChange={(e) => setThenText(e.target.value)}
                placeholder="مثال: اقفله وقوم وامشي ١٠ دقايق…"
                className="min-h-20 text-sm"
              />
            </div>
            <Button className="w-full" onClick={saveRule} disabled={!ifText.trim() || !thenText.trim()}>
              {editingId ? "حفظ التعديل" : "أضف القاعدة"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
