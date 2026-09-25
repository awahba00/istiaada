#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extract all 148 knowledge cards from TS code files, verify sync with the
evidence-verified-final doc, and dump a JSON snapshot for editorial work."""
import json, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SRC = "/home/z/my-project/src/data/app/"
FILES = ["knowledge-core.ts", "knowledge-wellbeing.ts", "knowledge-recovery.ts", "knowledge-new.ts"]

STR_RE = re.compile(r'"((?:[^"\\]|\\.)*)"')

def parse_cards(text):
    """Split file into card blocks by scanning balanced braces around each id."""
    cards = []
    lines = text.split("\n")
    # find line indices where a card object starts: a line == "  {" followed by id: line
    starts = []
    for idx, ln in enumerate(lines):
        if ln.strip() == "{" and idx + 1 < len(lines) and re.match(r'\s*id:\s*"', lines[idx + 1]):
            starts.append(idx)
    for k, s in enumerate(starts):
        e = starts[k + 1] - 1 if k + 1 < len(starts) else len(lines) - 1
        block = "\n".join(lines[s:e])
        cards.append(block)
    return cards

def parse_fields(block):
    """Parse key: "string" [+ "string"] fields from a block (line-based)."""
    out = {}
    cur_key = None
    buf = []
    for ln in block.split("\n"):
        m = re.match(r'\s*([a-zA-Z]+):\s*(.*)', ln)
        if m and not ln.strip().startswith("//"):
            key, rest = m.group(1), m.group(2)
            if key in ("id", "category", "title", "know", "understand", "act", "remember", "deep", "stage"):
                cur_key = key
                buf = [rest]
                continue
        if cur_key is not None:
            buf.append(ln)
        # terminate when buffer contains a top-level comma ending the field
        joined = " ".join(buf)
        if cur_key and re.search(r'",\s*$', joined.strip()) or (cur_key and joined.strip() in ('""', '""')):
            pass
    # simpler second pass: join block lines, split by key positions
    return out

def extract_fields(block):
    """Robust: locate each key: inside the block, take everything until the next key: or tags:/stage: line."""
    keys = ["id", "category", "title", "know", "understand", "act", "remember", "deep", "tags", "stage"]
    positions = []
    for key in keys:
        for m in re.finditer(r'(?:^|\n)\s*' + key + r':\s*', block):
            # ensure it's a field of this object (not inside a string) — files are regular enough
            positions.append((m.end(), key))
    positions.sort()
    fields = {}
    for i, (pos, key) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(block)
        raw = block[pos:end]
        raw = raw.rstrip().rstrip(",").rstrip()
        parts = STR_RE.findall(raw)
        if parts:
            s = "".join(parts)
            s = s.replace('\\"', '"').replace("\\\\", "\\")
            fields[key] = s
        else:
            # e.g. tags handled elsewhere
            fields[key] = raw.strip()
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

print(f"TOTAL CARDS IN CODE: {len(all_cards)}")
ids = [c["id"] for c in all_cards]
print(f"UNIQUE IDS: {len(set(ids))}")
missing_fields = [c["id"] for c in all_cards if not all(c.get(k) for k in ("title", "know", "understand", "act", "remember"))]
print(f"CARDS WITH MISSING TEXT FIELDS: {len(missing_fields)} {missing_fields[:5]}")

# --- parse the doc ---
doc = open("/home/z/my-project/download/phase3-knowledge-148-evidence-verified-final.md", encoding="utf-8").read()
doc_ids = re.findall(r'- \*\*ID:\*\* `([^`]+)`', doc)
print(f"DOC IDS: {len(doc_ids)}")
print(f"CODE/DOC ID ORDER MATCH: {ids == doc_ids}")

def doc_field(doc, cid, label):
    pos = doc.find(f"`{cid}`")
    if pos == -1:
        return None
    nxt = doc.find("- **ID:**", pos + 10)
    sect = doc[pos:nxt] if nxt != -1 else doc[pos:]
    m = re.search(r'\*\*' + label + r':\*\* (.+)', sect)
    return m.group(1).strip() if m else None

LABELS = {"know": "اعرف", "understand": "افهم", "act": "افعل", "remember": "تذكّر", "title": None}
n_sync, mismatches = 0, []
for c in all_cards:
    ok = True
    for fkey, lab in LABELS.items():
        if lab is None:
            # title appears as ### heading after ID block — handled below
            continue
        d = doc_field(doc, c["id"], lab)
        if d is not None and c.get(fkey) is not None and d != c[fkey]:
            ok = False
            print(f"  TEXT MISMATCH {c['id']}/{fkey}:\n    code: {c[fkey][:80]}\n    doc : {d[:80]}")
    if ok:
        n_sync += 1
    else:
        mismatches.append(c["id"])
print(f"TEXT SYNC (know/understand/act/remember): {n_sync}/{len(all_cards)} identical")

# titles: doc heading ### after card meta
n_title_sync = 0
for c in all_cards:
    pos = doc.find(f"`{c['id']}`")
    if pos == -1:
        continue
    m = re.compile(r'\n### (.+)\n').search(doc[pos:pos + 1500])
    # the NEXT heading after this card's meta is the next card's title... use heading BEFORE the ID instead
    pre = doc[:pos]
    m2 = re.compile(r'\n### (.+)\n(?:\n- \*\*ID:\*\*)').search(pre[-400:])
    if m2 and m2.group(1).strip() == c["title"].strip():
        n_title_sync += 1
    elif m2:
        print(f"  TITLE MISMATCH {c['id']}: code=«{c['title']}» doc=«{m2.group(1).strip()}»")
print(f"TITLE SYNC: {n_title_sync}/{len(all_cards)}")

fp = [{"id": c["id"], "category": c["category"], "tags": c["tags"], "stage": c["stage"]} for c in all_cards]
json.dump(fp, open("/home/z/my-project/scripts/task16-structure-baseline.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump(all_cards, open("/home/z/my-project/scripts/task16-cards-baseline.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("baselines saved")

# verify the 3 locked evidence changes are present
def frag(cid, s, f):
    c = next(x for x in all_cards if x["id"] == cid)
    return s in (c.get(f) or "")

print("\nEVIDENCE-LOCK CHECKS:")
checks = [
    ("ur-wave", "غالبًا خلال دقائق أو أقل من ساعة", "know", True),
    ("en-friction", "ثوانٍ قليلة", "know", True),
    ("en-friction", "عشرين ثانية", "know", False),
    ("em-labeling", "كثيرًا ما تخفض شدته", "know", True),
    ("em-labeling", "تخفض شدته فعلًا", "know", False),
]
for cid, s, f, expect in checks:
    present = frag(cid, s, f)
    print(f"  [{'OK' if present == expect else 'FAIL'}] {cid} :: «{s[:40]}» present={present} expected={expect}")
