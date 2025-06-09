import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Plus, X } from "lucide-react";

// বাংলা ফন্টের জন্য কাস্টম ক্লাস
const banglaFont = "font-bangla";

// কমন ক্লাস
const labelClass =
  "block font-medium mb-1 text-black dark:text-white text-[14px]";
const inputClass =
  "w-full border rounded px-3 py-2 text-[14px] text-black dark:text-white dark:bg-gray-800";
const inputWithIconClass = `${inputClass} pr-10`;
const buttonClass =
  "w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300 py-2 rounded transition flex items-center justify-center gap-2 text-[14px]";
const addBtnClass =
  "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300 px-2 py-1 rounded flex items-center gap-1 text-sm text-[14px]";
const closeBtnClass =
  "absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700";
const sectionTitleClass = "text-lg font-semibold text-[14px]";

const initialOwner = { name: "" };
const initialLand = { description: "", class: "", area: "" };

const CreateLandTaxForm: React.FC = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([{ ...initialOwner }]);
  const [lands, setLands] = useState([{ ...initialLand }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে future-এ API call বা state update করা যাবে
    navigate("/dashboard/land-tax-records");
  };

  // মালিক যোগ/রিমুভ
  const addOwner = () => setOwners([...owners, { ...initialOwner }]);
  const removeOwner = (idx: number) =>
    setOwners(owners.filter((_, i) => i !== idx));
  const handleOwnerChange = (idx: number, value: string) => {
    setOwners(owners.map((o, i) => (i === idx ? { ...o, name: value } : o)));
  };

  // ভূমি যোগ/রিমুভ
  const addLand = () => setLands([...lands, { ...initialLand }]);
  const removeLand = (idx: number) =>
    setLands(lands.filter((_, i) => i !== idx));
  const handleLandChange = (idx: number, field: string, value: string) => {
    setLands(lands.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };

  return (
    <div
      className={`w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700 ${banglaFont}`}
    >
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white text-[16px]">
        ভূমি উন্নয়ন কর রেকর্ড তৈরি করুন
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className={labelClass}>থানার নাম</label>
          <input
            type="text"
            className={inputClass}
            placeholder="থানার নাম লিখুন"
          />
        </div>
        <div>
          <label className={labelClass}>জেলার নাম</label>
          <input
            type="text"
            className={inputClass}
            placeholder="জেলার নাম লিখুন"
          />
        </div>
        <div>
          <label className={labelClass}>হোল্ডিং নম্বর</label>
          <input
            type="text"
            className={inputClass}
            placeholder="হোল্ডিং নম্বর লিখুন"
          />
        </div>
        <div>
          <label className={labelClass}>খতিয়ান নম্বর</label>
          <input
            type="text"
            className={inputClass}
            placeholder="খতিয়ান নম্বর লিখুন"
          />
        </div>
        <div>
          <label className={labelClass}>অফিসারের নাম</label>
          <input
            type="text"
            className={inputClass}
            placeholder="অফিসারের নাম লিখুন"
          />
        </div>
        <div>
          <label className={labelClass}>মৌজার নাম</label>
          <input
            type="text"
            className={inputClass}
            placeholder="মৌজার নাম লিখুন"
          />
        </div>
        <div>
          <label className={labelClass}>অর্থ বছর</label>
          <input
            type="text"
            className={inputClass}
            placeholder="অর্থ বছরের নাম লিখুন"
          />
        </div>

        {/* মালিকের তথ্য */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={sectionTitleClass}>মালিকের বিবরণ</span>
            <button type="button" onClick={addOwner} className={addBtnClass}>
              <Plus className="w-4 h-4" /> মালিক যোগ করুন
            </button>
          </div>
          {owners.map((owner, idx) => (
            <div key={idx} className="relative mb-3">
              <input
                type="text"
                className={inputWithIconClass}
                placeholder={`মালিকের নাম ${idx + 1}`}
                value={owner.name}
                onChange={(e) => handleOwnerChange(idx, e.target.value)}
              />
              {owners.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOwner(idx)}
                  className={closeBtnClass}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ভূমির তথ্য */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={sectionTitleClass}>ভূমির বিবরণ</span>
            <button type="button" onClick={addLand} className={addBtnClass}>
              <Plus className="w-4 h-4" /> ভূমি যোগ করুন
            </button>
          </div>
          {lands.map((land, idx) => (
            <div
              key={idx}
              className="relative mb-3 grid grid-cols-1 md:grid-cols-3 gap-2"
            >
              <input
                type="text"
                className={inputWithIconClass}
                placeholder={`বর্ণনা (${idx + 1} নম্বর)`}
                value={land.description}
                onChange={(e) =>
                  handleLandChange(idx, "description", e.target.value)
                }
              />
              <input
                type="text"
                className={inputClass}
                placeholder="শ্রেণি"
                value={land.class}
                onChange={(e) => handleLandChange(idx, "class", e.target.value)}
              />
              <input
                type="text"
                className={inputClass}
                placeholder="পরিমাণ"
                value={land.area}
                onChange={(e) => handleLandChange(idx, "area", e.target.value)}
              />
              {lands.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLand(idx)}
                  className={closeBtnClass}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className={buttonClass}>
          <Send className="w-4 h-4" /> রেকর্ড সংরক্ষণ করুন
        </button>
      </form>
    </div>
  );
};

export default CreateLandTaxForm;
