import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../context/LeadContext';
import { User, Key, Mail, Shield, Award } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile, isLoading } = useAuth();
  const { pagination } = useLeads();

  const [name, setName] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      const payload = { name };
      if (newPassword) {
        payload.oldPassword = oldPassword;
        payload.newPassword = newPassword;
      }

      await updateProfile(payload);
      
      // Clear password fields on success
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Error toast is handled inside AuthContext
    }
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-gray-900 dark:text-white">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500 sm:text-base dark:text-gray-300">
          Manage your account information and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex flex-col items-center text-center">
            {/* Avatar with Circular Gradient */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 text-3xl font-extrabold text-white shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/50">
              {firstLetter}
            </div>
            
            <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>

            <div className="mt-6 w-full border-t border-slate-100 pt-4 dark:border-slate-800" />

            <div className="mt-4 flex w-full flex-col gap-3 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">Email:</span>
                <span className="ml-auto font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={16} className="text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">Role:</span>
                <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  {user?.role || 'user'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Award size={16} className="text-blue-500" />
                <span className="text-gray-600 dark:text-gray-300">Leads Owned:</span>
                <span className="ml-auto font-semibold text-gray-900 dark:text-white">{pagination.total || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Settings Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/50 lg:col-span-2">
          <h3 className="text-lg font-bold">Update Profile Info</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Change your display name or update your account password.</p>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <User size={16} className="text-gray-400" /> Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                  required
                />
              </div>

              <div className="border-t border-slate-100 pt-4 dark:border-slate-800" />

              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                <Key size={16} className="text-gray-400" /> Change Password (Optional)
              </h4>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password to make changes"
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Verify new password"
                    className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-800"
              >
                {isLoading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
