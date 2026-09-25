import { cn } from "@/lib/utils";

/**
 * حلقة العودة — علامة «استعادة» (The Return Loop).
 *
 * One continuous stroke: an open loop whose returning end comes back
 * through the opening toward its own center — استعادة: taking back,
 * returning to balance. The gap stays open on purpose: recovery is a
 * return in progress, not a closed circle. The gesture also echoes the
 * Arabic letter ع — the root of عَوْد (return) inside استعادة.
 *
 * Decorative by design (aria-hidden): it never carries meaning alone —
 * it always sits beside the visible word «استعادة». Color follows
 * `currentColor`, so it adapts to both themes automatically.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <path
        d="M12.12 16.18A14.5 14.5 0 1 1 12.12 32.82A6.5 6.5 0 0 1 15.22 22.98"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
