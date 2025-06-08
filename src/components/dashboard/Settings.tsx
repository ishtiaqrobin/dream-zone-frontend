import React, { useState } from "react";
import { Save } from "lucide-react";

const Settings: React.FC = () => {
  const [name, setName] = useState("Rayhan Kabir");
  const [email, setEmail] = useState("rayhan@example.com");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে ভবিষ্যতে API call করা যাবে
    alert("Profile updated (fake)");
  };

  return (
    <div className="w-full max-w-xl bg-card rounded-lg shadow-sm border border-border text-foreground p-8 dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Settings
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Full Name
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            New Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded transition flex items-center justify-center gap-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          <Save className="w-4 h-4" /> Update Profile
        </button>
      </form>
    </div>
  );
};

export default Settings;
