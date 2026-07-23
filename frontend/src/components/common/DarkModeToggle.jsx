import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * DarkModeToggle
 * @param {boolean} compact – when true, renders a square icon-only button (for mobile)
 */
export default function DarkModeToggle({ compact = false }) {
  const { isDarkMode, toggleTheme } = useTheme();

  if (compact) {
    // Icon-only variant used in the mobile login header
    return (
      <button
        onClick={toggleTheme}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 cursor-pointer overflow-hidden"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span className={`absolute transition-all duration-300 transform ${
          isDarkMode
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
        }`}>
          <Moon size={18} className="text-indigo-400" />
        </span>
        <span className={`absolute transition-all duration-300 transform ${
          isDarkMode
            ? 'opacity-0 rotate-90 scale-50 pointer-events-none'
            : 'opacity-100 rotate-0 scale-100'
        }`}>
          <Sun size={18} className="text-amber-500" />
        </span>
      </button>
    );
  }

  // Full-width labeled variant used in the desktop sidebar
  return (
    <button
      onClick={toggleTheme}
      className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 outline-none focus:ring-2 cursor-pointer ${
        isDarkMode
          ? "bg-slate-900/40 border border-slate-800 text-slate-300 hover:bg-indigo-950/15 hover:border-indigo-900/30 hover:text-indigo-200 focus:ring-indigo-500/20"
          : "bg-slate-50/60 border border-slate-200 text-slate-600 hover:bg-amber-50/40 hover:border-amber-200/60 hover:text-amber-700 focus:ring-amber-500/20"
      }`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
        <span className={`absolute transition-all duration-300 transform ${
          isDarkMode
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
        }`}>
          <Moon size={18} className="text-indigo-400" />
        </span>
        <span className={`absolute transition-all duration-300 transform ${
          isDarkMode
            ? 'opacity-0 rotate-90 scale-50 pointer-events-none'
            : 'opacity-100 rotate-0 scale-100'
        }`}>
          <Sun size={18} className="text-amber-500" />
        </span>
      </div>
      <span>{isDarkMode ? "Dark" : "Light"}</span>
    </button>
  );
}
