import type { User } from "../user/user";

export interface LoadingContextType {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

export interface AuthContextType {
  user: User | null;
}
