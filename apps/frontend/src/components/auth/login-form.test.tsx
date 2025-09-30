import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import type { User } from "@app/shared";
import { ERROR_MESSAGES } from "@app/shared";

const sampleUser: User = {
  id: 1,
  nome: "Bruno",
  email: "bruno@teste.com",
};

const samplePassword = "ValidPassword123";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.mock("@context/auth-context", () => ({
      useAuth: () => ({
        setUser: vi.fn(),
        setAccessToken: vi.fn(),
      }),
    }));
  });

  it("renderiza todos elementos do formulário", async () => {
    const { LoginForm } = await import("./login-form");

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("form-title")).toBeInTheDocument();
    expect(screen.getByTestId("form-subtitle")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("senha-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByTestId("register-link")).toBeInTheDocument();
  });

  it("redireciona para a página de registro ao clicar no botão 'Cadastre-se'", async () => {
    const user = userEvent.setup();
    const { LoginForm } = await import("./login-form");

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/register"
            element={<div data-testid="register-page">Página de Registro</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByTestId("register-link"));

    expect(screen.getByTestId("register-page")).toBeInTheDocument();
  });

  it("dados são enviados ao clicar no botão 'Entrar' com payload válido", async () => {
    const user = userEvent.setup();

    const mockSuccessfulLogin = vi.fn().mockResolvedValue({
      user: { ...sampleUser },
      accessToken: "fake-access-token",
    });

    vi.doMock("@api/auth", () => ({
      login: mockSuccessfulLogin,
    }));

    const { LoginForm } = await import("./login-form");

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByTestId("email-input"), sampleUser.email);
    await user.type(screen.getByTestId("senha-input"), samplePassword);
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() =>
      expect(mockSuccessfulLogin).toHaveBeenCalledWith({
        email: sampleUser.email,
        senha: samplePassword,
      }),
    );
  });

  it("mostra erro ao tentar entrar com credenciais inválidas", async () => {
    const user = userEvent.setup();
    const mockFailedLogin = vi.fn().mockRejectedValue({
      response: {
        data: { message: ERROR_MESSAGES.INVALID_CREDENTIALS },
      },
    });
    const mockErrorToast = vi.fn((msg: string) => msg);

    vi.doMock("@api/auth", () => ({
      login: (data: unknown) => mockFailedLogin(data),
    }));

    vi.doMock("sonner", () => ({
      toast: { error: mockErrorToast },
    }));

    const { LoginForm } = await import("./login-form");

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByTestId("email-input"), sampleUser.email);
    await user.type(screen.getByTestId("senha-input"), samplePassword);
    await user.click(screen.getByTestId("submit-button"));
    await waitFor(() =>
      expect(mockErrorToast).toHaveBeenCalledWith(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
      ),
    );
  });

  it("mostra erros de validação ao tentar enviar formulário com dados inválidos", async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn();

    vi.doMock("@api/auth", () => ({
      login: mockLogin,
    }));

    const { LoginForm } = await import("./login-form");
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    );

    const submitButton = screen.getByTestId("submit-button");

    // tenta enviar sem preencher nada -> 2 mensagens de erro com 'campo obrigatório'
    await user.click(submitButton);
    expect(screen.getByTestId("email-error")).toHaveTextContent(
      ERROR_MESSAGES.REQUIRED_FIELD,
    );
    expect(screen.getByTestId("senha-error")).toHaveTextContent(
      ERROR_MESSAGES.REQUIRED_FIELD,
    );
    expect(mockLogin).not.toHaveBeenCalled();

    // preenche email inválido e senha fraca -> 2 mensagens de erro específicas
    await user.type(screen.getByTestId("email-input"), "invalid-email");
    await user.type(screen.getByTestId("senha-input"), "123");
    await user.click(submitButton);
    expect(screen.getByTestId("email-error")).toHaveTextContent(
      ERROR_MESSAGES.INVALID_EMAIL_FORMAT,
    );
    expect(screen.getByTestId("senha-error")).toHaveTextContent(
      ERROR_MESSAGES.INVALID_PASSWORD,
    );
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
