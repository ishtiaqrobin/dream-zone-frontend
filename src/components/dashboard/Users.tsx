import React, { useState } from "react";
import { Trash, UserPlus } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "User" | "Moderator";
  status: "Active" | "Inactive";
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Rayhan Kabir",
    email: "rayhan@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Fatema Begum",
    email: "fatema@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Sakib Hasan",
    email: "sakib@example.com",
    role: "Moderator",
    status: "Active",
  },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const makeAdmin = (id: number) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, role: "Admin" } : user))
    );
  };

  const removeAdmin = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id && user.role === "Admin"
          ? { ...user, role: "User" }
          : user
      )
    );
  };

  const removeUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Users
      </h2>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <table className="min-w-full border dark:bg-gray-900 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border dark:border-gray-700 px-4 py-2 text-black dark:text-white">
                Name
              </th>
              <th className="border dark:border-gray-700 px-4 py-2 text-black dark:text-white">
                Email
              </th>
              <th className="border dark:border-gray-700 px-4 py-2 text-black dark:text-white">
                Role
              </th>
              <th className="border dark:border-gray-700 px-4 py-2 text-black dark:text-white">
                Status
              </th>
              <th className="border dark:border-gray-700 px-4 py-2 text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border dark:border-gray-700 px-4 py-2">
                  {user.name}
                </td>
                <td className="border dark:border-gray-700 px-4 py-2">
                  {user.email}
                </td>
                <td className="border dark:border-gray-700 px-4 py-2">
                  {user.role}
                </td>
                <td className="border dark:border-gray-700 px-4 py-2">
                  {user.status}
                </td>
                <td className="border dark:border-gray-700 px-4 py-2 space-x-1">
                  {user.role !== "Admin" && (
                    <button
                      onClick={() => makeAdmin(user.id)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded transition"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  )}
                  {user.role === "Admin" && (
                    <button
                      onClick={() => removeAdmin(user.id)}
                      className="bg-yellow-500 text-white hover:bg-yellow-600 px-2 py-1 rounded transition"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeUser(user.id)}
                    className="bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded transition"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
