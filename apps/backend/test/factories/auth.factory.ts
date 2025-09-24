type RegisterDto = {
  nome: string;
  email: string;
  senha: string;
};

type LoginDto = {
  email: string;
  senha: string;
};

const DEFAULT_PASSWORD = "Senha123";
const DEFAULT_NAME = "Usuario Teste";
const DEFAULT_EMAIL = "teste@teste.com";
export const makeRegisterDto = (
  overrides?: Partial<RegisterDto>,
): RegisterDto => {
  return {
    nome: DEFAULT_NAME,
    email: DEFAULT_EMAIL,
    senha: DEFAULT_PASSWORD,
    ...overrides,
  };
};

export const makeLoginDto = (overrides?: Partial<LoginDto>): LoginDto => {
  return {
    email: DEFAULT_EMAIL,
    senha: DEFAULT_PASSWORD,
    ...overrides,
  };
};
