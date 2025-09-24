import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { LoadingContextType } from "@app/shared";


const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading deve ser usado dentro de LoadingProvider");
  return context;
}
