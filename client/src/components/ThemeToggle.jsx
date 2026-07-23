import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === "light";
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle color theme"
      className="theme-toggle flex h-9 w-9 items-center justify-center rounded-lg glass hover-lift"
      style={{ color: "var(--text-2)" }}
    >
      {isLight ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
