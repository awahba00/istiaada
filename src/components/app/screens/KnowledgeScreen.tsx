"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/app/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScreenHeader, Chip, EmptyState } from "../shared";
import { KNOWLEDGE, KNOWLEDGE_CATEGORIES } from "@/data/app/knowledge";
import { normalizeArabic } from "@/lib/app/helpers";
import type { KnowledgeItem } from "@/lib/app/types";
import { LibraryBig, Search, Lightbulb, Anchor, Footprints, BookOpen } from "lucide-react";

export function KnowledgeScreen() {
  const data = useAppStore();
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<KnowledgeItem | null>(null);

  const items = useMemo(() => {
    let pool = KNOWLEDGE.filter((k) => data.settings.spiritualContent || !k.spiritual);
    if (category !== "all") pool = pool.filter((k) => k.category === category);
    if (query.trim()) {
      // Normalize BOTH sides (query + haystack): strips diacritics/tatweel
      // and unifies alef/ya/hamza forms so «التراخي» finds «التَّراخِي» etc.
      const q = normalizeArabic(query);
      pool = pool.filter((k) =>
        normalizeArabic(
          [k.title, k.know, k.understand, k.act, k.remember, k.deep ?? ""].join(" ")
        ).includes(q)
      );
    }
    return pool;
  }, [category, query, data.settings.spiritualContent]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const k of KNOWLEDGE) {
      if (!data.settings.spiritualContent && k.spiritual) continue;
      m.set(k.category, (m.get(k.category) ?? 0) + 1);
    }
    return m;
  }, [data.settings.spiritualContent]);

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="قاعدة المعرفة"
        subtitle="بطاقات قصيرة عملية مبنية على فهم السلوك — بلا مبالغة ولا مصطلحات معقدة."
        icon={<LibraryBig className="size-5" />}
      />
      {/* One quiet line teaching WHEN to use this section — and when not
          to: urgent moments have a faster tool (Intervene Now on Home). */}
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        للقراءة في الهدوء — وقت الشدة له أداة أسرع: «تدخّل الآن» في الرئيسية.
      </p>

      <div className="relative">
        <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث في المعرفة…"
          className="bg-card ps-10 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Chip size="sm" label={`الكل (${items.length})`} selected={category === "all"} onClick={() => setCategory("all")} />
        {KNOWLEDGE_CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            size="sm"
            label={`${c.label} (${counts.get(c.id) ?? 0})`}
            selected={category === c.id}
            onClick={() => setCategory(c.id)}
          />
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Search className="size-8" />}
          title="لا نتائج"
          body="جرّب كلمة أبسط أو غيّر التصنيف."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setSelected(k)}
              className="flex flex-col rounded-2xl border border-border bg-card p-4 text-start transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold leading-snug">{k.title}</div>
                {k.spiritual && (
                  <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                    روحي
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {k.know}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
                <BookOpen className="size-3.5" />
                افتح البطاقة
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Card dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="rounded-3xl sm:max-w-lg" aria-describedby={undefined}>
          {selected && (
            <>
              <DialogHeader className="text-start">
                <DialogTitle className="leading-snug">{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Block icon={<Lightbulb className="size-4" />} title="اعرف" body={selected.know} />
                <Block icon={<Anchor className="size-4" />} title="افهم" body={selected.understand} />
                <Block icon={<Footprints className="size-4" />} title="افعل" body={selected.act} />
                <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-4">
                  <div className="text-sm font-bold text-primary">تذكّر</div>
                  <p className="mt-1.5 font-semibold leading-relaxed">{selected.remember}</p>
                </div>
                {selected.deep && (
                  <div className="rounded-xl bg-muted/50 p-4">
                    <div className="mb-1.5 text-xs font-bold text-muted-foreground">
                      قراءة أعمق
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{selected.deep}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Block({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4">
      <div className="flex items-center gap-2 text-sm font-bold text-primary">
        {icon}
        {title}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
