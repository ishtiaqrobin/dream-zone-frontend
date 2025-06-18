import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { API_ENDPOINTS, apiRequest } from "@/config/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [referral, setReferral] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+880");
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !whatsapp) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await apiRequest(API_ENDPOINTS.auth.register, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          number: `${countryCode}${whatsapp}`,
          role: "User",
          referralId: referral || undefined,
        }),
      });

      if (data.user) {
        toast({
          title: "Account created!",
          description:
            data.message ||
            "Welcome! Your account has been created successfully.",
        });
        navigate("/home");
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-center">
            Sign up to get started with your dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create a new account to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-colors"
                />
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  type="number"
                  placeholder="Enter your whatsapp number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral">Referral ID (Optional)</Label>
                <Input
                  id="referral"
                  type="text"
                  placeholder="Enter reffer ID"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  className="transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
