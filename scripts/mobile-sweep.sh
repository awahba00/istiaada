#!/bin/bash
# Mobile sweep: no horizontal overflow on key screens at 320/360/390.
declare -a LABELS=("الرئيسية" "الجرعة" "الخطة" "فحص الرغبة" "توقّف هنا" "الإعدادات" "القيم والروحانيات" "قاعدة المعرفة" "التقدم" "خريطة المحفزات" "خطة الوقاية")
for VP in "320 568" "360 640" "390 844"; do
  set -- $VP
  agent-browser set viewport $1 $2 > /dev/null
  sleep 0.4
  agent-browser eval "window.scrollTo(0,0)" > /dev/null
  RESULT=""
  for L in "${LABELS[@]}"; do
    if [ "$L" = "الرئيسية" ] || [ "$L" = "الجرعة" ] || [ "$L" = "الخطة" ]; then
      agent-browser find role button click --name "$L" > /dev/null 2>&1
    else
      agent-browser find role button click --name "المزيد من الأقسام" > /dev/null 2>&1
      sleep 0.4
      agent-browser find text "$L" click > /dev/null 2>&1
    fi
    sleep 0.8
    agent-browser eval "window.scrollTo(0,0)" > /dev/null
    OVERFLOW=$(agent-browser eval "document.documentElement.scrollWidth > document.documentElement.clientWidth ? 'OVF:' + document.documentElement.scrollWidth : 'ok'" 2>/dev/null | tail -1)
    RESULT="$RESULT | $L=$OVERFLOW"
  done
  echo "=== ${1}x${2} ===$RESULT"
done
