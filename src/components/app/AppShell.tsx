"use client";

import { useAppStore, type ScreenId } from "@/lib/app/store";
import { useEmergencyLauncher } from "@/lib/app/emergency-launcher";
import { AnimatePresence, motion } from "framer-motion";
import {
  Siren,
  Menu,
  Home,
  Pill,
  ListChecks,
  X,
  Gauge,
  Radar,
  LifeBuoy,
  ShieldCheck,
  TrendingUp,
  Heart,
  LibraryBig,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { LogoMark } from "./LogoMark";
import {
  HomeScreen,
  DoseScreen,
  PlanScreen,
  UrgeScreen,
  TriggerMapScreen,
  RelapseScreen,
  PreventionScreen,
  ProgressScreen,
  ValuesScreen,
  KnowledgeScreen,
  SettingsScreen,
} from "./screens";

export const NAV_ITEMS: {
  id: ScreenId;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "home", label: "الرئيسية", desc: "نظرة اليوم وحالتك", icon: Home },
  { id: "dose", label: "الجرعة اليومية", desc: "دقيقة معرفة في يومك الهادي", icon: Pill },
  { id: "plan", label: "الخطة اليومية", desc: "بناء يوم يستحق", icon: ListChecks },
  { id: "urge", label: "فحص الرغبة", desc: "بدأت رغبة؟ اعرف خطوتك", icon: Gauge },
  { id: "trigger-map", label: "خريطة المحفزات", desc: "أنماط سجلك ونقطة التوقف الأبكر", icon: Radar },
  { id: "relapse", label: "توقّف هنا", desc: "حصلت زَلّة؟ إيقاف فوري ثم فهم هادئ", icon: LifeBuoy },
  { id: "prevention", label: "خطة الوقاية", desc: "قواعد «إذا… إذن» وحمايتك", icon: ShieldCheck },
  { id: "progress", label: "التقدم", desc: "مؤشرات حقيقية من غير نسب زائفة", icon: TrendingUp },
  { id: "values", label: "القيم والروحانيات", desc: "ليه بعمل ده؟", icon: Heart },
  { id: "knowledge", label: "قاعدة المعرفة", desc: "قراءة هادئة — للوقت الهادي", icon: LibraryBig },
  { id: "settings", label: "الإعدادات", desc: "خصوصيتك وبياناتك", icon: Settings },
];

const SCREEN_COMPONENTS: Record<ScreenId, React.ComponentType> = {
  home: HomeScreen,
  dose: DoseScreen,
  plan: PlanScreen,
  urge: UrgeScreen,
  emergency: HomeScreen, // emergency renders as overlay, never routed here
  "trigger-map": TriggerMapScreen,
  relapse: RelapseScreen,
  prevention: PreventionScreen,
  progress: ProgressScreen,
  values: ValuesScreen,
  knowledge: KnowledgeScreen,
  settings: SettingsScreen,
};

// Bottom-nav direct tabs; every other screen lives behind «المزيد» (More).
const DIRECT_TAB_SCREENS = new Set<ScreenId>(["home", "dose", "plan"]);

// A screen that belongs to the More/secondary section (never a direct tab;
// "emergency" is an overlay that is never routed to).
const isMoreScreen = (id: ScreenId) =>
  id !== "emergency" && !DIRECT_TAB_SCREENS.has(id);

function EmergencyButton({
  onClick,
  compact = false,
}: {
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "emergency-pulse inline-flex items-center justify-center gap-2 rounded-full bg-destructive font-bold text-destructive-foreground shadow-lg transition-transform active:scale-95",
        compact ? "h-10 px-4 text-sm" : "h-12 px-6 text-base"
      )}
    >
      <Siren className={compact ? "size-4" : "size-5"} />
      تدخّل دلوقتي
    </button>
  );
}

