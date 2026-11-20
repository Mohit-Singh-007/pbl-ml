import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Verdict } from "@/lib/api";

const STYLES: Record<Verdict, string> = {
  Safe: "border-emerald-600/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  Suspicious:
    "border-amber-600/30 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Fraud:
    "border-red-600/30 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export function VerdictBadge({
  verdict,
  className,
}: {
  verdict: Verdict;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", STYLES[verdict], className)}
    >
      {verdict}
    </Badge>
  );
}
