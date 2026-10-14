"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { Card, CardContent } from "@/components/ui/card";
import { ScreenHeader, InfoNote } from "../shared";
import {
  HELP_LINES,
  HELP_LINKS,
  SEEK_HELP_INDICATORS,
  FIRST_SESSION_QUESTIONS,
  HELP_INFO_VERIFIED_AT,
  PLATFORM_UNAVAILABLE_NOTE,
} from "@/data/app/help-resources";
import { SUPPORT_MESSAGE_TEMPLATES } from "@/data/app/taxonomy";
import {
  HeartHandshake,
  Phone,
  Search,
  LifeBuoy,
  ExternalLink,
  Users,
  ShieldCheck,
  ChevronLeft,
  CloudOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GAP-02 / GAP-11 / NEED-020 / NEED-023 — the professional-help corridor.
 * Takes the user from "I need help" to "I know the next step":
 *   أ — what to do when help is needed NOW (verified Egyptian resources);
 *   ب — when specialized help is the right step (indicators, not diagnosis);
 *   ج — how to actually FIND a qualified specialist in Egypt.
 *
 * Everything here is static, verified content (see
 * src/data/app/help-resources.ts for sources + verification date). The
 * screen makes ZERO network requests: the only outbound affordances are
 * tel: links (the device dialer) and one external site link, both
 * user-initiated. No behavioral or clinical data is ever sent anywhere.
 *
 * 2026-10-13 content-integrity corrections (per-claim audit):
 *   - 16328 is presented ONLY as general psychological support per its
 *     official description (SIS / GSMHAT / WHO EMRO) — never as a
 *     specialized CSBD/porn service, and no "free" claim (not in official
 *     sources; the UI says "خدمة حكومية" only).
 *   - 16023 is removed from the general find-a-specialist pathway (ج) and
 *     from the urgent card (أ); it lives ONLY in its own separate,
 *     clearly-labeled substance-addiction context card after ج.
 *   - Section ج states explicitly that no verified Egyptian pathway
 *     specialized in CSBD / problematic pornography use could be found,
 *     and routes to a competent clinician + the first-session question.
 *   - Confidentiality is attributed only where an official source states
 *     it (16328: the Secretariat's own announcement; 16023: the fund's
 *     announcement about its treatment).
 *
 * 2026-10-14 mobile UX + link batch:
 *   - Hierarchy inverted: the urgent psychological-support pathway (أ)
 *     now sits immediately after the short intro, BEFORE the explanatory
 *     sections — the support call is reachable without scrolling through
 *     guidance (previous order put it ~4 screens down at 320×568).
 *   - Secondary guidance in ج (specialist types / first-appointment
 *     questions / cost & privacy) moved into collapsed-by-default
 *     disclosures (same chevron pattern as PriorLessonHint) — contents
 *     remain one tap away, never nested more than one level.
 *   - Readability: secondary body text raised from text-xs to text-sm,
 *     long single paragraphs split into short scannable lines.
 *   - Official link: the GSMHAT platform (mentalhealth.mohp.gov.eg)
 *     refuses visitors with an Unauthorized response and is no longer
 *     linked; the VERIFIED Ministry-of-Health page about the Secretariat
 *     is linked instead, labeled as official Ministry information — see
 *     help-resources.ts (2026-10-14 link investigation) for evidence.
 */

/** Collapsed-by-default disclosure for secondary guidance (one level max). */
function HelpDisclosure({
  open,
  onToggle,
  icon,
  title,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-4 py-3.5 text-start"
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 font-semibold">
          {icon}
          <span>{title}</span>
        </span>
        <ChevronLeft
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "-rotate-90"
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border px-4 py-3.5">{children}</div>
      )}
    </div>
  );
}

