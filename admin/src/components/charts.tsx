"use client";

import { formatCount, formatDay, formatNaira, formatNairaCompact } from "@/lib/format";
import type { DayPoint } from "@/lib/stats";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Validated with the dataviz palette checker (lightness band, CVD, contrast on white).
const SERIES_1 = "#4a4bab";
const GRID = "#ecebf1";
const AXIS_TEXT = "#6c6c82";

const axisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fill: AXIS_TEXT, fontSize: 12 },
} as const;

type TipProps = {
  active?: boolean;
  payload?: { payload: DayPoint }[];
  render: (p: DayPoint) => React.ReactNode;
};

function ChartTooltip({ active, payload, render }: TipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl bg-white px-3.5 py-2.5 text-sm shadow-lg ring-1 ring-line">
      <p className="text-xs text-muted">{formatDay(point.day)}</p>
      {render(point)}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <p className="rounded-full bg-white/90 px-4 py-2 text-sm text-muted ring-1 ring-line">{children}</p>
    </div>
  );
}

export function RevenueChart({ data }: { data: DayPoint[] }) {
  const empty = data.every((d) => d.revenue === 0);
  return (
    <div className="relative h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="day" tickFormatter={formatDay} minTickGap={24} {...axisProps} />
          <YAxis tickFormatter={(v: number) => formatNairaCompact(v)} width={64} allowDecimals={false} {...axisProps} />
          <Tooltip
            cursor={{ fill: "rgba(74, 75, 171, 0.07)" }}
            content={
              <ChartTooltip
                render={(p) => (
                  <>
                    <p className="font-semibold tabular-nums">{formatNaira(p.revenue)}</p>
                    <p className="text-xs text-muted">
                      {p.paidOrders} paid {p.paidOrders === 1 ? "order" : "orders"}
                    </p>
                  </>
                )}
              />
            }
          />
          <Bar dataKey="revenue" fill={SERIES_1} radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
      {empty && <Empty>No paid orders in this period yet</Empty>}
    </div>
  );
}

export function VisitorsChart({ data }: { data: DayPoint[] }) {
  const empty = data.every((d) => d.visitors === 0);
  return (
    <div className="relative h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES_1} stopOpacity={0.18} />
              <stop offset="100%" stopColor={SERIES_1} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="day" tickFormatter={formatDay} minTickGap={24} {...axisProps} />
          <YAxis width={40} allowDecimals={false} {...axisProps} />
          <Tooltip
            cursor={{ stroke: "#c9c8d6", strokeWidth: 1 }}
            content={
              <ChartTooltip
                render={(p) => (
                  <>
                    <p className="font-semibold tabular-nums">
                      {formatCount(p.visitors)} {p.visitors === 1 ? "visitor" : "visitors"}
                    </p>
                    <p className="text-xs text-muted">{formatCount(p.views)} page views</p>
                  </>
                )}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke={SERIES_1}
            strokeWidth={2}
            fill="url(#visitorsFill)"
            activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: SERIES_1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {empty && <Empty>No visitors recorded in this period yet</Empty>}
    </div>
  );
}
