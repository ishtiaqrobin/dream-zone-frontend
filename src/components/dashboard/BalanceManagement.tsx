import React, { useState } from "react";
import { DollarSign, Plus, Minus, History } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "User" | "Moderator";
  balance: number;
}

interface Transaction {
  id: number;
  userId: number;
  userName: string;
  type: "Add" | "Deduct";
  amount: number;
  date: string;
  description: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Rayhan Kabir",
    email: "rayhan@example.com",
    role: "Admin",
    balance: 1000,
  },
  {
    id: 2,
    name: "Fatema Begum",
    email: "fatema@example.com",
    role: "User",
    balance: 200,
  },
  {
    id: 3,
    name: "Sakib Hasan",
    email: "sakib@example.com",
    role: "Moderator",
    balance: 500,
  },
];

const initialTransactions: Transaction[] = [
  {
    id: 1,
    userId: 1,
    userName: "Rayhan Kabir",
    type: "Add",
    amount: 500,
    date: "2024-03-20",
    description: "Initial balance",
  },
  {
    id: 2,
    userId: 2,
    userName: "Fatema Begum",
    type: "Add",
    amount: 200,
    date: "2024-03-20",
    description: "Initial balance",
  },
];

const BalanceManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState<"Add" | "Deduct">(
    "Add"
  );
  const [error, setError] = useState("");

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setAmount("");
    setDescription("");
    setTransactionType("Add");
    setError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setAmount("");
    setDescription("");
    setError("");
  };

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (selectedUser) {
      const newBalance =
        transactionType === "Add"
          ? selectedUser.balance + amt
          : selectedUser.balance - amt;

      if (newBalance < 0) {
        setError("Insufficient balance");
        return;
      }

      // Update user balance
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, balance: newBalance } : u
        )
      );

      // Add transaction record
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        userId: selectedUser.id,
        userName: selectedUser.name,
        type: transactionType,
        amount: amt,
        date: new Date().toISOString().split("T")[0],
        description: description || `${transactionType} balance`,
      };

      setTransactions([newTransaction, ...transactions]);
      handleCloseModal();
    }
  };

  return (
    <div className="w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Balance Management
        </h2>
      </div>

      {/* Users Balance Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
          User Balances
        </h3>
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
                  Balance
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
                    ৳ {user.balance}
                  </td>
                  <td className="border dark:border-gray-700 px-4 py-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded transition flex items-center gap-1"
                    >
                      <DollarSign className="w-4 h-4" />
                      Manage Balance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
          Transaction History
        </h3>
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          <table className="min-w-full border dark:bg-gray-900 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border dark:border-gray-700 px-4 py-2 text-black dark:text-white">
                  Date
                </th>
                <th className="border dark:border-gray-700 px-4 py-2 text-black dark:text-white">
                  User
                </th>
                <th className="border dark:border-gray-700 px-4 py-2 text-black dark:text-white">
                  Type
                </th>
                <th className="border dark:border-gray-700 px-4 py-2 text-black dark:text-white">
                  Amount
                </th>
                <th className="border dark:border-gray-700 px-4 py-2 text-black dark:text-white">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="border dark:border-gray-700 px-4 py-2">
                    {transaction.date}
                  </td>
                  <td className="border dark:border-gray-700 px-4 py-2">
                    {transaction.userName}
                  </td>
                  <td className="border dark:border-gray-700 px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1 ${
                        transaction.type === "Add"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "Add" ? (
                        <Plus className="w-4 h-4" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                      {transaction.type}
                    </span>
                  </td>
                  <td className="border dark:border-gray-700 px-4 py-2">
                    ৳ {transaction.amount}
                  </td>
                  <td className="border dark:border-gray-700 px-4 py-2">
                    {transaction.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm border border-border dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Manage Balance for {selectedUser.name}
            </h3>
            <form onSubmit={handleTransaction} className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-black dark:text-white">
                  Transaction Type
                </label>
                <select
                  className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  value={transactionType}
                  onChange={(e) =>
                    setTransactionType(e.target.value as "Add" | "Deduct")
                  }
                >
                  <option value="Add">Add Balance</option>
                  <option value="Deduct">Deduct Balance</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1 text-black dark:text-white">
                  Amount
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-black dark:text-white">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
              {error && <div className="text-red-500 text-xs">{error}</div>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-400 text-white hover:bg-gray-500 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded transition"
                >
                  {transactionType === "Add" ? "Add Balance" : "Deduct Balance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceManagement;
