import React from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";

const CreateLandTaxForm: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে future-এ API call বা state update করা যাবে
    navigate("/dashboard/land-tax-records");
  };

  return (
    <div className="w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Create New Land Tax Record
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Thana Name
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            placeholder="Enter thana name"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            District Name
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            placeholder="Enter district name"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Holding Number
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            placeholder="Enter holding number"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Khatian Number
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            placeholder="Enter khatian number"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Officer Name
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            placeholder="Enter officer name"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Mouza Name
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            placeholder="Enter mouza name"
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black dark:text-white">
            Fiscal Year
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
            placeholder="Enter fiscal year"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 py-2 rounded transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Submit
        </button>
      </form>
    </div>
  );
};

export default CreateLandTaxForm;
