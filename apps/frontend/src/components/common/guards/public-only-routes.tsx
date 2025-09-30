import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@context/auth-context";
import { useLoading } from "@context/loading-context";
import { Loader } from "@components/common/loader";

export const PublicOnlyRoutes = () => {
  const { user } = useAuth();
  const { isLoading } = useLoading();

  if (isLoading) return <Loader />;

  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet data-testid="outlet" />;
};
