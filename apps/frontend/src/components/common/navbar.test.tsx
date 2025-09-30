import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "./navbar";
import { MemoryRouter } from "react-router-dom";
import type { LogoutResponse } from "@app/shared";

describe("Navbar", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("mostra o botão 'Homepage'", () => {
    vi.mock("@context/auth-context", () => ({
      useAuth: () => ({
        user: null,
        clearAuth: vi.fn(),
      }),
    }));

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    expect(screen.getByText("Homepage")).toBeInTheDocument();
  });

  it("mostra o botão 'Entrar' quando user é null", () => {
    vi.mock("@context/auth-context", () => ({
      useAuth: () => ({
        user: null,
        clearAuth: vi.fn(),
      }),
    }));

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    expect(screen.getByText("Entrar")).toBeInTheDocument();
  });

  it("Mostra o botão 'Sair' quando user existe, clicar nesse botão invoca clearAuth", async () => {
    const clearAuthMock = vi.fn();
    const toastErrorMock = vi.fn();
    const user = userEvent.setup();
    vi.doMock("@context/auth-context", () => ({
      useAuth: () => ({
        user: { id: 1, nome: "Bruno", email: "a@a.a" },
        clearAuth: clearAuthMock,
      }),
    }));

    vi.doMock("@api/auth", () => ({
      logout: async (): Promise<LogoutResponse> => ({
        message: "Logout realizado com sucesso",
      }),
    }));

    vi.doMock("sonner", () => ({
      toast: { error: toastErrorMock },
    }));

    const { Navbar } = await import("./navbar");

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );
    const sairBtn = screen.getByText("Sair");
    expect(sairBtn).toBeInTheDocument();
    await user.click(sairBtn);
    expect(clearAuthMock).toHaveBeenCalledTimes(1);
  });
});
