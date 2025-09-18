export const ERROR_MESSAGES: { readonly [key: string]: string } = {
  EMAIL_ALREADY_IN_USE: 'Email já está em uso',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  WEAK_PASSWORD: 'Senha deve ter pelo menos 8 caracteres e conter pelo menos um dígito',
  USER_NOT_FOUND: 'Usuário não encontrado',
  REFRESH_TOKEN_INVALID: 'Refresh token inválido',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token não encontrado',
  TOKEN_EXPIRED: 'Refresh token expirado',
  UNAUTHORIZED: 'Não autorizado',
  INVALID_TOKEN_TYPE: 'Tipo de token inválido',
};
