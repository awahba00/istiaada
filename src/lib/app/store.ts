"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nowIso, uid } from "./helpers";
import { buildBackupJson, validateBackup } from "./backup";
import { migrateAppDataToScale5 } from "./scale";
import type {
  AppData,
  AppSettings,
  DailyPlanState,
  EveningCheckIn,
  IfThenRule,
  InterventionLog,
  RelapseEvent,
  RelapseReview,
  SupportPerson,
  UrgeCheck,
  UserProfile,
} from "./types";

export const STORAGE_KEY = "istiaada-state-v1";

export type ScreenId =
  | "home"
  | "dose"
  | "plan"
  | "urge"
  | "emergency"
  | "trigger-map"
  | "relapse"
  | "prevention"
  | "progress"
  | "values"
  | "knowledge"
  | "settings";

export interface EmergencyContext {
  riskLevel: number;
  triggers: string[];
  workSafe: boolean;
}

interface AppStore extends AppData {
  hydrated: boolean;
  screen: ScreenId;
  emergencyActive: boolean;
  emergencyCtx: EmergencyContext | null;

  setHydrated: (v: boolean) => void;
  navigate: (s: ScreenId) => void;
  startEmergency: (ctx: EmergencyContext) => void;
  stopEmergency: () => void;

  completeOnboarding: (profile: UserProfile) => void;
  addUrgeCheck: (check: UrgeCheck) => void;
  setUrgeOutcome: (id: string, outcome: UrgeCheck["outcome"]) => void;
  logIntervention: (log: InterventionLog) => void;
  setInterventionSuccess: (id: string, success: boolean) => void;

  addRelapseQuick: (
    e: Omit<RelapseEvent, "id" | "reviewed">
  ) => string;
  completeRelapseReview: (id: string, review: RelapseReview) => void;
  deleteRelapse: (id: string) => void;

  saveCheckIn: (c: EveningCheckIn) => void;
  upsertPlan: (p: DailyPlanState) => void;
  logDose: (date: string, itemId: string, status: "done" | "skipped") => void;

  addRule: (r: Omit<IfThenRule, "id" | "createdAt">) => void;
  updateRule: (id: string, patch: Partial<IfThenRule>) => void;
  deleteRule: (id: string) => void;

  setSettings: (patch: Partial<AppSettings>) => void;
  setSupportPerson: (p: SupportPerson | null) => void;
  updateWhy: (why: string, whyReasons: string[]) => void;

  exportData: () => string;
  importData: (json: string) => { ok: boolean; error?: string };
  resetApp: () => void;
}

