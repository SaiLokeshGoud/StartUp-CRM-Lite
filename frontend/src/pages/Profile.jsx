import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../context/LeadContext';
import { User, Key, Mail, Shield, Award, Camera, ShieldCheck, CheckCircle2, Lock, ExternalLink, RefreshCw, Eye, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import FadeIn from '../components/common/FadeIn';

/**
 * Client-side helper to crop and compress profile images
 * @param {File} file
 * @returns {Promise<string>} base64 compressed data URL
 */
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        // Centered square crop
        const size = Math.min(width, height);
        const startX = (width - size) / 2;
        const startY = (height - size) / 2;

        const targetSize = Math.min(size, MAX_WIDTH);
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          img,
          startX,
          startY,
          size,
          size,
          0,
          0,
          targetSize,
          targetSize
        );

        // Compress as image/jpeg at 0.85 quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export default function Profile() {
  const { user, updateProfile, isLoading } = useAuth();
  const { pagination } = useLeads();

  const [name, setName] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localAvatar, setLocalAvatar] = useState(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  // Profile picture actions and dialog states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdown menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Lock body scroll when preview or deletion modal is open
  useEffect(() => {
    const anyOpen = isPreviewOpen || isDeleteConfirmOpen;
    if (anyOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isPreviewOpen, isDeleteConfirmOpen]);

  // Sync state if user changes in context
  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleDeleteAvatar = async () => {
    try {
      setIsAvatarUploading(true);
      await updateProfile({ name, profilePicture: "" });
      toast.success('Profile photo deleted successfully.');
      setIsDeleteConfirmOpen(false);
      setLocalAvatar(null); // Reset local preview
    } catch (err) {
      console.error(err);
      toast.error('Unable to delete profile photo. Please try again.');
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // A. Validate Image Type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid image type. Please choose a JPEG, PNG, or WebP image.');
      return;
    }

    // B. Validate original size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large. Please choose an image smaller than 5 MB.');
      return;
    }

    try {
      setIsAvatarUploading(true);
      
      // C. Compress and crop image to square 800x800 base64 string
      const compressedBase64 = await compressImage(file);
      setLocalAvatar(compressedBase64); // Preview locally immediately
      
      // D. Upload payload to backend
      await updateProfile({ name, profilePicture: compressedBase64 });
      toast.success('Profile photo updated successfully.');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 413) {
        toast.error('Image is too large. Please choose a smaller image.');
      } else {
        toast.error('Unable to update profile photo. Please try again.');
      }
      setLocalAvatar(null); // Reset preview on error
    } finally {
      setIsAvatarUploading(false);
      // Clear value so same file can be selected again
      e.target.value = '';
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setLocalAvatar(null);
    toast.success('Changes discarded');
  };

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
      toast.success('Profile updated successfully');
      
      // Clear password fields on success
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Error toast is handled inside AuthContext
    }
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  
  const avatarImage = localAvatar || user?.profilePicture;
  const completionPercent = avatarImage ? 100 : 85;

  const isFormDirty = name !== (user?.name || '') || oldPassword || newPassword || confirmPassword;

  // Design Tokens for Input Fields
  const inputClass = "w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50/90 px-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:border-slate-600/50 dark:bg-slate-700/45 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-400/80 outline-none transition-all duration-200 hover:border-slate-350 dark:hover:border-slate-500 dark:hover:bg-slate-700/60 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 dark:focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-700/75";
  const disabledInputClass = "w-full min-h-[44px] rounded-xl border border-slate-200/60 bg-slate-100/80 px-4 py-2.5 text-xs sm:text-sm text-slate-500 dark:border-slate-700/40 dark:bg-slate-850/40 dark:text-slate-350 outline-none cursor-not-allowed select-none transition-all duration-200";

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-slate-800 dark:text-slate-200">
      <Toaster position="top-right" />
      
      {/* Page Header */}
      <FadeIn>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold sm:text-3xl text-slate-900 dark:text-white">Profile Settings</h1>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                Account Settings
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Manage your account information and security settings.
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Summary Card */}
        <FadeIn delay={50}>
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-slate-700/50 dark:bg-slate-800/80 dark:shadow-slate-900/40">
              <div className="flex flex-col items-center text-center">
                {/* Avatar with Photo Upload Button Overlay */}
                <div className="relative group">
                  {avatarImage ? (
                    <img
                      src={avatarImage}
                      alt={user?.name}
                      className="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/40 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 text-3xl font-extrabold text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-100 dark:ring-blue-900/40">
                      {firstLetter}
                    </div>
                  )}

                  {/* Loading spinner overlay */}
                  {isAvatarUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/65 ring-4 ring-blue-100 dark:ring-blue-900/40 z-10 transition-all duration-300">
                      <RefreshCw className="animate-spin h-6 w-6 text-white" />
                    </div>
                  )}
                  
                  {/* Camera Icon Trigger Button */}
                  <button 
                    type="button"
                    onClick={() => {
                      if (!isAvatarUploading) {
                        setIsMenuOpen(!isMenuOpen);
                      }
                    }}
                    disabled={isAvatarUploading}
                    className={`absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/30 border-2 border-white dark:border-slate-800 transition-all duration-200 ${
                      isAvatarUploading 
                        ? 'opacity-40 cursor-not-allowed' 
                        : 'hover:bg-blue-700 hover:scale-105 hover:shadow-blue-500/50 active:scale-90 cursor-pointer'
                    }`}
                    title="Profile picture options"
                    aria-label="Profile picture options"
                  >
                    <Camera size={14} />
                  </button>

                  {/* Actions Dropdown Menu */}
                  {isMenuOpen && (
                    <div 
                      ref={menuRef}
                      className="absolute right-0 bottom-10 z-30 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900/95 backdrop-blur animate-in fade-in slide-in-from-bottom-2 duration-200"
                    >
                      {/* View Profile Picture */}
                      <button
                        type="button"
                        disabled={!user?.profilePicture}
                        onClick={() => {
                          setIsPreviewOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold border-b border-slate-100 dark:border-slate-800 text-left transition-colors ${
                          user?.profilePicture
                            ? 'text-slate-700 dark:text-slate-350 hover:bg-blue-50/50 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 cursor-pointer' 
                            : 'text-slate-350 dark:text-slate-600 cursor-not-allowed'
                        }`}
                        title={!user?.profilePicture ? "No profile picture uploaded" : "View profile picture"}
                        aria-label="View profile picture"
                      >
                        <Eye size={14} className={user?.profilePicture ? 'text-blue-500' : 'text-slate-350 dark:text-slate-600'} />
                        <span>View Profile Picture</span>
                      </button>

                      {/* Update Profile Picture */}
                      <button
                        type="button"
                        onClick={() => {
                          fileInputRef.current?.click();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold border-b border-slate-100 dark:border-slate-800 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                        title="Update profile picture"
                        aria-label="Update profile picture"
                      >
                        <Camera size={14} className="text-blue-500" />
                        <span>Update Profile Picture</span>
                      </button>

                      {/* Delete Profile Picture */}
                      <button
                        type="button"
                        disabled={!user?.profilePicture || isAvatarUploading}
                        onClick={() => {
                          setIsDeleteConfirmOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-left transition-colors ${
                          user?.profilePicture && !isAvatarUploading
                            ? 'text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 cursor-pointer'
                            : 'text-slate-350 dark:text-slate-600 cursor-not-allowed'
                        }`}
                        title={!user?.profilePicture ? "No profile picture uploaded" : "Delete profile picture"}
                        aria-label="Delete profile picture"
                      >
                        <Trash2 size={14} className={user?.profilePicture ? 'text-red-500' : 'text-slate-350 dark:text-slate-600'} />
                        <span>Delete Profile Picture</span>
                      </button>
                    </div>
                  )}

                  {/* Hidden File Input */}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    id="avatar-upload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange} 
                    disabled={isAvatarUploading}
                  />
                </div>
                
                <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white leading-snug truncate max-w-full">
                  {user?.name || "User Profile"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-450 truncate max-w-full">
                  {user?.email}
                </p>

                {/* Account Status Badge */}
                <div className="mt-3 flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Account
                </div>

                <div className="mt-6 w-full border-t border-slate-100 dark:border-slate-700/50" />

                {/* Metadata List */}
                <div className="mt-5 flex w-full flex-col gap-1 text-left">
                  <div className="flex items-center gap-3 text-xs sm:text-sm rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                    <Mail size={15} className="text-blue-400/80 dark:text-blue-500/70 shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400">Email</span>
                    <span className="ml-auto font-medium text-slate-800 dark:text-slate-200 truncate max-w-[130px] sm:max-w-[160px]" title={user?.email}>
                      {user?.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                    <Shield size={15} className="text-blue-400/80 dark:text-blue-500/70 shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400">Role</span>
                    <span className="ml-auto rounded-full bg-blue-50 dark:bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
                      {user?.role || 'user'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                    <Key size={15} className="text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400">Sign-in Method</span>
                    <span className="ml-auto rounded-full bg-slate-100 dark:bg-slate-700/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600/40">
                      {user?.authProvider || 'local'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                    <Award size={15} className="text-blue-400/80 dark:text-blue-500/70 shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400">Leads Owned</span>
                    <span className="ml-auto font-bold text-slate-900 dark:text-white">
                      {pagination?.total || 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm rounded-lg px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150">
                    <CheckCircle2 size={15} className="text-emerald-500/80 dark:text-emerald-400/70 shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400">Account Status</span>
                    <span className="ml-auto rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                      Active
                    </span>
                  </div>
                </div>

                <div className="mt-6 w-full border-t border-slate-100 dark:border-slate-700/50" />

                {/* Profile Completion Indicator */}
                <div className="mt-5 w-full text-left">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Profile Completion</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{completionPercent}%</span>
                  </div>
                  <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 to-blue-600" 
                      style={{ width: `${completionPercent}%` }} 
                    />
                  </div>
                  <p className="mt-2.5 text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                    Complete your profile to keep your account information up to date.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Right Column: Profile Form / Authentication settings */}
        <FadeIn delay={100} className="lg:col-span-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md dark:border-slate-700/50 dark:bg-slate-800/80 dark:shadow-slate-900/40">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/15">
                  <User size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update Profile Info</h3>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Manage your personal account details.
              </p>

              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Display Name Input */}
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  {/* Email Input (Read-only) */}
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className={disabledInputClass}
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Your email address is managed by your {user?.authProvider === 'google' ? 'Google' : 'Account'} login.
                    </p>
                  </div>

                  {user?.authProvider === 'google' ? (
                    /* Google Authenticated Security Details */
                    <div className="space-y-4">
                      <div className="border-t border-slate-150 pt-5 dark:border-slate-800" />
                      
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/15">
                          <Lock size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="text-md font-bold text-slate-900 dark:text-white">Security & Authentication</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50 text-xs sm:text-sm">
                        <div>
                          <p className="font-semibold text-slate-500 dark:text-slate-400">Authentication Provider</p>
                          <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">Google</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-500 dark:text-slate-400">Account Security</p>
                          <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">Managed by Google</p>
                        </div>
                      </div>

                      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/40 p-4 text-xs sm:text-sm text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                        <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          Your account is authenticated through Google. Password changes and account security settings are managed through your Google Account.
                        </p>
                      </div>

                      <div className="pt-2">
                        <a
                          href="https://myaccount.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[38px] items-center gap-2 rounded-xl border border-slate-250 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <ExternalLink size={14} />
                          Manage Google Account
                        </a>
                      </div>
                    </div>
                  ) : (
                    /* Local Credentials password change inputs */
                    <div className="space-y-4">
                      <div className="border-t border-slate-100 pt-5 dark:border-slate-700/50" />

                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/15">
                          <Lock size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="text-md font-bold text-slate-900 dark:text-white">Change Password (Optional)</h4>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter current password to make changes"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Verify new password"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 border-t border-slate-100 dark:border-slate-700/50 pt-5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-slate-200 bg-transparent px-5 py-2 text-xs sm:text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:border-slate-600 cursor-pointer active:scale-95 duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isFormDirty}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-blue-600 px-6 py-2 text-xs sm:text-sm font-semibold text-white transition-all shadow-sm hover:bg-blue-700 hover:-translate-y-px hover:shadow-md hover:shadow-blue-500/20 active:scale-95 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-sm cursor-pointer duration-150 shrink-0 gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="animate-spin h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Lightbox / View Profile Picture Modal */}
      {isPreviewOpen && user?.profilePicture && createPortal(
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setIsPreviewOpen(false); }}
        >
          <div className="relative max-w-2xl w-full flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-slate-350 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center text-lg font-bold rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95"
              aria-label="Close image preview"
            >
              ✕
            </button>
            <img
              src={avatarImage}
              alt={user?.name}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl select-none"
            />
          </div>
        </div>,
        document.body
      )}

      {/* Delete Profile Picture Confirmation Modal */}
      {isDeleteConfirmOpen && createPortal(
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setIsDeleteConfirmOpen(false); }}
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#111827] transition-all duration-200">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Profile Picture</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to remove your profile picture? Your default avatar will be shown instead.
            </p>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-[#243145]/40 pt-4">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-350 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-700 dark:bg-[#111827] dark:text-[#F8FAFC] dark:hover:bg-[#1B2235]/60 transition-all duration-150 ease-out active:scale-95 cursor-pointer min-h-[40px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAvatar}
                disabled={isAvatarUploading}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/40 dark:focus:ring-red-500/30 transition-all duration-150 ease-out active:scale-95 active:translate-y-0 cursor-pointer min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isAvatarUploading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

