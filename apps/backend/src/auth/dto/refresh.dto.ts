export class RefreshRequestDto {
  cookies: {
    refreshToken?: string;
  };
}

export class RefreshResponseDto {
  accessToken: string;
  user?: {
    id: number;
    nome: string;
    email: string;
  };
}
