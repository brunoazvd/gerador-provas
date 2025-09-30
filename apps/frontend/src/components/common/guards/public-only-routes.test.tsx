import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

describe("PublicOnlyRoutes", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("renderiza Loader quando isLoading é true", async () => {
    vi.doMock("@context/auth-context", () => ({
      useAuth: () => ({ user: null }),
    }));
    vi.doMock("@context/loading-context", () => ({
      useLoading: () => ({ isLoading: true }),
    }));

    const { PublicOnlyRoutes } = await import("./public-only-routes");
    render(
      <MemoryRouter>
        <PublicOnlyRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("redireciona para /dashboard quando user existe e isLoading é false", async () => {
    vi.doMock("@context/auth-context", () => ({
      useAuth: () => ({
        user: { id: 1, nome: "test", email: "a@a.a" },
      }),
    }));
    vi.doMock("@context/loading-context", () => ({
      useLoading: () => ({ isLoading: false }),
    }));

    const { PublicOnlyRoutes } = await import("./public-only-routes");
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route element={<PublicOnlyRoutes />}>
            <Route
              path="/login"
              element={<div data-testid="login-page">Login Page</div>}
            />
          </Route>
          <Route
            path="/dashboard"
            element={<div data-testid="dashboard-page">Dashboard</div>}
          />
        </Routes>
      </MemoryRouter>,
    );
    // O componente Navigate não renderiza nada, mas podemos verificar que não renderizou Outlet
    expect(screen.queryByTestId("dashboard-page")).toBeInTheDocument();
  });

  it("renderiza Outlet quando user é null e isLoading é false", async () => {
    vi.doMock("@context/auth-context", () => ({
      useAuth: () => ({ user: null }),
    }));
    vi.doMock("@context/loading-context", () => ({
      useLoading: () => ({ isLoading: false }),
    }));

    const { PublicOnlyRoutes } = await import("./public-only-routes");
    render(
      <MemoryRouter initialEntries={["/", "/login"]}>
        <Routes>
          <Route element={<PublicOnlyRoutes />}>
            <Route
              path="/login"
              element={<div data-testid="login-page">Login Page</div>}
            />
          </Route>
          <Route
            path="/"
            element={<div data-test-id="homepage">Homepage</div>}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });
});
