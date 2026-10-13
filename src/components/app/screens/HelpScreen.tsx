"use client";

import { useAppStore } from "@/lib/app/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScreenHeader, InfoNote } from "../shared";
import {
  HELP_LINES,
  HELP_LINKS,
  SEEK_HELP_INDICATORS,
  FIRST_SESSION_QUESTIONS,
  HELP_INFO_VERIFIED_AT,
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
} from "lucide-react";

/**
 * GAP-02 / GAP-11 / NEED-020 / NEED-023 — the professional-help corridor.
 * Takes the user from "I need help" to "I know the next step":
 *   أ — when specialized help is the right step (indicators, not diagnosis);
 *   ب — how to actually FIND a qualified specialist in Egypt;
 *   ج — what to do when help is needed NOW (verified Egyptian resources).
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
 *   - 16023 is removed from the general find-a-specialist pathway (ب) and
 *     from the urgent card (ج); it lives ONLY in its own separate,
 *     clearly-labeled substance-addiction context card after ج.
 *   - Section ب states explicitly that no verified Egyptian pathway
 *     specialized in CSBD / problematic pornography use could be found,
 *     and routes to a competent clinician + the first-session question.
 *   - Confidentiality is attributed only where an official source states
 *     it (16328: the Secretariat's own announcement; 16023: the fund's
 *     announcement about its treatment).
 */
