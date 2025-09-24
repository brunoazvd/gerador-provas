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
  SUCCESS_MESSAGES: () => SUCCESS_MESSAGES
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
  INVALID_NAME_FORMAT: "Nome deve ser uma string v\xE1lida."
};

// src/enums/messages/success-messages.ts
var SUCCESS_MESSAGES = {
  LOGOUT: "Logout realizado com sucesso"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
});
