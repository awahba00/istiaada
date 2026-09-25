"use client";

import { useRef, useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { validateBackup, type BackupSummary } from "@/lib/app/backup";
import { arabicDateTime } from "@/lib/app/helpers";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, FileJson, Check, AlertTriangle, ClipboardPaste } from "lucide-react";

const MAX_BACKUP_BYTES = 20 * 1024 * 1024; // 20MB sanity cap

/**
 * RestoreBackup — shared, self-contained restore-from-JSON flow.
 *
 * Safety properties:
 *  - File/paste content is validated (structure + schema + types) BEFORE import.
 *  - If the user already has data, an explicit confirmation gate is required.
 *  - Import is atomic (store.importData validates again before replacing state).
 *  - On any failure the current data remains untouched and a clear Arabic
 *    error is shown.
 */
export function RestoreBackup({
  hasExistingData,
  onRestored,
}: {
  hasExistingData: boolean;
  onRestored?: () => void;
}) {
  const importData = useAppStore((s) => s.importData);
  const [raw, setRaw] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [showPaste, setShowPaste] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Pure validation for the preview — the same validation runs again inside
  // importData() at the moment of import, so a stale/edited preview can never
  // import something unvalidated.
  const preview: { valid: boolean; summary?: BackupSummary; error?: string } =
    raw.trim() === ""
      ? { valid: false }
      : (() => {
          const res = validateBackup(raw);
          return res.ok
            ? { valid: true, summary: res.summary }
            : { valid: false, error: res.error };
        })();

  const updateRaw = (text: string, name: string | null) => {
    setRaw(text);
    setFileName(name);
    setResult(null);
  };

  const onFile = async (f: File | null) => {
    if (!f) return;
    if (f.size > MAX_BACKUP_BYTES) {
      setResult({ ok: false, error: "الملف كبير جدًا — ليس ملف نسخة احتياطية صالحًا." });
      return;
    }
    try {
      const text = await f.text();
      updateRaw(text, f.name);
    } catch {
      setResult({ ok: false, error: "تعذر قراءة الملف — حاول تاني." });
    }
  };

  const doImport = () => {
    const res = importData(raw);
    setResult(res);
    if (res.ok) {
      onRestored?.();
    }
  };

  const onRestoreClick = () => {
    if (hasExistingData) setConfirmOpen(true);
    else doImport();
  };

  return (
    <div className="space-y-3">
      {/* File picker */}
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="h-12 w-full gap-2 text-base"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="size-5" />
        اختر ملف النسخة الاحتياطية (.json)
      </Button>

      {/* Paste fallback */}
      {!showPaste ? (
        <button
          type="button"
          onClick={() => setShowPaste(true)}
          className="mx-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ClipboardPaste className="size-3.5" />
          أو الصق محتوى النسخة يدويًا
        </button>
      ) : (
        <textarea
          value={raw}
          onChange={(e) => updateRaw(e.target.value, null)}
          placeholder="ألصق محتوى ملف JSON هنا…"
          dir="ltr"
          className="min-h-28 w-full rounded-xl border border-border bg-background p-3 font-mono text-xs leading-relaxed"
        />
      )}

      {/* Preview card — shown once a candidate backup is loaded */}
      {raw.trim() !== "" && (
        <div
          className={`rounded-2xl border p-4 text-sm leading-relaxed ${
            preview.valid
              ? "border-primary/30 bg-primary/5"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          {preview.valid && preview.summary ? (
            <>
              <div className="flex items-center gap-2 font-bold text-primary">
                <FileJson className="size-4" />
                {fileName ?? "نسخة احتياطية صالحة"}
              </div>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {preview.summary.exportedAt && (
                  <li>
                    • تاريخ التصدير: {arabicDateTime(preview.summary.exportedAt)}
                  </li>
                )}
                <li>• فحوصات الرغبة: {preview.summary.urgeChecks}</li>
                <li>• زلات وانتكاسات مسجلة: {preview.summary.relapses}</li>
                <li>• قواعد وقاية: {preview.summary.rules}</li>
                <li>• تدخلات: {preview.summary.interventions}</li>
              </ul>
              {hasExistingData && (
                <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-warning/10 p-2.5 text-xs">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                  <span>
                    استعادة النسخة الاحتياطية ستستبدل بياناتك الحالية — سيُطلب تأكيدك
                    قبل ذلك.
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-start gap-2 font-medium text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{preview.error ?? "الملف غير صالح."}</span>
            </div>
          )}
        </div>
      )}

      {/* Result banner — persists after a successful restore (the parent
          keeps the dialog open) so the confirmation is explicit, not a flash. */}
      {result && (
        <div
          className={`rounded-xl p-3.5 text-sm leading-relaxed ${
            result.ok
              ? "bg-success/15 text-success"
              : "bg-destructive/15 text-destructive"
          }`}
          role="status"
        >
          {result.ok ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <Check className="size-4 shrink-0" />
                تمت الاستعادة بنجاح
              </div>
              <p className="text-success/90">
                بياناتك كما كانت يوم صدّرت النسخة. أغلق هذه النافذة وستجد كل شيء في
                مكانه — التطبيق يعمل الآن ببياناتك المستعادة.
              </p>
            </div>
          ) : (
            <span className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{result.error}</span>
            </span>
          )}
        </div>
      )}

      {/* Primary restore action — disabled after a successful restore to
          prevent importing the same (now stale) payload twice. */}
      <Button
        type="button"
        size="lg"
        className="h-12 w-full text-base font-bold"
        disabled={!preview.valid || result?.ok === true}
        onClick={onRestoreClick}
      >
        استعادة النسخة الاحتياطية
      </Button>

      {/* Confirmation gate when current data would be replaced */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        {/* No custom aria-describedby/description id — Radix wires the
            description automatically; a manual id breaks that association
            and triggers the "Missing Description" warning. */}
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>استرجاع النسخة الاحتياطية هيستبدل بياناتك الحالية. تحب تكمل؟</AlertDialogTitle>
            <AlertDialogDescription className="leading-relaxed">
              استعادة النسخة الاحتياطية ستستبدل بياناتك الحالية. هل تريد المتابعة؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>تراجع</AlertDialogCancel>
            <AlertDialogAction onClick={doImport}>نعم، استعِد النسخة</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
