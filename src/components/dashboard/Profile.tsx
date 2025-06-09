import React, { useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  User,
  MapPin,
  Building,
  Save,
  X,
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  organization: string;
  role: string;
  avatar: string;
}

const initialProfileData: ProfileData = {
  name: "Rayhan Kabir",
  email: "rayhan@example.com",
  phone: "+880 1712-345678",
  address: "123, Dhanmondi, Dhaka",
  organization: "Dakhela Municipality",
  role: "Admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rayhan",
};

const Profile: React.FC = () => {
  const [profileData, setProfileData] =
    useState<ProfileData>(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ProfileData>(initialProfileData);

  const handleEdit = () => {
    setEditedData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Profile Information
          </h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary mb-4">
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded transition flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <User className="w-4 h-4" />
                    {profileData.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <Mail className="w-4 h-4" />
                    {profileData.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedData.phone}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <Phone className="w-4 h-4" />
                    {profileData.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedData.address}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <MapPin className="w-4 h-4" />
                    {profileData.address}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Organization
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="organization"
                    value={editedData.organization}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <Building className="w-4 h-4" />
                    {profileData.organization}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Role
                </label>
                <div className="flex items-center gap-2 text-black dark:text-white">
                  <User className="w-4 h-4" />
                  {profileData.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
