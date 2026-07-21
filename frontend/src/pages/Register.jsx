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
    <div className="flex min-h-screen w-full transition-colors duration-200">
      {/* Left panel: Info & Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-12 text-white md:flex">
        {/* Glowing overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
        
        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-300" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
              Startup CRM
            </p>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
            Operations Hub
          </h2>
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

      {/* Right panel: Sign-up Form */}
      <div className="relative flex flex-1 flex-col justify-between p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200 overflow-hidden">
        {/* Decorative background glass orbs */}
        <div className="absolute top-1/4 -right-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10 animate-float-slow pointer-events-none" />
        <div className="absolute bottom-1/4 -left-24 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/10 animate-float-delayed pointer-events-none" />

        {/* Floating header & Dark Mode Toggle */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="md:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Startup CRM
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              Operations Hub
            </p>
          </div>
          <div className="hidden md:block" />
          <DarkModeToggle />
        </div>

        {/* Centered Register Card */}
        <div className="group relative mx-auto my-auto w-full max-w-md py-6 z-10">
          {/* Card glow effect for dark theme */}
          <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-0 blur-xl transition-all duration-500 group-hover:duration-200 dark:opacity-15 dark:group-hover:opacity-30" />
          
          <div className="relative rounded-3xl border border-white/20 dark:border-slate-800/50 bg-white/75 dark:bg-slate-900/75 p-8 shadow-2xl backdrop-blur-xl transition-colors duration-200">
            {/* Logo and Header inside Card */}
            <div className="flex flex-col items-center mb-8 animate-fade-in-up">
              <div className="group/logo relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/40 hover:rotate-3">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-400 to-indigo-500 opacity-0 blur-md transition-opacity duration-300 group-hover/logo:opacity-100" />
                <Activity className="relative h-7 w-7 text-white animate-pulse" style={{ animationDuration: '3s' }} />
              </div>
              
              <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">Create account</h1>
              <p className="mt-2 text-center text-sm text-slate-500 dark:text-gray-400">Sign up to start managing your leads in one place.</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Full name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/25 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-white focus:scale-[1.01]"
                  required
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/25 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-white focus:scale-[1.01]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in-up" style={{ animationDelay: '300ms', opacity: 0 }}>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/25 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-white focus:scale-[1.01]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/25 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-white focus:scale-[1.01]"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-650 dark:text-red-400 font-medium pt-2 animate-error-in">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="animate-fade-in-up inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white cursor-pointer relative btn-animate hover:shadow-lg hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-800"
                style={{ animationDelay: '400ms', opacity: 0 }}
              >
                {isLoading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </span>
                )}
                <span className={isLoading ? "opacity-0" : ""}>Create account</span>
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '500ms', opacity: 0 }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 animated-underline">
                Sign in
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
