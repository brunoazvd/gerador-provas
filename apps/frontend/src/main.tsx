import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@styles/bubblegum.css";
import { AppRouter } from "./app/app-router";
import { AuthProvider } from "./context/auth-context";
import { LoadingProvider } from "./context/loading-context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadingProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </LoadingProvider>
  </StrictMode>,
);
