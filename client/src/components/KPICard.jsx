import { useCountUp } from "../hooks/useCountUp";
import { TrendingUp, TrendingDown } from "lucide-react";

export function KpiCard({
  label,
  value,
  delta,
  positive,
  icon: Icon,
  delay,
  suffix = "",
}) {
  const animated = useCountUp(value);
  return (
    <div
      className="fade-up glass-strong hover-lift rounded-2xl p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            background: "rgba(0,229,255,0.1)",
            border: "1px solid rgba(0,229,255,0.25)",
          }}
        >
          <Icon size={16} style={{ color: "var(--cyan)" }} />
        </div>
        <span
          className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: positive ? "var(--success)" : "var(--danger)" }}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </span>
      </div>
      <p
        className="mt-4 text-xs font-medium uppercase tracking-wider"
        style={{ color: "var(--text-3)" }}
      >
        {label}
      </p>
      <p
        className="font-display font-mono mt-1 text-3xl font-semibold"
        style={{ color: "var(--text-1)" }}
      >
        {animated.toLocaleString()}
        {suffix}
      </p>
    </div>
  );
}
