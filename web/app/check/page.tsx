"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RiskGauge } from "@/components/main/risk-gauge";
import { VerdictBadge } from "@/components/main/verdict-badge";
import { pct } from "@/lib/format";
import type { Verdict } from "@/lib/api";

type Form = {
  sender_vpa: string;
  receiver_vpa: string;
  amount: string;
  user_avg_amount: string;
  hour: string;
  txn_type: "P2P" | "P2M" | "COLLECT";
  txns_last_hour: string;
  account_age_days: string;
  receiver_reports: string;
  is_new_payee: boolean;
  device_changed: boolean;
  location_changed: boolean;
};

type Result = {
  fraud_probability: number;
  verdict: Verdict;
  reasons: string[];
};

const EMPTY: Form = {
  sender_vpa: "",
  receiver_vpa: "",
  amount: "",
  user_avg_amount: "500",
  hour: "14",
  txn_type: "P2P",
  txns_last_hour: "0",
  account_age_days: "365",
  receiver_reports: "0",
  is_new_payee: false,
  device_changed: false,
  location_changed: false,
};

const PRESETS: { label: string; values: Form }[] = [
  {
    label: "Everyday payment",
    values: {
      ...EMPTY,
      sender_vpa: "rahul@okhdfc",
      receiver_vpa: "bigbasket@icici",
      amount: "450",
      txn_type: "P2M",
      account_age_days: "900",
    },
  },
  {
    label: "Needs a closer look",
    values: {
      ...EMPTY,
      sender_vpa: "priya@oksbi",
      receiver_vpa: "unknown123@ybl",
      amount: "4000",
      is_new_payee: true,
      account_age_days: "400",
    },
  },
  {
    label: "Likely scam",
    values: {
      ...EMPTY,
      sender_vpa: "amit@paytm",
      receiver_vpa: "refund.help@ybl",
      amount: "25000",
      hour: "3",
      txn_type: "COLLECT",
      txns_last_hour: "4",
      account_age_days: "20",
      receiver_reports: "3",
      is_new_payee: true,
      device_changed: true,
      location_changed: true,
    },
  },
];

const NEXT_STEP: Record<Verdict, string> = {
  Safe: "This looks normal. No action needed.",
  Suspicious: "Hold this payment for a manual check before approving it.",
  Fraud: "Block this payment and alert the account holder.",
};

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function CheckPage() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(form.amount);
    const avg = Number(form.user_avg_amount);
    if (!(amount > 0) || !(avg > 0)) {
      toast.error("Enter an amount and a usual amount greater than 0.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_vpa: form.sender_vpa || null,
          receiver_vpa: form.receiver_vpa || null,
          amount,
          user_avg_amount: avg,
          hour: Number(form.hour),
          txn_type: form.txn_type,
          is_new_payee: form.is_new_payee,
          txns_last_hour: Number(form.txns_last_hour) || 0,
          device_changed: form.device_changed,
          location_changed: form.location_changed,
          account_age_days: Number(form.account_age_days) || 0,
          receiver_reports: Number(form.receiver_reports) || 0,
        }),
      });
      if (res.status === 422) {
        toast.error(
          "Some values are not valid. Check the amount, hour and counts.",
        );
        return;
      }
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      toast.error(
        "Could not reach the prediction service. Is the API running on port 8000?",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Check a transaction
        </h1>
        <p className="text-muted-foreground">
          Enter the payment details and the model rates the risk. Every check is
          saved.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Fill with an example:
        </span>
        {PRESETS.map((p) => (
          <Button
            key={p.label}
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setForm(p.values);
              setResult(null);
            }}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Payment details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="sender" label="Sender UPI ID (optional)">
                  <Input
                    id="sender"
                    placeholder="name@okhdfc"
                    value={form.sender_vpa}
                    onChange={(e) => set("sender_vpa", e.target.value)}
                  />
                </Field>
                <Field id="receiver" label="Receiver UPI ID (optional)">
                  <Input
                    id="receiver"
                    placeholder="shop@ybl"
                    value={form.receiver_vpa}
                    onChange={(e) => set("receiver_vpa", e.target.value)}
                  />
                </Field>
                <Field id="amount" label="Amount (₹)">
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                  />
                </Field>
                <Field id="avg" label="Sender's usual amount (₹)">
                  <Input
                    id="avg"
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={form.user_avg_amount}
                    onChange={(e) => set("user_avg_amount", e.target.value)}
                  />
                </Field>
                <Field id="type" label="Payment type">
                  <select
                    id="type"
                    className={selectClass}
                    value={form.txn_type}
                    onChange={(e) =>
                      set("txn_type", e.target.value as Form["txn_type"])
                    }
                  >
                    <option value="P2P">Person to person (P2P)</option>
                    <option value="P2M">Merchant payment (P2M)</option>
                    <option value="COLLECT">Collect request</option>
                  </select>
                </Field>
                <Field id="hour" label="Time of day">
                  <select
                    id="hour"
                    className={selectClass}
                    value={form.hour}
                    onChange={(e) => set("hour", e.target.value)}
                  >
                    {Array.from({ length: 24 }, (_, h) => (
                      <option key={h} value={h}>
                        {String(h).padStart(2, "0")}:00
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="last-hour" label="Transactions in the last hour">
                  <Input
                    id="last-hour"
                    type="number"
                    min="0"
                    value={form.txns_last_hour}
                    onChange={(e) => set("txns_last_hour", e.target.value)}
                  />
                </Field>
                <Field id="age" label="Account age (days)">
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    value={form.account_age_days}
                    onChange={(e) => set("account_age_days", e.target.value)}
                  />
                </Field>
                <Field id="reports" label="Past reports against receiver">
                  <Input
                    id="reports"
                    type="number"
                    min="0"
                    value={form.receiver_reports}
                    onChange={(e) => set("receiver_reports", e.target.value)}
                  />
                </Field>
              </div>

              <div className="space-y-3 rounded-lg border p-4">
                <Toggle
                  id="new-payee"
                  label="Paying this receiver for the first time"
                  checked={form.is_new_payee}
                  onChange={(v) => set("is_new_payee", v)}
                />
                <Toggle
                  id="device"
                  label="Sent from a new device"
                  checked={form.device_changed}
                  onChange={(v) => set("device_changed", v)}
                />
                <Toggle
                  id="location"
                  label="Sent from an unusual location"
                  checked={form.location_changed}
                  onChange={(v) => set("location_changed", v)}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Checking..." : "Check transaction"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="lg:sticky lg:top-8">
            <CardHeader>
              <CardTitle>Result</CardTitle>
              {!result && (
                <CardDescription>
                  The verdict appears here after you check a transaction.
                </CardDescription>
              )}
            </CardHeader>
            {result && (
              <CardContent className="space-y-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fraud probability
                    </p>
                    <p className="text-4xl font-semibold tabular-nums tracking-tight">
                      {pct(result.fraud_probability)}
                    </p>
                  </div>
                  <VerdictBadge
                    verdict={result.verdict}
                    className="px-3 py-1 text-base"
                  />
                </div>
                <RiskGauge probability={result.fraud_probability} />
                <p className="text-sm font-medium">
                  {NEXT_STEP[result.verdict]}
                </p>
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Why</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm">
                    {result.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
