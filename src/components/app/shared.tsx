"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

export function ScreenHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold leading-tight sm:text-2xl">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action}
    </header>
  );
}

export function Chip({
  label,
  selected,
  onClick,
  size = "md",
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border transition-all duration-150 text-start leading-relaxed",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/50"
      )}
    >
      {label}
    </button>
  );
}

export function ChipMultiSelect({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { id: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map((o) => {
        const selected = value.includes(o.id);
        return (
          <Chip
            key={o.id}
            size={size}
            label={o.label}
            selected={selected}
            onClick={() =>
              onChange(selected ? value.filter((v) => v !== o.id) : [...value, o.id])
            }
          />
        );
      })}
    </div>
  );
}

export function NumberScale({
  value,
  onChange,
  label,
  low,
  high,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  low: string;
  high: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-1.5 font-semibold">{label}</div>
      <div className="mb-3 flex justify-between text-xs text-muted-foreground">
        <span>{low}</span>
        <span>{high}</span>
      </div>
      {/* The 1–5 ladder: one row of five numerals — comfortable one-hand
          targets at 320px (~44px each) and easy to compare at a glance.
          In RTL flow the row reads ١ → ٥ from the right, matching Arabic
          reading order. */}
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${label}: ${n} من ٥`}
            onClick={() => onChange(n)}
            className={cn(
              "tnum h-12 flex-1 rounded-xl border text-base font-bold transition-all",
              value === n
                ? "border-primary bg-primary text-primary-foreground scale-105 shadow"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30">
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-input transition-colors checked:bg-primary relative after:absolute after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-background after:transition-all after:content-[''] checked:after:start-[1.375rem] after:start-0.5"
      />
    </label>
  );
}

export function StatTile({
  label,
  value,
  hint,
  direction,
}: {
  label: string;
  value: string;
  hint?: string;
  direction?: "up" | "down" | "flat";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="tnum text-2xl font-bold">{value}</span>
        {direction === "up" && (
          <span className="text-success" aria-label="تحسن">
            ↑
          </span>
        )}
        {direction === "down" && (
          <span className="text-success" aria-label="انخفاض">
            ↓
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
      {icon && <div className="mb-3 text-muted-foreground">{icon}</div>}
      <div className="font-semibold">{title}</div>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function InfoNote({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warning" | "success" | "danger";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3.5 text-sm leading-relaxed",
        tone === "info" && "border-primary/25 bg-primary/10 text-foreground",
        tone === "warning" && "border-warning/30 bg-warning/10 text-foreground",
        tone === "success" && "border-success/30 bg-success/10 text-foreground",
        tone === "danger" && "border-destructive/30 bg-destructive/10 text-foreground"
      )}
    >
      {children}
    </div>
  );
}

export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-label={`خطوة ${current} من ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i === current ? "w-6 bg-primary" : i < current ? "w-1.5 bg-primary/50" : "w-1.5 bg-border"
          )}
        />
      ))}
    </div>
  );
}

export function CheckItem({
  done,
  title,
  onClick,
  children,
}: {
  done: boolean;
  title: string;
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card transition-all",
        done ? "border-success/40 bg-success/5" : "border-border"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        aria-pressed={done}
        className="flex w-full items-center gap-3 p-4 text-start"
      >
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-lg border transition-all",
            done ? "border-success bg-success text-success-foreground" : "border-border"
          )}
        >
          {done && <Check className="size-4" strokeWidth={3} />}
        </span>
        <span className={cn("font-medium", done && "text-muted-foreground line-through")}>
          {title}
        </span>
      </button>
      {children && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
