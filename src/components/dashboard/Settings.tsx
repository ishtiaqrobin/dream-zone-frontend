import React, { useState, useEffect } from "react";
import {
  Save,
  User,
  Lock,
  Bell,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { API_ENDPOINTS, apiRequest } from "@/config/api";
import { toast } from "@/hooks/use-toast";

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const settingsTabs: SettingsTab[] = [
  {
    id: "profile",
    label: "Profile Settings",
    icon: <User className="w-4 h-4" />,
  },
  { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="w-4 h-4" />,
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: <Globe className="w-4 h-4" />,
  },
];

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, updateUserData, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Common class names
  const inputClass =
    "w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800 dark:border-gray-700";
  const labelClass = "block font-medium mb-1 text-black dark:text-white";
  const buttonClass =
    "w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300 py-2 rounded transition flex items-center justify-center gap-2";
  const toggleContainerClass = "flex items-center justify-between";
  const toggleTextClass = "font-medium text-black dark:text-white";
  const toggleDescriptionClass = "text-sm text-gray-500 dark:text-gray-400";
  const toggleSwitchClass =
    "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-900 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary";

  const passwordInputWrapperClass = "relative";
  const passwordToggleButtonClass =
    "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200";

  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiRequest(API_ENDPOINTS.auth.profile.get, {
          method: "GET",
        });

        if (response.user) {
          const userData = response.user;
          setName(userData.name || user?.name || "");
          setEmail(userData.email || user?.email || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data.",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const responseData = await apiRequest(API_ENDPOINTS.auth.profile.update, {
        method: "PUT",
        body: JSON.stringify({
          name,
          email,
        }),
      });

      if (responseData.user) {
        const data = responseData.user;
        setName(data.name || "");
        setEmail(data.email || "");
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

  const handleDeleteAccount = async () => {
    try {
      // এখানে ভবিষ্যতে API call করা যাবে
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      // এখানে API call করা যাবে ইমেইল ভেরিফিকেশনের জন্য
      // উদাহরণস্বরূপ:
      // const response = await fetch('/api/verify-email', { method: 'POST', body: JSON.stringify({ email }) });
      // const data = await response.json();
      // if (response.ok) { setIsEmailVerified(true); alert('Verification email sent!'); }

      // For now, simulate success after a delay
      alert("Verification email sent! Please check your inbox.");
      setIsEmailVerified(true); // Simulate successful verification
    } catch (error) {
      console.error("Email verification failed:", error);
      alert("Failed to send verification email. Please try again.");
    }
  };

  const renderTabContent = (tab: SettingsTab) => {
    switch (tab.id) {
      case "profile":
        return (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            {/* Email Verification Section */}
            <div className="pt-6 border-t border-border dark:border-gray-700">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Email Verification
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-600 dark:text-blue-400">
                      {isEmailVerified
                        ? "Email Verified"
                        : "Email Not Verified"}
                    </h4>
                    <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
                      {isEmailVerified
                        ? "Your email address has been successfully verified."
                        : "Please verify your email address to unlock all features."}
                    </p>
                    {!isEmailVerified && (
                      <button
                        type="button"
                        onClick={handleVerifyEmail}
                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                      >
                        Verify Email
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className={buttonClass}>
              <Save className="w-4 h-4" /> Update Profile
            </button>
          </form>
        );

      case "security":
        return (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className={labelClass}>Current Password</label>
              <div className={passwordInputWrapperClass}>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className={inputClass}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className={passwordToggleButtonClass}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <div className={passwordInputWrapperClass}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className={passwordToggleButtonClass}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <div className={passwordInputWrapperClass}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={inputClass}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className={passwordToggleButtonClass}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {/* Danger Zone */}
            <div className="pt-6 border-t border-border dark:border-gray-700">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                Danger Zone
              </h3>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400">
                      Delete Account
                    </h4>
                    <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                        >
                          Delete Account
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className={buttonClass}>
              <Save className="w-4 h-4" /> Update Password
            </button>
          </form>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className={toggleContainerClass}>
              <div>
                <h3 className={toggleTextClass}>Email Notifications</h3>
                <p className={toggleDescriptionClass}>Receive email updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.email}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      email: e.target.checked,
                    })
                  }
                />
                <div className={toggleSwitchClass}></div>
              </label>
            </div>

            <div className={toggleContainerClass}>
              <div>
                <h3 className={toggleTextClass}>Push Notifications</h3>
                <p className={toggleDescriptionClass}>
                  Receive push notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.push}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      push: e.target.checked,
                    })
                  }
                />
                <div className={toggleSwitchClass}></div>
              </label>
            </div>

            <div className={toggleContainerClass}>
              <div>
                <h3 className={toggleTextClass}>System Updates</h3>
                <p className={toggleDescriptionClass}>
                  Receive system update notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.updates}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      updates: e.target.checked,
                    })
                  }
                />
                <div className={toggleSwitchClass}></div>
              </label>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div className={toggleContainerClass}>
              <div>
                <h3 className={toggleTextClass}>Dark Mode</h3>
                <p className={toggleDescriptionClass}>Toggle dark mode</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={theme === "dark"}
                  onChange={() =>
                    setTheme(theme === "light" ? "dark" : "light")
                  }
                />
                <div className={toggleSwitchClass}></div>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full p-8 bg-card rounded-lg shadow-sm border border-border text-foreground dark:bg-gray-900 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
        Settings
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
                  : "text-gray-600 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            {renderTabContent(
              settingsTabs.find((t) => t.id === activeTab) || settingsTabs[0]
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
