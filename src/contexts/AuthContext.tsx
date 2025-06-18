// contexts/AuthContext.tsx
import { API_ENDPOINTS, apiRequest } from "@/config/api";
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  number?: string;
  role: string;
  avatar?: string;
  isVerified?: boolean;
  address?: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    userData: User,
    tokens: { accessToken: string; refreshToken: string }
  ) => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserData: (updatedUser: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (
    userData: User,
    tokens: { accessToken: string; refreshToken: string }
  ) => {
    // Store user data in context/state
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Store tokens
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiRequest(API_ENDPOINTS.auth.register, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const userFromApi = data.user;

      const userData: User = {
        id: String(userFromApi.id),
        name: String(userFromApi.name || name),
        email: String(userFromApi.email || email),
        number: userFromApi.number ? String(userFromApi.number) : undefined,
        role: String(userFromApi.role || "User"),
        avatar: userFromApi.avatar ? String(userFromApi.avatar) : undefined,
        isVerified: userFromApi.isVerified,
        address: userFromApi.address || "",
        organization: userFromApi.organization || "",
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiRequest(API_ENDPOINTS.auth.logout, {
        method: "POST",
        credentials: "include",
      });
      // Clear user data and tokens
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // প্রোফাইল আপডেটের পর ইউজার ডাটা আপডেট করার ফাংশন
  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateUserData, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
