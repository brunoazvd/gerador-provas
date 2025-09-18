import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ERROR_MESSAGES } from '@app/shared';

export class LoginRequestDto {
  @IsString({ message: ERROR_MESSAGES.INVALID_EMAIL_FORMAT })
  @Matches(/^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/, { message: ERROR_MESSAGES.INVALID_EMAIL_FORMAT })
  email: string;

  @IsString({ message: ERROR_MESSAGES.INVALID_PASSWORD_FORMAT })
  @MinLength(8, { message: ERROR_MESSAGES.INVALID_PASSWORD })
  @MaxLength(64, { message: ERROR_MESSAGES.INVALID_PASSWORD })
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{8,64}$/, {
    message: ERROR_MESSAGES.INVALID_PASSWORD,
  })
  senha: string;
}

export class LoginResponseDto {
  user: {
    id: number;
    nome: string;
    email: string;
  };
  accessToken: string;
}
