import React, { useState } from "react";

const AddUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে ভবিষ্যতে API call করা যাবে
    setSuccess(true);
    setEmail("");
    setPassword("");
    setRole("User");
  };

  return (
    <div className="w-full max-w-xl bg-card rounded-lg shadow-sm border border-border text-foreground p-8 dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Add New User
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Role
          </label>
          <select
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded transition flex items-center justify-center gap-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          Add User
        </button>
        {success && (
          <div className="mt-4 text-green-600 text-center font-medium">
            User created successfully (fake)
          </div>
        )}
      </form>
    </div>
  );
};

export default AddUser;
