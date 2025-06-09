import React, { useState } from "react";
import { Trash, UserPlus } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "User" | "Moderator";
  status: "Active" | "Inactive";
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            বাতিল
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            নিশ্চিত করুন
          </button>
        </div>
      </div>
    </div>
  );
};

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

const tableCellClass =
  "border dark:border-gray-700 px-4 py-2 text-black dark:text-white";
const tableHeaderClass = "bg-gray-100 dark:bg-gray-800 " + tableCellClass;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: "delete" | "removeAdmin" | "makeAdmin" | null;
    userId: number | null;
  }>({
    isOpen: false,
    action: null,
    userId: null,
  });

  const openModal = (
    action: "delete" | "removeAdmin" | "makeAdmin",
    userId: number
  ) => {
    setModalState({
      isOpen: true,
      action,
      userId,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      action: null,
      userId: null,
    });
  };

  const handleConfirm = () => {
    if (modalState.userId) {
      if (modalState.action === "delete") {
        removeUser(modalState.userId);
      } else if (modalState.action === "removeAdmin") {
        removeAdmin(modalState.userId);
      } else if (modalState.action === "makeAdmin") {
        makeAdmin(modalState.userId);
      }
    }
    closeModal();
  };

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

  const getModalContent = () => {
    const user = users.find((u) => u.id === modalState.userId);
    if (!user) return { title: "", message: "" };

    if (modalState.action === "delete") {
      return {
        title: "ব্যবহারকারী মুছে ফেলুন",
        message: `আপনি কি নিশ্চিত যে আপনি ${user.name} কে মুছে ফেলতে চান?`,
      };
    } else if (modalState.action === "removeAdmin") {
      return {
        title: "অ্যাডমিন অধিকার প্রত্যাহার",
        message: `আপনি কি নিশ্চিত যে আপনি ${user.name} এর অ্যাডমিন অধিকার প্রত্যাহার করতে চান?`,
      };
    } else {
      return {
        title: "অ্যাডমিন হিসেবে নিয়োগ",
        message: `আপনি কি নিশ্চিত যে আপনি ${user.name} কে অ্যাডমিন হিসেবে নিয়োগ করতে চান?`,
      };
    }
  };

  return (
    <div className="w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Users
      </h2>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <table className="min-w-full border dark:bg-gray-900 dark:border-gray-700">
          <thead>
            <tr>
              <th className={tableHeaderClass}>Name</th>
              <th className={tableHeaderClass}>Email</th>
              <th className={tableHeaderClass}>Role</th>
              <th className={tableHeaderClass}>Status</th>
              <th className={tableHeaderClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className={tableCellClass}>{user.name}</td>
                <td className={tableCellClass}>{user.email}</td>
                <td className={tableCellClass}>{user.role}</td>
                <td className={tableCellClass}>{user.status}</td>
                <td className={tableCellClass + " space-x-1"}>
                  {user.role !== "Admin" && (
                    <button
                      onClick={() => openModal("makeAdmin", user.id)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded transition"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  )}
                  {user.role === "Admin" && (
                    <button
                      onClick={() => openModal("removeAdmin", user.id)}
                      className="bg-yellow-500 text-white hover:bg-yellow-600 px-2 py-1 rounded transition"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openModal("delete", user.id)}
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

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={getModalContent().title}
        message={getModalContent().message}
      />
    </div>
  );
};

export default Users;
