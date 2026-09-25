# Generated files

- `scale5-screenshots/` — the current, verified UI evidence set for the
  1–5 behavioral scale (22 production-build screenshots + README +
  VLM verification report, 22/22 passed). This is the only set that should
  be cited as validation of the shipped UI.

Pre-migration (1–10-era) screenshots are not published here; they remain
archived inside the project at `tool-results/archive-pre-scale5/` and are
explicitly marked superseded.

- `phase3-knowledge-148-evidence-verified-final.md` — **the current
  source-of-truth snapshot of the knowledge bank** (148 cards, full fields)
  after the Final Evidence Verification Pass (Task 15): the 16 deferred
  scientific claims were verified against live web research; 3 cards received
  minimal evidence-driven corrections (certainty softened ×2, unsupported
  number removed ×1); all other copy is byte-identical to the previous
  snapshot and matches the shipped app code.

- `phase3-knowledge-evidence-final.md` — the claim-by-claim review of all 16
  deferred claims: verdict (SUPPORTED ×13 / PARTIALLY_SUPPORTED ×3), evidence
  summary, limitations, required change, final wording, reason.

- `phase3-knowledge-evidence-sources.md` — the 30 sources actually used,
  with access points and confirmed DOIs/PMIDs where verified.

- `phase3-knowledge-evidence-change-map.md` — the 3 changes (before → after →
  why → evidence basis) plus the 13 NO CHANGE records.

- `phase3-knowledge-evidence-qa.md` — QA report for the evidence pass:
  scope, verdict distribution, content/scientific integrity checks, full
  regression results (validation 15/15, tsc(src) 0, ESLint clean, unit
  43/43 + 66/66 + 54/54, build pass, E2E 37/37, evidence sweep 29/29,
  VLM 9/9), and the documented pre-existing spiritual-gate failures proven
  unrelated to content.

- `phase3-knowledge-148-native-arabic-final.md` — **the CURRENT source of
  truth for card copy** (Task 16): the final native Arabic editorial pass
  performed AFTER the evidence verification round, on top of
  `phase3-knowledge-148-evidence-verified-final.md`. All 148 cards were
  re-reviewed as a native reader; 41 cards received 50 minimal language-only
  edits (24 semicolon-family punctuation unifications + 26 style/grammar/
  translationese fixes incl. the معادلة/هندسة calque family); 107 cards were
  judged already-native and intentionally untouched. The 3 evidence-locked
  changes (ur-wave / en-friction / em-labeling) are preserved verbatim.

- `phase3-knowledge-native-final-editorial-map.md` — per-card traceability
  for this final editorial round: all 148/148 entries (41 UPDATED with
  before → after, problem type, and reason; 107 UNCHANGED with an explicit
  naturalness verdict), plus the documented intentional keeps.

- `phase3-knowledge-native-final-qa.md` — QA report for this final editorial
  round: counts, problem families, before/after examples, integrity checks
  (structure fingerprint identical, evidence locks intact, code↔doc sync
  148/148), post-edit automated pattern scan (zero flagged phrases; معادلة/
  هندسي fully removed), and all regression results (validation 15/15,
  tsc(src) 0, ESLint clean, unit 43/43 + 66/66 + 54/54, build pass,
  E2E 37/37, edited-card sweep 85/85, VLM visual QA 14/14, zero horizontal
  overflow at 320/360/390; spiritual-gate 10/18 documented pre-existing and
  proven unrelated to knowledge content).

Earlier phase deliverables (`phase3-knowledge-98-*.md`,
`phase3-knowledge-50-final.md`, gap/evidence/change-map docs, and the
Task-14 era editorial files) remain as historical records of their
respective passes and are superseded for card copy by
`phase3-knowledge-148-native-arabic-final.md`.
