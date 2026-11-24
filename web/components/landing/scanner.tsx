"use client";

import { useEffect, useState } from "react";

type Verdict = "Safe" | "Suspicious" | "Fraud";
type Sample = {
  from: string;
  to: string;
  amount: number;
  p: number;
  v: Verdict;
  note: string;
};

const SAMPLES: Sample[] = [
  {
    from: "rahul@okhdfc",
    to: "bigbasket@icici",
    amount: 450,
    p: 0.01,
    v: "Safe",
    note: "Usual amount, known merchant",
  },
  {
    from: "priya@oksbi",
    to: "unknown123@ybl",
    amount: 4000,
    p: 0.35,
    v: "Suspicious",
    note: "8x usual amount, new payee",
  },
  {
    from: "amit@paytm",
    to: "refund.help@ybl",
    amount: 25000,
    p: 0.91,
    v: "Fraud",
    note: "Collect request, new device, 3 AM",
  },
  {
    from: "neha@okicici",
    to: "zomato@hdfcbank",
    amount: 620,
    p: 0.02,
    v: "Safe",
    note: "Regular payment, daytime",
  },
  {
    from: "karan@ybl",
    to: "ravi.k@okaxis",
    amount: 9500,
    p: 0.58,
    v: "Suspicious",
    note: "New payee, late evening",
  },
  {
    from: "sara@okhdfc",
    to: "cashback.win@paytm",
    amount: 15000,
    p: 0.84,
    v: "Fraud",
    note: "Reported receiver, 4 payments in an hour",
  },
];

const CHIP: Record<Verdict, string> = {
  Safe: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
  Suspicious: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
  Fraud: "bg-red-400/15 text-red-300 ring-red-400/30",
};
const BAR: Record<Verdict, string> = {
  Safe: "bg-emerald-400",
  Suspicious: "bg-amber-400",
  Fraud: "bg-red-400",
};

type Item = { id: number; sample: Sample; done: boolean };

const INITIAL: Item[] = [2, 1, 0].map((i) => ({
  id: i,
  sample: SAMPLES[i],
  done: true,
}));
const inr = new Intl.NumberFormat("en-IN");

export function Scanner() {
  const [items, setItems] = useState<Item[]>(INITIAL);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 3;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const tick = () => {
      const id = n;
      const sample = SAMPLES[n % SAMPLES.length];
      n += 1;
      setItems((prev) => [{ id, sample, done: false }, ...prev].slice(0, 4));
      timers.push(
        setTimeout(
          () =>
            setItems((prev) =>
              prev.map((it) => (it.id === id ? { ...it, done: true } : it)),
            ),
          1200,
        ),
      );
    };
    const first = setTimeout(tick, 1200);
    const iv = setInterval(tick, 3000);
    return () => {
      clearTimeout(first);
      clearInterval(iv);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="lp-ring" />
        <span className="lp-ring" style={{ animationDelay: "2.3s" }} />
        <span className="lp-ring" style={{ animationDelay: "4.6s" }} />
      </div>

      <div className="lp-float relative rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span
              className="lp-pulse size-2 rounded-full bg-emerald-400"
              aria-hidden
            />
            Live scoring
          </div>
          <span className="text-xs text-slate-400">Example transactions</span>
        </div>

        <ul
          className="min-h-[330px] space-y-2 [mask-image:linear-gradient(to_bottom,#000_72%,transparent)]"
          aria-label="Example transactions being scored"
        >
          {items.map(({ id, sample: s, done }) => (
            <li
              key={id}
              className="lp-row-in relative overflow-hidden rounded-xl border border-white/10 bg-[#0a1020]/70 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {s.from} <span className="text-slate-500">to</span> {s.to}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    ₹{inr.format(s.amount)} · {s.note}
                  </p>
                </div>
                <div className="flex w-24 shrink-0 justify-end">
                  {done ? (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${CHIP[s.v]}`}
                    >
                      {s.v} {Math.round(s.p * 100)}%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Scoring...</span>
                  )}
                </div>
              </div>
              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-[width] duration-1000 ease-out ${BAR[s.v]}`}
                  style={{ width: done ? `${Math.max(s.p * 100, 3)}%` : "0%" }}
                />
              </div>
              {!done && (
                <span
                  className="lp-shimmer pointer-events-none absolute inset-0"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
