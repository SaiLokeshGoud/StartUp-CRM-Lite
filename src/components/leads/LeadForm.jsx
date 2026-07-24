import { useState } from "react";

const statusOptions = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];
const sourceOptions = ["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Other"];

export default function LeadForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "New",
      source: "Website",
    }
  );

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

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full min-h-[44px] rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

      <input
        name="company"
        placeholder="Company"
        value={formData.company}
        onChange={handleChange}
        className="w-full min-h-[44px] rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}

      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full min-h-[44px] rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="w-full min-h-[44px] rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full min-h-[44px] rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        {statusOptions.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>

      <select
        name="source"
        value={formData.source}
        onChange={handleChange}
        className="w-full min-h-[44px] rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        {sourceOptions.map((source) => (
          <option key={source}>{source}</option>
        ))}
      </select>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[44px] rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button type="submit" className="min-h-[44px] rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  );
}
