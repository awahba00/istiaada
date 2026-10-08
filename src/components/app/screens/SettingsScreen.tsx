"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScreenHeader, InfoNote, ToggleRow } from "../shared";
import { RestoreBackup } from "../RestoreBackup";
import { dayKey } from "@/lib/app/helpers";
import { WHEN_TO_SEEK_HELP } from "@/data/app/taxonomy";
import { computeProgress } from "@/lib/app/progress";
import { APP_VERSION } from "@/lib/app/backup";
import {
  TEXT_SIZE_LEVELS,
  getStoredTextSize,
  setTextSize,
  type TextSizeId,
} from "@/lib/app/text-size";
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Moon,
  Sun,
  LifeBuoy,
  Copy,
  Check,
} from "lucide-react";

/** Does the user have meaningful local data an import would replace? */
function hasUserData(data: {
  urgeChecks: unknown[];
  interventionLogs: unknown[];
  relapseEvents: unknown[];
  preventionRules: unknown[];
  dailyLogs: { checkIns: unknown[]; plans: unknown[]; doseLog: unknown[] };
}): boolean {
  return (
    data.urgeChecks.length > 0 ||
    data.interventionLogs.length > 0 ||
    data.relapseEvents.length > 0 ||
    data.preventionRules.length > 0 ||
    data.dailyLogs.checkIns.length > 0 ||
    data.dailyLogs.plans.length > 0 ||
    data.dailyLogs.doseLog.length > 0
  );
}

