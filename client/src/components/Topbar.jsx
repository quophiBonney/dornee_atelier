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
        </div>
      </div>
    </div>
  );
}
