// src/enums/messages/error-messages.ts
var ERROR_MESSAGES = {
  EMAIL_ALREADY_IN_USE: "Email ja\u0301 est\xE1 em uso",
  USER_NOT_FOUND: "Usu\xE1rio n\xE3o encontrado",
  REFRESH_TOKEN_INVALID: "Refresh token inv\xE1lido",
  REFRESH_TOKEN_NOT_FOUND: "Refresh token n\xE3o encontrado",
  TOKEN_EXPIRED: "Refresh token expirado",
  INVALID_CREDENTIALS: "Credenciais inva\u0301lidas",
  INVALID_TOKEN: "Token de acesso inv\xE1lido",
  INVALID_TOKEN_TYPE: "Tipo de token inv\xE1lido",
  INVALID_EMAIL_FORMAT: "Email deve ter um formato v\xE1lido.",
  INVALID_PASSWORD: "Senha deve ter entre 8 e 64 caracteres e conter pelo menos um d\xEDgito e uma letra mai\xFAscula.",
  INVALID_PASSWORD_FORMAT: "Senha deve ser uma string v\xE1lida.",
  INVALID_NAME: "Nome deve ter entre 3 e 32 caracteres e conter apenas letras e espa\xE7os.",
  INVALID_NAME_FORMAT: "Nome deve ser uma string v\xE1lida."
};

// src/enums/messages/success-messages.ts
var SUCCESS_MESSAGES = {
  LOGOUT: "Logout realizado com sucesso"
};
export {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
