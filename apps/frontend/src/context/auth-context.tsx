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
  const { setLoading } = useLoading();

  setAuthContextGetter(() => accessToken);

  useEffect(() => {
    const tryRefreshToken = async () => {
      setLoading(true);
      try {
        const { user, accessToken } = await refreshAccessToken(true);
        setUser(user ?? null);
        setAccessToken(accessToken ?? null);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    tryRefreshToken();
  }, [setLoading]);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setUser, setAccessToken }}
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
