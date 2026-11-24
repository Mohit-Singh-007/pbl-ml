export function RiskGauge({ probability }: { probability: number }) {
  const position = Math.min(Math.max(probability, 0), 1) * 100;
  return (
    <div className="space-y-2">
      <div
        role="meter"
        aria-label="Fraud probability"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        className="relative h-3 w-full"
      >
        <div className="flex h-full w-full overflow-hidden rounded-full">
          <div className="h-full bg-emerald-500/35" style={{ width: "30%" }} />
          <div className="h-full bg-amber-500/45" style={{ width: "40%" }} />
          <div className="h-full bg-red-500/45" style={{ width: "30%" }} />
        </div>
        <div
          className="absolute top-1/2 h-7 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-2 ring-background transition-[left] duration-500"
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="flex text-xs text-muted-foreground">
        <span style={{ width: "30%" }}>Safe</span>
        <span style={{ width: "40%" }}>Suspicious</span>
        <span className="text-right" style={{ width: "30%" }}>
          Fraud
        </span>
      </div>
    </div>
  );
}
