import { z } from 'zod';

declare const ERROR_MESSAGES: {
    readonly [key: string]: string;
};

declare const SUCCESS_MESSAGES: {
    readonly [key: string]: string;
};

declare const INPUT_PLACEHOLDERS: {
    readonly [key: string]: string;
};

interface UserSelect {
    id: number;
    nome: string;
    email: string;
    senhaHash?: string;
}

interface AuthenticatedRequest {
    user: {
        userId: number;
        type: string;
    };
}

interface User {
    id: number;
    nome: string;
    email: string;
}

interface AuthResponse {
    user: User;
    accessToken: string;
}
interface LogoutResponse {
    message: string;
}
interface LoginRequest {
    email: string;
    senha: string;
}
interface RegisterRequest {
    email: string;
    senha: string;
    nome: string;
}
interface JwtPayload {
    userId: number;
    type: "access" | "refresh";
    iat?: number;
    exp?: number;
}
interface RefreshTokenResponse {
    user?: User;
    accessToken: string;
}

interface RegisterRequestForm {
    email: string;
    nome: string;
    senha: string;
    confirmarSenha: string;
}

interface LoadingContextType {
    isLoading: boolean;
    setLoading: (value: boolean) => void;
}
interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
}

declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    senha: z.ZodString;
}, z.core.$strip>;
declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    senha: z.ZodString;
    confirmarSenha: z.ZodString;
    nome: z.ZodString;
}, z.core.$strip>;

export { AuthContextType, AuthResponse, AuthenticatedRequest, ERROR_MESSAGES, INPUT_PLACEHOLDERS, JwtPayload, LoadingContextType, LoginRequest, LogoutResponse, RefreshTokenResponse, RegisterRequest, RegisterRequestForm, SUCCESS_MESSAGES, User, UserSelect, loginSchema, registerSchema };
