export interface UserSelect {
  id: number;
  nome: string;
  email: string;
  senhaHash?: string;
}

export interface AuthenticatedRequest {
  user: {
    userId: number;
    type: string;
  };
}
