import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./components/dashboard/DashboardHome";
import ProtectedRoute from "./components/ProtectedRoute";
import SubmitTasks from "./components/dashboard/SubmitTaks";
import LandTaxRecords from "./components/dashboard/TasksRecords";
import Users from "./components/dashboard/Users";
import Analytics from "./components/dashboard/Analytics";
import Reports from "./components/dashboard/Reports";
import Settings from "./components/dashboard/Settings";
import AddUser from "./components/dashboard/AddUser";
import BalanceManagement from "./components/dashboard/BalanceManagement";
import Profile from "./components/dashboard/Profile";
import Tasks from "./components/dashboard/Tasks";
import Home from "./pages/Home";
import useTokenRefresh from "./hooks/useTokenRefresh";
import MyBalance from "./components/dashboard/MyBalance";
import ActivationRequests from "./components/dashboard/ActivationRequests";

const queryClient = new QueryClient();

const App = () => {
  useTokenRefresh();
  return (
    <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardHome />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="users" element={<Users />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="submit-tasks" element={<SubmitTasks />} />
                  <Route path="task-records" element={<LandTaxRecords />} />
                  <Route path="add-user" element={<AddUser />} />
                  <Route path="balance" element={<BalanceManagement />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="my-balance" element={<MyBalance />} />
                  <Route
                    path="activation-requests"
                    element={<ActivationRequests />}
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
