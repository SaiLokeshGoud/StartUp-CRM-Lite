import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import DarkModeToggle from '../components/common/DarkModeToggle';
import { Activity, Mail, Lock, User, ArrowRight } from 'lucide-react';

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
      {/* Left panel: Modern Interactive SaaS Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-16 text-white md:flex">
        {/* Ambient glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%)]" />
        
        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400 ring-1 ring-blue-500/20">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blue-400">
                Startup CRM
              </p>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                Operations Hub
              </h2>
            </div>
          </div>
        </div>

        {/* Mockup Dashboard Element */}
        <div className="relative z-10 my-auto max-w-md select-none">
          <div className="absolute -left-6 -top-6 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-6 -bottom-6 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
          
          {/* Funnel Performance Mockup */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">Pipeline Funnel</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">+12.4% this week</span>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Qualifying Leads</span>
                  <span className="font-semibold text-white">82%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '82%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Contacted Pipeline</span>
                  <span className="font-semibold text-white">48%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '48%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Won / Converted</span>
                  <span className="font-semibold text-white">28%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '28%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Metric Card */}
          <div className="absolute -bottom-10 -right-10 rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-md shadow-xl hidden lg:block w-52">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">Conversion Rate</p>
            <p className="text-3xl font-extrabold text-white mt-1">58.4%</p>
            
            {/* Visual Bar Indicator */}
            <div className="flex items-end gap-1.5 h-8 mt-4">
              <div className="w-full bg-blue-500/20 rounded-sm h-3" />
              <div className="w-full bg-blue-500/30 rounded-sm h-5" />
              <div className="w-full bg-blue-500/45 rounded-sm h-4" />
              <div className="w-full bg-blue-500/65 rounded-sm h-6" />
              <div className="w-full bg-blue-500/90 rounded-sm h-8" />
            </div>
          </div>
        </div>

        {/* Footer Sentence */}
        <p className="relative z-10 text-xs text-slate-400 leading-relaxed">
          Manage pipelines, analyze sales cycles, and accelerate growth with a lightweight, state-of-the-art lead management platform.
        </p>
      </div>

      {/* Right panel: Sleek Form Panel */}
      <div className="relative flex flex-1 flex-col justify-between p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          {/* Mobile brand branding */}
          <div className="flex items-center gap-2 md:hidden">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 leading-none">
                Startup CRM
              </p>
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mt-0.5">
                Operations Hub
              </p>
            </div>
          </div>
          <div className="hidden md:block" />
          <DarkModeToggle />
        </div>

        {/* Register Form Container */}
        <div className="mx-auto my-auto w-full max-w-md py-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-10 shadow-xl shadow-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none transition-colors duration-200">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create account</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sign up to start managing your leads in one place.</p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full name</label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <User size={18} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950 dark:focus:ring-blue-950/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email address</label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950 dark:focus:ring-blue-950/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                      <Lock size={18} />
                    </div>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950 dark:focus:ring-blue-950/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Confirm</label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500">
                      <Lock size={18} />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950 dark:focus:ring-blue-950/30"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium pt-2">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-[46px] w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-800"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 group">
                Sign in
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
          © 2026 Startup CRM Lite. All rights reserved.
        </p>
      </div>
    </div>
  );
}
