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
  INVALID_NAME_FORMAT: "Nome deve ser uma string v\xE1lida.",
  PASSWORD_DO_NOT_MATCH: "As senhas n\xE3o coincidem.",
  REQUIRED_FIELD: "Este campo \xE9 obrigat\xF3rio."
};

// src/enums/messages/success-messages.ts
var SUCCESS_MESSAGES = {
  LOGOUT: "Logout realizado com sucesso"
};

// src/enums/placeholders/input-field.ts
var INPUT_PLACEHOLDERS = {
  SENHA: "Digite sua senha...",
  SENHA_CONFIRM: "Confirme sua senha...",
  EMAIL: "Digite seu email...",
  NOME: "Digite seu nome..."
};

// src/schemas/auth.ts
import { z } from "zod";
var loginSchema = z.object({
  email: z.string(ERROR_MESSAGES.INVALID_EMAIL_FORMAT).min(1, ERROR_MESSAGES.REQUIRED_FIELD).regex(
    /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/,
    ERROR_MESSAGES.INVALID_EMAIL_FORMAT
  ),
  senha: z.string(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT).min(1, ERROR_MESSAGES.REQUIRED_FIELD).min(8, ERROR_MESSAGES.INVALID_PASSWORD).max(64, ERROR_MESSAGES.INVALID_PASSWORD).regex(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,64}$/,
    ERROR_MESSAGES.INVALID_PASSWORD
  )
});
var registerSchema = z.object({
  email: z.string(ERROR_MESSAGES.INVALID_EMAIL_FORMAT).min(1, ERROR_MESSAGES.REQUIRED_FIELD).regex(
    /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/,
    ERROR_MESSAGES.INVALID_EMAIL_FORMAT
  ),
  senha: z.string(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT).min(1, ERROR_MESSAGES.REQUIRED_FIELD).min(8, ERROR_MESSAGES.INVALID_PASSWORD).max(64, ERROR_MESSAGES.INVALID_PASSWORD).regex(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,64}$/,
    ERROR_MESSAGES.INVALID_PASSWORD
  ),
  confirmarSenha: z.string(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT).min(1, ERROR_MESSAGES.REQUIRED_FIELD).min(8, ERROR_MESSAGES.INVALID_PASSWORD).max(64, ERROR_MESSAGES.INVALID_PASSWORD).regex(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,64}$/,
    ERROR_MESSAGES.INVALID_PASSWORD
  ),
  nome: z.string(ERROR_MESSAGES.INVALID_NAME_FORMAT).min(1, ERROR_MESSAGES.REQUIRED_FIELD).min(3, ERROR_MESSAGES.INVALID_NAME).max(32, ERROR_MESSAGES.INVALID_NAME).regex(
    /^(?!.*[ \-']{2})(?!.*[ \-']$)(?!^[ \-'])[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ \-'][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
    ERROR_MESSAGES.INVALID_NAME
  )
}).refine((data) => data.senha === data.confirmarSenha, {
  message: ERROR_MESSAGES.PASSWORD_DO_NOT_MATCH,
  path: ["confirmarSenha"]
});
export {
  ERROR_MESSAGES,
  INPUT_PLACEHOLDERS,
  SUCCESS_MESSAGES,
  loginSchema,
  registerSchema
};
