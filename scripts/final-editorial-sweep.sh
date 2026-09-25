#!/bin/bash
# Final editorial pass — Knowledge screen overflow sweep with EDITED cards.
# Opens the knowledge screen + 5 edited-card dialogs at 320/360/390 and checks
# horizontal overflow + that the new titles/lines render.
cd /home/z/my-project
PORT=3100
mkdir -p tool-results/final-editorial
LOG=tool-results/final-editorial/server.log

pkill -f "standalone/server.js" 2>/dev/null; sleep 1
NODE_ENV=production PORT=$PORT bun .next/standalone/server.js > "$LOG" 2>&1 &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null; true" EXIT
for i in $(seq 1 40); do curl -s -o /dev/null "http://localhost:$PORT" && break; sleep 1; done
echo "server up"

PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); echo "  ✓ $1"; }
bad()  { FAIL=$((FAIL+1)); echo "  ✗ $1"; }
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

# edited-card dialog targets: title → substring that MUST appear in the open dialog
declare -a CARDS=(
  "التدخل المبكر أسهل بكثير|أول علامة هي أسهل نقطة للتدخل"
  "حلقة العادة: إشارة، ثم روتين، ثم مكافأة|أسهل نقطة للكسر هي الإشارة"
  "وجود الناس يغيّر البيئة|مجرد وجود أشخاص حولك"
  "الالتزام المسبق: قيّد خياراتك قبل لحظة الضعف|أقفل الباب وأنت واقف خارجه"
  "الغضب: حين تبحث عن مخرج سريع|الغضب يشتعل سريعًا"
)

for VP in "320 568" "360 640" "390 844"; do
  set -- $VP
  echo "=== Knowledge sweep ${1}px ==="
  agent-browser set viewport $1 $2 >/dev/null; sleep 0.6
  agent-browser eval "$SEED" >/dev/null
  agent-browser reload >/dev/null; sleep 2
  # open knowledge section (same mechanism as e2e-phase23.sh open_section)
  agent-browser find role button click --name "المزيد من الأقسام" >/dev/null 2>&1; sleep 0.6
  agent-browser find role button click --name "قاعدة المعرفة" >/dev/null 2>&1; sleep 1.2
  agent-browser eval "window.scrollTo(0,0)" >/dev/null
  OVF=$(ev "document.documentElement.scrollWidth > document.documentElement.clientWidth ? 'OVF:' + document.documentElement.scrollWidth : 'ok'")
  [ "$OVF" = "ok" ] && ok "knowledge list ${1}px no overflow" || bad "knowledge list ${1}px $OVF"
  agent-browser screenshot "tool-results/final-editorial/knowledge-${1}.png" >/dev/null

  for ENTRY in "${CARDS[@]}"; do
    TITLE="${ENTRY%%|*}"
    MUST="${ENTRY##*|}"
    # clear any search text
    agent-browser eval "(() => { const i = document.querySelector('input[placeholder*=ابحث]'); if (i) { const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(i,''); i.dispatchEvent(new Event('input',{bubbles:true})); } return 'cleared'; })()" >/dev/null
    sleep 0.4
    agent-browser find role button click --name "$TITLE" >/dev/null 2>&1
    sleep 1
    TXT=$(ev "document.body.innerText.includes('$MUST') ? 'yes' : 'no'")
    [ "$TXT" = "yes" ] && ok "${1}px «$TITLE» renders new text" || bad "${1}px «$TITLE» missing new text"
    OVF=$(ev "document.documentElement.scrollWidth > document.documentElement.clientWidth ? 'OVF:' + document.documentElement.scrollWidth : 'ok'")
    [ "$OVF" = "ok" ] && ok "${1}px dialog no overflow" || bad "${1}px dialog $OVF"
    agent-browser screenshot "tool-results/final-editorial/card-${1}-$(echo "$TITLE" | head -c 30 | tr ' ' '_').png" >/dev/null 2>&1
    agent-browser find role button click --name "Close" >/dev/null 2>&1
    sleep 0.8
  done
  # search box RTL wrap check at this width
  agent-browser eval "(() => { const i = document.querySelector('input[placeholder*=ابحث]'); if (!i) return 'noinput'; const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(i,'الرغبة'); i.dispatchEvent(new Event('input',{bubbles:true})); return 'filled'; })()" >/dev/null
  sleep 0.8
  CNT=$(ev "Array.from(document.querySelectorAll('button.flex.flex-col')).filter(b => b.querySelector('.text-sm.leading-relaxed, p')).length")
  [ "${CNT:-0}" -gt 0 ] 2>/dev/null && ok "${1}px search «الرغبة» finds cards (${CNT})" || bad "${1}px search found nothing"
  OVF=$(ev "document.documentElement.scrollWidth > document.documentElement.clientWidth ? 'OVF:' + document.documentElement.scrollWidth : 'ok'")
  [ "$OVF" = "ok" ] && ok "${1}px search results no overflow" || bad "${1}px search results $OVF"
  agent-browser eval "(() => { const i = document.querySelector('input[placeholder*=ابحث]'); if (i) { const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(i,''); i.dispatchEvent(new Event('input',{bubbles:true})); } return 'cleared'; })()" >/dev/null
done

echo "SWEEP RESULT: $PASS passed, $FAIL failed"
exit $([ "$FAIL" -eq 0 ] && echo 0 || echo 1)
