"use client";

import { useEffect, useState } from "react";

type Verdict = "Safe" | "Suspicious" | "Fraud";
type Sample = {
  ref: string;
  time: string;
  from: string;
  to: string;
  amount: number;
  kind: string;
  note: string;
  p: number;
  v: Verdict;
};

const SAMPLES: Sample[] = [
  {
    ref: "00417",
    time: "03:12",
    from: "amit@paytm",
    to: "refund.help@ybl",
    amount: 25000,
    kind: "Collect request",
    note: "New device, 3 AM, receiver reported",
    p: 0.91,
    v: "Fraud",
  },
  {
    ref: "00418",
    time: "14:05",
    from: "rahul@okhdfc",
    to: "bigbasket@icici",
    amount: 450,
    kind: "Merchant",
    note: "Usual amount, known merchant",
    p: 0.01,
    v: "Safe",
  },
  {
    ref: "00419",
    time: "19:40",
    from: "priya@oksbi",
    to: "unknown123@ybl",
    amount: 4000,
    kind: "Person to person",
    note: "8x usual amount, new payee",
    p: 0.35,
    v: "Suspicious",
  },
  {
    ref: "00420",
    time: "11:22",
    from: "sara@okhdfc",
    to: "cashback.win@paytm",
    amount: 15000,
    kind: "Person to person",
    note: "4 payments in an hour, reported",
    p: 0.84,
    v: "Fraud",
  },
  {
    ref: "00421",
    time: "09:18",
    from: "neha@okicici",
    to: "zomato@hdfcbank",
    amount: 620,
    kind: "Merchant",
    note: "Regular payment, daytime",
    p: 0.02,
    v: "Safe",
  },
];

const STAMP: Record<Verdict, { cls: string; label: string; rot: string }> = {
  Safe: { cls: "lp-stamp-safe", label: "Safe", rot: "-7deg" },
  Suspicious: { cls: "lp-stamp-sus", label: "Suspicious", rot: "-4deg" },
  Fraud: { cls: "lp-stamp-fraud", label: "Fraud", rot: "-9deg" },
};
const FILL: Record<Verdict, string> = {
  Safe: "#047857",
  Suspicious: "#b45309",
  Fraud: "#dc2626",
};

type Phase = "scoring" | "stamped" | "leaving";
const inr = new Intl.NumberFormat("en-IN");

export function SlipStack() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("stamped");
  const [boot, setBoot] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wait = phase === "stamped" ? 3200 : phase === "leaving" ? 650 : 1100;
    const t = setTimeout(() => {
      setBoot(false);
      if (phase === "stamped") setPhase("leaving");
      else if (phase === "leaving") {
        setIndex((i) => (i + 1) % SAMPLES.length);
        setPhase("scoring");
      } else setPhase("stamped");
    }, wait);
    return () => clearTimeout(t);
  }, [phase]);

  const s = SAMPLES[index];
  const stamp = STAMP[s.v];
  const scoring = phase === "scoring";

  return (
    <div
      className="relative mx-auto w-full max-w-[22rem] rotate-[1.5deg] lg:mr-0"
      role="img"
      aria-label={`Example payment slip from ${s.from} to ${s.to}, rated ${s.v}`}
    >
      <div className="lp-slip-back -rotate-3" aria-hidden />
      <div className="lp-slip-back rotate-2" aria-hidden />

      <div
        key={index}
        className={`lp-slip lp-slip-in relative font-mono ${phase === "leaving" ? "lp-slip-out" : ""} px-6 pb-14 pt-5 text-[0.78rem] leading-relaxed`}
      >
        <div className="flex items-baseline justify-between border-b border-dashed lp-hair pb-3">
          <span className="font-semibold tracking-[0.14em]">
            UPI PAYMENT SLIP
          </span>
          <span className="lp-muted">#{s.ref}</span>
        </div>

        <dl className="mt-4 grid grid-cols-[4.5rem_1fr] gap-y-1.5">
          <dt className="lp-muted">FROM</dt>
          <dd className="truncate">{s.from}</dd>
          <dt className="lp-muted">TO</dt>
          <dd className="truncate">{s.to}</dd>
          <dt className="lp-muted">AMOUNT</dt>
          <dd className="text-base font-semibold">₹{inr.format(s.amount)}</dd>
          <dt className="lp-muted">TIME</dt>
          <dd>{s.time}</dd>
          <dt className="lp-muted">TYPE</dt>
          <dd>{s.kind}</dd>
          <dt className="lp-muted">NOTE</dt>
          <dd>{s.note}</dd>
        </dl>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-between">
            <span className="lp-muted">FRAUD RISK</span>
            <span className="font-semibold tabular-nums">
              {scoring ? "..." : `${Math.round(s.p * 100)}%`}
            </span>
          </div>
          <div className="relative h-2 bg-muted">
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-1000 ease-out"
              style={{
                width: scoring ? "0%" : `${Math.max(s.p * 100, 2)}%`,
                background: FILL[s.v],
              }}
            />
          </div>
        </div>

        {!scoring && (
          <div className="absolute bottom-[3.6rem] right-4">
            <span
              key={index}
              className={`lp-stamp lp-stamp-hit ${stamp.cls} px-3 py-1 text-xl`}
              style={{
                ["--r" as string]: stamp.rot,
                ["--d" as string]: boot ? "1100ms" : "0ms",
              }}
            >
              {stamp.label}
            </span>
          </div>
        )}

        <p className="absolute bottom-3.5 left-6 right-6 flex justify-between text-[0.65rem] tracking-[0.18em] lp-muted">
          <span>CHECKED BY MODEL</span>
          <span>{scoring ? "SCORING" : "REVIEW IF FLAGGED"}</span>
        </p>
      </div>
    </div>
  );
}
