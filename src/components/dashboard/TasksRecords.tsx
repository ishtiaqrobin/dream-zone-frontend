import React, { useState, useEffect } from "react";
import { Pencil, Save, Trash, View, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AccountData {
  id: number;
  cookies: string;
  uid: string;
  email: string;
  password: string;
  isVerified: boolean;
  type: string;
}

const initialRecords: AccountData[] = [
  {
    id: 1,
    cookies: "cookie123",
    uid: "user123",
    email: "user1@example.com",
    password: "********",
    isVerified: true,
    type: "Facebook ID Sells",
  },
  {
    id: 2,
    cookies: "cookie456",
    uid: "user456",
    email: "user2@example.com",
    password: "********",
    isVerified: false,
    type: "Gmail ID Sells",
  },
  {
    id: 3,
    cookies: "cookie789",
    uid: "user789",
    email: "user3@example.com",
    password: "********",
    isVerified: true,
    type: "TikTok ID Sells",
  },
];

const tableCellClass =
  "border dark:border-gray-700 px-4 py-2 text-black dark:text-white";
const tableHeaderClass = "bg-gray-100 dark:bg-gray-800 " + tableCellClass;
const editCellClass = "border dark:border-gray-700 px-2 py-1";

const TasksRecords: React.FC = () => {
  const location = useLocation();
  const [records, setRecords] = useState<AccountData[]>(initialRecords);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<AccountData>>({});
  const [selectedType, setSelectedType] = useState<string>("All");

  // Get unique task types for filter
  const taskTypes = ["All", ...new Set(records.map((record) => record.type))];

  // Filter records based on selected type
  const filteredRecords =
    selectedType === "All"
      ? records
      : records.filter((record) => record.type === selectedType);

  const handleDelete = (id: number) => {
    setRecords(records.filter((rec) => rec.id !== id));
  };

  const handleEdit = (rec: AccountData) => {
    setEditId(rec.id);
    setEditData({ ...rec });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditData({ ...editData, [e.target.name]: value });
  };

  const handleEditSave = () => {
    setRecords(
      records.map((rec) =>
        rec.id === editId ? { ...rec, ...editData, id: editId! } : rec
      )
    );
    setEditId(null);
    setEditData({});
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
  };

  return (
    <div className="w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Account Records
        </h2>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-black dark:text-white">
            Filter by Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border rounded px-3 py-1 text-black dark:text-white dark:bg-gray-800"
          >
            {taskTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <table className="min-w-full border dark:bg-gray-900 dark:border-gray-700">
          <thead>
            <tr>
              <th className={tableHeaderClass}>Type</th>
              <th className={tableHeaderClass}>Cookies</th>
              <th className={tableHeaderClass}>User ID</th>
              <th className={tableHeaderClass}>Email</th>
              <th className={tableHeaderClass}>Password</th>
              <th className={tableHeaderClass}>Verified</th>
              <th className={tableHeaderClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((rec) => (
              <tr key={rec.id}>
                {editId === rec.id ? (
                  <>
                    <td className={editCellClass}>
                      <select
                        name="type"
                        value={editData.type || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, type: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-40"
                      >
                        {taskTypes
                          .filter((type) => type !== "All")
                          .map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="cookies"
                        value={editData.cookies || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-32"
                      />
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="uid"
                        value={editData.uid || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-24"
                      />
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="email"
                        type="email"
                        value={editData.email || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-40"
                      />
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="password"
                        type="password"
                        value={editData.password || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-32"
                      />
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="isVerified"
                        type="checkbox"
                        checked={editData.isVerified || false}
                        onChange={handleEditChange}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className={editCellClass}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleEditSave}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded transition flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="bg-gray-400 text-white hover:bg-gray-500 px-2 py-1 rounded transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className={tableCellClass}>{rec.type}</td>
                    <td className={tableCellClass}>{rec.cookies}</td>
                    <td className={tableCellClass}>{rec.uid}</td>
                    <td className={tableCellClass}>{rec.email}</td>
                    <td className={tableCellClass}>{rec.password}</td>
                    <td className={tableCellClass}>
                      {rec.isVerified ? "Yes" : "No"}
                    </td>
                    <td className={tableCellClass}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(rec)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded transition flex items-center gap-1"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          className="bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded transition flex items-center gap-1"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/dashboard/task-records/${rec.id}`}
                          className="bg-gray-500 text-white hover:bg-gray-600 px-2 py-1 rounded transition flex items-center gap-1"
                        >
                          <View className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksRecords;
