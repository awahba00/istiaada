#!/usr/bin/env python3
"""Extract the 16 evidence-review cards from the 148-final file for close reading."""
import re, sys

SRC = "/home/z/my-project/download/phase3-knowledge-148-native-arabic-final.md"
TARGET_IDS = [
    "bb-dopamine", "bb-sensitization", "ur-wave", "ur-suppression",
    "hl-implementation", "en-friction", "sl-self-regulation", "sl-phone-out",
    "em-labeling", "sc-not-indulgence", "re-one-person", "rl-ave",
    "di-willpower-debate", "at-notifications", "ur-fade", "re-specialized-help",
]

with open(SRC, encoding="utf-8") as f:
    text = f.read()

# Split into card blocks: each starts with ### and contains ID: `xxx`
blocks = re.split(r"\n(?=### )", text)
found = {}
for b in blocks:
    m = re.search(r"-\s*\*\*ID:\*\*\s*`([^`]+)`", b)
    if m and m.group(1) in TARGET_IDS:
        found[m.group(1)] = b.strip()

missing = [t for t in TARGET_IDS if t not in found]
if missing:
    print(f"MISSING: {missing}", file=sys.stderr)

out = "/home/z/my-project/scripts/evidence-cards-extract.md"
with open(out, "w", encoding="utf-8") as f:
    for t in TARGET_IDS:
        if t in found:
            f.write(found[t] + "\n\n---\n\n")
print(f"Extracted {len(found)}/16 cards -> {out}")
for t in TARGET_IDS:
    print(("OK " if t in found else "MISS ") + t)
