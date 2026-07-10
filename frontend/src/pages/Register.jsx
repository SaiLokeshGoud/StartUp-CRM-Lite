import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import DarkModeToggle from '../components/common/DarkModeToggle';
import { Activity, LayoutDashboard, Users, BarChart3 } from 'lucide-react';

export default function Register() {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Premium background mesh glows for Light Mode */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#e0f2fe_0%,transparent_45%)] bg-[radial-gradient(circle_at_80%_80%,#e0e7ff_0%,transparent_45%)] bg-[radial-gradient(circle_at_50%_50%,#f0fdf4_0%,transparent_50%)] opacity-80 dark:hidden" />
      
      {/* Premium background mesh glows for Dark Mode */}
      <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_20%_20%,rgba(29,78,216,0.12)_0%,transparent_45%)] bg-[radial-gradient(circle_at_80%_80%,rgba(79,70,229,0.12)_0%,transparent_45%)] bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.85)_0%,transparent_50%)] dark:block" />

      {/* Global dot grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] dark:bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] opacity-60" />

      {/* Content wrapper */}
      <div className="relative z-10 flex w-full flex-col md:flex-row">
        {/* Left panel: Info & Branding with full light/dark support */}
        <div className="relative hidden w-1/2 flex-col justify-between border-r border-slate-200/50 bg-white/20 dark:bg-slate-950/10 p-12 transition-colors duration-200 dark:border-slate-800/80 md:flex">
          {/* Brand Header */}
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-2 text-blue-600 dark:text-blue-400">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 leading-none">
                  Startup CRM
                </p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Operations Hub
                </h2>
              </div>
            </div>
          </div>

          {/* Feature Highlights with glassmorphic cards */}
          <div className="space-y-6 py-6">
            <div className="flex items-start gap-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/20 p-4 shadow-sm backdrop-blur-sm transition-colors duration-200">
              <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-800">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Dashboard</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Get a real-time overview of your pipeline performance and key metrics at a glance.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/20 p-4 shadow-sm backdrop-blur-sm transition-colors duration-200">
              <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-800">
                <Users size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lead Operations</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Seamlessly organize, filter, and track over 100 sample leads linked to your account.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/20 p-4 shadow-sm backdrop-blur-sm transition-colors duration-200">
              <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-800">
                <BarChart3 size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Advanced Insights</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Generate dynamic funnel and source analytics to optimize your entire sales velocity.</p>
              </div>
            </div>
          </div>

          {/* Footer Sentence */}
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              A high-performance lead management and sales operations dashboard designed for fast-growing startups.
            </p>
          </div>
        </div>

        {/* Right panel: Sign-up Form */}
        <div className="relative flex flex-1 flex-col justify-between p-8 bg-white/10 dark:bg-slate-950/10 transition-colors duration-200">
          {/* Floating header & Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            {/* Mobile Header Branding */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-1.5 text-blue-600 dark:text-blue-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 leading-none">
                  Startup CRM
                </p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  Operations Hub
                </p>
              </div>
            </div>
            <div className="hidden md:block" />
            <DarkModeToggle />
          </div>

          {/* Centered Register Card */}
          <div className="mx-auto my-auto w-full max-w-md py-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-100/50 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none backdrop-blur-md transition-colors duration-200">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create account</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-gray-400 leading-relaxed">Sign up to start managing your leads in one place.</p>

              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Full name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
                    placeholder="name@company.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Confirm password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-950/40"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-600 dark:text-red-400 font-semibold pt-2">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-800 shadow-sm"
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400">
                Already have an account? {' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Footer info for mobile */}
          <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600 md:hidden">
            © 2026 Startup CRM Lite. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
