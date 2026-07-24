import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/common/Layout";

// Lazy-loaded pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Leads = lazy(() => import("../pages/Leads"));
const Analytics = lazy(() => import("../pages/Analytics"));

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
