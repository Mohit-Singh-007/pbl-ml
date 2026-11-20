import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/components/main/api-error";
import { ReviewActions } from "@/components/main/review-actions";
import { VerdictBadge } from "@/components/main/verdict-badge";
import { apiGet, type TransactionRow } from "@/lib/api";
import { inr, pct, when } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

const FILTERS = [
  { label: "All", query: {} },
  { label: "Fraud", query: { verdict: "Fraud" } },
  { label: "Suspicious", query: { verdict: "Suspicious" } },
  { label: "Safe", query: { verdict: "Safe" } },
  { label: "Needs review", query: { review: "pending" } },
] as const;

type SearchParams = Promise<{
  verdict?: string;
  review?: string;
  page?: string;
}>;

function href(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && q.set(k, v));
  const s = q.toString();
  return s ? `/transactions?${s}` : "/transactions";
}

export default function TransactionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense
      fallback={
        <p className="text-muted-foreground">Loading transactions...</p>
      }
    >
      <TransactionsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function TransactionsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connection();
  const { verdict, review, page } = await searchParams;
  const pageNo = Math.max(1, Number(page) || 1);

  const q = new URLSearchParams({
    limit: String(PAGE_SIZE),
    offset: String((pageNo - 1) * PAGE_SIZE),
  });
  if (verdict) q.set("verdict", verdict);
  if (review) q.set("review_status", review);

  const res = await apiGet<TransactionRow[]>(`/transactions?${q}`);
  if (res.data === null) return <ApiError message={res.error} />;
  const rows = res.data;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Every checked transaction. Review flagged ones to mark them as real
          fraud or a false alarm.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Filter transactions">
        {FILTERS.map((f) => {
          const q = f.query as { verdict?: string; review?: string };
          const active =
            (q.verdict ?? "") === (verdict ?? "") &&
            (q.review ?? "") === (review ?? "");
          return (
            <Link
              key={f.label}
              href={href(q)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      <Card>
        <CardContent className="pt-6">
          {rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {pageNo > 1
                ? "No more transactions."
                : "No transactions match this filter."}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>From / To</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Probability</TableHead>
                  <TableHead>Verdict</TableHead>
                  <TableHead>Main reason</TableHead>
                  <TableHead>Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => (
                  <TableRow key={t.prediction_id}>
                    <TableCell className="whitespace-nowrap">
                      {when(t.created_at)}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{t.sender_vpa ?? "Not given"}</div>
                      <div className="text-muted-foreground">
                        to {t.receiver_vpa ?? "Not given"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {inr(t.amount)}
                    </TableCell>
                    <TableCell>{t.txn_type}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {pct(t.fraud_probability)}
                    </TableCell>
                    <TableCell>
                      <VerdictBadge verdict={t.verdict} />
                    </TableCell>
                    <TableCell className="min-w-44 max-w-56 whitespace-normal break-words text-sm text-muted-foreground">
                      {t.reasons[0] ?? "-"}
                    </TableCell>
                    <TableCell>
                      <ReviewActions
                        predictionId={t.prediction_id}
                        verdict={t.verdict}
                        status={t.review_status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm">
        {pageNo > 1 ? (
          <Link
            className="underline underline-offset-4"
            href={href({ verdict, review, page: String(pageNo - 1) })}
          >
            Previous page
          </Link>
        ) : (
          <span />
        )}
        <span className="text-muted-foreground">Page {pageNo}</span>
        {rows.length === PAGE_SIZE ? (
          <Link
            className="underline underline-offset-4"
            href={href({ verdict, review, page: String(pageNo + 1) })}
          >
            Next page
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
