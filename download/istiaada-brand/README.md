# Istiaada Brand Assets — «حلقة العودة» (The Return Loop)

Generated 2026-09-19 · `scripts/make-brand-assets.mjs` is the reproducible source.

## The concept

One continuous stroke: an open loop whose returning end comes back **through
the opening toward its own center** — استعادة: taking back, returning to
balance. The gap stays open on purpose: recovery is a return in progress,
not a closed circle. The gesture also echoes the Arabic letter **ع** — the
root of عَوْد (return) inside استعادة. Calm single stroke, round caps, the
app's own teal — no shield, no cross, no heart, no lock, nothing medical.

## Files

| File | Purpose |
|------|---------|
| `logo.svg` | Standalone mark, transparent bg, light-theme primary teal `#268676` |
| `icon.svg` | Favicon badge — rounded deep-slate `#131E21` square + aqua `#5AC0AB` mark |
| `favicon-32.png` | 32×32 PNG favicon fallback (Safari & older browsers) |
| `apple-touch-icon.png` | 180×180 square (iOS applies its own mask) |
| `mark-256.png` | Large clean render of the mark |
| `tabstrip-light.png` / `tabstrip-dark.png` | The badge at 16px & 32px on simulated light/dark browser tab strips |
| `01…`, `03…`, `04…` | Live-app screenshots: onboarding welcome (390), desktop sidebar dark, desktop sidebar light |

## Where the logo lives in the app

- Desktop sidebar brand tile (`src/components/app/AppShell.tsx`)
- Onboarding brand bar + welcome hero mark (`src/components/app/Onboarding.tsx`)
- Browser tab / bookmark / iOS home screen via `metadata.icons`
  (`src/app/layout.tsx`; assets served from `public/`)

Component source: `src/components/app/LogoMark.tsx` (inline SVG,
`currentColor`, decorative by design).

## Notes

- PNG metadata-route files (`src/app/icon.png`, `src/app/apple-icon.png`)
  crash Turbopack 16 builds — icons are therefore served from `public/`
  with explicit `metadata.icons`. Identical browser behavior.
- In-app the mark inherits `currentColor`, so it adapts to both themes with
  zero extra variants.
- Verification evidence: `tool-results/brand/` (live screenshots, Chrome
  render of the served SVG, VLM checks).
