"use client";

import { useEffect, useState } from "react";

const STEPS = [0.04, 0.18, 0.42, 0.63, 0.91, 0.55, 0.12];

function verdictOf(p: number) {
  return p < 0.3
    ? { label: "Safe", color: "text-emerald-300", note: "Let it through" }
    : p < 0.7
      ? {
          label: "Suspicious",
          color: "text-amber-300",
          note: "Hold for a human check",
        }
      : {
          label: "Fraud",
          color: "text-red-300",
          note: "Block and alert the user",
        };
}

export function VerdictMeter() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const iv = setInterval(() => setI((x) => (x + 1) % STEPS.length), 2400);
    return () => clearInterval(iv);
  }, []);

  const p = STEPS[i];
  const v = verdictOf(p);

  return (
    <div
      role="img"
      aria-label="Animated example of the fraud probability gauge moving between Safe, Suspicious and Fraud"
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
    >
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Fraud probability
          </p>
          <p className="mt-1 text-6xl font-semibold tabular-nums tracking-tight">
            {Math.round(p * 100)}%
          </p>
        </div>
        <div className="text-right">
          <p
            className={`text-2xl font-semibold transition-colors duration-700 ${v.color}`}
          >
            {v.label}
          </p>
          <p className="text-sm text-slate-400">{v.note}</p>
        </div>
      </div>

      <div className="relative mt-8 h-3">
        <div className="flex h-full overflow-hidden rounded-full">
          <div className="h-full bg-emerald-400/35" style={{ width: "30%" }} />
          <div className="h-full bg-amber-400/40" style={{ width: "40%" }} />
          <div className="h-full bg-red-400/40" style={{ width: "30%" }} />
        </div>
        <div
          className="lp-marker absolute top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.7)]"
          style={{ left: `${p * 100}%` }}
        />
      </div>
      <div className="mt-2 flex text-xs text-slate-400">
        <span style={{ width: "30%" }}>0 to 30%</span>
        <span style={{ width: "40%" }}>30 to 70%</span>
        <span className="text-right" style={{ width: "30%" }}>
          70 to 100%
        </span>
      </div>
    </div>
  );
}
