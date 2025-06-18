import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  // Redirect to home if logged in, otherwise to login
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;
