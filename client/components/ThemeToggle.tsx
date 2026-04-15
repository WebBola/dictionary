import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const current = (theme === "system" ? resolvedTheme : theme) ?? "dark";
  const isDark = current === "dark";

  const handleToggle = () => {
    const nextTheme = isDark ? "light" : "dark";
    if (isDark) {
      const audio = new Audio("/sound/faaah_43AIzWF7.mp3");
      audio.volume = 0.65;
      audio.play().catch(() => undefined);
    }
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg glass-sm hover:bg-accent/10 dark:hover:bg-white/10 transition-colors text-sm text-foreground"
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

