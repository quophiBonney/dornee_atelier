import { useState } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const ACTIVITY_DATA = {
  "7D": [
    { name: "Mon", value: 24 },
    { name: "Tue", value: 38 },
    { name: "Wed", value: 30 },
    { name: "Thu", value: 46 },
    { name: "Fri", value: 41 },
    { name: "Sat", value: 18 },
    { name: "Sun", value: 14 },
  ],
  "30D": Array.from({ length: 10 }).map((_, i) => ({
    name: `${i * 3 + 1}`,
    value: 20 + Math.round(seededRand(i + 1) * 40),
  })),
  "90D": Array.from({ length: 12 }).map((_, i) => ({
    name: `W${i + 1}`,
    value: 100 + Math.round(seededRand(i + 20) * 160),
  })),
};

import { seededRand } from "../utils/helpers";

export function ActivityChart({ theme }) {
  const [range, setRange] = useState("7D");
  const data = ACTIVITY_DATA[range];
  const isLight = theme === "light";
  const tickColor = isLight ? "#8891a3" : "#525c74";
  const tooltipBg = isLight ? "#ffffff" : "#0a0c16";
  const tooltipLabel = isLight ? "#4c5567" : "#8b95ac";

  return (
    <div
      className="fade-up glass-strong hover-lift rounded-2xl p-5 lg:col-span-2"
      style={{ animationDelay: "180ms" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--text-1)" }}
          >
            Operations activity
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-3)" }}>
            Combined users, appointments and enquiries
          </p>
        </div>
        <div
          className="flex items-center gap-1 rounded-lg p-1"
          style={{ background: "var(--chip-bg)" }}
        >
          {Object.keys(ACTIVITY_DATA).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
              style={{
                background:
                  range === r ? "rgba(0,229,255,0.14)" : "transparent",
                color: range === r ? "var(--cyan)" : "var(--text-3)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 11 }}
            />
            <Tooltip
              cursor={{ stroke: "rgba(0,229,255,0.3)" }}
              contentStyle={{
                background: tooltipBg,
                border: "1px solid rgba(0,229,255,0.25)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: tooltipLabel }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00e5ff"
              strokeWidth={2}
              fill="url(#areaFill)"
              isAnimationActive
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
