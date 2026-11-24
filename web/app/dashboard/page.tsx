import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { apiGet, type Stats, type TransactionRow } from "@/lib/api";
import { inr, pct, when } from "@/lib/format";
import { ApiError } from "@/components/main/api-error";
import { DailyChart } from "@/components/main/daily-chart";
import { VerdictBadge } from "@/components/main/verdict-badge";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={<p className="text-muted-foreground">Loading dashboard...</p>}
    >
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await connection();
  const [stats, recent] = await Promise.all([
    apiGet<Stats>("/stats"),
    apiGet<TransactionRow[]>("/transactions?limit=6"),
  ]);

  if (stats.data === null) return <ApiError message={stats.error} />;
  const s = stats.data;
  const flagged = s.suspicious + s.fraud;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          What the model has checked so far.
        </p>
      </header>

      {s.total === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No transactions checked yet</CardTitle>
            <CardDescription>
              Check your first transaction and it will show up here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/check"
              className="text-sm font-medium underline underline-offset-4"
            >
              Check a transaction
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Transactions checked"
              value={s.total.toLocaleString("en-IN")}
              note={`${s.safe} safe`}
            />
            <Stat
              label="Flagged"
              value={flagged.toLocaleString("en-IN")}
              note={`${s.fraud} fraud, ${s.suspicious} suspicious`}
            />
            <Stat
              label="Fraud rate"
              value={`${s.fraud_rate}%`}
              note="Share of transactions rated Fraud"
            />
            <Stat
              label="Amount blocked"
              value={inr(s.amount_blocked)}
              note="Value of transactions rated Fraud"
            />
          </section>

          {s.pending_review > 0 && (
            <Link
              href="/transactions?review=pending"
              className="block rounded-lg border border-amber-600/30 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200"
            >
              <strong>{s.pending_review}</strong> flagged{" "}
              {s.pending_review === 1
                ? "transaction needs"
                : "transactions need"}{" "}
              a review. Open the review queue.
            </Link>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Last 7 days</CardTitle>
              <CardDescription>
                Transactions checked and how many were flagged each day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DailyChart data={s.daily} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Latest transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {recent.data === null ? (
                <p className="text-sm text-muted-foreground">{recent.error}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>Receiver</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Probability</TableHead>
                      <TableHead>Verdict</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.data.map((t) => (
                      <TableRow key={t.prediction_id}>
                        <TableCell className="whitespace-nowrap">
                          {when(t.created_at)}
                        </TableCell>
                        <TableCell>{t.receiver_vpa ?? "Not given"}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {inr(t.amount)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {pct(t.fraud_probability)}
                        </TableCell>
                        <TableCell>
                          <VerdictBadge verdict={t.verdict} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {note}
      </CardContent>
    </Card>
  );
}
