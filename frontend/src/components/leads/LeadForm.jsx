import { useState } from "react";

const statusOptions = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];
const sourceOptions = ["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Other"];

export default function LeadForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        value: initialData.value === undefined || initialData.value === null ? "" : initialData.value,
      };
    }
    return {
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "New",
      source: "Website",
      value: "",
    };
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.name) newErrors.name = "Name required";
    if (!formData.company) newErrors.company = "Company required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    const valueNum = formData.value === "" || formData.value === undefined || formData.value === null
      ? null
      : Number(formData.value);

    if (valueNum !== null) {
      if (isNaN(valueNum)) {
        newErrors.value = "Deal value must be a valid number";
      } else if (valueNum < 0) {
        newErrors.value = "Deal value cannot be negative";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      ...formData,
      value: valueNum,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
      {/* Scrollable Form Fields */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 overscroll-contain scrollbar-thin">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] mb-1.5 transition-colors duration-200">Name</label>
          <input
            name="name"
            placeholder="Enter lead name"
            value={formData.name}
            onChange={handleChange}
            className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 dark:border-[#243145] dark:bg-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-100 dark:focus:ring-[#3B82F6]/10"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-semibold animate-error-in">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] mb-1.5 transition-colors duration-200">Company</label>
          <input
            name="company"
            placeholder="Enter company name"
            value={formData.company}
            onChange={handleChange}
            className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 dark:border-[#243145] dark:bg-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-100 dark:focus:ring-[#3B82F6]/10"
          />
          {errors.company && <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-semibold animate-error-in">{errors.company}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] mb-1.5 transition-colors duration-200">Email</label>
          <input
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 dark:border-[#243145] dark:bg-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-100 dark:focus:ring-[#3B82F6]/10"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-semibold animate-error-in">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] mb-1.5 transition-colors duration-200">Phone (Optional)</label>
          <input
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 dark:border-[#243145] dark:bg-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-100 dark:focus:ring-[#3B82F6]/10"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] mb-1.5 transition-colors duration-200">Deal Value</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#94A3B8] text-sm font-semibold select-none">₹</span>
            <input
              name="value"
              type="number"
              min="0"
              step="any"
              placeholder="Enter deal value"
              value={formData.value === null || formData.value === undefined ? "" : formData.value}
              onChange={handleChange}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white pl-8 pr-4 py-3 text-sm text-slate-800 dark:border-[#243145] dark:bg-[#0F172A] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-100 dark:focus:ring-[#3B82F6]/10"
            />
          </div>
          {errors.value && <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-semibold animate-error-in">{errors.value}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] mb-1.5 transition-colors duration-200">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-[#243145] dark:bg-[#0F172A] dark:text-[#F8FAFC] outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-100 dark:focus:ring-[#3B82F6]/10 cursor-pointer"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status} className="bg-white text-slate-800 dark:bg-[#1B2235] dark:text-[#F8FAFC]">{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] mb-1.5 transition-colors duration-200">Source</label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-[#243145] dark:bg-[#0F172A] dark:text-[#F8FAFC] outline-none transition-all duration-200 focus:border-blue-500 dark:focus:border-[#3B82F6] focus:ring-4 focus:ring-blue-100 dark:focus:ring-[#3B82F6]/10 cursor-pointer"
            >
              {sourceOptions.map((source) => (
                <option key={source} value={source} className="bg-white text-slate-800 dark:bg-[#1B2235] dark:text-[#F8FAFC]">{source}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end border-t border-slate-100 dark:border-[#243145]/40 mt-4 bg-white dark:bg-[#111827] shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-750 dark:border-[#243145] dark:bg-[#111827] dark:text-[#F8FAFC] cursor-pointer btn-animate shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="min-h-[40px] rounded-xl bg-blue-600 dark:bg-[#3B82F6] px-5 py-2 text-xs font-bold text-white cursor-pointer btn-animate shadow-sm"
        >
          Save Lead
        </button>
      </div>
    </form>
  );
}