function defaultData(): AppData {
  return {
    version: 1,
    onboardingCompleted: false,
    userProfile: {
      goals: [],
      difficultTimes: [],
      patterns: [],
      deviceNeeds: "sometimes",
      buildGoals: [],
      supportPrefs: ["mixed"],
      why: "",
      whyReasons: [],
    },
    journey: { startDate: nowIso() },
    urgeChecks: [],
    interventionLogs: [],
    dailyLogs: { checkIns: [], plans: [], doseLog: [] },
    relapseEvents: [],
    preventionRules: [],
    supportPerson: null,
    settings: {
      dailyDoseEnabled: true,
      spiritualContent: false,
      preferredDoseTime: "morning",
      postRelapseSupport: true,
      theme: "dark",
      notificationsEnabled: false,
    },
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultData(),
      hydrated: false,
      screen: "home",
      emergencyActive: false,
      emergencyCtx: null,

      setHydrated: (v) => set({ hydrated: v }),
      navigate: (s) => set({ screen: s }),
      startEmergency: (ctx) => set({ emergencyActive: true, emergencyCtx: ctx }),
      stopEmergency: () => set({ emergencyActive: false, emergencyCtx: null }),

      completeOnboarding: (profile) =>
        set({
          onboardingCompleted: true,
          userProfile: profile,
          journey: { startDate: nowIso() },
          preventionRules: defaultPreventionRules(),
        }),

      addUrgeCheck: (check) =>
        set((s) => ({ urgeChecks: [...s.urgeChecks, { ...check, outcome: "pending" }] })),
      setUrgeOutcome: (id, outcome) =>
        set((s) => ({
          urgeChecks: s.urgeChecks.map((c) =>
            c.id === id ? { ...c, outcome, outcomeTs: nowIso() } : c
          ),
        })),
      logIntervention: (log) =>
        set((s) => ({ interventionLogs: [...s.interventionLogs, log] })),
      setInterventionSuccess: (id, success) =>
        set((s) => ({
          interventionLogs: s.interventionLogs.map((l) =>
            l.id === id ? { ...l, success } : l
          ),
        })),

      addRelapseQuick: (e) => {
        const id = uid("rel-");
        set((s) => ({
          relapseEvents: [
            ...s.relapseEvents,
            { ...e, id, reviewed: false },
          ],
        }));
        return id;
      },
      completeRelapseReview: (id, review) =>
        set((s) => ({
          relapseEvents: s.relapseEvents.map((r) =>
            r.id === id ? { ...r, review, reviewed: true } : r
          ),
        })),
      deleteRelapse: (id) =>
        set((s) => ({ relapseEvents: s.relapseEvents.filter((r) => r.id !== id) })),

      saveCheckIn: (c) =>
        set((s) => ({
          dailyLogs: {
            ...s.dailyLogs,
            checkIns: [
              ...s.dailyLogs.checkIns.filter((x) => x.date !== c.date),
              c,
            ],
          },
        })),
      upsertPlan: (p) =>
        set((s) => ({
          dailyLogs: {
            ...s.dailyLogs,
            plans: [...s.dailyLogs.plans.filter((x) => x.date !== p.date), p],
          },
        })),
      logDose: (date, itemId, status) =>
        set((s) => ({
          dailyLogs: {
            ...s.dailyLogs,
            doseLog: [
              ...s.dailyLogs.doseLog.filter((x) => x.date !== date),
              { date, itemId, status },
            ],
          },
        })),

      addRule: (r) =>
        set((s) => ({
          preventionRules: [
            ...s.preventionRules,
            { ...r, id: uid("rule-"), createdAt: nowIso() },
          ],
        })),
      updateRule: (id, patch) =>
        set((s) => ({
          preventionRules: s.preventionRules.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          ),
        })),
      deleteRule: (id) =>
        set((s) => ({
          preventionRules: s.preventionRules.filter((r) => r.id !== id),
        })),

      setSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      setSupportPerson: (p) => set({ supportPerson: p }),
      updateWhy: (why, whyReasons) =>
        set((s) => ({ userProfile: { ...s.userProfile, why, whyReasons } })),

      exportData: () => {
        const d = get();
        const data: AppData = {
          version: d.version,
          onboardingCompleted: d.onboardingCompleted,
          userProfile: d.userProfile,
          journey: d.journey,
          urgeChecks: d.urgeChecks,
          interventionLogs: d.interventionLogs,
          dailyLogs: d.dailyLogs,
          relapseEvents: d.relapseEvents,
          preventionRules: d.preventionRules,
          supportPerson: d.supportPerson,
          settings: d.settings,
        };
        return buildBackupJson(data);
      },

      /**
       * Atomic import: validateBackup() fully parses + validates the JSON
       * (structure, schema/version, types) before any state is touched.
       * On failure the current state stays exactly as it was — a partial
       * overwrite is impossible by construction.
       *
       * The current screen is intentionally PRESERVED: the restore UI lives
       * inside the screen that triggered it (Settings dialog / Onboarding
       * welcome). Keeping the screen stable lets the success confirmation
       * stay visible until the user closes it; forcing "home" here would
       * unmount that UI the instant the import succeeds.
       */
      importData: (json) => {
        const res = validateBackup(json);
        if (!res.ok) return { ok: false, error: res.error };
        set({
          ...res.data,
          hydrated: true,
          emergencyActive: false,
          emergencyCtx: null,
        });
        return { ok: true };
      },

      resetApp: () =>
        set({
          ...defaultData(),
          hydrated: true,
          screen: "home",
          emergencyActive: false,
          emergencyCtx: null,
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      /**
       * Storage version 2 = the 1–5 self-report scale. Version 1 state
       * (written by the 1–10-era app) is migrated once on rehydration via
       * the documented band mapping in scale.ts — historical events are
       * preserved one-for-one. This is the LOCAL storage version only; the
       * backup envelope schema version stays 1 (see backup.ts).
       */
      version: 2,
      migrate: (persisted) => {
        if (!persisted || typeof persisted !== "object") return persisted;
        const d = persisted as AppData;
        return migrateAppDataToScale5(d);
      },
      partialize: (s) => ({
        version: s.version,
        onboardingCompleted: s.onboardingCompleted,
        userProfile: s.userProfile,
        journey: s.journey,
        urgeChecks: s.urgeChecks,
        interventionLogs: s.interventionLogs,
        dailyLogs: s.dailyLogs,
        relapseEvents: s.relapseEvents,
        preventionRules: s.preventionRules,
        supportPerson: s.supportPerson,
        settings: s.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

function defaultPreventionRules(): IfThenRule[] {
  return [
    {
      id: uid("rule-"),
      ifText: "شعرت بالملل والتقطت الهاتف بلا هدف",
      thenText: "أغلقه فورًا وأنهض من مكاني",
      active: true,
      source: "suggested",
      createdAt: nowIso(),
    },
    {
      id: uid("rule-"),
      ifText: "بدأت بالبحث عن محفز",
      thenText: "أغلق المتصفح وأغيّر المكان",
      active: true,
      source: "suggested",
      createdAt: nowIso(),
    },
    {
      id: uid("rule-"),
      ifText: "وصلت درجة الرغبة ٣ من ٥",
      thenText: "أبدأ خطوة قطع فورًا",
      active: true,
      source: "suggested",
      createdAt: nowIso(),
    },
    {
      id: uid("rule-"),
      ifText: "كنت وحدي ليلًا وبدأت الرغبة",
      thenText: "أخرج من الغرفة",
      active: true,
      source: "suggested",
      createdAt: nowIso(),
    },
  ];
}
