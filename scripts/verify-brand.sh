#!/usr/bin/env bash
# ============================================================================
# verify-brand.sh — logo/favicon integration + copy-pass regression, run
# against the PRODUCTION standalone build on :3100.
#
# Verifies: icon HTTP serving + link tags, onboarding welcome logo (390/320),
# desktop sidebar logo dark+light, new "توقّف هنا" labels (quick guide, more
# sheet, relapse title, post-relapse CTA), STOP flow intact, mobile sweep
# (no horizontal overflow 320/360/390), zero console errors.
# ============================================================================
set -uo pipefail
PORT=3100
BASE="http://localhost:$PORT"
OUT=/home/z/my-project/tool-results/brand
AB=(agent-browser --session brand)
cd /home/z/my-project
mkdir -p "$OUT"

shot() { "${AB[@]}" screenshot "$OUT/$1.png" >/dev/null 2>&1; echo "  📸 $1"; }
wt()   { sleep "$1"; }
clk() { # click first VISIBLE button whose text includes $1
  local r
  r=$("${AB[@]}" eval "(() => { const t='$1'; const b=[...document.querySelectorAll('button,[role=button],a')].filter(x=>x.getClientRects().length&&x.textContent).find(x=>x.textContent.includes(t)); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()")
  r=${r//\"/}
  [[ "$r" == ok ]] || echo "  ⚠️ clk FAILED [$1] → $r"
}
ovf() {
  "${AB[@]}" eval "document.documentElement.scrollWidth > document.documentElement.clientWidth ? 'OVF:' + document.documentElement.scrollWidth : 'ok'" 2>/dev/null | tail -1
}

# ——— start production standalone server ———
# NOTE: standalone server.js reads PORT from env (defaults to 3000). Any ghost
# server from a previous session MUST be killed first — it would serve a
# stale build whose chunks no longer exist (client-side exception pages).
lsof -t -i :$PORT 2>/dev/null | xargs -r kill 2>/dev/null; sleep 0.5
PORT=$PORT bun .next/standalone/server.js > /tmp/brand-server.log 2>&1 &
SRV=$!
for i in $(seq 1 60); do curl -sf "$BASE" -o /dev/null && break; sleep 0.5; done
echo "═══ server up on :$PORT ═══"

# ——— 1. favicon / icon assets over HTTP ———
echo "— 1. icon assets over HTTP —"
for f in icon.svg favicon-32.png apple-touch-icon.png logo.svg; do
  curl -s -o /dev/null -w "  %{http_code}  %{content_type}  %{size_download}B  /$f\n" "$BASE/$f"
done
bun -e 'const sharp=require("sharp");(async()=>{for(const f of ["favicon-32.png","apple-touch-icon.png"]){const m=await sharp("/home/z/my-project/public/"+f).metadata();console.log("  dims:",f,m.width+"x"+m.height,m.format);}})()'
echo "  link tags in served HTML:"
curl -s "$BASE" | grep -oE '<link rel="[^"]*icon[^"]*"[^>]*>' | sed 's/^/    /'

# ——— 2. fresh onboarding welcome with logo ———
echo "— 2. onboarding (fresh) —"
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2
"${AB[@]}" storage local clear >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 3
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1; wt 0.6
shot 01-onboarding-logo-390
echo "  overflow@390: $(ovf)"
"${AB[@]}" set viewport 320 568 >/dev/null 2>&1; wt 0.6
shot 02-onboarding-logo-320
echo "  overflow@320: $(ovf)"

# ——— 3. returning user: sidebar logo dark + light ———
echo "— 3. sidebar logo dark/light (1280) —"
SEED=$(node scripts/make-scale5-seed.mjs)
"${AB[@]}" storage local set istiaada-state-v1 "$SEED" >/dev/null 2>&1
"${AB[@]}" eval "localStorage.setItem('istiaada-theme','dark')" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
"${AB[@]}" set viewport 1280 800 >/dev/null 2>&1; wt 0.8
shot 03-sidebar-dark-1280
"${AB[@]}" eval "localStorage.setItem('istiaada-theme','light')" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
shot 04-sidebar-light-1280
"${AB[@]}" eval "localStorage.setItem('istiaada-theme','dark')" >/dev/null 2>&1

# ——— 4. copy regression: guide / more sheet / relapse title / STOP ———
echo "— 4. copy labels —"
"${AB[@]}" set viewport 390 844 >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
"${AB[@]}" eval "window.scrollTo(0,0)" >/dev/null 2>&1; wt 0.3
shot 05-home-guide-newlabels-390
echo "  guide row4 present: $("${AB[@]}" eval "document.body.innerText.includes('توقّف هنا') ? 'yes' : 'NO'" 2>/dev/null | tail -1)"
echo "  guide row1 present: $("${AB[@]}" eval "document.body.innerText.includes('خد جرعة اليوم') ? 'yes' : 'NO'" 2>/dev/null | tail -1)"
echo "  old label absent:   $("${AB[@]}" eval "document.body.innerText.includes('ما بعد التعثر') ? 'STILL-THERE' : 'gone'" 2>/dev/null | tail -1)"

# more sheet label + desc
clk "المزيد"; wt 0.7
shot 06-moresheet-newlabel-390
"${AB[@]}" eval "(() => { const dl=[...document.querySelectorAll('[role=dialog]')].filter(x=>x.getClientRects().length); const d=dl[dl.length-1]; const b=[...d.querySelectorAll('button')].find(x=>(x.textContent||'').includes('توقّف هنا')); if(!b) return 'NOTFOUND'; b.click(); return 'ok'; })()" >/dev/null 2>&1
wt 1.2
"${AB[@]}" eval "window.scrollTo(0,0)" >/dev/null 2>&1; wt 0.3
shot 07-relapse-title-390
echo "  relapse title: $("${AB[@]}" eval "document.body.innerText.includes('توقّف هنا') ? 'yes' : 'NO'" 2>/dev/null | tail -1)"
clk "رجعت للسلوك الآن"; wt 1
shot 08-relapse-stop-390
echo "  STOP header:   $("${AB[@]}" eval "document.body.innerText.includes('ما تكملش') ? 'yes' : 'NO'" 2>/dev/null | tail -1)"

# ——— 5. post-relapse banner CTA ———
echo "— 5. post-relapse banner —"
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 1.5
"${AB[@]}" eval "(() => { const s=JSON.parse(localStorage.getItem('istiaada-state-v1')); const e=s.state.relapseEvents[s.state.relapseEvents.length-1]; e.reviewed=false; e.ts=new Date(Date.now()-30*60000).toISOString(); localStorage.setItem('istiaada-state-v1', JSON.stringify(s)); return 'ok'; })()" >/dev/null 2>&1
"${AB[@]}" open "$BASE" >/dev/null 2>&1; wt 2.5
shot 09-home-postrelapse-cta-390
echo "  banner CTA: $("${AB[@]}" eval "document.body.innerText.includes('توقّف هنا') ? 'yes' : 'NO'" 2>/dev/null | tail -1)"

# ——— 6. mobile sweep (all 11 screens × 320/360/390) ———
echo "— 6. mobile sweep —"
bash scripts/mobile-sweep.sh

# ——— 7. console errors ———
echo "— 7. console —"
"${AB[@]}" console 2>/dev/null | grep -ci "error" | sed 's/^/  error lines: /'

kill $SRV 2>/dev/null
echo "═══ done ═══"
