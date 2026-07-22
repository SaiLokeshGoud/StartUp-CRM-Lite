import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, LayoutDashboard, Menu, Users, X, User, LogOut, Activity, Sun, Moon } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    subtitle: "Overview",
  },
  {
    name: "Leads",
    path: "/leads",
    icon: Users,
    subtitle: "Pipeline",
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    subtitle: "Insights",
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
    subtitle: "Settings",
  },
];

function UserAvatar({ user, className = "h-6 w-6" }) {
  if (user?.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt="Profile"
        className={`${className} rounded-full object-cover shrink-0 border border-gray-200/50 dark:border-gray-700/50`}
        referrerPolicy="no-referrer"
      />
    );
  }
  
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  return (
    <div className={`flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 text-[10px] font-extrabold text-white shrink-0 shadow-sm ${className}`}>
      {firstLetter}
    </div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <aside className="md:sticky md:top-0 md:h-screen md:flex md:flex-col md:w-64 md:flex-shrink-0 md:border-r md:border-gray-200 dark:md:border-gray-700 md:bg-white/95 dark:md:bg-slate-900/95 md:backdrop-blur transition-colors duration-200 lg:w-72">
      {/* 1. Mobile Top Header Bar */}
      <div className="fixed top-0 inset-x-0 z-40 h-14 border-b border-gray-200 bg-white/95 px-4 py-3 flex items-center justify-between md:hidden shadow-sm dark:border-gray-800 dark:bg-slate-900/95 backdrop-blur transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-1 text-blue-600 dark:text-blue-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-600 leading-none">
              Startup CRM
            </p>
            <p className="mt-0.5 text-xs font-bold text-gray-900 dark:text-white leading-tight">
              Operations Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Global Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 cursor-pointer overflow-hidden"
            aria-label="Toggle theme"
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

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* 2. Mobile Hamburger Dropdown List */}
      {isMenuOpen && (
        <div className="fixed top-14 inset-x-0 z-30 border-b border-gray-200 bg-white/95 p-3 md:hidden dark:border-gray-700 dark:bg-slate-900/95 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all nav-item ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  {item.path === "/profile" ? (
                    <UserAvatar user={user} className="h-5 w-5" />
                  ) : (
                    <Icon size={18} className="nav-icon" />
                  )}
                  <span>{item.path === "/profile" ? (user?.name || item.name) : item.name}</span>
                </NavLink>
              );
            })}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
              className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-all nav-item hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <LogOut size={18} className="nav-icon" />
              <span>Sign out</span>
            </button>
          </nav>
        </div>
      )}

      {/* 3. Desktop Navigation Sidebar */}
      <nav className="hidden md:flex md:flex-1 md:flex-col md:gap-2 md:px-4 md:py-6">
        <div className="mb-4 hidden items-center gap-3 px-2 md:flex">
          <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-2.5 text-blue-600 dark:text-blue-400">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-600 leading-none">
              Startup CRM
            </p>
            <h2 className="mt-1 text-md font-bold text-gray-900 dark:text-white leading-tight">
              Operations Hub
            </h2>
          </div>
        </div>

        {navItems
          .filter((item) => item.path !== "/profile")
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition-all nav-item ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`
                }
              >
                <Icon size={18} className="nav-icon" />
                <span className="flex flex-col text-left leading-tight">
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="hidden text-[11px] text-inherit/70 lg:block">{item.subtitle}</span>
                </span>
              </NavLink>
            );
          })}

        <div className="mt-auto space-y-3 px-2 py-4">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition-all nav-item ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`
            }
          >
            <UserAvatar user={user} className="h-6 w-6" />
            <span className="flex flex-col text-left leading-tight min-w-0">
              <span className="text-sm font-semibold truncate max-w-[130px]" title={user?.name || "Profile"}>
                {user?.name || "Profile"}
              </span>
              <span className="hidden text-[11px] text-inherit/70 lg:block">Settings</span>
            </span>
          </NavLink>
          <DarkModeToggle />
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition-all nav-item hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <LogOut size={18} className="nav-icon" />
            <span className="text-sm font-semibold">Sign out</span>
          </button>
        </div>
      </nav>

      {/* 4. Mobile Bottom Tab Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 h-[64px] border-t border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-slate-900/95 px-3 pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+6px)] grid grid-cols-4 items-center justify-around md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              aria-label={item.name}
              className="relative flex flex-col items-center justify-center h-full active:scale-95 transition-transform duration-150 cursor-pointer"
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center justify-center pb-2">
                  <div className={`relative p-1 transition-all duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    <Icon size={18} className={`transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} />
                  </div>
                  <span className={`text-[9px] font-semibold tracking-wide uppercase mt-0.5 transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.name}
                  </span>
                  {/* Pulsing indicator dot */}
                  <span className={`absolute bottom-0 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 transition-all duration-300 transform ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
