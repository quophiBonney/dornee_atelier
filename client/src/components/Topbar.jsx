import { Menu, Bell, Plus, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { PAGE_META } from "../data/constants";

export function TopBar({
  page,
  onMenuClick,
  query,
  setQuery,
  theme,
  onToggleTheme,
}) {
  const meta = PAGE_META[page];
  return (
    <div
      className="flex flex-col gap-4 border-b pb-5"
      style={{ borderColor: "var(--panel-border)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onMenuClick}
            className="mt-1 rounded-md p-1.5 lg:hidden"
            style={{ color: "var(--text-2)" }}
          >
            <Menu size={20} />
          </button>
          <div>
            <h1
              className="font-display text-xl font-semibold sm:text-2xl"
              style={{ color: "var(--text-1)" }}
            >
              {meta.title}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
              {meta.sub}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            className="relative hidden h-9 w-9 items-center justify-center rounded-lg sm:flex glass hover-lift"
            style={{ color: "var(--text-2)" }}
          >
            <Bell size={16} />
            <span
              className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full pulse-dot"
              style={{ background: "var(--danger)" }}
            />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg">
        <div className="relative flex items-center gap-2 rounded-lg px-3 py-2.5 vtx-input">
          <Search size={16} style={{ color: "var(--text-3)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${page === "overview" ? "everything" : page}…`}
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: "var(--text-1)" }}
          />
          <kbd
            className="font-mono rounded border px-1.5 py-0.5 text-[10px]"
            style={{
              borderColor: "var(--panel-border)",
              color: "var(--text-3)",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
  );
}
