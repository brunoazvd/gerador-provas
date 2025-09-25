import { z } from "zod";
import { ERROR_MESSAGES } from "../enums";

export const loginSchema = z.object({
  email: z
    .string(ERROR_MESSAGES.INVALID_EMAIL_FORMAT)
    .regex(
      /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/,
      ERROR_MESSAGES.INVALID_EMAIL_FORMAT,
    ),
  senha: z
    .string(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT)
    .min(8, ERROR_MESSAGES.INVALID_PASSWORD)
    .max(64, ERROR_MESSAGES.INVALID_PASSWORD)
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,64}$/,
      ERROR_MESSAGES.INVALID_PASSWORD,
    ),
});

export const registerSchema = z
  .object({
    email: z
      .string(ERROR_MESSAGES.INVALID_EMAIL_FORMAT)
      .regex(
        /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/,
        ERROR_MESSAGES.INVALID_EMAIL_FORMAT,
      ),
    senha: z
      .string(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT)
      .min(8, ERROR_MESSAGES.INVALID_PASSWORD)
      .max(64, ERROR_MESSAGES.INVALID_PASSWORD)
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,64}$/,
        ERROR_MESSAGES.INVALID_PASSWORD,
      ),
    confirmarSenha: z
      .string(ERROR_MESSAGES.INVALID_PASSWORD_FORMAT)
      .min(8, ERROR_MESSAGES.INVALID_PASSWORD)
      .max(64, ERROR_MESSAGES.INVALID_PASSWORD)
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,64}$/,
        ERROR_MESSAGES.INVALID_PASSWORD,
      ),
    nome: z
      .string(ERROR_MESSAGES.INVALID_NAME_FORMAT)
      .min(3, ERROR_MESSAGES.INVALID_NAME)
      .max(32, ERROR_MESSAGES.INVALID_NAME)
      .regex(
        /^(?!.*[ \-']{2})(?!.*[ \-']$)(?!^[ \-'])[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ \-'][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/,
        ERROR_MESSAGES.INVALID_NAME,
      ),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmarSenha"],
  });
