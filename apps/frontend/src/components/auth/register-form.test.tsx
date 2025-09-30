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

describe("RegisterForm", () => {
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
    const { RegisterForm } = await import("./register-form");

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("form-title")).toBeInTheDocument();
    expect(screen.getByTestId("form-subtitle")).toBeInTheDocument();
    expect(screen.getByTestId("nome-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("senha-input")).toBeInTheDocument();
    expect(screen.getByTestId("confirmar-senha-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByTestId("login-link")).toBeInTheDocument();
  });

  it("redireciona para a página de login ao clicar no botão 'Entrar'", async () => {
    const user = userEvent.setup();
    const { RegisterForm } = await import("./register-form");

    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/login"
            element={<div data-testid="login-page">Página de Login</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByTestId("login-link"));

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("dados são enviados ao clicar no botão 'Cadastrar' com payload válido", async () => {
    const user = userEvent.setup();

    const mockSuccessfulRegister = vi.fn().mockResolvedValue({
      user: sampleUser,
      accessToken: "valid.token.here",
    });

    vi.doMock("@api/auth", () => ({
      register: (data: unknown) => mockSuccessfulRegister(data),
    }));

    const { RegisterForm } = await import("./register-form");

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByTestId("nome-input"), sampleUser.nome);
    await user.type(screen.getByTestId("email-input"), sampleUser.email);
    await user.type(screen.getByTestId("senha-input"), samplePassword);
    await user.type(
      screen.getByTestId("confirmar-senha-input"),
      samplePassword,
    );
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockSuccessfulRegister).toHaveBeenCalledWith({
        nome: sampleUser.nome,
        email: sampleUser.email,
        senha: samplePassword,
      });
    });
  });

  it("mostra erro ao tentar cadastrar com email já existente", async () => {
    const user = userEvent.setup();

    const mockFailedRegister = vi.fn().mockRejectedValue({
      response: {
        data: { message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS },
      },
    });

    const mockErrorToast = vi.fn((msg: string) => msg);

    vi.doMock("@api/auth", () => ({
      register: (data: unknown) => mockFailedRegister(data),
    }));

    vi.doMock("sonner", () => ({
      toast: { error: mockErrorToast },
    }));

    const { RegisterForm } = await import("./register-form");

    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );

    await user.type(screen.getByTestId("nome-input"), sampleUser.nome);
    await user.type(screen.getByTestId("email-input"), sampleUser.email);
    await user.type(screen.getByTestId("senha-input"), samplePassword);
    await user.type(
      screen.getByTestId("confirmar-senha-input"),
      samplePassword,
    );
    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() =>
      expect(mockErrorToast).toHaveBeenCalledWith(
        ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
      ),
    );
  });

  it("mostra erros de validação ao tentar enviar formulário com dados inválidos", async () => {
    const user = userEvent.setup();
    const mockRegister = vi.fn();

    vi.doMock("@api/auth", () => ({
      register: mockRegister,
    }));

    const { RegisterForm } = await import("./register-form");
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>,
    );

    const submitButton = screen.getByTestId("submit-button");
    const nomeInput = screen.getByTestId("nome-input");
    const emailInput = screen.getByTestId("email-input");
    const senhaInput = screen.getByTestId("senha-input");
    const confirmarSenhaInput = screen.getByTestId("confirmar-senha-input");

    // tenta enviar sem preencher nada -> 4 mensagens de erro com 'campo obrigatório'
    await user.click(submitButton);
    expect(screen.getByTestId("nome-error")).toHaveTextContent(
      ERROR_MESSAGES.REQUIRED_FIELD,
    );
    expect(screen.getByTestId("email-error")).toHaveTextContent(
      ERROR_MESSAGES.REQUIRED_FIELD,
    );
    expect(screen.getByTestId("senha-error")).toHaveTextContent(
      ERROR_MESSAGES.REQUIRED_FIELD,
    );
    expect(screen.getByTestId("confirmar-senha-error")).toHaveTextContent(
      ERROR_MESSAGES.REQUIRED_FIELD,
    );
    expect(mockRegister).not.toHaveBeenCalled();

    // preenche email inválido, nome invalido e senha fraca -> 3 mensagens de erro específicas
    await user.type(emailInput, "invalid-email");
    await user.type(senhaInput, "123");
    await user.type(nomeInput, "你你你");
    await user.click(submitButton);
    expect(screen.getByTestId("email-error")).toHaveTextContent(
      ERROR_MESSAGES.INVALID_EMAIL_FORMAT,
    );
    expect(screen.getByTestId("senha-error")).toHaveTextContent(
      ERROR_MESSAGES.INVALID_PASSWORD,
    );
    expect(screen.getByTestId("nome-error")).toHaveTextContent(
      ERROR_MESSAGES.INVALID_NAME,
    );
    expect(mockRegister).not.toHaveBeenCalled();

    // preencher senhas que não coincidem -> 1 mensagem de erro específica
    await user.type(senhaInput, "Valid123");
    await user.type(confirmarSenhaInput, "Wrong123");
    await user.click(submitButton);
    expect(screen.getByTestId("confirmar-senha-error")).toHaveTextContent(
      ERROR_MESSAGES.PASSWORD_DO_NOT_MATCH,
    );
    expect(mockRegister).not.toHaveBeenCalled();
  });
});
