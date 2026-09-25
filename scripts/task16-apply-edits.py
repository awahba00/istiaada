#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Task 16 — Final Native Arabic Editorial Pass: apply the adjudicated minimal
edit table to BOTH the TS code files and the source-of-truth doc.
Every edit is asserted (must exist exactly once in its card block).
Zero global replacements — each row is card-scoped."""
import json, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SRC = "/home/z/my-project/src/data/app/"
FILES = ["knowledge-core.ts", "knowledge-wellbeing.ts", "knowledge-recovery.ts", "knowledge-new.ts"]
DOC = "/home/z/my-project/download/phase3-knowledge-148-evidence-verified-final.md"

# (card_id, field, old, new, problem_type, reason)
EDITS = [
    # ————— content edits (naturalness / calques / clipped grammar) —————
    ("st-window", "remember",
     "أيام العاصفة تُبحر بأشرعة صغيرة.",
     "أيام العاصفة تُدار بأهداف صغيرة.",
     "metaphor + grammar",
     "«أيام تُبحر» مبنى مترجم (sail through stormy days): الأيام لا تُبحر، وصياغتها مبتورة نحويًّا؛ «تُدار بأهداف صغيرة» تنقل نصيحة البطاقة نفسها (وضع الحد الأدنى) وتتسق مع صوت st-exam-season."),
    ("em-loneliness", "remember",
     "لا يطفئ الوحدة محتوى — بل صوت حقيقي.",
     "الوحدة لا يطفئها محتوى، بل صوت حقيقي.",
     "awkward Arabic",
     "تقديم الفعل المنفي على المفعول النكرة («لا يطفئ الوحدة محتوى») ترتيب يوحي بالترجمة؛ التقديم والإضمار («الوحدة لا يطفئها») هو الأسلوب العربي الطبيعي."),
    ("em-unclear-feelings", "remember",
     "كلمة تقترب من شعورك خير من صمت يبتلعه.",
     "كلمة أقرب إلى شعورك خير من صمت يبتلعه.",
     "awkward Arabic",
     "«كلمة تقترب من شعورك» صياغة حرفية لـ a word that gets close؛ التركيب المقارن «كلمة أقرب إلى شعورك» هو الطبيعي ويتسق مع «خذ الأقرب» في البطاقة نفسها."),
    ("re-trust", "remember",
     "النمط أعلى صوتًا من الوعد.",
     "نمطك اليومي أبلغ من وعدك.",
     "metaphor",
     "«النمط أعلى صوتًا» يستعير صوتًا لمصطلح مجرد؛ «أبلغ من وعدك» هي الكتابة الطبيعية للمقارنة بين فعل ووعد."),
    ("di-morning-protocol", "remember",
     "يومك يبدأ قبل أول شاشة، لا عندها.",
     "يومك يبدأ قبل أن تفتح أول شاشة.",
     "awkward Arabic",
     "«لا عندها» مرجعها مضطرب (اليوم لا يبدأ «عند» شاشة)؛ الصيغة الفعلية الكاملة طبيعية وتحفظ المعنى نفسه."),
    ("re-loneliness-context", "remember",
     "كلفتها أغلى مما تظن.",
     "كلفتها أعلى مما تظن.",
     "grammar",
     "الكلفة توصف بأنها أعلى أو أثقل، أما «أغلى» فمضافها الثمن؛ تصحيح اقتران كلمة واحدة."),
    ("re-after-hard-talk", "understand",
     "وهذه الطاقة المتبقية إن لم تجد مصرفًا وصلت الليل متوهجة — والليل وحده مع الجهاز يعرف الباقي.",
     "وهذه الطاقة المتبقية إن لم تجد مصرفًا وصلت الليل متوهجة — والباقي معروف: وحدتك، وجهازك.",
     "AI-ish phrasing",
     "«والليل وحده مع الجهاز يعرف الباقي» تشخيص غامض يفك معناه القارئ؛ «والباقي معروف» هو التعبير العربي الجاري، مع إبقاء الصورة (وحدة وجهاز)."),
    ("sp-tawbah", "title",
     "التوبة: عودة لا مطاردة",
     "التوبة: عودة لا محاكمة",
     "title",
     "البطاقة كلها تقابل بين «عودة» و«محاكمة» (وردت مرتين في المتن)؛ «مطاردة» مفهوم ثالث لم يُبنَ عليه شيء، فاستقام أن يحمل العنوان التقابل الفعلي للبطاقة."),
    ("dg-one-minute", "understand",
     "الوعد الصغير يعبر لأنه يبدو بلا كلفة",
     "يفلت الوعد الصغير لأنه يبدو بلا كلفة",
     "awkward Arabic",
     "«يعبر» بلا مفعول أو مجاز مرسوم تركيب مبتور؛ «يفلت» هو الفعل العربي الدارج لما يتجاوز حذرك."),
    ("dg-no-testing", "understand",
     "الاختبار يضعك في أسوأ المعادلات:",
     "الاختبار يضعك في أسوأ الظروف:",
     "translation feel",
     "«أسوأ المعادلات» كلك لـ worst-case equation؛ «أسوأ الظروف» مباشرة وطبيعية، والسياق يسرد ظروفًا لا معادلة."),
    ("dg-no-testing", "understand",
     "القوة الحقيقية في الهندسة، لا في المواجهة.",
     "القوة الحقيقية في ترتيب بيئتك، لا في المواجهة.",
     "translation feel",
     "«الهندسة» ترجمة حرفية لـ engineering your environment وتُقرأ مهنةً لا فعلًا؛ «ترتيب بيئتك» هو ما توصي به البطاقة فعلًا."),
    ("tr-no-testing-decision", "know",
     "إنه قراءة واقعية لمعادلة تخسرها غالبًا.",
     "إنه قراءة واقعية لمواجهة تخسرها غالبًا.",
     "translation feel",
     "«معادلة تخسرها» من عائلة كلك المعادلة نفسها؛ «مواجهة تخسرها» تتسق مع معجم البطاقة (المسافة أمان والاقتراب مخاطرة)."),
    ("sc-firm-compassionate", "know",
     "المعادلة الأنجح تجمع خطين:",
     "الصيغة الأنجح تجمع أمرين:",
     "metaphor",
     "«معادلة تجمع خطين» تخلط استعارة رياضية بمعنى «خطوط» غير الهندسية؛ «الصيغة تجمع أمرين» مباشرة وصحيحة."),
    ("rl-lapse-relapse", "remember",
     "الزَلّة حدث… والاستمرار قرار.",
     "الزَلّة حدث عابر، والاستمرار قرار.",
     "punctuation + AI-ish",
     "النقط الثلاث وقفة درامية مصطنعة؛ «حدث عابر» يصرّح بمضمون البطاقة (واقعة واحدة مححدودة) ويعيد الجملة إلى إيقاع عربي عادي."),
    ("rl-cut-point", "remember",
     "أين كانت نقطة القطع؟ — هذا هو السؤال.",
     "بعد كل زَلّة اسأل: أين كانت نقطة القطع؟",
     "AI-ish phrasing",
     "«— هذا هو السؤال» لقطة شعارية (كلك لـ that is the question)؛ صيغة الأمر + السؤال أخف وأكثر عربية."),
    ("rl-speed", "remember",
     "سرعة وقوفك تقدم يُحسب — حتى داخل الزَلّة نفسها.",
     "سرعة وقوفك تُحسب تقدمًا — حتى داخل الزَلّة نفسها.",
     "grammar",
     "«تقدم يُحسب» تركيب اسمي مبتور بلا خبر؛ «تُحسب تقدمًا» هي الصياغة الكاملة الطبيعية."),
    ("sc-friend-voice", "remember",
     "أنت أول أصدقائك — عامله على هذا الأساس.",
     "كلّم نفسك كما تكلّم أعز أصدقائك.",
     "translation feel",
     "«أنت أول أصدقائك» كلك لـ you are your first friend، والضمير «عامله» يعود على المخاطب نفسه بصيغة الغائب؛ الصياغة الفعلية المباشرة أدّى المعنى بلا التفاف."),
    ("lt-travel", "remember",
     "خذ معك أقل القواعد وأمتنها، ولا تعلّق التزامك على باب بيتك.",
     "خذ معك أقل القواعد وأمتنها، ولا تترك التزامك في البيت.",
     "metaphor",
     "«علّق التزامك على باب بيتك» صورة مبتكرة تحتاج فك شفرتها؛ «لا تترك التزامك في البيت» يقول المعنى مباشرة."),
    ("dg-chat-groups", "remember",
     "المجموعة تخدمك حين تدخلها بوقتك؛ وتستهلكك حين تظل تدخل إليك.",
     "المجموعة تخدمك حين تدخلها بوقتك، وتستهلكك حين تظل تدخل عليك.",
     "mixed",
     "«تدخل إليك» للمجموعة اقتران غير جارٍ؛ «تدخل عليك» هو الفعل العربي لمن يقتحم عليك، وإزالة الفاصلة المنقوطة الزائدة قبل الواو."),
    ("dg-unintended-exposure", "understand",
     "فالعرض لم تختره أنت؛ والاستمرار في النظر اختيار.",
     "فالعرض لم تختره أنت، والاستمرار في النظر اختيار.",
     "punctuation",
     "فاصلة منقوطة قبل واو العطف زائدة؛ الفاصلة تكفي لأن الواو تصل الجملتين."),
    ("dg-unintended-exposure", "remember",
     "العارض ليس من فعلك؛ والثانية التالية بالكامل من فعلك.",
     "العارض ليس اختيارك، والثانية التالية اختيارك بالكامل.",
     "awkward Arabic",
     "المتن نفسه يقول «لم تختره أنت… والاستمرار اختيار»؛ توحيد التذكّر مع معجم البطاقة (اختيار/اختيار) بدل «من فعلك/من فعلك» المبتورة."),
    ("va-day-design", "title",
     "صمّم يومك بحيث يخدم قيمك، لا بحيث يكون كله مقاومة",
     "صمّم يومك لخدمة قيمك، لا ليكون كله مقاومة",
     "title",
     "تكرار «بحيث» مرتين في عنوان واحد مثقل؛ «لخدمة/ليكون» أخف وتحفظ التقابل."),
    ("di-restart", "know",
     "لا تُرمى ولا تُعاقب عليها — تُستأنف من نقطة اليوم.",
     "لا تُرمى — بل تُستأنف من نقطة اليوم بلا عقاب.",
     "awkward Arabic",
     "«لا تُعاقب عليها» يجعل الخطة هي المعاقَب (التقدير مختل: العقاب واقع عليك لا عليها)؛ «بلا عقاب» يحفظ الموقف دون خلل في الإسناد."),
    ("re-repair-relationship", "understand",
     "فقد ثقته في «وجودك».",
     "فقد ثقته فيك.",
     "punctuation",
     "علامتا التنصيص حول «وجودك» لمسة مصطنعة لمعنى لا يحتاج تنصيصًا؛ «ثقته فيك» أبسط وأصدق، والشرح بعدها مباشرة (حضور في الموعد…)."),
    ("em-shame-after-slip", "understand",
     "«حصلت زَلّة» جملة يمكن البناء عليها؛ و«أنا فاسد» جملة تُغلق الطريق.",
     "«حصلت زَلّة» جملة يمكن البناء عليها، و«أنا فاسد» جملة تُغلق الطريق.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("em-shame-after-slip", "remember",
     "الذنب يقوّم؛ والعار يهدم — فانتبه لما تحدث به نفسك.",
     "الذنب يقوّم والعار يهدم — فانتبه لما تحدث به نفسك.",
     "punctuation",
     "اجتماع الفاصلة المنقوطة والشرطة في سطر واحد كثافة إعرابية لا يحتاجها التذكّر؛ الواو تكفي."),
    ("re-after-hard-talk", "remember",
     "المحادثة تنتهي؛ وبقاياها لا تنتهي إلا بقرارك.",
     "المحادثة تنتهي، وبقاياها لا تنتهي إلا بقرارك.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),

    # ————— punctuation family: «؛» + «و» → «،» + «و» (redundant juncture) —————
    ("ur-wave", "remember",
     "تمرّ الموجة في كل حال؛ والتنفيذ هو قرارك أنت.",
     "تمرّ الموجة في كل حال، والتنفيذ هو قرارك أنت.",
     "punctuation",
     "الفاصلة المنقوطة قبل واو العطف زائدة؛ الواو تصل الجملتين والفاصلة تكفي. (لا يمسّ التعديل العلمي المقفول في حقل «اعرف».)"),
    ("ur-intensity-proximity", "understand",
     "فالشدة تخبرك بحرارة الإحساس؛ والقرب يخبرك باحتمال التنفيذ",
     "فالشدة تخبرك بحرارة الإحساس، والقرب يخبرك باحتمال التنفيذ",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("ur-urge-return", "understand",
     "ضعُف ولم يُمحَ؛ وموجة اليوم أهون من موجات أمس",
     "ضعُف ولم يُمحَ، وموجة اليوم أهون من موجات أمس",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("sl-consistency", "understand",
     "جسمك يعمل على إيقاع؛ والسهر يومًا",
     "جسمك يعمل على إيقاع، والسهر يومًا",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("st-shrink", "know",
     "والمحددة تُرى على حجمها؛ ومعظم التوتر يولد من الضباب.",
     "والمحددة تُرى على حجمها، ومعظم التوتر يولد من الضباب.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("em-body", "know",
     "وتنفس يتسارع؛ ومن الجسد نفسه تُدار بسرعة.",
     "وتنفس يتسارع، ومن الجسد نفسه تُدار بسرعة.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("em-anger", "remember",
     "الغضب يستعجل القرار؛ وأنت تحتاج عكسه تمامًا.",
     "الغضب يستعجل القرار، وأنت تحتاج عكسه تمامًا.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("at-boredom-list", "remember",
     "القائمة التي تشبهك تُستعمل؛ والقائمة المثالية تُقرأ.",
     "القائمة التي تشبهك تُستعمل، والقائمة المثالية تُقرأ.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("re-trust", "understand",
     "تفقد قيمتها؛ والأفعال الصغيرة المنتظمة",
     "تفقد قيمتها، والأفعال الصغيرة المنتظمة",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("re-loneliness-reading", "understand",
     "راحة صحية؛ وأن تعزل نفسك",
     "راحة صحية، وأن تعزل نفسك",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("re-asking-support", "remember",
     "الطلب المحدد يُستجاب؛ والاعتراف الكامل ليس شرطًا له.",
     "الطلب المحدد يُستجاب، والاعتراف الكامل ليس شرطًا له.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("re-disclosure", "understand",
     "وحملك موزعًا؛ والخطأ في الشخص",
     "وحملك موزعًا، والخطأ في الشخص",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("dg-phone-first-decision", "remember",
     "يستقبل يومه؛ ومن يؤخره يصنعه.",
     "يستقبل يومه، ومن يؤخره يصنعه.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("dg-rest-no-phone", "understand",
     "والراحة من الأولى؛ والثانية ليست راحة أصلًا.",
     "والراحة من الأولى، والثانية ليست راحة أصلًا.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("dg-content-from-others", "remember",
     "ما يصلك ليس قرارك؛ وما يبقى مفتوحًا هو قرارك.",
     "ما يصلك ليس قرارك، وما يبقى مفتوحًا هو قرارك.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("rl-data", "understand",
     "قاعدة جديدة في الخطة؛ وما يُكتم من دروسه",
     "قاعدة جديدة في الخطة، وما يُكتم من دروسه",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("sc-firm-compassionate", "understand",
     "فيعيد السلسلة؛ والقسوة تقول",
     "فيعيد السلسلة، والقسوة تقول",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("pr-hobby", "know",
     "يترك فراغًا؛ والهواية الحقيقية تملأ الفراغ",
     "يترك فراغًا، والهواية الحقيقية تملأ الفراغ",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("pr-hobby", "remember",
     "المنع يحمي الحدود؛ والهواية تعمر الأرض خلفها.",
     "المنع يحمي الحدود، والهواية تعمر الأرض خلفها.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("va-write", "know",
     "شعور عابر؛ والمكتوبة قرار يمكنك الرجوع إليه.",
     "شعور عابر، والمكتوبة قرار يمكنك الرجوع إليه.",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
    ("sp-tawbah", "understand",
     "يطيل السلسلة؛ وقراءتها «عودة»",
     "يطيل السلسلة، وقراءتها «عودة»",
     "punctuation",
     "فاصلة منقوطة زائدة قبل الواو."),
]

# fields not to touch in the doc/code beyond those listed
assert len(EDITS) == 48, f"expected 48 edits, got {len(EDITS)}"
cards = {e[0] for e in EDITS}
print(f"EDIT TABLE: {len(EDITS)} operations on {len(cards)} unique cards")

# ————— load code files —————
code = {f: open(SRC + f, encoding="utf-8").read() for f in FILES}

def card_block_bounds(text, cid):
    """Find the card object block containing id: "cid" and return (start, end) char bounds."""
    m = re.search(r'\{\s*\n\s*id:\s*"' + re.escape(cid) + '"', text)
    if not m:
        return None
    start = m.start()  # the match itself starts at the object's opening brace
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

FIELD_KEY = {"title": "title", "know": "know", "understand": "understand",
             "act": "act", "remember": "remember", "deep": "deep"}

applied_code, applied_doc, failures = [], [], []
for cid, field, old, new, ptype, reason in EDITS:
    ok = False
    for f in FILES:
        text = code[f]
        bb = card_block_bounds(text, cid)
        if not bb:
            continue
        block = text[bb[0]:bb[1]]
        cnt = block.count(old)
        if cnt != 1:
            continue
        # verify the old string sits inside the right field of the block
        # (find field key position and next key position)
        km = re.search(r'\n\s*' + FIELD_KEY[field] + r':', block)
        if not km:
            continue
        p = block.find(old)
        if p == -1 or (km.start() > p):
            continue  # not inside this field region
        nb = block.replace(old, new, 1)
        code[f] = text[:bb[0]] + nb + text[bb[1]:]
        applied_code.append((cid, field, f, old, new, ptype, reason))
        ok = True
        break
    if not ok:
        failures.append((cid, field, old[:50]))

print(f"CODE: {len(applied_code)}/{len(EDITS)} applied")
for fl in failures:
    print("  FAILED:", fl)

# ————— apply to doc —————
doc = open(DOC, encoding="utf-8").read()
doc_fail = []
for cid, field, old, new, ptype, reason in EDITS:
    # scope to the card's doc section — use the '- **ID:** `cid`' line (unique to card blocks;
    # the doc header also mentions ur-wave/en-friction/em-labeling as `cid` but never in this form)
    pos = doc.find(f"- **ID:** `{cid}`")
    if pos == -1:
        doc_fail.append((cid, "id-not-found"))
        continue
    nxt = doc.find("- **ID:**", pos + 10)
    end = nxt if nxt != -1 else len(doc)
    sect = doc[pos:end]
    if field == "title":
        # the ### heading precedes the ID line — search backward
        pre = doc[:pos]
        hpos = pre.rfind(f"### {old}")
        if hpos == -1 or doc[hpos:pos].count("### ") != 1:
            doc_fail.append((cid, "title-not-found-or-not-adjacent", old[:40]))
            continue
        doc = doc[:hpos] + f"### {new}" + doc[hpos + len(f"### {old}"):]
        applied_doc.append(cid)
        continue
    cnt = sect.count(old)
    if cnt != 1:
        doc_fail.append((cid, field, f"count={cnt}", old[:40]))
        continue
    doc = doc[:pos] + sect.replace(old, new, 1) + doc[end:]
    applied_doc.append(cid)

print(f"DOC: {len(applied_doc)}/{len(EDITS)} applied")
for fl in doc_fail:
    print("  DOC FAILED:", fl)

if failures or doc_fail:
    print("\n!!! NOT WRITING FILES — fix failures first")
    sys.exit(1)

# ————— write code files —————
for f in FILES:
    open(SRC + f, "w", encoding="utf-8").write(code[f])
print("code files updated")

# ————— write the new doc (this round's deliverable base) —————
NEW_DOC = "/home/z/my-project/download/phase3-knowledge-148-native-arabic-final.md"
open(NEW_DOC, "w", encoding="utf-8").write(doc)
print("doc copy updated:", NEW_DOC)

# save applied log for deliverable generation
json.dump([{"id": a[0], "field": a[1], "file": a[2], "old": a[3], "new": a[4],
            "type": a[5], "reason": a[6]} for a in applied_code],
          open("/home/z/my-project/scripts/task16-applied-edits.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print("applied-edits log saved")

# ————— post-edit: find any REMAINING «؛ و» that was NOT adjudicated —————
remaining = []
for m in re.finditer(r'؛\s*و', doc):
    ctx = doc[max(0, m.start()-80):m.start()+60].replace("\n", " ")
    remaining.append(ctx)
print(f"\nRemaining «؛ و» after edits: {len(remaining)}")
for r in remaining:
    print("  …" + r + "…")
