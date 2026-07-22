import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 md:flex">
      <Navbar />

      <main className="flex-1 min-w-0 overflow-x-hidden bg-gray-50 px-4 pt-16 pb-32 transition-colors duration-200 sm:px-6 md:px-6 md:pt-4 md:pb-6 lg:px-8 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <div key={location.pathname} className="animate-page-enter">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

