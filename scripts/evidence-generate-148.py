#!/usr/bin/env python3
"""
Generate phase3-knowledge-148-evidence-verified-final.md from the 148-native-arabic-final
by applying exactly the 3 evidence-driven corrections (ur-wave, en-friction, em-labeling)
and prepending the evidence-verification round header.
Integrity: asserts 148 cards before/after, IDs/categories/tags/stages/bit-identical elsewhere.
"""
import re, sys

SRC = "/home/z/my-project/download/phase3-knowledge-148-native-arabic-final.md"
DST = "/home/z/my-project/download/phase3-knowledge-148-evidence-verified-final.md"

EDITS = [
    # (card id, old text, new text, reason key)
    ("ur-wave",
     "تتصاعد الرغبة حتى تبلغ ذروتها، ثم تنحسر — خلال دقائق أو أقل من ساعة — ما دمت لم تستجب لها.",
     "تتصاعد الرغبة حتى تبلغ ذروتها، ثم تنحسر — غالبًا خلال دقائق أو أقل من ساعة — ما دمت لم تستجب لها.",
     "soften"),
    ("en-friction",
     "أضِف عشرين ثانية بينك وبين السلوك، ينخفض احتمال وقوعه فعليًا؛ واختصر عشرين ثانية، يرتفع.",
     "أضِف ثوانٍ قليلة بينك وبين السلوك، ينخفض احتمال وقوعه فعليًا؛ واختصر ثوانٍ قليلة، يرتفع.",
     "remove_number"),
    ("em-labeling",
     "تشير أبحاث «وسم الانفعال» إلى أن تسمية الشعور بدقة تخفض شدته فعلًا.",
     "تشير أبحاث «وسم الانفعال» إلى أن تسمية الشعور بدقة كثيرًا ما تخفض شدته.",
     "soften"),
]

HEADER_ADDITION = """
## جولة التحقق العلمي النهائية (Final Evidence Verification Pass)

هذه النسخة تلي الجولة التحريرية، وهي آخر خطوة في إقفال قاعدة المعرفة: تم التحقق من
الادعاءات العلمية الـ16 التي أُجّلت للمراجعة المصدرية، ببحث فعلي في الأدبيات العلمية
(المراجعات المنهجية والتحليلات البعدية أولًا). النتيجة: 13 ادعاءً بقيت بصياغتها كما هي
لأن الأدلة تدعمها بدرجة تحفظها الحالي، و3 بطاقات فقط عدّلت بأدنى تعديل تقتضيه الأدلة:

1. `ur-wave` — أُضيفت «غالبًا» قبل النطاق الزمني، لأن المدة المذكورة تقدير إكليني شائع
   (١٥–٣٠ دقيقة في أدبيات ركوب موجة الرغبة) وليست ثابتة تجريبية، والمدة تختلف بين الأشخاص.
2. `en-friction` — استُبدل الرقم «عشرين ثانية» بـ«ثوانٍ قليلة»، لأن الرقم يرجع إلى كتاب
   علم نفس شعبي (شون أكور) لا إلى بحث محكّم، بينما مبدأ الاحتكاك نفسه مدعوم تجريبيًا.
3. `em-labeling` — لُيّنت «تخفض شدته فعلًا» إلى «كثيرًا ما تخفض شدته»، لأن الأثر العصبي
   موثق جيدًا لكن الأثر السلوكي متواضع ومشروط بحدود (شدة الانفعال وتوقيت الوسم).

لم تتغير أي بطاقة أخرى، ولم يتغير في هذه الجولة: المعرفات، التصنيفات، الوسوم، المراحل،
البوابات الروحية، المخطط، ترتيب البطاقات، التوصيات السلوكية، أو أي صياغة لغوية لا يقتضي
الدليل تعديلها. التفاصيل الكاملة في: `phase3-knowledge-evidence-final.md`
و`phase3-knowledge-evidence-change-map.md` و`phase3-knowledge-evidence-sources.md`.

---

"""

def card_blocks(text):
    blocks = re.split(r"\n(?=### )", text)
    return blocks

def block_id(b):
    m = re.search(r"-\s*\*\*ID:\*\*\s*`([^`]+)`", b)
    return m.group(1) if m else None

def fingerprint(b):
    """Structure fingerprint: ID, category, tags, stage, spiritual lines."""
    lines = []
    for ln in b.splitlines():
        if ln.startswith("- **"):
            lines.append(ln)
    return "\n".join(lines)

with open(SRC, encoding="utf-8") as f:
    src = f.read()

# --- apply edits ---
changed = []
work = src
for cid, old, new, kind in EDITS:
    n = work.count(old)
    assert n == 1, f"expected exactly 1 occurrence of {cid} old text, found {n}"
    work = work.replace(old, new)
    changed.append(cid)

# --- insert header addition after the editorial-round header block (before first "—" separator after the intro) ---
marker = "—\n"
first_sep = work.find(marker)
assert first_sep > 0, "separator not found"
work = work[:first_sep] + HEADER_ADDITION + work[first_sep:]

# --- integrity checks ---
def ids_of(text):
    return re.findall(r"-\s*\*\*ID:\*\*\s*`([^`]+)`", text)

src_ids, dst_ids = ids_of(src), ids_of(work)
assert len(dst_ids) == 148, f"card count changed: {len(dst_ids)}"
assert src_ids == dst_ids, "card order/ids changed"

# structural fingerprint comparison per card
src_blocks = {block_id(b): b for b in card_blocks(src) if block_id(b)}
dst_blocks = {block_id(b): b for b in card_blocks(work) if block_id(b)}
assert set(src_blocks) == set(dst_blocks)
struct_changes = []
for cid in src_blocks:
    if fingerprint(src_blocks[cid]) != fingerprint(dst_blocks[cid]):
        struct_changes.append(cid)
assert not struct_changes, f"structure changed in: {struct_changes}"

# content diff outside the 3 intended cards
text_changed = [cid for cid in src_blocks if src_blocks[cid] != dst_blocks[cid]]
assert set(text_changed) == set(changed), f"unexpected text diffs: {set(text_changed) ^ set(changed)}"

with open(DST, "w", encoding="utf-8") as f:
    f.write(work)

print(f"OK: wrote {DST}")
print(f"  cards: 148 (before) -> {len(dst_ids)} (after)")
print(f"  text-changed cards (expected exactly the 3): {sorted(text_changed)}")
print(f"  structure (ID/category/tags/stage) identical for all 148: True")
