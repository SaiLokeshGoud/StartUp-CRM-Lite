import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, LayoutDashboard, Menu, Users, X, User, LogOut, Activity } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../../context/AuthContext";

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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur transition-colors duration-200 dark:border-gray-700 dark:bg-slate-900/95 md:sticky md:top-0 md:h-screen md:flex md:flex-col md:w-64 md:flex-shrink-0 md:border-r md:border-t-0 lg:w-72">
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-1.5 text-blue-600 dark:text-blue-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-600 leading-none">
              Startup CRM
            </p>
            <p className="mt-0.5 text-xs font-bold text-gray-900 dark:text-white leading-tight">
              Operations Hub
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-b border-gray-200 bg-white/95 p-3 md:hidden dark:border-gray-700 dark:bg-slate-900/95">
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
                    `flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
              className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </nav>
        </div>
      )}

      <nav className="hidden md:flex md:flex-1 md:flex-col md:gap-2 md:px-4 md:py-6">
        <div className="mb-4 hidden items-center gap-3 px-2 lg:flex">
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
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`
                }
              >
                <Icon size={18} />
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
              `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`
            }
          >
            <User size={18} />
            <span className="flex flex-col text-left leading-tight">
              <span className="text-sm font-semibold">Profile</span>
              <span className="hidden text-[11px] text-inherit/70 lg:block">Settings</span>
            </span>
          </NavLink>
          <DarkModeToggle />
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold">Sign out</span>
          </button>
        </div>
      </nav>

      <nav className="grid grid-cols-4 gap-2 px-2 py-2 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              aria-label={item.name}
              className={({ isActive }) =>
                `flex min-h-[44px] min-w-[44px] flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`
              }
            >
              <Icon size={18} />
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
