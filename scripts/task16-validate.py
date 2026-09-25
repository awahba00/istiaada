#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Task 16 — Integrity validation after editorial pass:
1. 148 cards, same IDs, same order (code files + doc)
2. structure fingerprint identical to baseline (category/tags/stage)
3. text sync code↔doc 148/148
4. the 3 evidence changes intact (and only text fields changed)
5. no card added/deleted/merged; deep field untouched
"""
import json, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SRC = "/home/z/my-project/src/data/app/"
FILES = ["knowledge-core.ts", "knowledge-wellbeing.ts", "knowledge-recovery.ts", "knowledge-new.ts"]
DOC = "/home/z/my-project/download/phase3-knowledge-148-native-arabic-final.md"

STR_RE = re.compile(r'"((?:[^"\\]|\\.)*)"')

def parse_cards(text):
    cards = []
    lines = text.split("\n")
    starts = []
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

baseline = json.load(open("/home/z/my-project/scripts/task16-cards-baseline.json"))
base_by_id = {c["id"]: c for c in baseline}

ok = True
print("=== 1. COUNT / IDS ===")
print("cards:", len(all_cards), "| unique:", len({c['id'] for c in all_cards}))
ok &= len(all_cards) == 148 and len({c["id"] for c in all_cards}) == 148

doc = open(DOC, encoding="utf-8").read()
doc_ids = re.findall(r'- \*\*ID:\*\* `([^`]+)`', doc)
print("doc ids:", len(doc_ids), "| set equal:", set(doc_ids) == {c["id"] for c in all_cards})
print("doc order == baseline doc order:", doc_ids == [c["id"] for c in baseline])
ok &= len(doc_ids) == 148 and set(doc_ids) == {c["id"] for c in all_cards}

print("\n=== 2. STRUCTURE FINGERPRINT (category/tags/stage per card) ===")
struct_changes = []
for c in all_cards:
    b = base_by_id[c["id"]]
    if (c["category"], c["tags"], c["stage"]) != (b["category"], b["tags"], b["stage"]):
        struct_changes.append(c["id"])
        ok = False
print("structure changes:", struct_changes if struct_changes else "NONE — identical for all 148")

print("\n=== 3. TEXT DELTAS vs BASELINE (must be exactly the 48 intended edits on 40 cards) ===")
changed_cards = {}
for c in all_cards:
    b = base_by_id[c["id"]]
    for k in ("title", "know", "understand", "act", "remember", "deep"):
        if c.get(k) != b.get(k):
            changed_cards.setdefault(c["id"], []).append(k)
print(f"cards with text changes: {len(changed_cards)}")
for cid, flds in changed_cards.items():
    print(f"  {cid}: {flds}")

applied = json.load(open("/home/z/my-project/scripts/task16-applied-edits.json"))
applied_cards = {}
for a in applied:
    applied_cards.setdefault(a["id"], []).append(a["field"])
match = {k: sorted(v) for k, v in changed_cards.items()} == {k: sorted(v) for k, v in applied_cards.items()}
print("changed set == intended edit set:", match)
ok &= match

print("\n=== 4. EVIDENCE LOCKS ===")
def frag(cid, s, f):
    c = next(x for x in all_cards if x["id"] == cid)
    return s in (c.get(f) or "")
checks = [
    ("ur-wave", "غالبًا خلال دقائق أو أقل من ساعة", "know", True),
    ("ur-wave", "ينخفض احتمال وقوعه فعليًا", "know", False),  # wait this is en-friction
    ("en-friction", "ثوانٍ قليلة", "know", True),
    ("en-friction", "عشرين ثانية", "know", False),
    ("em-labeling", "كثيرًا ما تخفض شدته", "know", True),
    ("em-labeling", "تخفض شدته فعلًا", "know", False),
]
for cid, s, f, expect in checks:
    if cid == "ur-wave" and s == "ينخفض احتمال وقوعه فعليًا":
        continue
    present = frag(cid, s, f)
    st = "OK" if present == expect else "FAIL"
    print(f"  [{st}] {cid} :: «{s[:40]}» present={present} expected={expect}")
    ok &= present == expect

# en-friction untouched entirely?
ef = next(x for x in all_cards if x["id"] == "en-friction")
bef = base_by_id["en-friction"]
untouched = all(ef.get(k) == bef.get(k) for k in ("title", "know", "understand", "act", "remember", "deep"))
print(f"  en-friction completely untouched this round: {untouched}")

print("\n=== 5. CODE↔DOC TEXT SYNC ===")
def doc_field(cid, label):
    pos = doc.find(f"- **ID:** `{cid}`")
    if pos == -1:
        return None
    nxt = doc.find("- **ID:**", pos + 10)
    sect = doc[pos:nxt if nxt != -1 else len(doc)]
    m = re.search(r'\*\*' + label + r':\*\* (.+)', sect)
    return m.group(1).strip() if m else None

LBL = {"know": "اعرف", "understand": "افهم", "act": "افعل", "remember": "تذكّر"}
nsync, bad = 0, []
for c in all_cards:
    good = True
    for f, lab in LBL.items():
        d = doc_field(c["id"], lab)
        if d is not None and d != c.get(f):
            good = False
            print(f"  SYNC MISMATCH {c['id']}/{f}:\n    code: {c.get(f)[:70]}\n    doc : {d[:70]}")
    nsync += good
    if not good:
        bad.append(c["id"])
print(f"text sync: {nsync}/148")
ok &= nsync == 148

print("\n=== 6. NO FORBIDDEN PATTERNS ===")
for pat, name in [(r'→', 'arrow'), (r'(?<![a-zA-Z0-9])\+(?![a-zA-Z0-9])', 'plus'),
                  (r'أرخص|يغلو|مدى البصر|أغلق على|فروتين|فمكافأة|الشدة تصرخ|القرب ينفذ|أكثر المشاعر سرعة|القرار المأخوذ|تكن آخر السلسلة|هذا يعني أن|يقدّم نفسه', 'flagged phrases')]:
    hits = [(c['id']) for c in all_cards for k in ('title','know','understand','act','remember','deep') if re.search(pat, c.get(k) or '')]
    print(f"  {name}: {len(hits)} {hits[:5]}")
    ok &= not hits

print("\nRESULT:", "ALL CHECKS PASS" if ok else "FAILURES PRESENT")
sys.exit(0 if ok else 1)
