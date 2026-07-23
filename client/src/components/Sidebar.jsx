import { Hexagon, X, Bell } from "lucide-react";
import { NAV_ITEMS } from "../data/constants";

export function Sidebar({ active, onNavigate, open, onClose, counts }) {
  const activeIndex = NAV_ITEMS.findIndex((n) => n.key === active);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col glass-strong transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ borderRight: "1px solid var(--panel-border)" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center">
              <Hexagon
                size={34}
                className="spin-slow"
                style={{
                  color: "var(--cyan)",
                  position: "absolute",
                  opacity: 0.35,
                }}
              />
              <Hexagon
                size={18}
                fill="var(--cyan)"
                style={{ color: "var(--cyan)" }}
              />
            </div>
            <div>
              <p
                className="font-display text-sm font-semibold tracking-wide"
                style={{ color: "var(--text-1)" }}
              >
                VERTEX
              </p>
              <p
                className="font-mono text-[10px] tracking-widest"
                style={{ color: "var(--text-3)" }}
              >
                OPS CONSOLE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 lg:hidden"
            style={{ color: "var(--text-2)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="relative mt-2 flex-1 px-3">
          {activeIndex >= 0 && (
            <div
              className="rail absolute left-3 w-[calc(100%-24px)] rounded-lg glow-cyan"
              style={{
                height: 44,
                top: activeIndex * 48,
                background:
                  "linear-gradient(90deg, rgba(0,229,255,0.14), rgba(124,92,252,0.10))",
                border: "1px solid rgba(0,229,255,0.3)",
              }}
            />
          )}
          <div className="relative space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              const count = counts[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className="relative z-10 flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive ? "var(--text-1)" : "var(--text-2)",
                  }}
                >
                  <Icon
                    size={17}
                    style={{
                      color: isActive ? "var(--cyan)" : "var(--text-3)",
                    }}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {typeof count === "number" && (
                    <span
                      className="font-mono rounded-md px-1.5 py-0.5 text-[10px]"
                      style={{
                        background: isActive
                          ? "rgba(0,229,255,0.14)"
                          : "var(--chip-bg)",
                        color: isActive ? "var(--cyan)" : "var(--text-3)",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Status footer */}
        <div
          className="m-3 rounded-xl p-4 glass"
          style={{ borderColor: "var(--panel-border)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full pulse-dot"
              style={{ background: "var(--success)" }}
            />
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-1)" }}
            >
              All systems nominal
            </p>
          </div>
          <p
            className="mt-1 font-mono text-[10px]"
            style={{ color: "var(--text-3)" }}
          >
            Sync latency 42ms
          </p>
        </div>
      </aside>
    </>
  );
}
