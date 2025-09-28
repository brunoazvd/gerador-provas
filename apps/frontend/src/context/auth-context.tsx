import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, AuthContextType } from "@app/shared";
import { setAuthContextGetter } from "@lib/api-client";
import { refreshAccessToken } from "@api/auth";
import { useLoading } from "./loading-context";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { setLoading } = useLoading();

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
  };

  setAuthContextGetter(() => accessToken);

  useEffect(() => {
    const tryRefreshToken = async () => {
      setLoading(true);
      try {
        const res = await refreshAccessToken(true);
        setUser(res?.user ?? null);
        setAccessToken(res?.accessToken ?? null);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setAuthLoading(false);
        }, 1000);
      }
    };
    tryRefreshToken();
  }, [setLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        authLoading,
        setUser,
        setAccessToken,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
