import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Homepage } from "@pages/homepage";
import { Login } from "@pages/login";
import { Register } from "@pages/register";
import { PublicOnlyRoutes } from "@components/common/guards/public-only-routes";
import { PrivateRoutes } from "@components/common/guards/private-routes";
import { PageWrapper } from "@components/common/page-wrapper";
import { Toaster } from "@shadcn/sonner";

export const AppRouter = () => {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <PageWrapper>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Homepage />} />

          {/* Rotas Protegidas */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<p>Dashboard</p>} />
          </Route>

          {/* Rotas Public-Only */}
          <Route element={<PublicOnlyRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </PageWrapper>
    </Router>
  );
};
