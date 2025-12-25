import { Navigate, Outlet } from "react-router-dom";
import { onlineManager } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated && onlineManager.isOnline()) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};
