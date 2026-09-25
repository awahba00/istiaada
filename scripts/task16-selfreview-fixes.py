#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Task 16 — self-review additions: fix the two remaining الهندسة calques found
during the §19 self-review (rl-cut-point, va-dissonance). Card-scoped, asserted."""
import json, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SRC = "/home/z/my-project/src/data/app/"
FILES = ["knowledge-core.ts", "knowledge-wellbeing.ts", "knowledge-recovery.ts", "knowledge-new.ts"]
DOC = "/home/z/my-project/download/phase3-knowledge-148-native-arabic-final.md"

EDITS = [
    ("rl-cut-point", "understand",
     "وبمجرد تحديدها تملك هدفًا هندسيًّا واضحًا للخطة القادمة.",
     "وبمجرد تحديدها تعرف ما الذي تصلحه في خطتك القادمة.",
     "translation feel",
     "«هدفًا هندسيًّا» من عائلة كلك الهندسة نفسها التي صُححت في dg-no-testing؛ الصياغة الفعلية «تعرف ما الذي تصلحه» أوضح وأكثر عربية."),
    ("va-dissonance", "know",
     "إن وُجّه هندسيًّا، لا محاكمةً.",
     "إن وُجّه إلى التعديل، لا إلى الجلد.",
     "translation feel",
     "«وُجّه هندسيًّا» ترجمة حرفية لـ directed engineeringly؛ «إلى التعديل لا إلى الجلد» يستخدم معجم البطاقة نفسها (التعديل في المتن، والجلد في العنوان)."),
]

code = {f: open(SRC + f, encoding="utf-8").read() for f in FILES}
doc = open(DOC, encoding="utf-8").read()

def card_block_bounds(text, cid):
    m = re.search(r'\{\s*\n\s*id:\s*"' + re.escape(cid) + '"', text)
    if not m:
        return None
    start = m.start()
    depth, j = 0, start
    while j < len(text):
        if text[j] == "{":
            depth += 1
        elif text[j] == "}":
            depth -= 1
            if depth == 0:
                return (start, j + 1)
        j += 1
    return None

applied = []
for cid, field, old, new, ptype, reason in EDITS:
    done = False
    for f in FILES:
        text = code[f]
        bb = card_block_bounds(text, cid)
        if not bb:
            continue
        block = text[bb[0]:bb[1]]
        if block.count(old) != 1:
            continue
        code[f] = text[:bb[0]] + block.replace(old, new, 1) + text[bb[1]:]
        applied.append({"id": cid, "field": field, "file": f, "old": old, "new": new,
                        "type": ptype, "reason": reason})
        done = True
        break
    assert done, f"code edit failed: {cid} :: {old[:40]}"
    # doc
    pos = doc.find(f"- **ID:** `{cid}`")
    assert pos != -1, f"doc id not found: {cid}"
    nxt = doc.find("- **ID:**", pos + 10)
    end = nxt if nxt != -1 else len(doc)
    sect = doc[pos:end]
    assert sect.count(old) == 1, f"doc count != 1 for {cid}"
    doc = doc[:pos] + sect.replace(old, new, 1) + doc[end:]

for f in FILES:
    open(SRC + f, "w", encoding="utf-8").write(code[f])
open(DOC, "w", encoding="utf-8").write(doc)

# append to applied log
log = json.load(open("/home/z/my-project/scripts/task16-applied-edits.json"))
log.extend(applied)
json.dump(log, open("/home/z/my-project/scripts/task16-applied-edits.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print(f"applied {len(applied)} additional edits; total now {len(log)} on {len({e['id'] for e in log})} cards")

# confirm no هندسي remains anywhere
for f in FILES:
    t = open(SRC + f, encoding="utf-8").read()
    assert "هندسي" not in t, f"هندسي still in {f}"
assert "هندسي" not in open(DOC, encoding="utf-8").read(), "هندسي still in doc"
print("هندسي calque: fully removed from code + doc")
