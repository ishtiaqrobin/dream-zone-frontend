import React, { useState } from "react";
import { Pencil, Save, Trash, View, X } from "lucide-react";
import { Link } from "react-router-dom";

interface LandTaxRecord {
  id: number;
  thana: string;
  district: string;
  holding: string;
  khatian: string;
  officer: string;
  mouza: string;
  year: string;
}

const initialRecords: LandTaxRecord[] = [
  {
    id: 1,
    thana: "Dhanmondi",
    district: "Dhaka",
    holding: "1234",
    khatian: "5678",
    officer: "Abdul Karim",
    mouza: "Mouza-1",
    year: "2023-24",
  },
  {
    id: 2,
    thana: "Kotwali",
    district: "Chattogram",
    holding: "4321",
    khatian: "8765",
    officer: "Rahim Uddin",
    mouza: "Mouza-2",
    year: "2022-23",
  },
];

const tableCellClass =
  "border dark:border-gray-700 px-4 py-2 text-black dark:text-white";
const tableHeaderClass = "bg-gray-100 dark:bg-gray-800 " + tableCellClass;
const editCellClass = "border dark:border-gray-700 px-2 py-1";

const LandTaxRecords: React.FC = () => {
  const [records, setRecords] = useState<LandTaxRecord[]>(initialRecords);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<LandTaxRecord>>({});

  const handleDelete = (id: number) => {
    setRecords(records.filter((rec) => rec.id !== id));
  };

  const handleEdit = (rec: LandTaxRecord) => {
    setEditId(rec.id);
    setEditData({ ...rec });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
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
        Land Tax Records
      </h2>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <table className="min-w-full border dark:bg-gray-900 dark:border-gray-700">
          <thead>
            <tr>
              <th className={tableHeaderClass}>Thana</th>
              <th className={tableHeaderClass}>District</th>
              <th className={tableHeaderClass}>Holding</th>
              <th className={tableHeaderClass}>Khatian</th>
              <th className={tableHeaderClass}>Officer</th>
              <th className={tableHeaderClass}>Mouza</th>
              <th className={tableHeaderClass}>Year</th>
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
                        name="thana"
                        value={editData.thana || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-24"
                      />
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="district"
                        value={editData.district || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-24"
                      />
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="holding"
                        value={editData.holding || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-20"
                      />
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="khatian"
                        value={editData.khatian || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-20"
                      />
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="officer"
                        value={editData.officer || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-24"
                      />
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="mouza"
                        value={editData.mouza || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-20"
                      />
                    </td>
                    <td className={editCellClass}>
                      <input
                        name="year"
                        value={editData.year || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-16"
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
                    <td className={tableCellClass}>{rec.thana}</td>
                    <td className={tableCellClass}>{rec.district}</td>
                    <td className={tableCellClass}>{rec.holding}</td>
                    <td className={tableCellClass}>{rec.khatian}</td>
                    <td className={tableCellClass}>{rec.officer}</td>
                    <td className={tableCellClass}>{rec.mouza}</td>
                    <td className={tableCellClass}>{rec.year}</td>
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
                          to={`/dashboard/land-tax-records/${rec.id}`}
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

export default LandTaxRecords;
