#!/bin/bash
# Task 16 — Final Native Arabic Editorial Pass sweep (v2, fixed card-open mechanism):
# open Knowledge screen + 9 EDITED-card dialogs at 320/360/390; verify:
#  - the NEW wording renders in the open dialog
#  - the OLD wording is gone
#  - no horizontal overflow in list or dialog
# spiritualContent=true in the seed so the gated sp-tawbah card is reachable.
cd /home/z/my-project
PORT=3100
mkdir -p tool-results/task16-editorial
LOG=tool-results/task16-editorial/server.log

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

SEED="localStorage.setItem('istiaada-state-v1', JSON.stringify({state:{version:1,onboardingCompleted:true,userProfile:{goals:['change'],difficultTimes:['late-night'],patterns:['aimless'],deviceNeeds:'no',buildGoals:['study'],supportPrefs:['mixed'],why:'لأجل دراستي وتركيزي',whyReasons:['study','focus']},journey:{startDate:'2026-08-01T10:00:00.000Z'},urgeChecks:[],interventionLogs:[],dailyLogs:{checkIns:[],plans:[],doseLog:[]},relapseEvents:[],preventionRules:[],supportPerson:null,settings:{dailyDoseEnabled:true,spiritualContent:true,preferredDoseTime:'morning',postRelapseSupport:true,theme:'dark',notificationsEnabled:false}},version:2}))"

agent-browser close >/dev/null 2>&1; sleep 1
for i in 1 2 3 4 5; do
  agent-browser open "http://localhost:$PORT" >/dev/null 2>&1; sleep 1.5
  URL=$(agent-browser get url 2>/dev/null | tail -1 | tr -d '"')
  echo "$URL" | grep -q "localhost:$PORT" && break
done
READY=$(ev "document.title.includes('استعادة') ? 'ready' : 'notready'")
[ "$READY" = "ready" ] || { echo "FATAL: app not ready"; exit 1; }
agent-browser eval "$SEED" >/dev/null
agent-browser reload >/dev/null; sleep 2

# sanity: 148 cards with spiritual ON
agent-browser find role button click --name "المزيد من الأقسام" >/dev/null 2>&1; sleep 0.6
agent-browser find role button click --name "قاعدة المعرفة" >/dev/null 2>&1; sleep 1.4
TXT=$(ev "(() => { const chips = Array.from(document.querySelectorAll('button')).map(b=>b.textContent.trim()); return chips.some(c=>c==='الكل (148)') ? 'yes' : 'no'; })()")
[ "$TXT" = "yes" ] && ok "knowledge total chip: الكل (148) with spiritual ON" || bad "knowledge total chip missing (got $TXT)"

# EDITED cards: full-title | new-fragment(must appear) | old-fragment(must NOT appear)
declare -a CARDS=(
  "نافذة التحمل تضيق تحت الضغط|أيام العاصفة تُدار بأهداف صغيرة|تُبحر بأشرعة"
  "الوحدة لا تُعالج بالخلوة مع شاشة|الوحدة لا يطفئها محتوى|لا يطفئ الوحدة محتوى"
  "حين لا تعرف ما تشعر به: ابدأ بأبسط اسم|كلمة أقرب إلى شعورك|كلمة تقترب من شعورك"
  "الثقة تُبنى بالاتساق لا بالاعتذار|نمطك اليومي أبلغ من وعدك|النمط أعلى صوتًا"
  "بروتوكول أول ثلاثين دقيقة من يومك|يبدأ قبل أن تفتح أول شاشة|لا عندها"
  "بعد محادثة صعبة: لا تدع التوتر يختار عنك|والباقي معروف|يعرف الباقي"
  "التوبة: عودة لا محاكمة|التوبة: عودة لا محاكمة|عودة لا مطاردة"
  "لا تختبر نفسك أمام المحفز|ترتيب بيئتك، لا في المواجهة|في الهندسة"
  "أهم سؤال بعد الزَلّة|بعد كل زَلّة اسأل: أين كانت نقطة القطع|هذا هو السؤال"
)

for VP in "320 568" "360 640" "390 844"; do
  set -- $VP
  echo "=== Knowledge sweep ${1}px ==="
  agent-browser set viewport $1 $2 >/dev/null; sleep 0.8
  agent-browser eval "$SEED" >/dev/null
  agent-browser reload >/dev/null; sleep 2
  agent-browser find role button click --name "المزيد من الأقسام" >/dev/null 2>&1; sleep 0.6
  agent-browser find role button click --name "قاعدة المعرفة" >/dev/null 2>&1; sleep 1.4
  agent-browser eval "window.scrollTo(0,0)" >/dev/null
  OVF=$(ev "document.documentElement.scrollWidth > document.documentElement.clientWidth ? 'OVF:' + document.documentElement.scrollWidth : 'ok'")
  [ "$OVF" = "ok" ] && ok "knowledge list ${1}px no overflow" || bad "knowledge list ${1}px $OVF"
  agent-browser screenshot "tool-results/task16-editorial/knowledge-${1}.png" >/dev/null

  for ENTRY in "${CARDS[@]}"; do
    TITLE="${ENTRY%%|*}"; REST="${ENTRY#*|}"
    MUST="${REST%%|*}"; MUSTNOT="${REST##*|}"
    agent-browser find role button click --name "$TITLE" >/dev/null 2>&1
    sleep 1.6
    BODY=$(ev "document.body.innerText.includes('${MUST}') ? 'has-new' : 'missing-new'")
    [ "$BODY" = "has-new" ] && ok "[${TITLE}] new wording renders (${1}px)" || bad "[${TITLE}] new wording MISSING (${1}px)"
    OLD=$(ev "document.body.innerText.includes('${MUSTNOT}') ? 'old-present' : 'gone'")
    [ "$OLD" = "gone" ] && ok "[${TITLE}] old wording gone (${1}px)" || bad "[${TITLE}] old wording STILL PRESENT (${1}px)"
    DOVF=$(ev "document.documentElement.scrollWidth > document.documentElement.clientWidth ? 'OVF:' + document.documentElement.scrollWidth : 'ok'")
    [ "$DOVF" = "ok" ] && ok "[${TITLE}] dialog ${1}px no overflow" || bad "[${TITLE}] dialog ${1}px $DOVF"
    if [ "$1" = "360" ]; then
      SAFE=$(echo "$TITLE" | tr ' ' '_')
      agent-browser screenshot "tool-results/task16-editorial/card-${SAFE}-${1}.png" >/dev/null
    fi
    agent-browser find role button click --name "Close" >/dev/null 2>&1
    sleep 0.9
  done
done

echo
echo "SWEEP RESULT: $PASS passed, $FAIL failed"
[ $FAIL -eq 0 ] && echo "ALL OK"