export function AppShell() {
  const screen = useAppStore((s) => s.screen);
  const navigate = useAppStore((s) => s.navigate);
  const launchEmergency = useEmergencyLauncher();
  const [moreOpen, setMoreOpen] = useState(false);

  // Every always-on SOS entry point goes through the launcher — Work-Safe
  // is derived from the user's profile (deviceNeeds) consistently (I4).
  const openEmergency = () => launchEmergency(5);

  // F1 — true while the current page is one of the More/secondary screens;
  // the bottom-nav «المزيد» control represents that page.
  const onMoreScreen = isMoreScreen(screen);

  // F2 — on screen navigation, reset the page scroll to the top. Keyed to
  // the existing `screen` state only; navigate()/store semantics untouched.
  // "instant" overrides the app-wide CSS `scroll-behavior: smooth` so the
  // reset is a jump, not a glide. The initial mount is not a navigation.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [screen]);

  const Screen = SCREEN_COMPONENTS[screen];

  const go = (s: ScreenId) => {
    navigate(s);
    setMoreOpen(false);
  };

  return (
    // id="app-shell-root": Emergency Mode marks this subtree inert +
    // aria-hidden while the overlay is open, so focus can never escape into
    // the background (P4).
    <div className="min-h-screen" id="app-shell-root">
      {/* ————— Desktop sidebar ————— */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col border-e border-border bg-sidebar lg:flex">
        <div className="flex items-center gap-3 px-5 pt-6 pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LogoMark className="size-7" />
          </div>
          <div>
            <div className="font-bold leading-tight">استعادة</div>
            <div className="text-[11px] text-muted-foreground">نظام شخصي للتحكم</div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <EmergencyButton onClick={openEmergency} compact />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="التنقل الرئيسي">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              aria-current={screen === item.id ? "page" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors",
                screen === item.id
                  ? "bg-primary/15 font-semibold text-primary"
                  : "text-foreground/80 hover:bg-accent hover:text-foreground"
              )}
            >
              {item.icon && <item.icon className="size-4 shrink-0" />}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-border px-5 py-3 text-[11px] leading-relaxed text-muted-foreground">
          بياناتك على جهازك بس — من غير حسابات ولا خوادم.
        </div>
      </aside>

      {/* ————— Main content ————— */}
      <div className="lg:ps-64">
        <main className="mx-auto w-full max-w-3xl px-4 pt-5 pb-28 sm:px-6 lg:pt-8 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Screen />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ————— Mobile bottom nav ————— */}
      <nav
        className="safe-b fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden"
        aria-label="التنقل السفلي"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-1.5 pb-1.5">
          <button
            type="button"
            onClick={() => go("home")}
            aria-current={screen === "home" ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
              screen === "home" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Home className="size-5" />
            الرئيسية
          </button>
          <button
            type="button"
            onClick={() => go("dose")}
            aria-current={screen === "dose" ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
              screen === "dose" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Pill className="size-5" />
            الجرعة
          </button>

          {/* Center: persistent Emergency */}
          <div className="relative flex items-end justify-center">
            <button
              type="button"
              onClick={openEmergency}
              aria-label="تدخل دلوقتي — وضع الطوارئ"
              className="emergency-pulse -mt-6 flex size-16 flex-col items-center justify-center gap-0.5 rounded-full bg-destructive text-destructive-foreground shadow-xl transition-transform active:scale-90"
            >
              <Siren className="size-6" />
              <span className="text-[9px] font-bold">تدخل دلوقتي</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => go("plan")}
            aria-current={screen === "plan" ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
              screen === "plan" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <ListChecks className="size-5" />
            الخطة
          </button>
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-label="المزيد من الأقسام"
            aria-current={onMoreScreen ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
              moreOpen || onMoreScreen ? "text-primary" : "text-muted-foreground",
              onMoreScreen && "font-bold"
            )}
          >
            <Menu className="size-5" strokeWidth={onMoreScreen ? 2.75 : 2} />
            المزيد
          </button>
        </div>
      </nav>

      {/* ————— More sheet (mobile) ————— */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-4 pb-[calc(env(safe-area-inset-bottom,0px)+2rem)] pt-3"
          aria-describedby={undefined}
          showCloseButton={false}
        >
          <SheetTitle className="mb-4 text-center text-base font-bold">
            كل الأقسام
          </SheetTitle>
          <button
            type="button"
            onClick={() => setMoreOpen(false)}
            aria-label="إغلاق"
            className="absolute end-2.5 top-1.5 flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
          >
            <X className="size-4" />
          </button>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-current={screen === item.id ? "page" : undefined}
                className={cn(
                  "flex flex-col gap-1.5 rounded-2xl border p-4 text-start transition-colors",
                  screen === item.id
                    ? "border-primary/40 bg-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                {item.icon && <item.icon className="size-5 text-primary" />}
                <span className="text-sm font-semibold leading-tight">{item.label}</span>
                <span className="text-[11px] leading-snug text-muted-foreground">{item.desc}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMoreOpen(false);
                openEmergency();
              }}
              className="flex flex-col gap-1.5 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-start"
            >
              <Siren className="size-5 text-destructive" />
              <span className="text-sm font-bold text-destructive">تدخّل دلوقتي</span>
              <span className="text-[11px] leading-snug text-muted-foreground">
                لحظة خطر؟ وضع الطوارئ — خطوات مباشرة من غير تشتيت
              </span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