export function HelpScreen() {
  const supportPerson = useAppStore((s) => s.supportPerson);

  // B2 — safe resolution: a renamed, missing, or empty hotline entry must
  // never blank out the whole help screen (the old non-null assertions
  // crashed the render on any data drift). Missing entries simply don't
  // render their card; the always-honest limits footer lists whatever IS
  // configured, and the verified-link + platform-note blocks below are
  // content-constant (never data-dependent).
  const hotline = HELP_LINES.find(
    (l) => l.id === "gsmhat-hotline" && l.numbers.length > 0
  ) ?? null;
  const ambulance = HELP_LINES.find(
    (l) => l.id === "ambulance" && l.numbers.length > 0
  ) ?? null;
  const police = HELP_LINES.find(
    (l) => l.id === "police" && l.numbers.length > 0
  ) ?? null;
  const addiction = HELP_LINES.find(
    (l) => l.id === "addiction-fund" && l.numbers.length > 0
  ) ?? null;
  // The resource this screen exists for — when even it is unavailable the
  // screen still renders: the verified Ministry link + honest platform note
  // stay reachable instead of a blank crash.
  const primaryHotlineMissing = !hotline;

  const [openTypes, setOpenTypes] = useState(false);
  const [openQuestions, setOpenQuestions] = useState(false);
  const [openCost, setOpenCost] = useState(false);

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="المساعدة المتخصصة"
        subtitle="لو وصلت لإنك محتاج مساعدة بشرية — الصفحة دي هتقولك الخطوة الجاية، من غير لف ودوران."
        icon={<HeartHandshake className="size-5" />}
      />

      {/* ————— أ. ماذا أفعل عندما أحتاج مساعدة عاجلة؟ ————— */}
      {/* FIRST on purpose (2026-10-14): the urgent pathway must be the
          first thing after the intro — nobody should scroll through
          guidance to find a phone they need right now. */}
      <Card className="border-destructive/30">
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center gap-2 font-bold text-destructive">
            <Phone className="size-4" />
            أ. محتاج مساعدة عاجلة — أعمل إيه؟
          </div>

          {/* B2 — graceful fallback: the psychological-support line entry
              itself is unavailable (renamed/missing) → say so honestly and
              keep the emergency + verified-link pathways reachable instead
              of crashing the whole screen. */}
          {primaryHotlineMissing && (
            <div className="rounded-2xl border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground">
              خط الدعم النفسي مش متاح في النسخة دي — لو في خطر فوري استخدم
              إسعاف الطوارئ تحت، وصفحة وزارة الصحة الرسمية (تحت في القسم
              الثالث) فيها آخر أرقام الأمانة العامة للصحة النفسية.
            </div>
          )}

          {hotline && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
            <div className="font-bold text-destructive">
              لو في أفكار لإيذاء النفس دلوقتي:
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              متكملش لوحدك — اتكلم مع شخص مدررب حالًا. أفكار إيذاء النفس حالة
              بتتطلب مساعدة، والمساعدة موجودة وبتنجح لما تتطلب في وقتها.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 @min-[9.7rem]:grid-cols-2">
              {hotline.numbers.map((n) => (
                <a
                  key={n}
                  href={`tel:${n}`}
                  className="inline-flex h-auto min-h-14 w-full items-center justify-center gap-2 whitespace-normal rounded-xl bg-destructive px-4 py-3 text-lg font-bold text-white shadow-lg transition-transform active:scale-95"
                >
                  <Phone className="size-5" />
                  <span dir="ltr" className="tnum">{n}</span>
                </a>
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {hotline.title} — {hotline.hours}، {hotline.cost}.
            </p>
          </div>
          )}

          <div className="rounded-2xl border border-destructive/30 bg-background/60 p-4">
            <div className="font-bold">لو في خطر فوري على حياة:</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ambulance?.numbers.map((n) => (
                <a
                  key={n}
                  href={`tel:${n}`}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-base font-bold text-primary-foreground transition-transform active:scale-95"
                >
                  إسعاف <span dir="ltr" className="tnum">{n}</span>
                </a>
              ))}
              {police?.numbers.map((n) => (
                <a
                  key={n}
                  href={`tel:${n}`}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-base font-bold transition-colors hover:border-primary/40"
                >
                  شرطة <span dir="ltr" className="tnum">{n}</span>
                </a>
              ))}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              الخطر الفوري معناه إن ثانية التأخير بتفرق — دي مش لحظة تطبيق، دي
              لحظة مساعدة بشرية مباشرة.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <div className="flex items-center gap-2 font-semibold">
              <Users className="size-4 text-primary" />
              ولو تقدر: قول لحد تثق فيه
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {supportPerson?.phone ? (
                <a
                  href={`tel:${supportPerson.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  <Phone className="size-4" />
                  اتصل بـ{supportPerson.label}
                </a>
              ) : (
                <span className="rounded-xl bg-muted px-3 py-2 text-sm leading-relaxed">
                  «{SUPPORT_MESSAGE_TEMPLATES[0]}» — ابعتها لأي شخص تثق فيه
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ————— ب. متى أطلب مساعدة متخصصة؟ ————— */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <Search className="size-4 text-primary" />
            ب. متى أطلب مساعدة متخصصة؟
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            دي إشارات مفهومة مش تشخيص — لو لقيت نفسك فيها، الخطوة الجاية
            المنطقية هي مختص:
          </p>
          <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            {SEEK_HELP_INDICATORS.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
          <InfoNote>
            <p>استعادة أداة مساعدة ذاتية سلوكية.</p>
            <p className="mt-1">
              بتساعدك ترصد وتتعلم وتقطع السلاسل — هي مش تشخيص، ولا علاج نفسي،
              ولا بديل عن مختص.
            </p>
            <p className="mt-1 font-medium">وطلب المساعدة قوة، مش اعتراف بالفشل.</p>
          </InfoNote>
        </CardContent>
      </Card>

      {/* ————— ج. أبدأ البحث عن مختص منين؟ ————— */}
      <Card>
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <LifeBuoy className="size-4 text-primary" />
            ج. أبدأ البحث عن مختص منين؟
          </div>

          <InfoNote>
            <p>بصراحة عشان ما تدورش على حاجة مش موجودة:</p>
            <p className="mt-1">
              مفيش خدمة مصرية موثقة قدرنا نتحقق منها متخصصة تحديدًا في السلوك
              الجنسي القهري أو الاستخدام الإشكالي للإباحية — فمش هنختلقلك رقم
              خدمة كده.
            </p>
            <p className="mt-1">
              المسار الواقعي: مختص نفسي كفء (طبيب نفسي أو معالج نفسي — الفرق
              بينهم في قسم «الفرق بين مين ومين» تحت)، وأول سؤال تسأله: «اشتغلت
              مع حالات زي حالتي قبل كده؟» — وهو أول سؤال في قايمة أسئلة أول
              موعد تحت.
            </p>
          </InfoNote>

          <div className="space-y-2">
            <div className="font-semibold">طرق موثقة للبحث في مصر</div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                • <b>المسار الحكومي:</b> مستشفيات ومراكز وعيادات الصحة النفسية
                التابعة للأمانة العامة للصحة النفسية وعلاج الإدمان (١٨ مستشفى
                حكومي وفق صفحة وزارة الصحة الرسمية عن الأمانة) — وصفحة الوزارة
                الرسمية عن الأمانة موجودة تحت.
              </li>
              <li>
                • <b>خط الدعم النفسي العام 16328 (وزارة الصحة والسكان):</b>{" "}
                استشارة نفسية وتوجيه على مدار الساعة، والحالات العاجلة
                بتتحال منه للرعاية المناسبة — دعم نفسي عام، مش خدمة علاج
                متخصصة لمشكلتك تحديدًا.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            {HELP_LINKS.map((lk) => (
              <a
                key={lk.id}
                href={lk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 rounded-xl border border-primary/25 bg-primary/5 p-3.5 text-start transition-colors hover:border-primary/40"
              >
                <ExternalLink className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  <span className="block text-sm font-semibold">{lk.title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                    {lk.what}
                  </span>
                </span>
              </a>
            ))}
            <div className="flex items-start gap-2 rounded-xl border border-dashed border-border p-3.5">
              <CloudOff className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {PLATFORM_UNAVAILABLE_NOTE}
              </p>
            </div>
          </div>

          <HelpDisclosure
            open={openTypes}
            onToggle={() => setOpenTypes((o) => !o)}
            icon={<Users className="size-4 shrink-0 text-primary" />}
            title="الفرق بين مين ومين — طبيب نفسي ولا معالج نفسي؟"
          >
            <div className="grid grid-cols-1 gap-2 @min-[9.7rem]:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-3">
                <div className="text-sm font-bold text-primary">طبيب نفسي</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  درس طب ثم تخصص في الأمراض النفسية — يقدر يشخص ويوصف علاج
                  دوائي لو احتاج.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <div className="text-sm font-bold text-primary">
                  أخصائي / معالج نفسي
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  متخصص في العلاج بالجلسات (مثل العلاج السلوكي المعرفي) —
                  مهارات وتدريب، من غير وصف دواء.
                </p>
              </div>
            </div>
          </HelpDisclosure>

          <HelpDisclosure
            open={openQuestions}
            onToggle={() => setOpenQuestions((o) => !o)}
            icon={<Search className="size-4 shrink-0 text-primary" />}
            title="أسئلة تسألها في أول موعد"
          >
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {FIRST_SESSION_QUESTIONS.map((q) => (
                <li key={q}>• «{q}»</li>
              ))}
            </ul>
          </HelpDisclosure>

          <HelpDisclosure
            open={openCost}
            onToggle={() => setOpenCost((o) => !o)}
            icon={<ShieldCheck className="size-4 shrink-0 text-primary" />}
            title="التكلفة والخصوصية — قبل ما تحجز"
          >
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                • <b>التكلفة:</b> مفيش أرقام موثقة لأسعار الجلسات — اسأل عن
                التكلفة بنفسك عند الحجز واختار اللي يناسبك.
              </li>
              <li>
                • <b>الخصوصية:</b> كل خط في الصفحة دي مكتوب تحته اللي الموثق
                رسميًا عنه — السرية معلنة من الأمانة لخط الدعم النفسي، وأي وصف
                تاني مش مكتوب: اسأل عنه بنفسك لما تتواصل.
              </li>
              <li>
                • <b>ومش لازم تحكي لحد في بيتك</b> قبل ما تكون جاهز — قرارك.
              </li>
            </ul>
          </HelpDisclosure>
        </CardContent>
      </Card>

      {/* ————— Separate context: substance-addiction path (NOT this app's problem) ————— */}
      {/* 16023 lives ONLY here — never in the general find-a-specialist
          list (ج) and never inside the urgent card (أ). Its services are
          documented for SUBSTANCE addiction, so it is offered only for
          users whose struggle also includes substances. */}
      {/* addiction resolver already filters empty numbers; the render-site
          guard keeps the crash-proof property locally explicit. */}
      {addiction && addiction.numbers.length > 0 && (
        <Card>
          <CardContent className="space-y-3 pt-5">
            <div className="flex items-center gap-2 font-bold">
              <Phone className="size-4 text-primary" />
              مسار منفصل: لو صراعك شمل — كمان — إدمان المواد المخدرة
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              المسار ده مضاف لو صراعك بيشمل إدمان مواد، غير السلوك اللي
              بتعمل عليه في التطبيق. 16023 خط صندوق مكافحة وعلاج الإدمان
              والتعاطي، وخدماته الموثقة لعلاج إدمان المواد تحديدًا:{" "}
              {addiction.cost}، {addiction.hours}.
            </p>
            <a
              href={`tel:${addiction.numbers[0]}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 text-sm font-bold text-primary transition-transform active:scale-95"
            >
              <Phone className="size-4" />
              <span dir="ltr" className="tnum">{addiction.numbers[0]}</span>
            </a>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {addiction.limits}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ————— Honest limits + verification footer ————— */}
      <InfoNote tone="info">
        <p>استعادة مش بتشخصك ولا بتعالجك.</p>
        <p className="mt-1">
          وكل اللي فوقه مجرد معلومات خدمات متحقق منها، مش توصية طبية شخصية.
          أنت الوحيد اللي يقدر يقرر الخطوة اللي تناسبه، ومتخصص هو اللي يساعدك
          تقرر صح.
        </p>
      </InfoNote>

      <Card>
        <CardContent className="space-y-2.5 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <ShieldCheck className="size-4 text-primary" />
            حدود الخدمات دي — بصراحة
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            {HELP_LINES.map((l) => (
              <li key={l.id}>
                <b>{l.numbers.join(" / ")}:</b> {l.limits}
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed text-muted-foreground">
            آخر تحقق من المعلومات دي: {HELP_INFO_VERIFIED_AT} — من مصادر
            رسمية (وزارة الصحة والسكان، هيئة الاستعلامات، قنوات الأمانة
            والصندوق الرسمية، ومنظمة الصحة العالمية). الأرقام ممكن تتغير مع
            الوقت؛ لو رقم ماردش، جرب التاني أو أقرب خدمة من صفحة وزارة الصحة
            عن الأمانة.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
