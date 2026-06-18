"use client";

import { useState } from "react";
import type { RevenuePoint } from "@/lib/stats";

function fmt(n: number) {
  if (n >= 1_000_000) return `Rs ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `Rs ${(n / 1_000).toFixed(0)}k`;
  return `Rs ${n.toLocaleString()}`;
}

function BarChart({
  data,
  field,
  color,
  height = 140,
}: {
  data: RevenuePoint[];
  field: "revenue" | "profit";
  color: string;
  height?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const values = data.map((d) => d[field]);
  const max = Math.max(...values, 1);
  const w = 100 / data.length;

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox={`0 0 ${data.length * 12} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        {data.map((d, i) => {
          const val = d[field];
          const barH = Math.max((val / max) * (height - 16), val > 0 ? 2 : 0);
          const x = i * 12 + 1;
          const y = height - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={10}
                height={barH}
                rx={2}
                fill={color}
                opacity={hovered === i ? 1 : 0.75}
                style={{ transition: "opacity .15s" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              {hovered === i && (
                <g>
                  <rect
                    x={Math.min(x - 2, data.length * 12 - 70)}
                    y={Math.max(y - 28, 0)}
                    width={66}
                    height={22}
                    rx={4}
                    fill="#1e1035"
                  />
                  <text
                    x={Math.min(x + 3, data.length * 12 - 37)}
                    y={Math.max(y - 13, 12)}
                    fill="white"
                    fontSize={8}
                    fontFamily="system-ui"
                  >
                    {fmt(val)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {/* x-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex" style={{ top: height + 4 }}>
        {data.map((d, i) => (
          <span
            key={i}
            className="flex-1 truncate text-center text-[9px] text-muted"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RevenueChart({
  byMonth,
  byWeek,
}: {
  byMonth: RevenuePoint[];
  byWeek: RevenuePoint[];
}) {
  const [period, setPeriod] = useState<"month" | "week">("month");
  const [field, setField] = useState<"revenue" | "profit">("revenue");
  const data = period === "month" ? byMonth : byWeek;

  return (
    <div className="rounded-2xl border border-plum/10 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">Revenue &amp; profit</h2>
        <div className="flex gap-1">
          {(["month", "week"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-violet-deep text-white"
                  : "text-plum/60 hover:bg-cream"
              }`}
            >
              {p === "month" ? "Monthly" : "Weekly"}
            </button>
          ))}
          <div className="mx-1 w-px bg-plum/10" />
          {(["revenue", "profit"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setField(f)}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors ${
                field === f
                  ? "bg-violet/15 text-violet-deep"
                  : "text-plum/60 hover:bg-cream"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="pb-7">
        <BarChart
          data={data}
          field={field}
          color={field === "revenue" ? "#4c1d95" : "#059669"}
        />
      </div>
      <div className="mt-2 flex gap-4 border-t border-plum/10 pt-3">
        <div>
          <p className="text-xs text-muted">Total {field}</p>
          <p className="text-lg font-semibold text-ink">
            {fmt(data.reduce((n, d) => n + d[field], 0))}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Orders</p>
          <p className="text-lg font-semibold text-ink">
            {data.reduce((n, d) => n + d.orderCount, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
