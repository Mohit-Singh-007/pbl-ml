"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Day = { day: string; total: number; flagged: number };

export function DailyChart({ data }: { data: Day[] }) {
  const rows = data.map((d) => ({
    ...d,
    label: new Date(d.day).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
  }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(128,128,128,0.25)"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <Tooltip cursor={{ fill: "rgba(128,128,128,0.1)" }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="total"
            name="Checked"
            fill="#94a3b8"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="flagged"
            name="Flagged"
            fill="#dc2626"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
