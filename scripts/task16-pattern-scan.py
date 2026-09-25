#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Task 16 — Automated language pattern scan (detection only, no auto-replacement).
Scans the source-of-truth doc + code files for translationese/AI-ish markers
per spec §20. Every hit is flagged for MANUAL adjudication."""
import re, sys, io, json

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

DOC = "/home/z/my-project/download/phase3-knowledge-148-evidence-verified-final.md"
doc = open(DOC, encoding="utf-8").read()

# card sections for locating hits
ids = re.findall(r'- \*\*ID:\*\* `([^`]+)`', doc)

def card_of(pos):
    return doc.rfind("- **ID:**", 0, pos)

PATTERNS = [
    ("symbol: +", r'(?<![a-zA-Z0-9])\+(?![a-zA-Z0-9])'),
    ("symbol: =", r'(?<![a-zA-Z0-9=])=(?![a-zA-Z0-9=])'),
    ("symbol: →", r'→'),
    ("symbol: ←", r'←'),
    ("«أرخص»", r'أرخص'),
    ("«يغلو ثمنه»", r'يغلو'),
    ("«في مدى البصر»", r'مدى البصر'),
    ("«أغلق على»", r'أغلق على'),
    ("«فروتين»", r'فروتين'),
    ("«فمكافأة»", r'فمكافأة'),
    ("«الشدة تصرخ»", r'الشدة تصرخ'),
    ("«القرب ينفذ»", r'القرب ينفذ'),
    ("«أكثر المشاعر سرعة»", r'أكثر المشاعر سرعة'),
    ("«القرار المأخوذ منك»", r'القرار المأخوذ'),
    ("«تكن آخر السلسلة»", r'تكن آخر السلسلة'),
    ("«هذا يعني أن»", r'هذا يعني أن'),
    ("«يقدّم نفسه»", r'يقدّم نفسه'),
    ("«يغيّر معادلة»", r'يغيّر معادلة|تغيّر معادلة'),
    ("«معادلة» (any)", r'معادلة|معادلات'),
    ("«الزخم»", r'زخم'),
    ("«مرساة»", r'مرساة'),
    ("«الميدان»", r'الميدان'),
    ("«الضباب» (any)", r'ضباب'),
    ("«الجدار» (any)", r'جدار'),
    ("«النافذة» (any)", r'نافذة'),
    ("«فرصة» (any)", r'فرصة'),
    ("«سلاح»", r'سلاح'),
    ("«محكمة»", r'محكمة'),
    ("ellipsis …", r'…'),
    ("semicolon ؛", r'؛'),
    ("em-dash —", r'—'),
    ("«نفسي المستقبلي»", r'نفسي المستقبلي'),
    ("«الرصيد»", r'رصيد'),
    ("English latin in prose", r'[A-Za-z]{3,}'),
]

report = {}
for name, pat in PATTERNS:
    hits = []
    for m in re.finditer(pat, doc):
        cid_pos = card_of(m.start())
        cid = re.search(r'`([^`]+)`', doc[cid_pos:cid_pos+80]).group(1) if cid_pos != -1 else "HEADER"
        ctx = doc[max(0, m.start()-60):m.start()+60].replace("\n", " ")
        hits.append((cid, ctx))
    report[name] = hits
    print(f"\n### {name}: {len(hits)} hits")
    for cid, ctx in hits[:12]:
        print(f"  [{cid}] …{ctx}…")
    if len(hits) > 12:
        print(f"  … and {len(hits)-12} more")

json.dump({k: [(c, x) for c, x in v] for k, v in report.items()},
          open("/home/z/my-project/scripts/task16-pattern-scan.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# count cards with 2+ em-dashes in one card body
print("\n### cards with 2+ '—' inside a single card:")
per_card = {}
bounds = [doc.find(f"`{i}`") for i in ids] + [len(doc)]
for k, cid in enumerate(ids):
    sect = doc[bounds[k]:bounds[k+1]]
    n = sect.count("—")
    if n >= 2:
        per_card[cid] = n
print(per_card)

# semicolon per card
print("\n### cards containing '؛':")
semi = {}
for k, cid in enumerate(ids):
    sect = doc[bounds[k]:bounds[k+1]]
    n = sect.count("؛")
    if n:
        semi[cid] = n
print(semi)