export function SettingsScreen() {
  const data = useAppStore();
  const setSettings = useAppStore((s) => s.setSettings);
  const resetApp = useAppStore((s) => s.resetApp);
  const exportData = useAppStore((s) => s.exportData);
  const { setTheme } = useTheme();

  const [importOpen, setImportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  // In-app font size (device-local accessibility preference — not part of
  // AppSettings/backup). Applied immediately on click via setTextSize.
  const [textSize, setTextSizeState] = useState<TextSizeId>(getStoredTextSize);
  // Controlled so the destructive confirm registers a Back-navigation
  // sentinel (Hybrid C): Back closes the dialog first, keeping the user on
  // Settings. Mirrors the controlled import dialog above.
  const [eraseConfirmOpen, setEraseConfirmOpen] = useState(false);
  const metrics = computeProgress(data);

  const startDate = dayKey(data.journey.startDate);

  const downloadExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `istiaada-backup-${dayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportData());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="خصوصيتك أولًا — كل حاجة شغالة محليًا على جهازك."
        icon={<SettingsIcon className="size-5" />}
      />

      {/* ————— Privacy explanation ————— */}
      <Card className="border-success/30 bg-success/5">
        <CardContent className="space-y-2.5 pt-5">
          <div className="flex items-center gap-2 font-bold text-success">
            <ShieldCheck className="size-5" />
            خصوصيتك
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            <li>• مفيش حساب، ولا تسجيل دخول، ولا خادم بيستقبل أي حاجة.</li>
            <li>• امسح بياناتك من الشاشة دي وقت ما تحب — والمسح نهائي.</li>
            <li>• مش بنطلب اسمك الحقيقي ولا أي تفاصيل صريحة.</li>
          </ul>
        </CardContent>
      </Card>

      {/* ————— Journey ————— */}
      <Card>
        <CardContent className="space-y-4 pt-5">
          <div className="font-bold">الرحلة</div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor="start-date" className="mb-1.5 block text-xs text-muted-foreground">
                تاريخ بداية الرحلة (اليوم {metrics.daysSinceStart})
              </label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  if (e.target.value) {
                    useAppStore.setState({
                      journey: { startDate: new Date(e.target.value + "T12:00:00").toISOString() },
                    });
                  }
                }}
                className="bg-background text-sm"
              />
            </div>
          </div>
          <InfoNote>
            تغيير التاريخ مش هيأثر على أي سجل تاني — هيغيّر بس عداد الرحلة ومرحلة المحتوى.
          </InfoNote>
        </CardContent>
      </Card>

      {/* ————— Content preferences ————— */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="font-bold">المحتوى والدعم</div>
          <ToggleRow
            title="الجرعة اليومية"
            description="جرعة تعلم يومية مخصصة على الرئيسية"
            checked={data.settings.dailyDoseEnabled}
            onCheckedChange={(v) => setSettings({ dailyDoseEnabled: v })}
          />
          <ToggleRow
            title="المحتوى الروحي/القيمي"
            description="صلاة، ذكر، توبة — بتظهر بس عند تفعيلها"
            checked={data.settings.spiritualContent}
            onCheckedChange={(v) => setSettings({ spiritualContent: v })}
          />
          {/* Only toggles wired to real behavior live here — settings that
              promised nothing (reminders without scheduling, post-relapse
              support with no effect) were removed rather than kept as
              placebos. */}
        </CardContent>
      </Card>

      {/* ————— Appearance ————— */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="font-bold">المظهر</div>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "dark", label: "ليلي هادئ", icon: Moon },
                { id: "light", label: "نهاري", icon: Sun },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setSettings({ theme: t.id });
                  setTheme(t.id);
                }}
                aria-pressed={data.settings.theme === t.id}
                className={`flex items-center justify-center gap-2 rounded-2xl border p-4 font-semibold transition-colors ${
                  data.settings.theme === t.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <t.icon className="size-5" />
                {t.label}
              </button>
            ))}
          </div>
          {/* Text size — device-local a11y preference, never in backup */}
          <div className="space-y-2 pt-1">
            <div className="text-sm font-semibold">حجم الخط</div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              كبّر الخط لو القراية صعبة — التغيير فوري ومحفوظ على الجهاز ده بس.
            </p>
            <div
              role="radiogroup"
              aria-label="حجم الخط"
              className="grid grid-cols-3 gap-2"
            >
              {TEXT_SIZE_LEVELS.map((l) => {
                const active = textSize === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setTextSize(l.id);
                      setTextSizeState(l.id);
                    }}
                    className={`flex items-center justify-center gap-1.5 rounded-2xl border p-3 font-semibold transition-colors ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    {active && <Check className="size-4" aria-hidden="true" />}
                    {l.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ————— Data ————— */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="font-bold">بياناتك ملكك</div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            صدّر نسخة احتياطية بصيغة JSON تقدر تقراها، أو استورد نسختك القديمة على أي جهاز.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-1.5" onClick={downloadExport}>
              <Download className="size-4" />
              تصدير البيانات
            </Button>
            <Button variant="outline" className="gap-1.5" onClick={copyExport}>
              <Copy className="size-4" />
              {copied ? "نُسخ ✓" : "نسخ إلى الحافظة"}
            </Button>
            <Dialog open={importOpen} onOpenChange={setImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-1.5">
                  <Upload className="size-4" />
                  استيراد / استعادة
                </Button>
              </DialogTrigger>
              <DialogContent
                className="rounded-3xl sm:max-w-md"
                aria-describedby={undefined}
              >
                <DialogHeader className="text-start">
                  <DialogTitle>استيراد نسخة احتياطية</DialogTitle>
                </DialogHeader>
                <div className="text-sm leading-relaxed text-muted-foreground">
                  اختار ملف نسخة احتياطية سليم (.json). بنتأكد من سلامته قبل الاستبدال —
                  ولو التحقق فشل، بياناتك الحالية هتفضل زي ما هي من غير أي تغيير.
                </div>
                <RestoreBackup
                  hasExistingData={hasUserData(data)}
                  onRestored={() => {
                    // Keep the dialog open — the persistent success banner
                    // inside RestoreBackup confirms the restore explicitly;
                    // the user closes it when ready (the store no longer
                    // force-navigates away on import).
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* ————— Danger zone ————— */}
      <Card className="border-destructive/30">
        <CardContent className="space-y-3 pt-5">
          <div className="font-bold text-destructive">منطقة الحذر</div>
          <AlertDialog open={eraseConfirmOpen} onOpenChange={setEraseConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-1.5">
                <Trash2 className="size-4" />
                مسح كل البيانات المحلية
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>مسح كل حاجة نهائيًا؟</AlertDialogTitle>
                <AlertDialogDescription className="leading-relaxed">
                  كل بياناتك هتتمسح (فحوصات، مراجعات، خطة، قواعد) من الجهاز ده ومش هتقدر ترجعها. صدّر نسخة احتياطية الأول لو عايز تحافظ عليها.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>رجوع</AlertDialogCancel>
                <AlertDialogAction
                  onClick={resetApp}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  نعم، امسح كل شيء
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* ————— About & help ————— */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <LifeBuoy className="size-4 text-primary" />
            إمتى تحتاج دعم مهني؟
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            {WHEN_TO_SEEK_HELP.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
          <InfoNote>
            التطبيق ده أداة مساعدة ذاتية سلوكية — مش تشخيص، ولا علاج طبي، ولا بديل عن مختص. طلب المساعدة قوة، مش اعتراف بالفشل.
          </InfoNote>
          <p className="text-center text-2xs text-muted-foreground">
            استعادة · نسخة {APP_VERSION} · يعمل محليًا بالكامل
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
