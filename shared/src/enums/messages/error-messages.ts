export const ERROR_MESSAGES: { readonly [key: string]: string } = {
  EMAIL_ALREADY_IN_USE: "Email já está em uso",
  USER_NOT_FOUND: "Usuário não encontrado",
  REFRESH_TOKEN_INVALID: "Refresh token inválido",
  REFRESH_TOKEN_NOT_FOUND: "Refresh token não encontrado",
  TOKEN_EXPIRED: "Refresh token expirado",
  INVALID_CREDENTIALS: "Credenciais inválidas",
  INVALID_TOKEN: "Token de acesso inválido",
  INVALID_TOKEN_TYPE: "Tipo de token inválido",
  INVALID_EMAIL_FORMAT: "Email deve ter um formato válido.",
  INVALID_PASSWORD:
    "Senha deve ter entre 8 e 64 caracteres e conter pelo menos um dígito e uma letra maiúscula.",
  INVALID_PASSWORD_FORMAT: "Senha deve ser uma string válida.",
  INVALID_NAME:
    "Nome deve ter entre 3 e 32 caracteres e conter apenas letras e espaços.",
  INVALID_NAME_FORMAT: "Nome deve ser uma string válida.",
};
