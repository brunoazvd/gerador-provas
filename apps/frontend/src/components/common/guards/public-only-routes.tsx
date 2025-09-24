import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@context/user-context";

export function PublicOnlyRoutes() {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
