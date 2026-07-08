import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import DarkModeToggle from '../components/common/DarkModeToggle';
import { Activity, LayoutDashboard, Users, BarChart3 } from 'lucide-react';

export default function Login() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen w-full transition-colors duration-200">
      {/* Left panel: Info & Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-12 text-white md:flex">
        {/* Glowing overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
        
        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="url(#login-bolt-grad-1)">
              <defs>
                <linearGradient id="login-bolt-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              StartUp-CRM-Lite
            </h2>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="relative z-10 space-y-8 py-12">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <LayoutDashboard size={20} className="text-blue-300" />
            </div>
            <div>
              <h4 className="text-md font-bold text-white">Interactive Dashboard</h4>
              <p className="mt-1 text-sm text-blue-100/80">Get a real-time overview of your pipeline performance and metrics.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Users size={20} className="text-blue-300" />
            </div>
            <div>
              <h4 className="text-md font-bold text-white">Lead Operations</h4>
              <p className="mt-1 text-sm text-blue-100/80">Seamlessly organize, filter, and track over 100 sample leads.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <BarChart3 size={20} className="text-blue-300" />
            </div>
            <div>
              <h4 className="text-md font-bold text-white">Advanced Insights</h4>
              <p className="mt-1 text-sm text-blue-100/80">Generate dynamic funnel and source analytics to optimize sales velocity.</p>
            </div>
          </div>
        </div>

        {/* Description sentence */}
        <p className="relative z-10 text-xs text-blue-200/60">
          A high-performance lead management and sales operations dashboard designed for fast-growing startups.
        </p>
      </div>

      {/* Right panel: Sign-in Form */}
      <div className="relative flex flex-1 flex-col justify-between p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        {/* Floating header & Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="url(#login-bolt-grad-2)">
              <defs>
                <linearGradient id="login-bolt-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
              StartUp-CRM-Lite
            </span>
          </div>
          <div className="hidden md:block" />
          <DarkModeToggle />
        </div>

        {/* Centered Login Card */}
        <div className="mx-auto my-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Sign in</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">Enter your credentials to access your CRM dashboard.</p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-800"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400">
              New to Startup CRM Lite?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info for mobile */}
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600 md:hidden">
          © 2026 Startup CRM Lite.
        </p>
      </div>
    </div>
  );
}
