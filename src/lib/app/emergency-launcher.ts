"use client";

import { useCallback } from "react";
import { useAppStore } from "./store";

/**
 * Single source of truth for launching Emergency from any always-on entry
 * point (bottom-nav SOS, Home cards, More sheet, دليلك السريع).
 *
 * Work-Safe consistency (I4): every entry point derives `workSafe` from the
 * user's onboarding profile — deviceNeeds === "yes" means "I need this device
 * for work/study", so Emergency must run its Work-Safe protocol instead of
 * asking the user to leave the device. The Urge Check flow keeps its own
 * in-the-moment toggle (which defaults to the same profile value) because
 * there the user is answering about *right now*.
 */
export function useEmergencyLauncher() {
  const startEmergency = useAppStore((s) => s.startEmergency);
  const deviceNeeds = useAppStore((s) => s.userProfile.deviceNeeds);

  return useCallback(
    // F4 — every ALWAYS-ON entry point is MANUAL: the caller passes a
    // protocol intensity (5 for the FAB's maximum variant, 4 for the
    // QuickGuide row), never a user-reported degree. `assessed: false`
    // keeps the overlay's degree badge and the written log honest
    // («أقصى استجابة — من غير تقييم», no fabricated riskLevel). The ONLY
    // assessed launches are the Urge flow and Home's high-state card,
    // which call startEmergency/this launcher with a real recent check.
    (riskLevel = 4, triggers: string[] = []) =>
      startEmergency({
        riskLevel,
        triggers,
        workSafe: deviceNeeds === "yes",
        assessed: false,
      }),
    [startEmergency, deviceNeeds]
  );
}