export function HelpScreen() {
  const supportPerson = useAppStore((s) => s.supportPerson);

  const hotline = HELP_LINES.find((l) => l.id === "gsmhat-hotline")!;
  const ambulance = HELP_LINES.find((l) => l.id === "ambulance")!;
  const police = HELP_LINES.find((l) => l.id === "police")!;
  const addiction = HELP_LINES.find((l) => l.id === "addiction-fund")!;

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="المساعدة المتخصصة"
        subtitle="لو وصلت لإنك محتاج مساعدة بشرية — الصفحة دي هتقولك الخطوة الجاية، من غير لف ودوران."
        icon={<HeartHandshake className="size-5" />}
      />

      {/* ————— أ. متى أطلب مساعدة متخصصة؟ ————— */}
      <Card>
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <Search className="size-4 text-primary" />
            أ. متى أطلب مساعدة متخصصة؟
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
            استعادة أداة مساعدة ذاتية سلوكية — بتساعدك ترصد وتتعلم وتقطع
            السلاسل. هي مش تشخيص، ولا علاج نفسي، ولا بديل عن مختص. وطلب
            المساعدة قوة، مش اعتراف بالفشل.
          </InfoNote>
        </CardContent>
      </Card>

      {/* ————— ب. أبدأ البحث عن مختص منين؟ ————— */}
      <Card>
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center gap-2 font-bold">
            <LifeBuoy className="size-4 text-primary" />
            ب. أبدأ البحث عن مختص منين؟
          </div>

          <div className="space-y-2">
            <div className="font-semibold">الفرق بين مين ومين</div>
            <div className="grid grid-cols-1 gap-2 @min-[9.7rem]:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-3">
                <div className="text-sm font-bold text-primary">طبيب نفسي</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  درس طب ثم تخصص في الأمراض النفسية — يقدر يشخص ويوصف علاج
                  دوائي لو احتاج.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <div className="text-sm font-bold text-primary">أخصائي / معالج نفسي</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  متخصص في العلاج بالجلسات (مثل العلاج السلوكي المعرفي) —
                  مهارات وتدريب، من غير وصف دواء.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">طرق موثقة للبحث في مصر</div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                • <b>المسار الحكومي:</b> مستشفيات ومراكز وعيادات الصحة النفسية
                التابعة للأمانة العامة للصحة النفسية (٢٠ مستشفى حكومي على
                مستوى الجمهورية) — والوصول ليها من موقع الأمانة تحت.
              </li>
              <li>
                • <b>خط الدعم النفسي العام 16328 (وزارة الصحة والسكان):</b>{" "
                }
                استشارة نفسية وتوجيه على مدار الساعة، والحالات العاجلة
                بتتحال منه للرعاية المناسبة — دعم نفسي عام، مش خدمة علاج
                متخصصة لمشكلتك تحديدًا.
              </li>
            </ul>
            <InfoNote>
              بصراحة عشان ما تدورش على حاجة مش موجودة: مفيش خدمة مصرية
              موثقة قدرنا نتحقق منها متخصصة تحديدًا في السلوك الجنسي القهري
              أو الاستخدام الإشكالي للإباحية — فمش هنختلقلك رقم خدمة كده.
              المسار الواقعي: مختص نفسي كفء (طبيب نفسي أو معالج نفسي زي
              الشرح فوق)، وأول سؤال تسأله: «اشتغلت مع حالات زي حالتي قبل
              كده؟» — أول سؤال في قايمة الأسئلة تحت.
            </InfoNote>
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
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {lk.what}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">أسئلة تسألها قبل ما تبدأ</div>
            <div className="flex flex-wrap gap-1.5">
              {FIRST_SESSION_QUESTIONS.map((q) => (
                <span
                  key={q}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs leading-relaxed"
                >
                  «{q}»
                </span>
              ))}
            </div>
          </div>

          <InfoNote tone="warning">
            عن التكلفة والخصوصية: مفيش أرقام موثقة لأسعار الجلسات — اسأل عن
            التكلفة بنفسك عند الحجز واختار اللي يناسبك. كل خط في الصفحة دي
            مكتوب تحته اللي الموثق رسميًا عنه — السرية معلنة من الأمانة لخط
            الدعم النفسي، وأي وصف تاني مش مكتوب: اسأل عنه بنفسك لما تتواصل.
            ومش لازم تحكي لحد في بيتك قبل ما تكون جاهز — قرارك.
          </InfoNote>
        </CardContent>
      </Card>

      {/* ————— ج. ماذا أفعل عندما أحتاج مساعدة عاجلة؟ ————— */}
      <Card className="border-destructive/30">
        <CardContent className="space-y-4 pt-5">
          <div className="flex items-center gap-2 font-bold text-destructive">
            <Phone className="size-4" />
            ج. محتاج مساعدة عاجلة — أعمل إيه؟
          </div>

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
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {hotline.title} — {hotline.hours}، {hotline.cost}.
            </p>
          </div>

          <div className="rounded-2xl border border-destructive/30 bg-background/60 p-4">
            <div className="font-bold">لو في خطر فوري على حياة:</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ambulance.numbers.map((n) => (
                <a
                  key={n}
                  href={`tel:${n}`}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-base font-bold text-primary-foreground transition-transform active:scale-95"
                >
                  إسعاف <span dir="ltr" className="tnum">{n}</span>
                </a>
              ))}
              {police.numbers.map((n) => (
                <a
                  key={n}
                  href={`tel:${n}`}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-base font-bold transition-colors hover:border-primary/40"
                >
                  شرطة <span dir="ltr" className="tnum">{n}</span>
                </a>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
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

      {/* ————— Separate context: substance-addiction path (NOT this app's problem) ————— */}
      {/* 16023 lives ONLY here — never in the general find-a-specialist
          list (ب) and never inside the urgent card (ج). Its services are
          documented for SUBSTANCE addiction, so it is offered only for
          users whose struggle also includes substances. */}
      {addiction && (
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
            <p className="text-xs leading-relaxed text-muted-foreground">
              {addiction.limits}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ————— Honest limits + verification footer ————— */}
      <InfoNote tone="info">
        استعادة مش بتشخصك ولا بتعالجك — وكل اللي فوقه مجرد معلومات خدمات
        متحقق منها، مش توصية طبية شخصية. أنت الوحيد اللي يقدر يقرر الخطوة
        اللي تناسبه، ومتخصص هو اللي يساعدك تقرر صح.
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
          <p className="text-2xs leading-relaxed text-muted-foreground">
            آخر تحقق من المعلومات دي: {HELP_INFO_VERIFIED_AT} — من مصادر
            رسمية (وزارة الصحة والسكان، هيئة الاستعلامات، قنوات الأمانة
            والصندوق الرسمية، ومنظمة الصحة العالمية). الأرقام ممكن تتغير مع
            الوقت؛ لو رقم ماردش، جرب التاني أو أقرب خدمة من موقع الأمانة.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
