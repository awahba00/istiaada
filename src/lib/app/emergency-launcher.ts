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
    (riskLevel = 4, triggers: string[] = []) =>
      startEmergency({
        riskLevel,
        triggers,
        workSafe: deviceNeeds === "yes",
      }),
    [startEmergency, deviceNeeds]
  );
}
