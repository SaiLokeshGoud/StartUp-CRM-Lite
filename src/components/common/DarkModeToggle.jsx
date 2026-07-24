import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      {isDarkMode ? (
        <>
          <Moon size={18} />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun size={18} />
          <span>Light</span>
        </>
      )}
    </button>
  );
}
