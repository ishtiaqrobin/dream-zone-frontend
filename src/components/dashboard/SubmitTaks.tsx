import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Common classes
const labelClass =
  "block font-medium mb-1 text-black dark:text-white text-base";
const inputClass =
  "w-full border rounded px-3 py-2 text-base text-black dark:text-white dark:bg-gray-800";
const buttonClass =
  "w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300 py-2 rounded transition flex items-center justify-center gap-2 text-base font-medium";

const SubmitTasks: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const taskType = location.state?.taskType || "Facebook ID Sells";

  const [formData, setFormData] = useState({
    cookies: "",
    uid: "",
    email: "",
    password: "",
    isVerified: false,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Show success toast
    toast({
      title: "Success!",
      description: `Your ${taskType} details have been submitted successfully.`,
      variant: "default",
    });

    // Reset form
    setFormData({
      cookies: "",
      uid: "",
      email: "",
      password: "",
      isVerified: false,
    });
  };

  return (
    <div className="w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Submit Your {taskType} Details
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className={labelClass}>Cookies</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter your cookies"
            value={formData.cookies}
            onChange={(e) => handleChange("cookies", e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>User ID</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter your user ID"
            value={formData.uid}
            onChange={(e) => handleChange("uid", e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            className={inputClass}
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            className={inputClass}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isVerified"
            checked={formData.isVerified}
            onChange={(e) => handleChange("isVerified", e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="isVerified" className={labelClass}>
            Is Account Verified?
          </label>
        </div>

        <button type="submit" className={buttonClass}>
          <Send className="w-4 h-4" /> Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitTasks;
