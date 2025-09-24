import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Homepage } from "./pages/homepage";
import { PublicOnlyRoutes } from "@components/common/guards/public-only-routes";
import { PrivateRoutes } from "@components/common/guards/private-routes";

function App() {
  return (
    <Router>
      <div className="min-h-svh">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Homepage />} />

          {/* Rotas Protegidas */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<p>Dashboard</p>} />
          </Route>

          {/* Rotas Public-Only */}
          <Route element={<PublicOnlyRoutes />}>
            <Route path="/login" element={<p>Login</p>} />
            <Route path="/register" element={<p>Register</p>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
