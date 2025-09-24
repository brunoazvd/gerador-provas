import type { User } from "@types/user";

export type LoadingContextType = {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
};

export type AuthContextType = {
  user: User | null;
};