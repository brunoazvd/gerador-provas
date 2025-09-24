export interface AuthenticatedRequest {
  user: {
    userId: number;
    type: string;
  };
}
