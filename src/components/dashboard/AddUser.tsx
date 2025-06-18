import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff, User, Mail, Phone, Shield, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, apiRequest } from "@/config/api";
import UsersList from "./UsersList";
import { useAuth } from "@/contexts/AuthContext";

interface UserData {
  _id: string;
  name: string;
  email: string;
  number: string;
  role: string;
  referralId?: string;
  category?: string;
  isActive: boolean;
  workerId?: string;
  createdAt: string;
}

const AddUser: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [countryCode, setCountryCode] = useState("+880");
  const [category, setCategory] = useState("");
  const [lastUser, setLastUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(API_ENDPOINTS.auth.users.getAll({}));
      setUsers(response.users);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await apiRequest(API_ENDPOINTS.auth.register, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          number: `${countryCode}${whatsapp}`,
          role,
          category: role === "Trainer" ? category : undefined,
        }),
      });

      if (!data.user) {
        throw new Error(data.message || "Registration failed");
      }

      setLastUser(data.user);
      setSuccess(true);
      toast({
        title: "Success!",
        description: "User created successfully.",
      });

      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setWhatsapp("");
      setCategory("");

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Error!",
        description: error.message || "User creation failed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Add New User */}
      <div className="w-full bg-card rounded-lg shadow-sm border border-border text-foreground p-8 dark:bg-gray-900 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
          Add New User
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1 text-black dark:text-white">
              Full Name
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user full name"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-black dark:text-white">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-black dark:text-white">
              Country Code
            </label>
            <Select
              value={countryCode}
              onValueChange={(value) => setCountryCode(value)}
            >
              <SelectTrigger className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800">
                <SelectValue placeholder="Select Country Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+880">+880 (Bangladesh)</SelectItem>
                <SelectItem value="+91">+91 (India)</SelectItem>
                <SelectItem value="+92">+92 (Pakistan)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-black dark:text-white">
              WhatsApp Number
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Enter user whatsapp number"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-black dark:text-white">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-black dark:text-white">
              Role
            </label>
            <Select value={role} onValueChange={(value) => setRole(value)}>
              <SelectTrigger className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                {user.role === "Leader" && (
                  <SelectItem value="Trainer">Trainer</SelectItem>
                )}
                {user.role === "Admin" && (
                  <>
                    <SelectItem value="Leader">Team Leader</SelectItem>
                    <SelectItem value="Trainer">Trainer</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {role === "Trainer" && (
            <div>
              <label className="block font-medium mb-1 text-black dark:text-white">
                Category
              </label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger className="w-full border rounded px-3 py-2 text-black dark:text-white dark:bg-gray-800">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Photo Editing">Photo Editing</SelectItem>
                  <SelectItem value="Video Editing">Video Editing</SelectItem>
                  <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="SEO">SEO</SelectItem>
                  <SelectItem value="Content Writing">
                    Content Writing
                  </SelectItem>
                  <SelectItem value="Social Media Marketing">
                    Social Media Marketing
                  </SelectItem>
                  <SelectItem value="Digital Marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="Data Entry">Data Entry</SelectItem>
                  <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                  <SelectItem value="Data Visualization">
                    Data Visualization
                  </SelectItem>
                  <SelectItem value="Data Cleaning">Data Cleaning</SelectItem>
                  <SelectItem value="Data Mining">Data Mining</SelectItem>
                  <SelectItem value="Data Modeling">Data Modeling</SelectItem>
                  <SelectItem value="Data Warehousing">
                    Data Warehousing
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded transition flex items-center justify-center gap-2 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users List Component */}
      <UsersList users={users} onUsersUpdate={fetchUsers} />

      {/* Last Created User Card */}
      {lastUser && (
        <div className="w-full bg-card rounded-lg shadow-sm border border-border text-foreground p-8 dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
            Last Created User
          </h2>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                <User className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">
                  {lastUser.name}
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {lastUser.role}
                </p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <span>Email: </span>
                <span>{lastUser.email}</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <span>WhatsApp: </span>
                <span>{lastUser.number}</span>
              </div>
              {lastUser.category && (
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <span>Category: </span>
                  <span>{lastUser.category}</span>
                </div>
              )}
              {lastUser.referralId && (
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <span>Referral ID: </span>
                  <span>{lastUser.referralId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
