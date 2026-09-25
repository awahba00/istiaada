#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Task 16 — generate phase3-knowledge-native-final-editorial-map.md
(148/148 entries: UPDATED cards with before/after/problem-type/reason,
UNCHANGED cards listed with an explicit verdict)."""
import json, re, io, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SRC = "/home/z/my-project/src/data/app/"
FILES = ["knowledge-core.ts", "knowledge-wellbeing.ts", "knowledge-recovery.ts", "knowledge-new.ts"]
STR_RE = re.compile(r'"((?:[^"\\]|\\.)*)"')

FIELD_AR = {"title": "العنوان", "know": "اعرف", "understand": "افهم", "act": "افعل",
            "remember": "تذكّر", "deep": "قراءة أعمق"}

def parse_cards(text):
    cards, lines, starts = [], text.split("\n"), []
    for idx, ln in enumerate(lines):
        if ln.strip() == "{" and idx + 1 < len(lines) and re.match(r'\s*id:\s*"', lines[idx + 1]):
            starts.append(idx)
    for k, s in enumerate(starts):
        e = starts[k + 1] - 1 if k + 1 < len(starts) else len(lines) - 1
        cards.append("\n".join(lines[s:e]))
    return cards

def extract_fields(block):
    keys = ["id", "category", "title", "know", "understand", "act", "remember", "deep", "tags", "stage"]
    positions = []
    for key in keys:
        for m in re.finditer(r'(?:^|\n)\s*' + key + r':\s*', block):
            positions.append((m.end(), key))
    positions.sort()
    fields = {}
    for i, (pos, key) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(block)
        raw = block[pos:end].rstrip().rstrip(",").rstrip()
        parts = STR_RE.findall(raw)
        fields[key] = "".join(parts) if parts else raw.strip()
    return fields

all_cards = []
for f in FILES:
    text = open(SRC + f, encoding="utf-8").read()
    for block in parse_cards(text):
        fl = extract_fields(block)
        tg = re.search(r'tags:\s*\[([^\]]*)\]', block)
        fl["tags"] = tg.group(1).strip() if tg else ""
        fl["src_file"] = f
        all_cards.append(fl)

# doc order (category-grouped presentation of the deliverable doc)
doc = open("/home/z/my-project/download/phase3-knowledge-148-native-arabic-final.md", encoding="utf-8").read()
doc_ids = re.findall(r'- \*\*ID:\*\* `([^`]+)`', doc)
by_id = {c["id"]: c for c in all_cards}

log = json.load(open("/home/z/my-project/scripts/task16-applied-edits.json"))
edits_by_card = {}
for e in log:
    edits_by_card.setdefault(e["id"], []).append(e)

updated = [i for i in doc_ids if i in edits_by_card]
unchanged = [i for i in doc_ids if i not in edits_by_card]
assert len(updated) == 41 and len(unchanged) == 107, (len(updated), len(unchanged))

# type distribution
from collections import Counter
types = Counter()
for e in log:
    t = e["type"]
    if "punctuation" == t:
        types["punctuation (؛ قبل و)"] += 1
    else:
        types[t] += 1

out = []
out.append("# خريطة الجولة التحريرية العربية النهائية — 148 بطاقة")
out.append("")
out.append("هذه خريطة الجولة التحريرية الأخيرة التي أعقبت جولة التحقق العلمي. نقطة الانطلاق:")
out.append("`phase3-knowledge-148-evidence-verified-final.md`. رُوجعت البطاقات الـ148 كلها،")
out.append("وعدّلت منها 41 بطاقة بـ50 تعديلًا موضعيًّا (أقل تعديل ضروري)، وبقيت 107 بطاقات")
out.append("دون تعديل — وقد قرئت وحُكم عليها بأنها سليمة، لا أنها لم تُقرأ.")
out.append("")
out.append("## ملخص الأنواع")
out.append("")
out.append("| نوع المشكلة | عدد التعديلات |")
out.append("|---|---|")
for t, n in types.most_common():
    out.append(f"| {t} | {n} |")
out.append("")
out.append("## البطاقات المعدلة (41)")
out.append("")
for cid in updated:
    c = by_id[cid]
    es = edits_by_card[cid]
    out.append(f"### `{cid}` — {c['title']}")
    out.append("")
    out.append(f"- **الحالة:** UPDATED ({len(es)} تعديل{'ان' if len(es)==2 else ''})")
    for e in es:
        out.append(f"- **الحقل:** {FIELD_AR[e['field']]}")
        out.append(f"  - **النوع:** {e['type']}")
        out.append(f"  - **قبل:** {e['old']}")
        out.append(f"  - **بعد:** {e['new']}")
        out.append(f"  - **السبب:** {e['reason']}")
    out.append("")

out.append("## البطاقات غير المعدلة (107)")
out.append("")
out.append("قرئت كل واحدة منها كاملة وأُصدر فيها حكم تحريري: سليمة لغويًّا، طبيعية الأسلوب،")
out.append("خالية من أثر الترجمة والتكلف — فتُركت عمدًا وفق مبدأ «أقل تعديل ضروري».")
out.append("")
out.append("| # | ID | العنوان |")
out.append("|---|---|---|")
for k, cid in enumerate(unchanged, 1):
    out.append(f"| {k} | `{cid}` | {by_id[cid]['title']} |")

out.append("")
out.append("## ملاحظات الحكم التحريري على حالات بقيت عمدًا")
out.append("")
out.append("هذه أشياء ظهرت أثناء المسح الآلي ورُوجعت يدويًّا ثم أُبقيت عن قصد (لكشفها ليس")
out.append("إدانة، والقرار في كل حالة سياقي):")
out.append("")
out.append("- **«أم الأبواب»** (`dg-one-minute`): تركيب عربي معتبر (كأم القرى وأم المعارك)، فبقيت.")
out.append("- **«تعمر الأرض خلفها»** (`pr-hobby`): عمارة الأرض تركيب عربي أصيل، والصورة متماسكة مع «الحدود».")
out.append("- **«ليست محكمة — بل ورشة»** (`va-dissonance`): تقابل وظيفي يتسق مع متن البطاقة (محاكمة النفس).")
out.append("- **«نافذة الخطر» و«نافذة التحمل» و«درجة الغليان» و«صمام/مضخة»**: مفاهيم منتج راسخة، بقيت كما هي.")
out.append("- **«الرغبات تخفت… عادةً»** (`ur-fade`): النقط الثلاث هنا وحدها في القاعدة كلها، وتؤدي معنى (الاستدراك)، فبقيت.")
out.append("- **الفاصلة المنقوطة قبل «أما/إنه»** (نحو: «محتمل؛ أما اجتماعها»): استعمال قويم للفاصلة المنقوطة، بقي في مواضعه.")
out.append("- **إبقاء عمدًا لحالتين من «؛» قبل الواو**: في `en-friction` (حقل مقفول علميًّا) و`lt-pressure` (جملة بفواصل داخلية تحتاج الفاصلة المنقوطة حدًّا فاصلًا) — القرار سياقي لا آلي.")
out.append("")
out.append("—")

open("/home/z/my-project/download/phase3-knowledge-native-final-editorial-map.md", "w", encoding="utf-8").write("\n".join(out))
print(f"editorial map written: 148/148 ({len(updated)} updated + {len(unchanged)} unchanged), {len(log)} edits")
