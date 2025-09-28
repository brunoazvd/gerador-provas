import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@context/auth-context";
import { useLoading } from "@context/loading-context";
import { useEffect } from "react";
import { Loader } from "@components/common/loader";
import { getMe } from "@api/auth";

export const PrivateRoutes = () => {
  const { authLoading, user, setUser } = useAuth();
  const { isLoading, setLoading } = useLoading();

  useEffect(() => {
    if (authLoading) return;
    const tryGetMe = async () => {
      setLoading(true);
      const user = await getMe();
      setUser(user);
      setLoading(false);
    };
    tryGetMe();
  }, [authLoading, setLoading, setUser]);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
