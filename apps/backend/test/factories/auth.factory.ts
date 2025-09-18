type RegisterDto = {
  nome: string;
  email: string;
  senha: string;
};
export const makeRegisterDto = (overrides?: Partial<RegisterDto>) : RegisterDto => {
  return {
    nome: 'Usuario Teste',
    email: 'teste@teste.com',
    senha: 'Senha123',
    ...overrides,
  };
};
