#!/bin/bash
# Evidence verification pass — focused sweep on the 3 evidence-edited cards.
# Opens each edited-card dialog at 320/360/390, verifies the NEW wording renders,
# the REMOVED wording is gone, and the dialog has zero horizontal overflow.
cd /home/z/my-project
PORT=3100
mkdir -p tool-results/evidence
LOG=tool-results/evidence/server.log

pkill -f "standalone/server.js" 2>/dev/null; sleep 1
NODE_ENV=production PORT=$PORT bun .next/standalone/server.js > "$LOG" 2>&1 &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null; true" EXIT
for i in $(seq 1 40); do curl -s -o /dev/null "http://localhost:$PORT" && break; sleep 1; done
echo "server up"

PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); echo "  ✓ $1"; }
bad()  { FAIL=$((FAIL+1)); echo "  ✗ $1"; }
check(){ if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (got: $2 | want: $3)"; fi }
ev()   { agent-browser eval "$1" | tail -1 | tr -d '"'; }

SEED="localStorage.setItem('istiaada-state-v1', JSON.stringify({state:{version:1,onboardingCompleted:true,userProfile:{goals:['change'],difficultTimes:['late-night'],patterns:['aimless'],deviceNeeds:'no',buildGoals:['study'],supportPrefs:['mixed'],why:'لأجل دراستي وتركيزي',whyReasons:['study','focus']},journey:{startDate:'2026-08-01T10:00:00.000Z'},urgeChecks:[],interventionLogs:[],dailyLogs:{checkIns:[],plans:[],doseLog:[]},relapseEvents:[],preventionRules:[],supportPerson:null,settings:{dailyDoseEnabled:true,spiritualContent:false,preferredDoseTime:'morning',postRelapseSupport:true,theme:'dark',notificationsEnabled:false}},version:2}))"

agent-browser close >/dev/null 2>&1; sleep 1
for i in 1 2 3 4 5; do
  agent-browser open "http://localhost:$PORT" >/dev/null 2>&1; sleep 1.5
  URL=$(agent-browser get url 2>/dev/null | tail -1 | tr -d '"')
  echo "$URL" | grep -q "localhost:$PORT" && break
done
READY=$(ev "document.title.includes('استعادة') ? 'ready' : 'notready'")
[ "$READY" = "ready" ] || { echo "FATAL: app not ready"; exit 1; }

# card title | NEW text that MUST be in the dialog | OLD text that must NOT be there | slug for screenshots
declare -a CARDS=(
  "الرغبة موجة، لا جدار|غالبًا خلال دقائق أو أقل من ساعة|ثم تنحسر — خلال دقائق|ur-wave"
  "الاحتكاك المقصود: ثوانٍ تصنع الفارق|أضِف ثوانٍ قليلة بينك وبين السلوك|عشرين ثانية|en-friction"
  "سمِّ الشعور تُغيّر علاقتك به|كثيرًا ما تخفض شدته|تخفض شدته فعلًا|em-labeling"
)

SHOT=0
for VP in "320 568" "360 640" "390 844"; do
  set -- $VP
  echo "=== Evidence cards sweep ${1}px ==="
  agent-browser set viewport $1 $2 >/dev/null; sleep 0.6
  agent-browser eval "$SEED" >/dev/null
  agent-browser reload >/dev/null; sleep 2
  agent-browser find role button click --name "المزيد من الأقسام" >/dev/null 2>&1; sleep 0.6
  agent-browser find role button click --name "قاعدة المعرفة" >/dev/null 2>&1; sleep 1.4

  for entry in "${CARDS[@]}"; do
    TITLE="${entry%%|*}"; rest="${entry#*|}"
    NEWTXT="${rest%%|*}"; rest2="${rest#*|}"
    OLDTXT="${rest2%%|*}"; SLUG="${rest2##*|}"
    agent-browser find role button click --name "$TITLE" >/dev/null 2>&1; sleep 1
    TXT=$(ev "(() => { const t = document.body.innerText; return t.includes('$NEWTXT') ? 'yes' : 'no'; })()")
    check "[${1}px] $SLUG: new evidence wording renders" "$TXT" "yes"
    TXT=$(ev "(() => { const t = document.body.innerText; return t.includes('$OLDTXT') ? 'present' : 'absent'; })()")
    check "[${1}px] $SLUG: old wording removed" "$TXT" "absent"
    OV=$(ev "(() => { const d = document.documentElement; return (d.scrollWidth > d.clientWidth + 1) ? 'overflow' : 'ok'; })()")
    check "[${1}px] $SLUG dialog: no horizontal overflow" "$OV" "ok"
    agent-browser screenshot "tool-results/evidence/card-${SLUG}-${1}.png" >/dev/null 2>&1
    SHOT=$((SHOT+1))
    agent-browser find role button click --name "Close" >/dev/null 2>&1; sleep 0.8
  done
done

# full knowledge list overflow check at the narrowest width
agent-browser set viewport 320 568 >/dev/null; sleep 0.5
OV=$(ev "(() => { const d = document.documentElement; return (d.scrollWidth > d.clientWidth + 1) ? 'overflow' : 'ok'; })()")
check "knowledge list at 320: no horizontal overflow" "$OV" "ok"
ERRS=$(ev "window.__pageErrors ? window.__pageErrors.length : 0")
check "zero page errors through sweep" "$ERRS" "0"

echo ""
echo "EVIDENCE SWEEP RESULT: $PASS passed, $FAIL failed ($SHOT screenshots in tool-results/evidence/)"
[ "$FAIL" = "0" ] || exit 1
