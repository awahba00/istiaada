# استعادة — Istiaada

A local-first, Egyptian-Arabic behavioral self-support app: notice, understand,
cut the chain, learn, and build a fuller life. Everything runs on the user's
device — no account, no server, no analytics, no network calls at runtime.

## What it is

Istiaada («استعادة») is a single-user recovery companion for people working on
compulsive sexual behavior / problematic pornography use. It offers a daily
learning dose, a daily plan, an urge check with a 1–5 self-report ladder, an
emergency intervention mode, relapse (زَلّة/انتكاسة) logging with a guided
no-shame review, If-Then prevention rules, a knowledge base (148 cards), and an
honest professional-help corridor with verified Egyptian resources.

Core product principles:

- **Local-first privacy** — all data lives in the browser's `localStorage`;
  nothing is ever sent anywhere. The only outbound affordances are
  user-initiated `tel:` links and one verified external link.
- **No shame, no streaks, no gamified pressure** — progress indicators are
  real metrics; absence is met with a welcome back, never a penalty.
- **Honest content** — hotline claims, scope, cost, and hours only where
  official sources state them; the app never invents services or outcomes.
- **ما قل ودل** — minimal UI; one screen = one clear next step.

## Architecture (high level)

```
src/
  app/            Next.js App Router shell (layout, page, PWA metadata)
  components/app/  AppRoot (hydration → onboarding → shell), AppShell,
                   screens/ (13 screens), shared widgets, emergency overlay
  lib/app/        Engines: store (zustand + persist), nav-history, risk,
                   dose, intervention, progress, trigger-plans, lesson-match,
                   backup (export/import), erase, text-size, return-tracking
  data/app/       Static content: knowledge bank (148 cards), taxonomy,
                   interventions, dose examples, help resources
public/           Icons, web app manifest, robots.txt
scripts/          Bun-run regression suites (test-*.ts) + aggregate runner
docs/             Authoritative documentation (see below)
```

State management is a single zustand store persisted to `localStorage` under
`istiaada-state-v1`; two device-local keys hold user content outside the store
(`istiaada-values-draft-v1`, `istiaada-last-open-v1` — both erased by a full
reset, see `src/lib/app/erase.ts`), and two preference keys deliberately
survive it (`istiaada-text-size`, `istiaada-theme`).

## Development setup

Requirements: [Bun](https://bun.sh) 1.3+ (Node 24 works for `next` commands,
but the test runner and scripts use Bun).

```bash
bun install            # install dependencies (respects bun.lock)
bun run dev            # dev server on http://localhost:3000
```

## Commands

| Command | What it does |
|---------|--------------|
| `bun run test` | Runs every `scripts/test-*.ts` regression suite in isolation, prints a per-suite summary, exits non-zero on any failure. |
| `bun run typecheck` | TypeScript gate for the shipped application code (`src/`, strict, `noImplicitAny`). |
| `bun run typecheck:scripts` | Same for the dev/test scripts under `scripts/`. |
| `bun run lint` | ESLint; `src/` is held to a strict rule set (no `any`, no unused code, no console, hooks correctness). |
| `bun run build` | Production build (type-checked; standalone output). |
| `bun run start` | Serves the standalone production build. |

CI (`.github/workflows/ci.yml`) runs install → typecheck → lint → test → build
on every pull request and push to `main`.

## Privacy & data behavior

- **No accounts, no servers, no telemetry.** The app makes zero automatic
  network requests. Font files are bundled at build time.
- **Everything is stored locally**: use `Settings → مسح كل البيانات المحلية`
  for a truthful, allowlist-based full erase (it also removes the values
  draft and usage stamps; theme and text-size preferences survive, and the
  confirmation dialog says exactly that). Storage failures are reported
  honestly, never claimed as success.
- **Browser-tab title is just «استعادة»** and the app is `noindex` — public
  indexing has no value for a device-local tool. Honest limitation: this
  reduces visibility, it does **not** protect `localStorage` from someone
  with physical access to the device or browser profile. For shared devices,
  erase before handing the device over.

## Backup & restore

`Settings → تصدير البيانات` writes a **plain, unencrypted JSON file** (a
pre-export warning lists exactly what it contains). Import validates the
whole file (structure, schema version, types, 20MB cap) before replacing any
state — a failed import never touches existing data. Backups are portable
across devices and browsers; identifiers `istiaada`/`masar` are both accepted
for historical compatibility.

## Documentation

- `docs/dose-examples.md` — approved source of truth for the 148 daily-dose
  examples (immutable; referenced by `src/data/app/dose-examples.ts`).
- `docs/knowledge/` — knowledge-bank source-of-truth snapshots, evidence
  verification, and native-Arabic editorial records.
- `docs/language-final-review.md`, `docs/language-inventory.md` — the Arabic
  language review and the full string inventory.
- `docs/brand.md` — the brand mark concept and asset pipeline.
- `docs/maintenance-checklist.md` — quarterly verification procedure for the
  help resources (F2).
- `docs/accessibility-manual-checklist.md` — manual screen-reader
  verification checklist (E3).
- `docs/history/` — earlier phase working documents, kept for traceability.
- `docs/worklog.md` — the project's build history log.

## Contributing / release workflow

This repository works in batches: one coordinated change set → one commit →
one `git format-patch` deliverable, verified against a clean checkout of the
approved baseline, then applied and pushed by the maintainer. Keep patches
single-purpose and include regression tests (`scripts/test-*.ts` — the
aggregate runner picks up any new suite automatically).
