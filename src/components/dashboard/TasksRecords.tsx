import React, { useState } from "react";
import { Pencil, Save, Trash, View, X } from "lucide-react";
import { Link } from "react-router-dom";

interface FacebookAccount {
  id: number;
  cookies: string;
  uid: string;
  email: string;
  password: string;
  isVerified: boolean;
}

const initialRecords: FacebookAccount[] = [
  {
    id: 1,
    cookies: "cookie123",
    uid: "user123",
    email: "user1@example.com",
    password: "********",
    isVerified: true,
  },
  {
    id: 2,
    cookies: "cookie456",
    uid: "user456",
    email: "user2@example.com",
    password: "********",
    isVerified: false,
  },
];

const tableCellClass =
  "border dark:border-gray-700 px-4 py-2 text-black dark:text-white";
const tableHeaderClass = "bg-gray-100 dark:bg-gray-800 " + tableCellClass;
const editCellClass = "border dark:border-gray-700 px-2 py-1";

const TasksRecords: React.FC = () => {
  const [records, setRecords] = useState<FacebookAccount[]>(initialRecords);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<FacebookAccount>>({});

  const handleDelete = (id: number) => {
    setRecords(records.filter((rec) => rec.id !== id));
  };

  const handleEdit = (rec: FacebookAccount) => {
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
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Facebook Account Records
      </h2>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <table className="min-w-full border dark:bg-gray-900 dark:border-gray-700">
          <thead>
            <tr>
              <th className={tableHeaderClass}>Cookies</th>
              <th className={tableHeaderClass}>User ID</th>
              <th className={tableHeaderClass}>Email</th>
              <th className={tableHeaderClass}>Password</th>
              <th className={tableHeaderClass}>Verified</th>
              <th className={tableHeaderClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                {editId === rec.id ? (
                  <>
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
