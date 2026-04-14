import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const current = (theme === "system" ? resolvedTheme : theme) ?? "dark";
  const isDark = current === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg glass-sm hover:bg-white/10 transition-colors text-sm text-foreground"
      aria-label={isDark ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish"}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-accent" />
          Kunduz
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-accent" />
          Tun
        </>
      )}
    </button>
  );
}

