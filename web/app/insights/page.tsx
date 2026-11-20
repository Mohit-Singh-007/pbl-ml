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
import { ApiError } from "@/components/main/api-error";
import { ImportanceChart } from "@/components/main/importance-chart";
import { apiGet, type ModelInfo } from "@/lib/api";
import { FEATURE_LABELS, pct } from "@/lib/format";

export default function InsightsPage() {
  return (
    <Suspense
      fallback={
        <p className="text-muted-foreground">Loading model insights...</p>
      }
    >
      <InsightsContent />
    </Suspense>
  );
}

async function InsightsContent() {
  await connection();
  const res = await apiGet<ModelInfo>("/model-info");
  if (res.data === null) return <ApiError message={res.error} />;
  const info = res.data;

  const bestF1 = Math.max(...info.results.map((r) => r.f1));
  const rf =
    info.results.find((r) => r.model === "Random Forest") ?? info.results[0];
  const [[tn, fp], [fn, tp]] = rf.confusion_matrix;

  const importance = Object.entries(info.feature_importance)
    .map(([key, value]) => ({ name: FEATURE_LABELS[key] ?? key, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Model insights
        </h1>
        <p className="text-muted-foreground">
          How the Random Forest compares with simpler models, and what it relies
          on.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Model comparison</CardTitle>
          <CardDescription>
            Scores on a held-out test set of 10,000 synthetic transactions (4%
            fraud), using a 0.5 cut-off. Accuracy is left out on purpose: always
            predicting &quot;safe&quot; would already score 96%.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Precision</TableHead>
                <TableHead className="text-right">Recall</TableHead>
                <TableHead className="text-right">F1</TableHead>
                <TableHead className="text-right">ROC-AUC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {info.results.map((r) => (
                <TableRow
                  key={r.model}
                  className={
                    r.f1 === bestF1
                      ? "bg-emerald-50 font-medium dark:bg-emerald-950/40"
                      : undefined
                  }
                >
                  <TableCell>
                    {r.model}
                    {r.f1 === bestF1 && (
                      <span className="ml-2 text-xs text-emerald-700 dark:text-emerald-400">
                        best F1
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.precision.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.recall.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.f1.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.roc_auc.toFixed(3)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Verdict thresholds</CardTitle>
            <CardDescription>
              Below 30% a transaction is Safe, 30% to 70% is Suspicious, above
              70% is Fraud. Higher cut-offs catch fewer frauds but are right
              more often.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flag at or above</TableHead>
                  <TableHead className="text-right">Precision</TableHead>
                  <TableHead className="text-right">Recall</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {info.threshold_metrics.map((t) => (
                  <TableRow key={t.threshold}>
                    <TableCell>{pct(t.threshold, 0)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {pct(t.precision, 0)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {pct(t.recall, 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Random Forest confusion matrix</CardTitle>
            <CardDescription>
              What the model predicted against what was true, at a 0.5 cut-off.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid max-w-md grid-cols-[auto_1fr_1fr] gap-2 text-sm">
              <span />
              <span className="text-center text-muted-foreground">
                Predicted safe
              </span>
              <span className="text-center text-muted-foreground">
                Predicted fraud
              </span>

              <span className="self-center text-muted-foreground">
                Actually safe
              </span>
              <Cell value={tn} label="Correctly passed" tone="good" />
              <Cell value={fp} label="False alarms" tone="bad" />

              <span className="self-center text-muted-foreground">
                Actually fraud
              </span>
              <Cell value={fn} label="Missed" tone="bad" />
              <Cell value={tp} label="Caught" tone="good" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What the model relies on</CardTitle>
          <CardDescription>
            Feature importance from the Random Forest: how much each input
            contributes to its decisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImportanceChart data={importance} />
        </CardContent>
      </Card>
    </div>
  );
}

function Cell({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "good" | "bad";
}) {
  return (
    <div
      className={
        tone === "good"
          ? "rounded-lg bg-emerald-500/15 p-3 text-center"
          : "rounded-lg bg-red-500/15 p-3 text-center"
      }
    >
      <div className="text-2xl font-semibold tabular-nums">
        {value.toLocaleString("en-IN")}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
