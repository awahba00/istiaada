/**
 * استعادة — Type definitions
 * Local-first behavioral support app. All data lives in localStorage.
 */

export type DeviceNeeds = "yes" | "no" | "sometimes";

export type SupportPreference =
  | "science"
  | "practical"
  | "psychological"
  | "spiritual"
  | "mixed";

export interface UserProfile {
  goals: string[]; // onboarding step 1 ids
  difficultTimes: string[]; // step 2 ids
  patterns: string[]; // step 3 ids (what happens before)
  deviceNeeds: DeviceNeeds; // step 4
  buildGoals: string[]; // step 5 ids
  supportPrefs: SupportPreference[]; // step 6 ids
  why: string; // step 7 free text
  whyReasons: string[]; // chosen reason chips
}

export interface UrgeContext {
  alone: boolean;
  lateNight: boolean;
  inBed: boolean;
  browsingStarted: boolean;
  deviceNeededNow: boolean;
}

export interface UrgeCheck {
  id: string;
  ts: string; // ISO
  urge: number; // 1-5 intensity
  proximity: number; // 1-5 proximity to acting
  control: number; // 1-5 loss of control (5 = almost unable to stop)
  context: UrgeContext;
  riskLevel: number; // computed 1-5 state degree
  triggers: string[]; // trigger ids selected
  outcome?: "handled" | "escalated" | "acted" | "pending";
  outcomeTs?: string;
  interventionId?: string;
}

export interface InterventionLog {
  id: string;
  ts: string;
  interventionId: string;
  riskLevel: number;
  source: "urge-check" | "emergency" | "manual" | "plan";
  success?: boolean;
}

export type TimeToStop = "immediately" | "minutes" | "under-hour" | "longer";

/**
 * Phase 2B.2 — slip/relapse semantic model (approved):
 *   slip     = زَلّة  — one limited episode
 *   relapse  = انتكاسة — return to the previous pattern (continuation and/or
 *                          repetition). NEVER auto-detected; always user-chosen.
 * Legacy records simply omit these fields — the values are never guessed.
 */
export type RelapseClassification = "slip" | "relapse";
export type RelapseBehavior = "pornography" | "masturbation";

export interface RelapseReview {
  trigger: string; // trigger id
  vulnerabilities: string[];
  firstSign: string; // warning-sign id or free text
  firstAction: string; // free text
  escalation: string; // free text
  extended: boolean; // continued after first slip
  cutPoint: string; // where the chain could have been cut
  lesson: string;
}

export interface RelapseEvent {
  id: string;
  ts: string;
  timeToStop: TimeToStop;
  /** Kept for legacy compatibility — NOT the definition of a relapse. */
  continued: boolean;
  triggers: string[];
  quickTs?: string;
  reviewed: boolean;
  review?: RelapseReview;
  /** User-facing classification (زَلّة/انتكاسة) — absent on legacy records. */
  classification?: RelapseClassification;
  /** Which behavior(s) occurred — absent on legacy records. */
  behaviors?: RelapseBehavior[];
}

export interface EveningCheckIn {
  date: string; // YYYY-MM-DD
  highestUrge: number; // 1-5
  mainTrigger: string;
  interventionUsed: string; // 'none' or free text/intervention name
  lesson: string;
  changeTomorrow: string;
  sleepQuality: number; // 1-5
  stress: number; // 1-5
  loneliness: number; // 1-5
  freeTime: number; // 1-5
}

export interface DailyPlanState {
  date: string; // YYYY-MM-DD
  mode: "minimum" | "standard" | "extra";
  purposeTask: string;
  bodyChoice: string;
  completedSections: string[];
}

export interface IfThenRule {
  id: string;
  ifText: string;
  thenText: string;
  active: boolean;
  source: "user" | "suggested";
  createdAt: string;
}

export interface DoseLogEntry {
  date: string; // YYYY-MM-DD
  itemId: string;
  status: "done" | "skipped";
}

export interface SupportPerson {
  label: string; // what to call them (not real name required)
  phone: string;
}

export interface AppSettings {
  dailyDoseEnabled: boolean;
  spiritualContent: boolean;
  preferredDoseTime: string; // "morning" | "afternoon" | "evening" | ""
  postRelapseSupport: boolean;
  theme: "dark" | "light";
  notificationsEnabled: boolean;
}

export interface AppData {
  version: number;
  onboardingCompleted: boolean;
  userProfile: UserProfile;
  journey: { startDate: string }; // ISO date
  urgeChecks: UrgeCheck[];
  interventionLogs: InterventionLog[];
  dailyLogs: {
    checkIns: EveningCheckIn[];
    plans: DailyPlanState[];
    doseLog: DoseLogEntry[];
  };
  relapseEvents: RelapseEvent[];
  preventionRules: IfThenRule[];
  supportPerson?: SupportPerson | null;
  settings: AppSettings;
}

/** Risk engine output — 1–5 behavioral ladder */
export type RiskCategory =
  | "calm" // 1 هدوء
  | "early" // 2 بداية بسيطة
  | "growing" // 3 بدأت تقوى
  | "high-risk" // 4 خطر مرتفع
  | "imminent"; // 5 على وشك التصرف

export type RecommendedMode =
  | "awareness"
  | "interrupt"
  | "immediate"
  | "emergency"
  | "maximum";

export interface RiskAssessment {
  level: number; // 1-5 state degree
  category: RiskCategory;
  categoryLabel: string;
  recommendedMode: RecommendedMode;
  modeLabel: string;
}

export interface TriggerItem {
  id: string;
  label: string;
  category: TriggerCategoryId;
}

export type TriggerCategoryId =
  | "internal"
  | "emotional"
  | "digital"
  | "situational"
  | "habitual";

export interface TriggerCategory {
  id: TriggerCategoryId;
  label: string;
  hint: string;
}

export interface Intervention {
  id: string;
  name: string;
  family: "cut-chain" | "change-state" | "prevent-return" | "support";
  triggers: string[]; // trigger ids this intervention fits ("any" = general)
  riskLevels: [number, number]; // min..max range (1–5 degrees) where appropriate
  duration: string; // human readable
  durationSec?: number; // for timer
  location: string; // where
  requiresPhone: boolean;
  requiresAnotherPerson: boolean;
  workSafe: boolean;
  aloneSuitable: boolean;
  instructions: string[]; // concrete steps
  whyItHelps: string;
  nextAction: string;
  tags?: string[];
}

export type KnowledgeCategoryId =
  | "brain-behavior"
  | "triggers"
  | "urges"
  | "habit-loops"
  | "environment"
  | "sleep"
  | "stress"
  | "emotions"
  | "attention"
  | "discipline"
  | "relationships"
  | "digital"
  | "relapse"
  | "self-compassion"
  | "purpose"
  | "values"
  | "spiritual"
  | "long-term"
  | "prevention"
  | "emergency-skills";

export interface KnowledgeCategory {
  id: KnowledgeCategoryId;
  label: string;
}

export interface KnowledgeItem {
  id: string;
  category: KnowledgeCategoryId;
  title: string;
  know: string;
  understand: string;
  act: string;
  remember: string;
  deep?: string;
  tags: string[]; // trigger ids / contexts it relates to
  spiritual?: boolean;
  stage: "early" | "mid" | "late" | "any";
}

export interface JourneyStage {
  id: string;
  fromDay: number;
  toDay: number;
  label: string;
  description: string;
}
