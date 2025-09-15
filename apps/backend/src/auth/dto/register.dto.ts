import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterRequestDto {
  @IsString({ message: 'Nome deve ser uma string válida.' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres.' })
  @MaxLength(32, { message: 'Nome deve ter no máximo 32 caracteres.' })
  nome: string;

  @IsEmail({}, { message: 'Email deve ter um formato válido.' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string válida.' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres.' })
  @MaxLength(64, { message: 'Senha deve ter no máximo 64 caracteres.' })
  @Matches(/^(?=.*\d)/, {
    message: 'Senha deve conter pelo menos um dígito',
  })
  senha: string;
}

export class RegisterResponseDto {
  user: {
    id: number;
    nome: string;
    email: string;
  };
  accessToken: string;
}
