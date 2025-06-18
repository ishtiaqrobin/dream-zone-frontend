import React, { useState, useEffect } from "react";
import { Trash, UserPlus, Search } from "lucide-react";
import { API_ENDPOINTS, apiRequest } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  _id: string;
  name: string;
  email: string;
  number: string;
  role: "Team Leader" | "User" | "Moderator" | "Trainer";
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const tableCellClass =
  "border dark:border-gray-700 px-4 py-2 text-black dark:text-white";
const tableHeaderClass = "bg-gray-100 dark:bg-gray-800 " + tableCellClass;

const Users: React.FC = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: "delete" | "removeLeader" | "makeLeader" | null;
    userId: string | null;
  }>({
    isOpen: false,
    action: null,
    userId: null,
  });

  // Check if current user is Admin
  const isAdmin = currentUser?.role === "Admin";

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Use different API endpoints based on user role
      const endpoint = isAdmin
        ? API_ENDPOINTS.auth.users.getAllForAdmin({
            page: pagination.page,
            limit: pagination.limit,
            search,
            role: selectedRole === "all" ? "" : selectedRole,
            status: selectedStatus === "all" ? "" : selectedStatus,
          })
        : API_ENDPOINTS.auth.users.getAll({
            page: pagination.page,
            limit: pagination.limit,
            search,
            role: selectedRole === "all" ? "" : selectedRole,
          });

      const response = await apiRequest(endpoint);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, search, selectedRole, selectedStatus]);

  const openModal = (
    action: "delete" | "removeLeader" | "makeLeader",
    userId: string
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

  const handleConfirm = async () => {
    if (!modalState.userId) return;

    try {
      if (modalState.action === "delete") {
        await apiRequest(
          API_ENDPOINTS.auth.users.updateStatus(modalState.userId),
          {
            method: "PUT",
            body: JSON.stringify({ isActive: false }),
          }
        );
      } else if (modalState.action === "removeLeader") {
        await apiRequest(
          API_ENDPOINTS.auth.users.updateStatus(modalState.userId),
          {
            method: "PUT",
            body: JSON.stringify({ role: "User" }),
          }
        );
      } else if (modalState.action === "makeLeader") {
        await apiRequest(
          API_ENDPOINTS.auth.users.updateStatus(modalState.userId),
          {
            method: "PUT",
            body: JSON.stringify({ role: "Team Leader" }),
          }
        );
      }

      toast({
        title: "Success",
        description: "User status updated successfully",
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
    closeModal();
  };

  const getModalContent = () => {
    const user = users.find((u) => u._id === modalState.userId);
    if (!user) return { title: "", message: "" };

    if (modalState.action === "delete") {
      return {
        title: "Delete User",
        message: `Are you sure you want to deactivate ${user.name}?`,
      };
    } else if (modalState.action === "removeLeader") {
      return {
        title: "Remove Team Leader",
        message: `Are you sure you want to remove ${user.name}'s Team Leader role?`,
      };
    } else {
      return {
        title: "Assign Team Leader",
        message: `Are you sure you want to assign ${user.name} as Team Leader?`,
      };
    }
  };

  return (
    <div className="w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Users
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Leader">Team Leader</SelectItem>
            <SelectItem value="Trainer">Trainer</SelectItem>
            <SelectItem value="Moderator">Moderator</SelectItem>
            {currentUser?.role === "Admin" && (
              <SelectItem value="Admin">Admin</SelectItem>
            )}
          </SelectContent>
        </Select>

        {/* Status filter only for Admin */}
        {isAdmin && (
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Info message for non-admin users */}
      {!isAdmin && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            Showing only inactive users. Contact admin for full user management.
          </p>
        </div>
      )}

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <table className="min-w-full border dark:bg-gray-900 dark:border-gray-700">
          <thead>
            <tr>
              <th className={tableHeaderClass}>Name</th>
              <th className={tableHeaderClass}>Email</th>
              <th className={tableHeaderClass}>Number</th>
              <th className={tableHeaderClass}>Role</th>
              <th className={tableHeaderClass}>Status</th>
              <th className={tableHeaderClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className={tableCellClass}>{user.name}</td>
                  <td className={tableCellClass}>{user.email}</td>
                  <td className={tableCellClass}>{user.number}</td>
                  <td className={tableCellClass}>{user.role}</td>
                  <td className={tableCellClass}>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className={tableCellClass + " space-x-1"}>
                    {user.role !== "Team Leader" && (
                      <button
                        onClick={() => openModal("makeLeader", user._id)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded transition"
                        title="Make Team Leader"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    )}
                    {user.role === "Team Leader" && (
                      <button
                        onClick={() => openModal("removeLeader", user._id)}
                        className="bg-yellow-500 text-white hover:bg-yellow-600 px-2 py-1 rounded transition"
                        title="Remove Team Leader"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                    {user.isActive && (
                      <button
                        onClick={() => openModal("delete", user._id)}
                        className="bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded transition"
                        title="Deactivate User"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.min(pagination.totalPages, prev.page + 1),
              }))
            }
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}

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
