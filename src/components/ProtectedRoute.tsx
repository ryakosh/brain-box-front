import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};
