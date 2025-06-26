import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme} className="p-2 rounded-full border hover:bg-accent">
      {theme === "dark" ? <IconSun className="w-3 h-3" /> : <IconMoon className="w-4 h-4" />}
    </button>
  );
}
