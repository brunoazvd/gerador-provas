"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ERROR_MESSAGES: () => ERROR_MESSAGES,
  INPUT_PLACEHOLDERS: () => INPUT_PLACEHOLDERS,
  SUCCESS_MESSAGES: () => SUCCESS_MESSAGES,
  loginSchema: () => loginSchema,
  registerSchema: () => registerSchema
});
module.exports = __toCommonJS(src_exports);

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
  PASSWORD_DO_NOT_MATCH: "As senhas n\xE3o coincidem."
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
var import_zod = require("zod");
var loginSchema = import_zod.z.object({
  email: import_zod.z.string(ERROR_MESSAGES.INVALID_EMAIL_FORMAT).regex(
    /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/,
    ERROR_MESSAGES.INVALID_EMAIL_FORMAT
  ),
  senha: import_zod.z.string(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT).min(8, ERROR_MESSAGES.INVALID_PASSWORD).max(64, ERROR_MESSAGES.INVALID_PASSWORD).regex(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,64}$/,
    ERROR_MESSAGES.INVALID_PASSWORD
  )
});
var registerSchema = import_zod.z.object({
  email: import_zod.z.string(ERROR_MESSAGES.INVALID_EMAIL_FORMAT).regex(
    /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/,
    ERROR_MESSAGES.INVALID_EMAIL_FORMAT
  ),
  senha: import_zod.z.string(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT).min(8, ERROR_MESSAGES.INVALID_PASSWORD).max(64, ERROR_MESSAGES.INVALID_PASSWORD).regex(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,64}$/,
    ERROR_MESSAGES.INVALID_PASSWORD
  ),
  confirmarSenha: import_zod.z.string(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT).min(8, ERROR_MESSAGES.INVALID_PASSWORD).max(64, ERROR_MESSAGES.INVALID_PASSWORD).regex(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,64}$/,
    ERROR_MESSAGES.INVALID_PASSWORD
  ),
  nome: import_zod.z.string(ERROR_MESSAGES.INVALID_NAME_FORMAT).min(3, ERROR_MESSAGES.INVALID_NAME).max(32, ERROR_MESSAGES.INVALID_NAME).regex(
    /^(?!.*[ \-']{2})(?!.*[ \-']$)(?!^[ \-'])[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ \-'][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
    ERROR_MESSAGES.INVALID_NAME
  )
}).refine((data) => data.senha === data.confirmarSenha, {
  message: ERROR_MESSAGES.PASSWORD_DO_NOT_MATCH,
  path: ["confirmarSenha"]
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ERROR_MESSAGES,
  INPUT_PLACEHOLDERS,
  SUCCESS_MESSAGES,
  loginSchema,
  registerSchema
});
