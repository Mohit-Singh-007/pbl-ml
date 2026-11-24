"use client";

import { useEffect, useState } from "react";

const STEPS = [0.06, 0.2, 0.44, 0.63, 0.91, 0.55, 0.14];

function verdictOf(p: number) {
  return p < 0.3
    ? { label: "Safe", color: "var(--green)" }
    : p < 0.7
      ? { label: "Suspicious", color: "var(--amber)" }
      : { label: "Fraud", color: "var(--red)" };
}


export function RulerGauge() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const iv = setInterval(() => setI((x) => (x + 1) % STEPS.length), 2600);
    return () => clearInterval(iv);
  }, []);

  const p = STEPS[i];
  const v = verdictOf(p);

  return (
    <div
      role="img"
      aria-label="Ruler from 0 to 100 percent with a marker moving between the Safe, Suspicious and Fraud zones"
    >
      <div className="flex items-end justify-between">
        <p className={`font-mono text-xs uppercase tracking-[0.18em] lp-muted`}>
          Example score
        </p>
        <p
          className="text-right font-semibold transition-colors duration-700"
          style={{ color: v.color }}
        >
          {v.label}
        </p>
      </div>

      <div className="relative mt-10 pt-2">
        <div
          className="lp-marker absolute -top-7 z-10 -translate-x-1/2"
          style={{ left: `${p * 100}%` }}
        >
          <div
            className={`font-mono -mt-1 whitespace-nowrap bg-foreground px-2 py-0.5 text-xs font-medium text-background tabular-nums`}
          >
            {Math.round(p * 100)}%
          </div>
          <div className="mx-auto h-[3.1rem] w-px bg-foreground" />
        </div>

        <div className="flex h-10 overflow-hidden border border-foreground">
          <div style={{ width: "30%", background: "rgba(4,120,87,0.14)" }} />
          <div style={{ width: "40%", background: "rgba(180,83,9,0.16)" }} />
          <div style={{ width: "30%", background: "rgba(220,38,38,0.14)" }} />
        </div>
        <div className="lp-ticks-l" aria-hidden />

        <div className={`font-mono relative mt-1 h-5 text-xs lp-muted`}>
          {[0, 30, 70, 100].map((n) => (
            <span
              key={n}
              className="absolute tabular-nums"
              style={{
                left: `${n}%`,
                transform:
                  n === 0
                    ? "none"
                    : n === 100
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
              }}
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
