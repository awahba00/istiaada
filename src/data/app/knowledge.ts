import type { KnowledgeCategory, KnowledgeItem } from "@/lib/app/types";
import { KNOWLEDGE_CORE } from "./knowledge-core";
import { KNOWLEDGE_WELLBEING } from "./knowledge-wellbeing";
import { KNOWLEDGE_RECOVERY } from "./knowledge-recovery";
import { KNOWLEDGE_NEW } from "./knowledge-new";

export const KNOWLEDGE_CATEGORIES: KnowledgeCategory[] = [
  { id: "brain-behavior", label: "الدماغ والسلوك" },
  { id: "triggers", label: "المحفزات" },
  { id: "urges", label: "الرغبات" },
  { id: "habit-loops", label: "حلقات العادة" },
  { id: "environment", label: "البيئة" },
  { id: "sleep", label: "النوم" },
  { id: "stress", label: "التوتر" },
  { id: "emotions", label: "المشاعر" },
  { id: "attention", label: "الانتباه" },
  { id: "discipline", label: "الانضباط" },
  { id: "relationships", label: "العلاقات" },
  { id: "digital", label: "العادات الرقمية" },
  { id: "relapse", label: "الزلّة والانتكاسة" },
  { id: "self-compassion", label: "الرحمة بالذات" },
  { id: "purpose", label: "الهدف" },
  { id: "values", label: "القيم" },
  { id: "spiritual", label: "تأمل روحي" },
  { id: "long-term", label: "المدى الطويل" },
  { id: "prevention", label: "الوقاية" },
  { id: "emergency-skills", label: "مهارات الطوارئ" },
];

export const KNOWLEDGE: KnowledgeItem[] = [
  ...KNOWLEDGE_CORE,
  ...KNOWLEDGE_WELLBEING,
  ...KNOWLEDGE_RECOVERY,
  ...KNOWLEDGE_NEW,
];

export const KNOWLEDGE_BY_ID: Record<string, KnowledgeItem> = Object.fromEntries(
  KNOWLEDGE.map((k) => [k.id, k])
);

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  KNOWLEDGE_CATEGORIES.map((c) => [c.id, c.label])
);
