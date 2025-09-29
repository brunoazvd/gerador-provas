import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const sampleUser = { id: 1, nome: "Bruno", email: "a@a.a" };

describe("PrivateRoutes", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("exibe Loader enquanto isLoading is true", async () => {
    vi.doMock("@context/auth-context", () => ({
      useAuth: () => ({
        authLoading: true,
        user: { ...sampleUser },
        setUser: vi.fn(),
      }),
    }));

    vi.doMock("@context/loading-context", () => ({
      useLoading: () => ({
        isLoading: true,
        setLoading: vi.fn(),
      }),
    }));

    const { PrivateRoutes } = await import("./private-routes");

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route
              path="/dashboard"
              element={<div data-testid="dashboard-page">Dashboard</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renderiza Outlet quando getMe retorna user válido", async () => {
    vi.doMock("@context/auth-context", () => ({
      useAuth: () => ({
        authLoading: false,
        user: { ...sampleUser },
        setUser: vi.fn(),
      }),
    }));
    vi.doMock("@context/loading-context", () => ({
      useLoading: () => ({
        isLoading: false,
        setLoading: vi.fn(),
      }),
    }));
    vi.doMock("@api/auth", () => ({
      getMe: async () => ({ ...sampleUser }),
    }));

    const { PrivateRoutes } = await import("./private-routes");

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route
              path="/dashboard"
              element={<div data-testid="dashboard-page">Dashboard</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });
  });

  it("redireciona para /login quando getMe retorna null", async () => {
    vi.doMock("@context/auth-context", () => ({
      useAuth: () => ({
        authLoading: false,
        user: null,
        setUser: vi.fn(),
      }),
    }));
    vi.doMock("@context/loading-context", () => ({
      useLoading: () => ({
        isLoading: false,
        setLoading: vi.fn(),
      }),
    }));
    vi.doMock("@api/auth", () => ({
      getMe: async () => null,
    }));

    const { PrivateRoutes } = await import("./private-routes");

    render(
      <MemoryRouter initialEntries={["/dashboard", "/login"]}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route
              path="/dashboard"
              element={<div data-testid="dashboard-page">Dashboard</div>}
            />
          </Route>
          <Route
            path="/login"
            element={<div data-testid="login-page">Login</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });
});
