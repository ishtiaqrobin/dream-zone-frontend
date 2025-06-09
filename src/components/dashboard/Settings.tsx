import React, { useState } from "react";
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
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("Rayhan Kabir");
  const [email, setEmail] = useState("rayhan@example.com");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে ভবিষ্যতে API call করা যাবে
    alert("Settings updated (fake)");
  };

  const renderTabContent = () => {
    switch (activeTab) {
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
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
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
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
