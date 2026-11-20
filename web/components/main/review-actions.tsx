"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { REVIEW_LABELS } from "@/lib/format";
import type { ReviewStatus, Verdict } from "@/lib/api";

export function ReviewActions({
  predictionId,
  verdict,
  status,
}: {
  predictionId: number;
  verdict: Verdict;
  status: ReviewStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (verdict === "Safe")
    return <span className="text-muted-foreground">-</span>;

  async function mark(next: ReviewStatus) {
    setBusy(true);
    try {
      const res = await fetch(`/api/review/${predictionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_status: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(
        next === "pending"
          ? "Moved back to review queue"
          : `Marked as ${REVIEW_LABELS[next].toLowerCase()}`,
      );
      router.refresh();
    } catch {
      toast.error("Could not update the review status. Is the API running?");
    } finally {
      setBusy(false);
    }
  }

  if (status !== "pending") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{REVIEW_LABELS[status]}</span>
        <Button
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={() => mark("pending")}
        >
          Undo
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="destructive"
        disabled={busy}
        onClick={() => mark("confirmed_fraud")}
      >
        Confirm fraud
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() => mark("false_positive")}
      >
        False alarm
      </Button>
    </div>
  );
}
