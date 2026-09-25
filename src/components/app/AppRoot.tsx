"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useAppStore } from "@/lib/app/store";
import { AppShell } from "./AppShell";
import { Onboarding } from "./Onboarding";
import { EmergencyMode } from "./screens";
import { useTheme } from "next-themes";

/**
 * AppRoot — hydration guard → onboarding → shell (+ emergency overlay).
 * We read zustand-persist's hydration state via useSyncExternalStore so the
 * server render and the client hydration pass agree (splash), then the real
 * app renders once localStorage has been rehydrated. No data ever leaves the
 * device: state lives in localStorage only.
 */
export function AppRoot() {
  const storeHydrated = useSyncExternalStore(
    (cb) => useAppStore.persist.onFinishHydration(cb),
    () => useAppStore.persist.hasHydrated(),
    () => false
  );
  const onboardingCompleted = useAppStore((s) => s.onboardingCompleted);
  const emergencyActive = useAppStore((s) => s.emergencyActive);
  const theme = useAppStore((s) => s.settings.theme);
  const { setTheme } = useTheme();

  useEffect(() => {
    if (storeHydrated) setTheme(theme);
  }, [theme, storeHydrated, setTheme]);

  if (!storeHydrated) return <SplashScreen />;
  if (!onboardingCompleted) return <Onboarding />;

  return (
    <>
      <AppShell />
      {emergencyActive && <EmergencyMode />}
    </>
  );
}

function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="flex size-14 animate-pulse items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
        اس
      </div>
      <div className="text-lg font-bold">استعادة</div>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
      </div>
      <noscript>
        <p className="mt-4 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
          هذا التطبيق يحتاج تشغيل جافاسكربت — ويعمل بعد ذلك محليًا بالكامل على جهازك.
        </p>
      </noscript>
    </div>
  );
}
