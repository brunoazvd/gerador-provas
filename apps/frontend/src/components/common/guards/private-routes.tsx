import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@context/user-context";
import { useLoading } from "@context/loading-context";

export function PrivateRoutes() {
  const { user } = useAuth();
  const { isLoading } = useLoading();

  if (isLoading) {
    return <div>Carregando...</div>; // pode trocar por um spinner do shadcn
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
