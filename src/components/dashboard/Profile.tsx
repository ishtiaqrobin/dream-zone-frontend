import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Mail,
  Phone,
  User,
  MapPin,
  Building,
  Save,
  X,
  Upload,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, apiRequest } from "@/config/api";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  organization: string;
  role: string;
  avatar: string;
}

const Profile: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const { toast } = useToast();

  const initialProfileData: ProfileData = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.number || "",
    address: user?.address || "",
    organization: user?.organization || "",
    role: user?.role || "",
    avatar:
      user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Rayhan",
  };

  const [profileData, setProfileData] =
    useState<ProfileData>(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ProfileData>(initialProfileData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const responseData = await apiRequest(
            API_ENDPOINTS.auth.profile.get,
            {
              method: "GET",
            }
          );

          if (responseData.user) {
            const data = responseData.user;
            setProfileData({
              name: data.name || "",
              email: data.email || "",
              phone: data.number || "",
              address: data.address || "",
              organization: data.organization || "",
              role: data.role || "",
              avatar:
                data.avatar ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Rayhan",
            });
            setEditedData({
              name: data.name || "",
              email: data.email || "",
              phone: data.number || "",
              address: data.address || "",
              organization: data.organization || "",
              role: data.role || "",
              avatar:
                data.avatar ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Rayhan",
            });
          } else {
            toast({
              title: "Error fetching profile",
              description:
                responseData.message || "Failed to load profile data.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to connect to the server for profile data.",
            variant: "destructive",
          });
        }
      };

      fetchProfile();
    } else {
      setProfileData(initialProfileData);
      setEditedData(initialProfileData);
    }
  }, [user]);

  const handleEdit = () => {
    setEditedData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
  };

  const handleSave = async () => {
    try {
      const responseData = await apiRequest(API_ENDPOINTS.auth.profile.update, {
        method: "PUT",
        body: JSON.stringify(editedData),
      });

      if (responseData.user) {
        const data = responseData.user;
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.number || "",
          address: data.address || "",
          organization: data.organization || "",
          role: data.role || "",
          avatar:
            data.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Rayhan",
        });
        setIsEditing(false);
        toast({
          title: "Profile Updated!",
          description: "Your profile has been successfully updated.",
        });
        updateUserData(data);
      } else {
        throw new Error(responseData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description:
          error.message || "Could not update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData({
          ...editedData,
          avatar: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
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
              Edit <span className="hidden md:inline">Profile</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div
              className={`w-48 h-48 rounded-full overflow-hidden border-4 border-primary mb-4 relative ${
                isEditing ? "cursor-pointer group" : ""
              }`}
              onClick={handleImageClick}
            >
              <img
                src={editedData.avatar}
                alt={editedData.name}
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
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
                  WhatsApp Number
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
